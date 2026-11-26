# Algorims architecture changes

This snapshot covers the website changes from the initial AWS WhatsApp alert rollout through the Contact Us multi-service fix, 25–26 November 2026. The file inventory is the Git diff from `e39a87b` through `f1a5511` and includes the adjacent frontend updates. Deployment details come from the workflow, SAM template and rollout notes in the repository.

- [Frontend diagram](frontend.html) follows static delivery from CloudFront and S3 into Astro pages, consent, measurement and forms.
- [Backend diagram](backend.html) follows Web3Forms email, the separate AWS alert, WhatsApp delivery and Meta status callbacks.

Open either HTML file in a browser. Select a diagram node to see its role or open **Component inventory** for the full flow. The diagrams use the AWS sample Architecture Diagram MCP server and the official July 2026 AWS Architecture Icons. [AWS sample MCP server](https://github.com/aws-samples/sample-architecture-diagram-mcp-server) · [AWS Architecture Icons](https://aws.amazon.com/architecture/icons/)

## Form routing

| Form | Email path | Staff WhatsApp recipients after email acceptance |
| --- | --- | --- |
| Contact Us · `/contact` | Web3Forms | Owner and CEO |
| InvoiceNow · `/invoicenow` | Web3Forms | InvoiceNow recipient, owner and CEO |
| WhatsApp Business API · `/whatsapp-business-api` · `API-01` | Web3Forms | Owner and CEO |
| Book Audit · `/book-audit` · `AUD-01` | Web3Forms | Owner and CEO |
| Other WhatsApp campaign forms and Support | Web3Forms | Email only |

Alerts require `PUBLIC_LEAD_ALERT_URL` and a successful Web3Forms response. A missing form key opens a mail draft. The leads inbox is the system of record. The browser makes one best-effort alert request after acceptance.

## File-by-file change inventory

Paths are relative to the repository root. The tables account for all 49 changed paths in the snapshot.

### Frontend pages, layout and data

| Path | Change |
| --- | --- |
| `src/pages/index.astro` | Reorganized the homepage around shared service, solution, approach, partner, trust, proof and consultation sections. |
| `src/pages/services.astro` | Rebuilt service-practice details as indexed showcases. |
| `src/pages/solutions/index.astro` | Reused the full solutions showcase and consultation CTA. |
| `src/pages/partners.astro` | Moved partner details into indexed panels with partner-specific links and content. |
| `src/pages/case-studies/index.astro` | Switched the listing to the shared showcase panel structure. |
| `src/pages/contact.astro` | Revised layout and copy, added multi-select services, updated contact links, wired lead alerts and added a privacy notice. |
| `src/pages/invoicenow.astro` | Uses the shared public contact number and WhatsApp link. |
| `src/pages/support.astro` | Added a notice covering request details and attachments. |
| `src/pages/privacy.astro` | Added the privacy policy. |
| `src/pages/terms.astro` | Added terms of use. |
| `src/pages/cookies.astro` | Added the cookie policy, with optional-tool details driven by build configuration. |
| `src/layouts/BaseLayout.astro` | Wires shared consent, optional chat, legal footer links and Cookie settings. |
| `src/data/ogPages.ts` | Added dedicated legal-page Open Graph copy and replaced the old Security entry with Cookies. |
| `src/data/whatsapp.ts` | Centralized the public WhatsApp URL and retained prefilled message and campaign code support. |

### Frontend components

| Path | Change |
| --- | --- |
| `src/components/Analytics.astro` | Restores saved choices, sets Google Consent Mode v2 defaults, and defers Meta Pixel loading until marketing consent. |
| `src/components/AwsAiAnnouncement.astro` | Schedules the announcement after the visitor answers a displayed cookie banner. |
| `src/components/ConsultationCta.astro` | Redesigned the reusable consultation section. |
| `src/components/CookieConsent.astro` | Added the consent banner, preferences dialog and functional-consent chat gate. |
| `src/components/PartnerGrid.astro` | Added the reusable homepage partner section. |
| `src/components/ScrollShowcase.astro` | Added the shared indexed panel layout. |
| `src/components/ServiceShowcase.astro` | Added the homepage service practice preview. |
| `src/components/SolutionsShowcase.astro` | Added shared full and compact solution presentations. |
| `src/components/TrustedTeams.astro` | Added the shared customer proof section to the homepage. |
| `src/components/VisualShowcase.astro` | Added shared interactive tabs and presentation for visual phases. |
| `src/components/WhyAlgorims.astro` | Added the homepage differentiation section. |
| `src/components/case-studies/CaseStudiesShowcase.astro` | Mapped case-study content and detail links into shared showcase panels. |
| `src/components/illustrations/ApproachShowcase.astro` | Switched the approach stages to VisualShowcase. |
| `src/components/invoicenow/LeadForm.astro` | Added the alert URL, correlation ID and privacy notice. |
| `src/components/legal/LegalPage.astro` | Added the shared policy layout. |
| `src/components/whatsapp/LeadForm.astro` | Enables alerts for Business API and Book Audit and gives each the appropriate fallback address. |

### Browser scripts and configuration

| Path | Change |
| --- | --- |
| `src/lib/consentConfig.ts` | Derives enabled consent categories from the configured Chatling, GA4, Google Ads and Meta Pixel IDs. |
| `src/scripts/consent.ts` | Persists versioned choices, publishes consent updates and clears known category storage on revocation. |
| `src/scripts/formSubmission.ts` | Keeps Web3Forms as the full submission path and adds the post-acceptance JSON alert using a field allowlist and keepalive. |
| `src/scripts/partner-showcase.ts` | Removed and replaced by the shared scroll showcase script. |
| `src/scripts/scroll-showcase.ts` | Synchronizes the panel, selected index, window hash, focus and responsive or reduced-motion behavior. |
| `src/scripts/tracking.ts` | Requires marketing consent before sending normalized phone information for Google enhanced conversions. |
| `.env.example` | Documents the browser alert endpoint and optional Chatling ID. |

### Backend, deployment and tests

| Path | Change |
| --- | --- |
| `deploy/cloudfront-function.js` | Added HTTP 301 canonical-host handling with query preservation alongside static directory rewrites. |
| `deploy/lead-alerts/function/app.py` | Added lead ingress and delivery callbacks, validation, template checks, routing, deduplication, budget enforcement and outcome logging. Now supports multiple Contact Us services. |
| `deploy/lead-alerts/template.yaml` | Defines the regional API Gateway, Lambda, IAM permissions, DynamoDB table, and CloudWatch log group, with a reference to Secrets Manager. |
| `deploy/lead-alerts/README.md` | Documents setup, deployment, account migration, recipient routing and troubleshooting. |
| `.github/workflows/deploy-s3.yml` | Runs backend unit tests alongside website checks and injects the alert URL into the static build. |
| `tools/check-form-submission.mjs` | Checks alert ordering, request shape and Web3Forms failure behavior. |
| `tools/check-migrated-dynamic-pages.mjs` | Updated case-study checks to match showcase panels and their links. |
| `tools/test_lead_alerts.py` | Added Lambda tests for source validation, origins, recipient routing, budget and webhook behavior. |
| `README.md` | Links the website documentation to the lead alert rollout. |

### Legacy rollback snapshot

| Path | Change |
| --- | --- |
| `assets/js/site.js` | Updated legacy services proof, contact number, WhatsApp link and optional contact message. |
| `uploads/Algorims-Website-main/assets/js/site.js` | Updated the archived copy of the legacy contact links and message validation. |
| `uploads/Algorims-Website-main/footer.html` | Updated the archived footer contact number and WhatsApp link. |
