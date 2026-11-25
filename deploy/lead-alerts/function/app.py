import base64
import hashlib
import hmac
import json
import logging
import os
import re
import time
from datetime import UTC, datetime
from functools import cache
from urllib.error import HTTPError
from urllib.request import Request, urlopen

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

EVENT_ID = r"(?:[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}|[0-9]{13}-[a-z0-9]{1,16})"
STATUS_RANK = {"sent": 1, "failed": 2, "delivered": 3, "read": 4}
SHARED_RECIPIENTS = ("owner", "ceo")
RECIPIENTS = {
    "contact": SHARED_RECIPIENTS,
    "invoicenow": ("invoice_recipient", *SHARED_RECIPIENTS),
    "whatsapp": SHARED_RECIPIENTS,
}
DELIVERY_KEY = re.compile("|".join(
    rf"algorims-lead:{source}:{EVENT_ID}:(?:{'|'.join(roles)})" for source, roles in RECIPIENTS.items()
))
CONTACT_SERVICES = {
    "Cloud", "DevOps", "Development", "AI", "Data and ML",  # Accept submissions from older forms.
    "Never Miss a Sales Lead Again – Set Up Your WhatsApp AI Agent",
    "Get a Complimentary AI Assessment for Your Business",
    "Meet IRAS GST Compliant with InvoiceNOW",
    "Transform Your SME with AI – Get Up to 50% IMDA Grant",
}
MONTHLY_SEND_LIMIT = 300


@cache
def aws_clients():
    import boto3

    return (
        boto3.client("secretsmanager"),
        boto3.resource("dynamodb").Table(os.environ["DELIVERIES_TABLE"]),
    )


def same_secret(provided, secret):
    return bool(secret) and hmac.compare_digest(provided.encode(), secret.encode())


def lead_details(body):
    def field(name, limit):
        value = body.get(name)
        return " ".join(value.split()) if isinstance(value, str) and len(value) <= limit else ""

    page = field("page_url", 80).rstrip("/")
    event_id = field("event_id", 64)
    name = field("name", 100)
    company = field("company", 120)
    if not re.fullmatch(EVENT_ID, event_id) or not name:
        return None
    if page == "/contact":
        contact = field("email", 255)
        service = field("service", 80)
        if service in CONTACT_SERVICES and re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", contact):
            return "contact", event_id, [service, name, company or "Not provided", contact]
        return None
    if not company:
        return None
    if page == "/invoicenow":
        contact = field("email", 255)
        if re.fullmatch(r"[^@\s]+@[^@\s]+", contact) and field("gst_status", 40):
            return "invoicenow", event_id, ["InvoiceNow", name, company, contact]
    if page == "/whatsapp-business-api" and body.get("page_code") == "API-01":
        contact = field("whatsapp", 20)
        if (body.get("consent") == "yes" and field("industry", 80) and field("monthly_chats", 40)
                and re.fullmatch(r"\+?[0-9(). -]+", contact)
                and 8 <= len(re.sub(r"[^0-9]", "", contact)) <= 15):
            return "whatsapp", event_id, ["WhatsApp Business", name, company, contact]
    return None


def graph(config, endpoint, payload=None):
    request = Request(
        f"https://graph.facebook.com/{config['graph_version']}/{endpoint}",
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={"Authorization": f"Bearer {config['access_token']}", "Content-Type": "application/json"},
    )
    with urlopen(request, timeout=4) as response:
        return json.load(response)


def reserve_send(table):
    # One shared budget covers public requests and Meta retries without double-counting replays.
    now = datetime.now(UTC)
    try:
        table.update_item(
            Key={"id": f"alert-budget:{now:%Y-%m}"},
            UpdateExpression="SET expires_at = if_not_exists(expires_at, :expiry) ADD attempts :one",
            ConditionExpression="attribute_not_exists(attempts) OR attempts < :limit",
            ExpressionAttributeValues={":expiry": int(now.timestamp()) + 62 * 86400, ":one": 1,
                                       ":limit": MONTHLY_SEND_LIMIT},
        )
    except table.meta.client.exceptions.ConditionalCheckFailedException:
        return False
    return True


def attempt_delivery(table, config, key, number, template, values):
    try:
        table.put_item(
            Item={"id": key, "send_state": "attempting", "expires_at": int(time.time()) + 30 * 86400},
            ConditionExpression="attribute_not_exists(id) OR send_state = :retry",
            ExpressionAttributeValues={":retry": "retry"},
        )
    except table.meta.client.exceptions.ConditionalCheckFailedException:
        return True

    if not reserve_send(table):
        table.update_item(Key={"id": key}, UpdateExpression="SET send_state = :state",
                          ExpressionAttributeValues={":state": "capped"})
        logger.warning("WhatsApp monthly send limit reached for %s", key)
        return False

    try:
        result = graph(config, f"{config['phone_number_id']}/messages", {
            "messaging_product": "whatsapp",
            "to": number.lstrip("+"),
            "type": "template",
            "biz_opaque_callback_data": key,
            "template": {
                "name": template["name"],
                "language": {"code": template["language"]},
                "components": [{
                    "type": "body",
                    "parameters": [{"type": "text", "text": value} for value in values],
                }],
            },
        })
        message_id = result["messages"][0]["id"]
        if not isinstance(message_id, str) or not message_id:
            raise ValueError("Missing Meta message ID")
    except HTTPError as error:
        state = "retry" if error.code == 429 else "rejected" if 400 <= error.code < 500 else "unknown"
        detail = f"HTTP {error.code}"
        error.close()
    except (OSError, ValueError, KeyError, IndexError, TypeError) as error:
        # A timeout can occur after Meta accepts the send. A signed callback can still confirm it.
        state, detail = "unknown", type(error).__name__
    else:
        table.update_item(
            Key={"id": key},
            UpdateExpression="SET send_state = :state, message_id = if_not_exists(message_id, :message)",
            ExpressionAttributeValues={":state": "accepted", ":message": message_id},
        )
        return True

    table.update_item(
        Key={"id": key},
        UpdateExpression="SET send_state = :state, send_error = :detail",
        ExpressionAttributeValues={":state": state, ":detail": detail},
    )
    logger.warning("WhatsApp send %s for %s (%s)", state, key, detail)
    return state != "retry"


def record_statuses(table, phone_number_id, body):
    if body.get("object") != "whatsapp_business_account":
        return
    for entry in body.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            if change.get("field") != "messages" or value.get("metadata", {}).get("phone_number_id") != phone_number_id:
                continue
            for event in value.get("statuses", []):
                key = event.get("biz_opaque_callback_data", "")
                message_id = event.get("id")
                status = event.get("status")
                if not isinstance(key, str) or not DELIVERY_KEY.fullmatch(key) or not message_id or status not in STATUS_RANK:
                    continue
                try:
                    table.update_item(
                        Key={"id": key},
                        UpdateExpression="SET delivery_status = :status, status_rank = :rank, message_id = :message",
                        ConditionExpression=(
                            "attribute_exists(id) AND (attribute_not_exists(message_id) OR message_id = :message) "
                            "AND (attribute_not_exists(status_rank) OR status_rank < :rank)"
                        ),
                        ExpressionAttributeValues={
                            ":status": status, ":rank": STATUS_RANK[status], ":message": message_id,
                        },
                    )
                except table.meta.client.exceptions.ConditionalCheckFailedException:
                    continue
                if status == "failed":
                    logger.warning("WhatsApp delivery failed for %s", key)


def handle(event, config, table):
    route = event["routeKey"]
    query = event.get("queryStringParameters") or {}
    headers = event.get("headers") or {}
    if route == "GET /whatsapp-status":
        if (query.get("hub.mode") == "subscribe" and query.get("hub.challenge")
                and same_secret(query.get("hub.verify_token", ""), config["meta_verify_token"])):
            return {"statusCode": 200, "body": query["hub.challenge"]}
        return {"statusCode": 403}

    if route == "POST /lead-alert":
        if headers.get("origin") != config["site_origin"]:
            return {"statusCode": 403}
    elif route != "POST /whatsapp-status":
        return {"statusCode": 404}

    raw = event.get("body") or ""
    if len(raw) > (8 if route == "POST /lead-alert" else 256) * 1024:
        return {"statusCode": 413}
    try:
        raw = base64.b64decode(raw, validate=True) if event.get("isBase64Encoded") else raw.encode()
        if route == "POST /whatsapp-status":
            app_secret = config["meta_app_secret"]
            if not app_secret:
                return {"statusCode": 503}
            signature = "sha256=" + hmac.new(app_secret.encode(), raw, hashlib.sha256).hexdigest()
            if not same_secret(headers.get("x-hub-signature-256", ""), signature):
                return {"statusCode": 403}
        body = json.loads(raw)
    except ValueError:
        return {"statusCode": 400}
    if not isinstance(body, dict):
        return {"statusCode": 400}
    if route == "POST /whatsapp-status":
        record_statuses(table, config["phone_number_id"], body)
        return {"statusCode": 200}

    lead = lead_details(body)
    if lead is None:
        return {"statusCode": 422}
    source, event_id, values = lead
    roles = RECIPIENTS[source]
    numbers = [config[role] for role in roles]
    if (not all(re.fullmatch(r"\+[1-9][0-9]{7,14}", number) for number in numbers) or len(set(numbers)) != len(roles)
            or not re.fullmatch(r"v[0-9]+\.[0-9]+", config["graph_version"])
            or not all(re.fullmatch(r"[0-9]+", config[key]) for key in ("phone_number_id", "template_id"))):
        raise ValueError("Invalid sender configuration")

    template = graph(config, f"{config['template_id']}?fields=name,language,status,category")
    if template.get("status") != "APPROVED" or template.get("category") != "UTILITY":
        logger.warning("The Algorims staff alert template is unavailable")
        return {"statusCode": 503}

    results = []
    for role, number in zip(roles, numbers):
        key = f"algorims-lead:{source}:{event_id}:{role}"
        try:
            results.append(attempt_delivery(table, config, key, number, template, values))
        except Exception as error:
            logger.error("Could not record WhatsApp send for %s (%s)", key, type(error).__name__)
            results.append(False)
    return {"statusCode": 200 if all(results) else 503}


def lambda_handler(event, _context):
    try:
        secrets, table = aws_clients()
        secret = secrets.get_secret_value(SecretId=os.environ["ALERTS_SECRET_ARN"])
        config = json.loads(secret["SecretString"])
        config["site_origin"] = os.environ["SITE_ORIGIN"]
        return handle(event, config, table)
    except Exception as error:
        logger.error("Lead alert webhook failed (%s)", type(error).__name__)
        return {"statusCode": 503}
