# Algorims lead alerts

After Web3Forms accepts a Contact Us enquiry, an InvoiceNow consultation, a WhatsApp Business API audit or a Book Audit request, the browser asks AWS to alert the assigned staff via Meta. Contact Us, WhatsApp Business API and Book Audit alert the owner and CEO. InvoiceNow also alerts its additional recipient. The shared WhatsApp landing-page form sends staff alerts only on `/whatsapp-business-api` and `/book-audit`.

The email is the record of the lead. An interrupted browser request or AWS or Meta error can prevent an alert after the email has been accepted. The browser endpoint is public. AWS throttles requests, validates fields, deduplicates sends, and limits WhatsApp send attempts to 300 per UTC month. Requests from outside the website can imitate the browser, so a caller can still consume the alert budget. Email acceptance is unaffected by the alert budget.

The alert stack is `algorims-lead-alerts` in the Algorims AWS account `561580620525`, region `ap-south-1`, the same account as the website. Its Secrets Manager entry is `algorims/website/lead-alerts`. It moved there on 2026-11-26 from account `882040517029`, which belongs to Bharat Finance; the old stack there was deleted the same day.

## Prepare the accounts

1. Use the existing Web3Forms keys for each form. Contact Us uses `PUBLIC_WEB3FORMS_CONTACT_KEY`. Use a separate Web3Forms form and test recipients for staging.
2. In the Algorims WhatsApp Business Account, submit an English utility template named `algorims_staff_lead_v1` with four positional body parameters. The Lambda checks that the configured template is approved and classified as utility before sending.

   ```text
   New enquiry from the Algorims website.
   Service: {{1}}
   Name: {{2}}
   Company: {{3}}
   Reply contact: {{4}}
   The full submission is in the leads inbox. Please follow up.
   ```

3. Create or update the secret in AWS Secrets Manager in the deployment region. Enter the values there, with the opted-in recipient numbers in international E.164 format. Use a random `meta_verify_token` (for example, 32 random bytes encoded as hex). Use a Meta access token with access to the sending number and template metadata.

   | Key | Value |
   | --- | --- |
   | `invoice_recipient` | The additional staff WhatsApp number for InvoiceNow enquiries |
   | `owner`, `ceo` | The two staff WhatsApp numbers shared by all three forms |
   | `graph_version` | A supported Meta Graph API version including the leading `v` |
   | `phone_number_id`, `template_id` | The Algorims sender and approved template IDs |
   | `access_token`, `meta_app_secret` | The sending access token and the webhook app's secret |
   | `meta_verify_token` | The Meta verification token |

## Deploy and verify

1. In the Algorims AWS account, set `alerts_secret_arn` to the configuration secret ARN, deploy `template.yaml` with AWS SAM, and review the change set.

   ```sh
   sam deploy --template-file deploy/lead-alerts/template.yaml \
     --stack-name algorims-lead-alerts --region ap-south-1 --resolve-s3 \
     --capabilities CAPABILITY_IAM --confirm-changeset \
     --parameter-overrides "AlertsSecretArn=$alerts_secret_arn"
   ```

2. Use the stack output `MetaCallback` and `meta_verify_token` on the Meta app subscribed to the Algorims account's `messages` webhook. If an app is already receiving Meta events, use a separate subscription or forward signed callbacks from the existing handler. Confirm the existing subscription's routing before making changes.
3. For a staging stack, set `SiteOrigin` to the exact HTTPS staging origin. Build the staging website with `PUBLIC_LEAD_ALERT_URL` set to the staging `LeadAlertUrl` stack output. Submit a synthetic enquiry from each page and check all three emails and the seven alert deliveries. Confirm `/book-audit` emails through Web3Forms and alerts staff. Verify that a rejected AWS alert leaves the email submission successful.
4. Set the GitHub Actions repository variable `LEAD_ALERT_URL` to the production stack output. Verify the production recipients for each form, then deploy the website. To disable browser alerts, remove the variable and redeploy. Email submission continues through Web3Forms.

## Troubleshooting

DynamoDB stores status and Meta message IDs per submission and recipient for 30 days. Find a lead by its `event_id` from the email copy. The key is `algorims-lead:<source>:<event_id>:<recipient role>`, where the source is `contact`, `invoicenow`, `whatsapp` or `audit`. Check CloudWatch for template, send or delivery failures. Requests with the same submission ID skip previously attempted recipients, except those Meta explicitly rate-limited. The browser makes one alert request per accepted email. For a missed, capped, rejected or unconfirmed alert, use the email to follow up. A timeout can occur after Meta accepted the message.

Run the local webhook checks with `python3 -B -m unittest discover -s tools -p test_lead_alerts.py`.
