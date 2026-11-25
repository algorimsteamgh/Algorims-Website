// Run with: node --experimental-strip-types tools/check-form-submission.mjs
import assert from "node:assert/strict";
import { sendForm, setButtonLoading } from "../src/scripts/formSubmission.ts";

const originalFetch = globalThis.fetch;
const originalFormData = globalThis.FormData;
globalThis.window = { location: { href: "" } };

try {
  await sendForm({}, undefined, "Hello & goodbye", "team@example.com", "Line 1\nLine 2");
  assert.equal(window.location.href, "mailto:team@example.com?subject=Hello%20%26%20goodbye&body=Line%201%0ALine%202");

  class FakeFormData {
    constructor(form) { this.values = new Map(Object.entries(form)); }
    append(name, value) { this.values.set(name, value); }
    get(name) { return this.values.get(name) ?? null; }
  }
  globalThis.FormData = FakeFormData;
  const form = { page_url: "/contact/", event_id: "lead-id", service: "AI", message: "Private note" };
  const emailUrl = "https://api.web3forms.com/submit";
  const alertUrl = "https://alerts.example.com/lead-alert";
  const requests = [];
  let emailResult = { success: true };
  let alertFails = false;
  globalThis.fetch = async (url, request) => {
    requests.push({ url, ...request });
    if (url === emailUrl) return { ok: true, json: async () => emailResult };
    if (alertFails) throw new Error("Connection lost");
    return { ok: true };
  };
  const submit = (values, url) => sendForm(values, "configured-key", "Subject", "team@example.com", "Body", url);
  await submit(form, alertUrl);
  assert.deepEqual(requests.map(({ url }) => url), [emailUrl, alertUrl]);
  const [email, alert] = requests;
  assert.equal(email.body.get("access_key"), "configured-key");
  assert.equal(email.body.get("subject"), "Subject");
  assert.equal(email.body.get("message"), "Private note");
  assert.equal(alert.keepalive, true);
  const alertBody = JSON.parse(alert.body);
  assert.equal(alertBody.event_id, email.body.get("event_id"));
  assert.equal(alertBody.page_url, "/contact/");
  assert.equal(alertBody.service, "AI");
  assert.equal("message" in alertBody, false);
  assert.equal("access_key" in alertBody, false);

  requests.length = 0;
  await submit({}, alertUrl);
  await submit(form);
  emailResult = { success: false };
  await assert.rejects(submit(form, alertUrl));
  emailResult = {};
  await assert.rejects(submit(form, alertUrl));
  assert.deepEqual(requests.map(({ url }) => url), [emailUrl, alertUrl, emailUrl, emailUrl, emailUrl]);

  emailResult = { success: true };
  alertFails = true;
  const warnings = [];
  const originalWarn = console.warn;
  try {
    console.warn = (...args) => warnings.push(args);
    await submit(form, alertUrl);
    assert.deepEqual(warnings, [["Staff alert request failed"]]);
  } finally {
    console.warn = originalWarn;
  }

  const button = { innerHTML: "Send", dataset: {}, style: {}, disabled: false };
  setButtonLoading(button, true);
  assert.equal(button.disabled, true);
  setButtonLoading(button, false);
  assert.equal(button.innerHTML, "Send");
  assert.equal(button.disabled, false);
} finally {
  globalThis.fetch = originalFetch;
  globalThis.FormData = originalFormData;
  delete globalThis.window;
}
