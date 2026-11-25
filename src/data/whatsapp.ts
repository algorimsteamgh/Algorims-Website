// WhatsApp Business Platform campaign pages (/whatsapp-*, /wati-alternative,
// /book-audit). One config per page; LandingPage.astro renders them all.
//
// Copy rules (see the WhatsApp marketing playbook, section 7):
// - Say "verified Meta Tech Provider" as text only. Never "Meta Business Partner".
// - Never promise the green tick: we provide application support; Meta decides.
// - Always say Meta bills message fees directly to the client.
// - Client logos and named results only with written client approval.

export const WHATSAPP_NUMBER = "6581492575";
export const WHATSAPP_DISPLAY = "+65 8149 2575";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Matches the encoding in the playbook (apostrophe as %27). */
const encode = (text: string) => encodeURIComponent(text).replaceAll("'", "%27");

/** wa.me link with a prefilled message ending in the page code, e.g. [CLN-01]. */
export const waLink = (message: string, code: string) =>
  `${WHATSAPP_URL}?text=${encode(`${message} [${code}]`)}`;

export interface Message { from: "customer" | "business"; text: string }

export interface LandingPageConfig {
  slug: string;
  /** Page code carried in the WhatsApp prefill and the lead form. */
  code: string;
  waMessage: string;
  metaTitle: string;
  metaDescription: string;
  og: { kicker: string; title: string; description?: string };
  kicker: string;
  headline: string;
  /** Optional coloured second line of the headline. */
  headlineAccent?: string;
  subhead?: string;
  outcomes: { icon: string; title: string; body: string }[];
  demo: {
    title: string;
    body: string;
    business: string;
    chat: Message[];
    /** Swap the chat mock for the recorded 30–60 s demo when it exists. */
    video?: { src: string; poster: string; captions?: string };
  };
  extra?: "pricing" | "comparison";
  /** Industry preselected in the lead form. */
  industry?: string;
  faqs?: { q: string; a: string }[];
  breadcrumb: string;
}

export const SUBHEAD = "Set up and managed by a verified Meta Tech Provider in Singapore.";

export const steps = [
  { title: "Audit", body: "A free 15-minute call. We look at your chat volume, your current setup and the one workflow worth automating first." },
  { title: "Setup", body: "We handle Meta business verification, connect your WhatsApp Business number, get your message templates approved and build your flows." },
  { title: "Go live", body: "Your team starts replying from one inbox. We watch quality ratings and tune the AI agent in the first weeks." },
];

/**
 * TODO(before ads): set `priceFrom` for each package, e.g. "S$1,500 setup + S$300/mo".
 * While null, the card shows "Quoted after your free audit" instead of a price.
 */
export const packages: { name: string; for: string; priceFrom: string | null; items: string[]; featured?: boolean }[] = [
  {
    name: "Starter",
    for: "Small shops, clinics and F&B outlets",
    priceFrom: null,
    items: ["WhatsApp Business setup", "Move your existing number", "3 approved message templates", "Shared team inbox"],
  },
  {
    name: "Growth",
    for: "Retail, education and real estate teams",
    priceFrom: null,
    featured: true,
    items: ["Everything in Starter", "AI chat agent trained on your business", "Broadcasts to opted-in customers", "CRM sync"],
  },
  {
    name: "Enterprise",
    for: "Multi-outlet and regulated brands",
    priceFrom: null,
    items: ["Multiple numbers and outlets", "Custom flows and integrations", "Service-level agreement", "Named support engineer"],
  },
];

/** Published results only (SMAC Tech Labs story is public on /customer-stories). */
export const results = [
  { value: "~1 sec", label: "First-line reply time, down from minutes, across website, WhatsApp and email", source: "SMAC Tech Labs", href: "/customer-stories/smac-tech-labs" },
  { value: "80%", label: "Of repetitive support tickets resolved without a person stepping in", source: "SMAC Tech Labs", href: "/customer-stories/smac-tech-labs" },
];

/** Add logos here only after the client approves in writing. */
export const clientLogos: { src: string; alt: string }[] = [];

export const META_PRICING_URL = "https://developers.facebook.com/docs/whatsapp/pricing";

export const coreFaqs = [
  {
    q: "Can you get us the green tick?",
    a: "We prepare and submit your verified badge (green tick) application and fix anything Meta flags. Meta alone decides who gets it, so no provider can guarantee it. Strong brand presence and press coverage help.",
  },
  {
    q: "How do WhatsApp message fees work?",
    a: `Meta charges message fees directly to your account, based on the message type and your customer's country. Replies inside a customer's 24-hour service window are currently free. Our fees cover setup, software and support. See <a href="${META_PRICING_URL}" target="_blank" rel="noopener noreferrer">Meta's current rates</a>.`,
  },
  {
    q: "Can we keep our existing number?",
    a: "In most cases, yes. We connect your current WhatsApp Business number to our managed service. Where Meta supports it, you can keep using the app on the same number. We confirm eligibility during the audit.",
  },
  {
    q: "How long does setup take?",
    a: "Most businesses go live within 7 days. The main variable is Meta's business verification, which we start on day one; if your business is already verified, it is often faster.",
  },
];

const chatHello: Message = { from: "customer", text: "Hi, are you open on Sunday?" };

export const landingPages = {
  api: {
    slug: "whatsapp-business-api",
    code: "API-01",
    waMessage: "Hi, I'm interested in managed WhatsApp Business",
    metaTitle: "Managed WhatsApp Business in Singapore | Algorims",
    metaDescription: "Managed WhatsApp Business in Singapore. Connect AI replies, a shared inbox and automated updates with Algorims, a verified Meta Tech Provider.",
    og: { kicker: "WhatsApp Business", title: "WhatsApp Business, managed for you", description: "Set up and managed by a verified Meta Tech Provider in Singapore." },
    kicker: "WhatsApp Business",
    headline: "WhatsApp Business,",
    headlineAccent: "managed for you.",
    subhead: "Give customers one number for sales, support and updates. Algorims connects your systems, builds your automations and sets up a shared inbox for your team.",
    outcomes: [
      { icon: "zap", title: "Reply in seconds with AI", body: "An AI agent answers common questions day and night, then hands over to your team when a person is needed." },
      { icon: "megaphone", title: "Send updates customers asked for", body: "Send approved reminders, order updates and promotions to customers who opted in." },
      { icon: "smartphone", title: "Keep your existing number", body: "Use the number your customers already know. We check migration eligibility during the audit." },
    ],
    demo: {
      title: "See what happens after a message",
      body: "Follow a product enquiry, an order handoff or an appointment reminder. See what the customer reads and what your team or systems do at each step.",
      business: "Your store",
      chat: [
        { from: "customer", text: "Do you have the linen shirt in size M?" },
        { from: "business", text: "Yes, medium is available in white and sage. Which colour would you like?" },
        { from: "customer", text: "White, please." },
        { from: "business", text: "Here’s the white linen shirt in medium. You can order from the product page." },
      ],
    },
    breadcrumb: "WhatsApp Business",
  },
  pricing: {
    slug: "whatsapp-api-pricing",
    code: "PRC-01",
    waMessage: "Hi, I'd like WhatsApp API pricing",
    metaTitle: "WhatsApp Business API Pricing Singapore | Algorims",
    metaDescription: "Transparent WhatsApp Business API pricing in Singapore: our setup, software and support fees, plus how Meta bills message fees directly to you. Green tick application support included.",
    og: { kicker: "WhatsApp API pricing", title: "What WhatsApp Business API really costs", description: "Our fees, plus Meta's message fees billed directly to you." },
    kicker: "WhatsApp API pricing",
    headline: "WhatsApp Business API pricing,",
    headlineAccent: "without the surprises",
    subhead: "Clear packages from a verified Meta Tech Provider in Singapore. Meta's message fees are billed to you directly, never marked up.",
    outcomes: [
      { icon: "receipt", title: "No message markup", body: "Meta bills message fees straight to your WhatsApp account at Meta's rates." },
      { icon: "badge-check", title: "Green tick application support", body: "We prepare and submit your verified badge application. Meta makes the final call." },
      { icon: "smartphone", title: "Keep your existing number", body: "Move the number your customers already use. Setup included in every package." },
    ],
    demo: {
      title: "What you get on day 7",
      body: "Your number on the official API, approved templates and an AI agent that replies while your team is busy.",
      business: "Your business",
      chat: [
        { from: "customer", text: "How much is delivery to Tampines?" },
        { from: "business", text: "Delivery to Tampines is $5, free for orders above $60. Want me to start an order?" },
        { from: "customer", text: "Yes" },
        { from: "business", text: "Great! Here's our catalogue 🛍️ Tap any item to add it to your cart." },
      ],
    },
    extra: "pricing",
    breadcrumb: "WhatsApp API pricing",
  },
  clinics: {
    slug: "whatsapp-for-clinics",
    code: "CLN-01",
    waMessage: "Hi, I'm interested in WhatsApp for my clinic",
    industry: "Clinic or healthcare",
    metaTitle: "WhatsApp for Clinics Singapore — Bookings & Reminders | Algorims",
    metaDescription: "Let patients book, reschedule and ask questions on WhatsApp. Official API with an AI agent, set up by a verified Meta Tech Provider in Singapore. Live in 7 days.",
    og: { kicker: "WhatsApp for clinics", title: "Patient bookings and reminders on WhatsApp", description: "Official API, live in 7 days." },
    kicker: "WhatsApp for clinics",
    headline: "Patient bookings on WhatsApp —",
    headlineAccent: "live in 7 days",
    outcomes: [
      { icon: "calendar-check", title: "Book and reschedule on chat", body: "Patients pick a slot on WhatsApp instead of waiting on hold. Your front desk sees every booking." },
      { icon: "bell-ring", title: "Cut no-shows with reminders", body: "Automatic appointment reminders and follow-ups to patients who opted in." },
      { icon: "clock", title: "Answer FAQs after hours", body: "Opening hours, fees, location and preparation instructions, answered at any hour." },
    ],
    demo: {
      title: "A booking, start to finish",
      body: "The AI agent handles routine booking questions and passes anything clinical to your staff.",
      business: "Your clinic",
      chat: [
        { from: "customer", text: "Hi, can I see a doctor tomorrow morning?" },
        { from: "business", text: "Good morning! We have 9:30am or 11:00am tomorrow with Dr Tan. Which suits you?" },
        { from: "customer", text: "9:30 please" },
        { from: "business", text: "Booked ✅ Tomorrow 9:30am with Dr Tan. Reply RESCHEDULE anytime to change it." },
      ],
    },
    faqs: [{ q: "Is patient data safe on WhatsApp?", a: "Messages are end-to-end encrypted in transit. We keep the AI agent to scheduling and general questions, route anything clinical to your staff, and store chat records in line with Singapore's PDPA." }],
    breadcrumb: "WhatsApp for clinics",
  },
  education: {
    slug: "whatsapp-for-education",
    code: "EDU-01",
    waMessage: "Hi, I'm interested in WhatsApp for education",
    industry: "Education or tuition",
    metaTitle: "WhatsApp for Schools & Tuition Centres Singapore | Algorims",
    metaDescription: "Answer parent enquiries, confirm trial classes and send reminders on WhatsApp. Official API, set up by a verified Meta Tech Provider in Singapore.",
    og: { kicker: "WhatsApp for education", title: "Enrolments and parent updates on WhatsApp", description: "Official API, live in 7 days." },
    kicker: "WhatsApp for education",
    headline: "Parent enquiries on WhatsApp —",
    headlineAccent: "live in 7 days",
    outcomes: [
      { icon: "graduation-cap", title: "Turn enquiries into trial classes", body: "Answer course, schedule and fee questions instantly and book a trial on the spot." },
      { icon: "bell-ring", title: "Class and fee reminders", body: "Timetable changes, class reminders and fee notices sent to opted-in parents." },
      { icon: "users", title: "One inbox for every centre", body: "All branches reply from one shared inbox, with the full conversation history." },
    ],
    demo: {
      title: "A parent enquiry, handled",
      body: "The AI agent answers from your course information and books trial classes into your schedule.",
      business: "Your centre",
      chat: [
        { from: "customer", text: "Do you have P5 maths classes on Saturday?" },
        { from: "business", text: "Yes, Saturdays 10am and 2pm at our Bishan centre. Would you like a free trial class?" },
        { from: "customer", text: "Yes, the 10am one" },
        { from: "business", text: "Booked ✅ Free trial this Saturday, 10am, Bishan. See you there!" },
      ],
    },
    breadcrumb: "WhatsApp for education",
  },
  realEstate: {
    slug: "whatsapp-for-real-estate",
    code: "REA-01",
    waMessage: "Hi, I'm interested in WhatsApp for real estate",
    industry: "Real estate",
    metaTitle: "WhatsApp for Real Estate Agencies Singapore | Algorims",
    metaDescription: "Qualify buyer and tenant enquiries, schedule viewings and send listing alerts on WhatsApp. Official API, set up by a verified Meta Tech Provider in Singapore.",
    og: { kicker: "WhatsApp for real estate", title: "Qualify leads and book viewings on WhatsApp", description: "Official API, live in 7 days." },
    kicker: "WhatsApp for real estate",
    headline: "Qualify property leads on WhatsApp —",
    headlineAccent: "live in 7 days",
    outcomes: [
      { icon: "filter", title: "Qualify every enquiry", body: "Budget, location and timing collected before an agent picks up the chat." },
      { icon: "calendar-check", title: "Book viewings in chat", body: "Leads choose a viewing slot without phone tag." },
      { icon: "home", title: "Listing alerts to opted-in leads", body: "New listings that match what each buyer asked for." },
    ],
    demo: {
      title: "From ad click to viewing",
      body: "The AI agent asks your qualifying questions and hands hot leads to the right agent.",
      business: "Your agency",
      chat: [
        { from: "customer", text: "Is the 3-bedroom in Punggol still available?" },
        { from: "business", text: "Yes it is! Are you looking to buy or rent, and when would you like to move?" },
        { from: "customer", text: "Rent, from March" },
        { from: "business", text: "Got it. Viewings are open Thursday 7pm or Saturday 11am. Which works?" },
      ],
    },
    breadcrumb: "WhatsApp for real estate",
  },
  fnb: {
    slug: "whatsapp-for-fnb",
    code: "FNB-01",
    waMessage: "Hi, I'm interested in WhatsApp for F&B",
    industry: "F&B",
    metaTitle: "WhatsApp for Restaurants & F&B Singapore | Algorims",
    metaDescription: "Take reservations, share menus and send promotions on WhatsApp. Official API, set up by a verified Meta Tech Provider in Singapore. Live in 7 days.",
    og: { kicker: "WhatsApp for F&B", title: "Reservations and orders on WhatsApp", description: "Official API, live in 7 days." },
    kicker: "WhatsApp for F&B",
    headline: "Reservations on WhatsApp —",
    headlineAccent: "live in 7 days",
    outcomes: [
      { icon: "utensils", title: "Reservations without the phone", body: "Guests book, change or cancel a table in chat, any time of day." },
      { icon: "book-open", title: "Menu and ordering in chat", body: "Share today's menu and take pickup or delivery orders." },
      { icon: "megaphone", title: "Promotions to opted-in diners", body: "Set lunches, events and loyalty offers sent to regulars who asked for them." },
    ],
    demo: {
      title: "A Friday night booking",
      body: "The AI agent handles bookings and menu questions so your floor team can focus on guests.",
      business: "Your restaurant",
      chat: [
        { from: "customer", text: "Table for 4 this Friday at 7.30?" },
        { from: "business", text: "We have 7:15pm or 8:00pm for 4 this Friday. Which would you like?" },
        { from: "customer", text: "8pm" },
        { from: "business", text: "Confirmed ✅ Table for 4, Friday 8pm. Reply CHANGE if plans shift." },
      ],
    },
    breadcrumb: "WhatsApp for F&B",
  },
  aiAgent: {
    slug: "whatsapp-ai-agent",
    code: "AIA-01",
    waMessage: "Hi, I'm interested in a WhatsApp AI agent",
    metaTitle: "WhatsApp AI Agent & Chatbot Singapore — Built with Claude | Algorims",
    metaDescription: "An AI agent on WhatsApp that answers from your own information, books appointments and hands over to your team. Built by Algorims, a verified Meta Tech Provider in Singapore.",
    og: { kicker: "WhatsApp AI agent", title: "An AI agent that answers on WhatsApp", description: "Answers from your knowledge, hands over to people." },
    kicker: "WhatsApp AI agent",
    headline: "An AI agent on WhatsApp —",
    headlineAccent: "live in 7 days",
    outcomes: [
      { icon: "book-open-check", title: "Answers from your information", body: "Trained on your FAQs, price lists and policies, not the open internet." },
      { icon: "user-round-check", title: "Hands over to a person", body: "Passes the chat to your team when a customer asks or the agent is unsure." },
      { icon: "languages", title: "Replies in your customers' language", body: "English, Chinese, Malay, Tamil and more, without extra staff." },
    ],
    demo: {
      title: "Watch the handover",
      body: "The agent handles routine questions, then hands the conversation to your team with full context.",
      business: "Your business",
      chat: [
        { from: "customer", text: "What's your refund policy?" },
        { from: "business", text: "You can return unused items within 14 days for a full refund. Do you want to start a return?" },
        { from: "customer", text: "Actually I need to speak to someone about a damaged item" },
        { from: "business", text: "Sorry to hear that. I'm passing you to Mei from our team now, she'll reply in a few minutes." },
      ],
    },
    faqs: [{ q: "Which AI model does the agent use?", a: "We build on Claude by Anthropic for most agents, the same approach behind our <a href=\"/customer-stories/smac-tech-labs\">SMAC Tech Labs support agent</a>. The agent answers only from the information you approve." }],
    breadcrumb: "WhatsApp AI agent",
  },
  wati: {
    slug: "wati-alternative",
    code: "WAT-01",
    waMessage: "Hi, I'm looking for a WATI alternative",
    metaTitle: "WATI Alternative Singapore — Managed WhatsApp API | Algorims",
    metaDescription: "Looking for a WATI alternative? Algorims sets up and runs your WhatsApp Business API for you: AI agent, flows, CRM sync and a Singapore support team.",
    og: { kicker: "WATI alternative", title: "A managed alternative to self-serve WhatsApp tools", description: "We set it up and run it for you." },
    kicker: "WATI alternative",
    headline: "Want WhatsApp done for you,",
    headlineAccent: "not another tool to learn?",
    subhead: "Algorims sets up and manages your official WhatsApp Business API as a verified Meta Tech Provider in Singapore. Live in 7 days.",
    outcomes: [
      { icon: "wrench", title: "We build it, you use it", body: "Flows, templates and the AI agent built for you, not left as a to-do list." },
      { icon: "plug", title: "Connected to your systems", body: "CRM, booking and order systems wired in as part of setup." },
      { icon: "headset", title: "A Singapore team you can call", body: "Engineers in your time zone who know your setup." },
    ],
    demo: {
      title: "Switching without downtime",
      body: "We move your number and rebuild your key flows, then switch over when everything is tested.",
      business: "Your business",
      chat: [chatHello, { from: "business", text: "Hi! Yes, 10am–6pm on Sunday. Would you like to book a slot?" }],
    },
    extra: "comparison",
    faqs: [{ q: "Can we move from our current WhatsApp provider?", a: "Yes. A WhatsApp Business API number can move between providers. We plan the move so templates and key flows are ready before the switch, and you keep the same number." }],
    breadcrumb: "WATI alternative",
  },
} satisfies Record<string, LandingPageConfig>;

export const industries = ["Clinic or healthcare", "Retail or e-commerce", "Education or tuition", "Real estate", "F&B", "Professional services", "Other"];
export const chatVolumes = ["Under 500", "500–5,000", "Over 5,000"];

export const BOOK_AUDIT_CODE = "AUD-01";
export const bookAuditWaLink = waLink("Hi, I'd like to book a free WhatsApp audit", BOOK_AUDIT_CODE);
