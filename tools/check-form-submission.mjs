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
    values = new Map();
    append(name, value) { this.values.set(name, value); }
  }
  globalThis.FormData = FakeFormData;
  globalThis.fetch = async (_url, { body }) => {
    assert.equal(body.values.get("access_key"), "configured-key");
    assert.equal(body.values.get("subject"), "Subject");
    return { ok: true, json: async () => ({ success: true }) };
  };
  await sendForm({}, "configured-key", "Subject", "team@example.com", "Body");

  globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: false }) });
  await assert.rejects(sendForm({}, "configured-key", "Subject", "team@example.com", "Body"));

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
