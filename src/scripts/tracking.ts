// Conversion events for the WhatsApp campaign pages. Every call is a no-op
// when the Meta Pixel or Google tag is not loaded (IDs unset).
//
// Meta events carry an eventID so a later Conversions API (server) feed can
// send the same event and Meta will deduplicate the pair.

import { hasConsent } from "./consent";

type Fbq = (...args: unknown[]) => void;
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window { fbq?: Fbq; gtag?: Gtag }
}

const ADS_ID = import.meta.env.PUBLIC_GOOGLE_ADS_ID as string | undefined;
const LEAD_LABEL = import.meta.env.PUBLIC_GOOGLE_ADS_LEAD_LABEL as string | undefined;
const BOOK_LABEL = import.meta.env.PUBLIC_GOOGLE_ADS_BOOK_LABEL as string | undefined;

export const newEventId = () =>
  (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);

const fbq: Fbq = (...args) => window.fbq?.(...args);
const gtag: Gtag = (...args) => window.gtag?.(...args);
const adsConversion = (label: string | undefined, eventId: string) => {
  if (ADS_ID && label) gtag("event", "conversion", { send_to: `${ADS_ID}/${label}`, transaction_id: eventId });
};

export function trackWhatsAppClick(pageCode: string) {
  fbq("track", "Contact", { content_name: pageCode }, { eventID: newEventId() });
  gtag("event", "whatsapp_click", { page_code: pageCode });
}

export function trackLead(pageCode: string, eventId: string, phoneE164?: string) {
  // Enhanced conversions share a (Google-hashed) phone number: marketing consent only.
  if (phoneE164 && hasConsent("marketing")) gtag("set", "user_data", { phone_number: phoneE164 });
  fbq("track", "Lead", { content_name: pageCode }, { eventID: eventId });
  gtag("event", "generate_lead", { page_code: pageCode });
  adsConversion(LEAD_LABEL, eventId);
}

export function trackAuditBooked() {
  const eventId = newEventId();
  fbq("track", "Schedule", {}, { eventID: eventId });
  gtag("event", "book_audit");
  adsConversion(BOOK_LABEL, eventId);
}

/** Best-effort E.164 for enhanced conversions. Bare 8-digit numbers are taken as Singapore. */
export function toE164(raw: string): string | undefined {
  const digits = raw.replace(/\D/g, "");
  if (raw.trim().startsWith("+") && digits.length >= 8) return `+${digits}`;
  if (/^[3689]\d{7}$/.test(digits)) return `+65${digits}`;
  if (/^65[3689]\d{7}$/.test(digits)) return `+${digits}`;
  return undefined;
}

// ---- UTM / click-ID capture -------------------------------------------------

export const ATTRIBUTION_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gclid", "fbclid"] as const;
const STORE = "algorims-attribution-v1";

/** Saves campaign parameters from the landing URL for the rest of the session. */
export function captureAttribution(): Record<string, string> {
  let saved: Record<string, string> = {};
  try { saved = JSON.parse(sessionStorage.getItem(STORE) ?? "{}"); } catch {}
  const params = new URLSearchParams(location.search);
  const fresh = Object.fromEntries(ATTRIBUTION_KEYS.flatMap((key) => {
    const value = params.get(key);
    return value ? [[key, value.slice(0, 200)]] : [];
  }));
  // A new campaign click replaces the previous attribution as a whole.
  if (Object.keys(fresh).length) {
    saved = { ...fresh, landing_page: location.pathname };
    try { sessionStorage.setItem(STORE, JSON.stringify(saved)); } catch {}
  }
  return saved;
}

/** Fills <input data-attribution="utm_source"> etc. inside `root`. */
export function fillAttributionFields(root: ParentNode, attribution = captureAttribution()) {
  root.querySelectorAll<HTMLInputElement>("input[data-attribution]").forEach((input) => {
    input.value = attribution[input.dataset.attribution!] ?? "";
  });
}

/** One delegated listener for every WhatsApp CTA (a[data-wa-code]). */
export function bindWhatsAppClicks() {
  document.addEventListener("click", (event) => {
    const link = (event.target as Element | null)?.closest?.<HTMLAnchorElement>("a[data-wa-code]");
    if (link) trackWhatsAppClick(link.dataset.waCode!);
  });
}
