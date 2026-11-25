import hashlib
import hmac
import json
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch
from urllib.error import HTTPError

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "deploy" / "lead-alerts" / "function"))
import app

CONFIG = {
    "site_origin": "https://www.algorims.com",
    "meta_verify_token": "test-verify-token",
    "meta_app_secret": "test-app-secret",
    "graph_version": "v25.0",
    "phone_number_id": "123",
    "template_id": "456",
    "owner": "+12025550111",
    "ceo": "+12025550112",
    "invoice_recipient": "+12025550113",
}
EVENT_ID = "ae9dba81-3d3a-4741-ab9f-c39c4cf8bdf6"
CONTACT = {"page_url": "/contact/", "event_id": EVENT_ID, "name": "Test Lead", "company": "",
           "email": "lead@example.com", "service": "AI", "message": "Private note"}
INVOICE = {"page_url": "/invoicenow", "event_id": EVENT_ID, "name": "Test Lead", "company": "Example",
           "email": "lead@example.com", "gst_status": "Not registered", "message": "Private note"}
WHATSAPP = {"page_url": "/whatsapp-business-api", "page_code": "API-01", "event_id": EVENT_ID,
            "name": "Test Lead", "company": "Example", "whatsapp": "+65 9123 4567",
            "industry": "Other", "monthly_chats": "Under 500", "consent": "yes"}
TEMPLATE = {"name": "algorims_staff_lead_v1", "language": "en", "status": "APPROVED", "category": "UTILITY"}


class ConditionalCheckFailed(Exception):
    pass


class MemoryTable:
    meta = SimpleNamespace(client=SimpleNamespace(exceptions=SimpleNamespace(
        ConditionalCheckFailedException=ConditionalCheckFailed,
    )))

    def __init__(self):
        self.items = {}

    def put_item(self, Item, **_):
        if Item["id"] in self.items and self.items[Item["id"]].get("send_state") != "retry":
            raise ConditionalCheckFailed
        self.items[Item["id"]] = Item.copy()

    def update_item(self, Key, ExpressionAttributeValues, **_):
        values = ExpressionAttributeValues
        if ":limit" in values:
            item = self.items.setdefault(Key["id"], {"attempts": 0})
            if item["attempts"] >= values[":limit"]:
                raise ConditionalCheckFailed
            item["attempts"] += values[":one"]
            return
        item = self.items.get(Key["id"])
        if ":status" in values:
            if (item is None or item.get("status_rank", 0) >= values[":rank"]
                    or item.get("message_id", values[":message"]) != values[":message"]):
                raise ConditionalCheckFailed
            item.update(delivery_status=values[":status"], status_rank=values[":rank"], message_id=values[":message"])
        else:
            item["send_state"] = values[":state"]
            if ":message" in values:
                item.setdefault("message_id", values[":message"])


class LeadAlertsTest(unittest.TestCase):
    def setUp(self):
        self.table = MemoryTable()
        self.sends = []
        mock = patch.object(app, "graph", side_effect=self.graph)
        self.graph_mock = mock.start()
        self.addCleanup(mock.stop)

    def graph(self, _config, _endpoint, payload=None):
        if payload is None:
            return TEMPLATE
        self.sends.append(payload)
        return {"messages": [{"id": f"wamid.{len(self.sends)}"}]}

    def lead(self, body, origin=CONFIG["site_origin"]):
        return app.handle({"routeKey": "POST /lead-alert", "body": json.dumps(body),
                           "headers": {"origin": origin}}, CONFIG, self.table)["statusCode"]

    def status(self, key, status, signature=None):
        body = json.dumps({"object": "whatsapp_business_account", "entry": [{"changes": [{
            "field": "messages",
            "value": {"metadata": {"phone_number_id": CONFIG["phone_number_id"]}, "statuses": [{
                "id": "wamid.1", "status": status, "biz_opaque_callback_data": key,
            }]},
        }]}]})
        signature = signature or "sha256=" + hmac.new(
            CONFIG["meta_app_secret"].encode(), body.encode(), hashlib.sha256,
        ).hexdigest()
        return app.handle({"routeKey": "POST /whatsapp-status", "headers": {"x-hub-signature-256": signature},
                           "body": body}, CONFIG, self.table)["statusCode"]

    def test_each_form_uses_its_configured_recipients_and_deduplicates_replays(self):
        for lead, product, company, contact, recipients in [
            (INVOICE, "InvoiceNow", "Example", "lead@example.com", ["12025550113", "12025550111", "12025550112"]),
            (WHATSAPP, "WhatsApp Business", "Example", "+65 9123 4567", ["12025550111", "12025550112"]),
            (CONTACT, "AI", "Not provided", "lead@example.com", ["12025550111", "12025550112"]),
        ]:
            previous_sends = len(self.sends)
            self.assertEqual(self.lead(lead), 200)
            self.assertEqual(self.lead(lead), 200)
            alerts = self.sends[previous_sends:]
            self.assertEqual([sent["to"] for sent in alerts], recipients)
            for sent in alerts:
                self.assertEqual([param["text"] for param in sent["template"]["components"][0]["parameters"]],
                                 [product, "Test Lead", company, contact])

    def test_ignores_unauthorized_other_forms_and_whatsapp_without_consent(self):
        self.assertEqual(self.lead(INVOICE, "https://other.example.com"), 403)
        self.assertEqual(self.lead(dict(WHATSAPP, page_url="/book-audit")), 422)
        self.assertEqual(self.lead(dict(WHATSAPP, consent="")), 422)
        self.assertEqual(self.lead(dict(CONTACT, email="invalid")), 422)
        self.assertEqual(self.lead(dict(CONTACT, service="Other")), 422)
        self.graph_mock.assert_not_called()

    def test_replays_do_not_spend_budget_and_monthly_cap_blocks_new_sends(self):
        with patch.object(app, "MONTHLY_SEND_LIMIT", 4):
            self.assertEqual(self.lead(INVOICE), 200)
            self.assertEqual(self.lead(INVOICE), 200)
            self.assertEqual(self.lead(WHATSAPP), 503)
            self.assertEqual(len(self.sends), 4)
            key = f"algorims-lead:whatsapp:{EVENT_ID}:ceo"
            self.assertEqual(self.table.items[key]["send_state"], "capped")

    def test_requires_utility_template(self):
        self.graph_mock.side_effect = None
        self.graph_mock.return_value = dict(TEMPLATE, category="MARKETING")
        self.assertEqual(self.lead(INVOICE), 503)
        self.assertEqual(self.sends, [])
        self.graph_mock.assert_called_once()

    def test_retry_only_resends_to_rate_limited_recipient(self):
        def rate_limit_once(config, endpoint, payload=None):
            if payload and payload["to"] == "12025550111" and not self.sends:
                self.sends.append(payload)
                raise HTTPError(endpoint, 429, "Rate limited", {}, None)
            return self.graph(config, endpoint, payload)
        self.graph_mock.side_effect = rate_limit_once
        self.assertEqual(self.lead(WHATSAPP), 503)
        self.assertEqual(self.lead(WHATSAPP), 200)
        self.assertEqual([sent["to"] for sent in self.sends], ["12025550111", "12025550112", "12025550111"])

    def test_ambiguous_send_failure_still_alerts_other_recipient(self):
        def timeout(config, endpoint, payload=None):
            if payload and payload["to"] == "12025550111":
                raise TimeoutError
            return self.graph(config, endpoint, payload)
        self.graph_mock.side_effect = timeout
        self.assertEqual(self.lead(WHATSAPP), 200)
        self.assertEqual(self.lead(WHATSAPP), 200)
        self.assertEqual([sent["to"] for sent in self.sends], ["12025550112"])
        self.assertEqual(self.table.items[f"algorims-lead:whatsapp:{EVENT_ID}:owner"]["send_state"], "unknown")

    def test_signed_callbacks_track_recipient_and_keep_newest_status(self):
        self.assertEqual(self.lead(CONTACT), 200)
        self.assertEqual(self.lead(INVOICE), 200)
        self.assertEqual(self.lead(WHATSAPP), 200)
        key = self.sends[0]["biz_opaque_callback_data"]
        self.assertEqual(self.status(key, "failed", "sha256=invalid"), 403)
        self.assertNotIn("delivery_status", self.table.items[key])
        self.assertEqual(self.status(key, "delivered"), 200)
        self.assertEqual(self.status(key, "sent"), 200)
        self.assertEqual(self.table.items[key]["delivery_status"], "delivered")
        for sent in self.sends[1:]:
            self.assertNotIn("delivery_status", self.table.items[sent["biz_opaque_callback_data"]])


if __name__ == "__main__":
    unittest.main()
