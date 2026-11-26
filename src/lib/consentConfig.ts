// Build-time view of the optional tools this build loads. Each one needs the
// visitor's consent (src/components/CookieConsent.astro) and appears in the
// cookie policy only when it is switched on here.
const env = import.meta.env;

/** Chatling chat assistant. Unset = no chat widget and no chat consent category. */
export const chatbotId = (env.PUBLIC_CHATLING_ID as string | undefined) || undefined;

export const optionalTools = {
  functional: Boolean(chatbotId),
  analytics: Boolean(env.PUBLIC_GA4_ID),
  marketing: Boolean(env.PUBLIC_GOOGLE_ADS_ID || env.PUBLIC_META_PIXEL_ID),
};

/** Whether anything on the site needs consent (shows "Cookie settings" in the footer). */
export const hasOptionalTools = Object.values(optionalTools).some(Boolean);
