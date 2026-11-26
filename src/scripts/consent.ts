// Visitor consent for optional cookies and browser storage.
//
// The choice lives in localStorage under CONSENT_KEY. An inline bootstrap in
// src/components/Analytics.astro reads the same record before any tag loads
// and exposes it as window.algorimsConsent — keep the key, version and
// maximum age in sync with that script.
//
// Categories:
//   functional — the Chatling chat assistant
//   analytics  — Google Analytics 4
//   marketing  — Google Ads and Meta Pixel
// Strictly necessary storage (this record, page-session flags) needs no consent.

export type ConsentCategory = "functional" | "analytics" | "marketing";
export type ConsentChoices = Record<ConsentCategory, boolean>;
export interface ConsentState extends ConsentChoices {
  v: number;
  ts: number;
}

declare global {
  interface Window {
    algorimsConsent?: ConsentState | null;
    algorimsLoadPixel?: () => void;
    chtlConfig?: { chatbotId: string };
  }
}

export const CONSENT_KEY = "algorims-consent";
export const CONSENT_VERSION = 1;
/** Ask again after 12 months. */
export const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000;
export const CONSENT_EVENT = "algorims:consent";
export const CATEGORIES: ConsentCategory[] = ["functional", "analytics", "marketing"];

export function readConsent(): ConsentState | null {
  let state: ConsentState | null = null;
  try { state = JSON.parse(localStorage.getItem(CONSENT_KEY) ?? "null"); } catch {}
  return state && state.v === CONSENT_VERSION && Date.now() - state.ts < CONSENT_MAX_AGE ? state : null;
}

export const hasConsent = (category: ConsentCategory) => Boolean(readConsent()?.[category]);

export function saveConsent(choices: ConsentChoices): ConsentState {
  const state: ConsentState = { v: CONSENT_VERSION, ts: Date.now(), ...choices };
  try { localStorage.setItem(CONSENT_KEY, JSON.stringify(state)); } catch {}
  window.algorimsConsent = state;
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
  return state;
}

/** Remove what an opted-out category may already have stored on this site. */
export function clearCategoryStorage(category: ConsentCategory) {
  const cookiePatterns: Record<ConsentCategory, RegExp | null> = {
    functional: /^chtl_/,
    analytics: /^(_ga|_gid|_gat)/,
    marketing: /^(_gcl_|_fbp$|_fbc$)/,
  };
  const pattern = cookiePatterns[category];
  if (pattern) {
    const host = location.hostname;
    // Tags set cookies on the host, ".host" (Chatling) or the registrable domain (Google, Meta).
    const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
    document.cookie.split(";").map((part) => part.split("=")[0].trim()).filter((name) => pattern.test(name)).forEach((name) => {
      domains.forEach((domain) => { document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`; });
    });
  }
  if (category === "functional") {
    try { Object.keys(localStorage).filter((key) => key.startsWith("chtl_")).forEach((key) => localStorage.removeItem(key)); } catch {}
  }
}
