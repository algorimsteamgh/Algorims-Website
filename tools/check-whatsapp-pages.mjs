// Checks the built WhatsApp campaign pages against the launch plan.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../dist/${path}`, import.meta.url), "utf8");
const pages = {
  "whatsapp-business-api": "API-01", "whatsapp-api-pricing": "PRC-01", "whatsapp-for-clinics": "CLN-01",
  "whatsapp-for-education": "EDU-01", "whatsapp-for-real-estate": "REA-01",
  "whatsapp-for-fnb": "FNB-01", "whatsapp-ai-agent": "AIA-01", "wati-alternative": "WAT-01",
};
// Exact links from the plan.
const planned = {
  "API-01": "https://wa.me/6581492575?text=Hi%2C%20I%27m%20interested%20in%20WhatsApp%20API%20%5BAPI-01%5D",
  "CLN-01": "https://wa.me/6581492575?text=Hi%2C%20I%27m%20interested%20in%20WhatsApp%20for%20my%20clinic%20%5BCLN-01%5D",
};

for (const [slug, code] of Object.entries(pages)) {
  const html = read(`${slug}/index.html`);
  const links = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map((m) => m[1].replaceAll("&amp;", "&"));
  assert(links.length >= 3, `${slug}: WhatsApp CTAs`);
  for (const link of links) {
    assert(link.startsWith("https://wa.me/6581492575?text="), `${slug}: WhatsApp number`);
    assert(decodeURIComponent(link).endsWith(`[${code}]`), `${slug}: page code in ${link}`);
  }
  if (planned[code]) assert(links.includes(planned[code]), `${slug}: link matches plan`);
  assert.equal((html.match(new RegExp(`data-wa-code="${code}"`, "g")) ?? []).length, links.length, `${slug}: every WhatsApp link tracked`);
  assert.match(html, /Book a free audit/, `${slug}: audit CTA`);
  assert.match(html, /Verified Meta Tech Provider/i, `${slug}: proof`);
  for (const field of ["name", "company", "whatsapp", "industry", "monthly_chats", "consent", "page_code", "utm_source", "utm_campaign", "utm_content"]) {
    assert.match(html, new RegExp(`name="${field}"`), `${slug}: form field ${field}`);
  }
  for (const volume of ["Under 500", "500–5,000", "Over 5,000"]) assert(html.includes(volume), `${slug}: chat volume ${volume}`);
  assert.match(html, /PDPA/, `${slug}: PDPA consent`);
  assert.match(html, /href="\/privacy"/, `${slug}: privacy link`);
  assert.match(html, /Meta charges message fees directly to your account\. Our fees cover setup, software and support\./, `${slug}: fee line`);
  assert.match(html, /"@type":"FAQPage"/, `${slug}: FAQ schema`);
  assert.doesNotMatch(html, /Meta Business Partner/i, `${slug}: partner wording`);
  assert.doesNotMatch(html, /chatling\.ai|id="aws-ai-announce"|id="meta-strip"/, `${slug}: no popups or chat widget`);
}

const api = read("whatsapp-business-api/index.html");
assert.match(api, /whatsapp-retail-outcomes-3d\.webp/);
assert.match(api, /href="#workflow"/);
assert.match(api, /name="wa-workflow" checked[^>]+aria-controls="wa-sales-example"/);
for (const scenario of ["sales", "support", "reminder"]) {
  assert.match(api, new RegExp(`aria-controls="wa-${scenario}-example"`));
  assert.match(api, new RegExp(`id="wa-${scenario}-example"`));
}
assert(!existsSync(new URL("../dist/whatsapp-for-retail/index.html", import.meta.url)), "Retail example belongs on the Business API page");

const thanks = read("book-audit/thanks/index.html");
assert.match(thanks, /noindex/);
assert.match(read("book-audit/index.html"), /wa\.me\/6581492575/);
console.log(`WhatsApp pages: ${Object.keys(pages).length} landing pages + booking flow OK`);
