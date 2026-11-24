// Share-card copy for static pages. Collection pages (blog, solutions,
// products, case studies) derive theirs from content in src/pages/og/.
export interface OgCard {
  kicker: string;
  title: string;
  description?: string;
}

export const staticOgCards: Record<string, OgCard> = {
  home: { kicker: "Algorims", title: "The future of enterprise is autonomous. We build it.", description: "Agentic AI, data, AWS cloud and DevOps for the enterprise." },
  about: { kicker: "About", title: "AWS Advanced Tier Services Partner", description: "Engineering autonomous AI, data and cloud systems." },
  services: { kicker: "Services", title: "AI, data, cloud and DevOps engineering", description: "Development, cloud, DevOps and managed services." },
  "agentic-ai": { kicker: "Agentic AI", title: "Systems that reason, decide and act", description: "Agentic AI on Amazon Nova, Kendra and S3 Vectors." },
  partners: { kicker: "Partners", title: "Technology partners and credentials", description: "AWS, Anthropic Claude, Meta WhatsApp Business, Xero and InvoiceNow." },
  invoicenow: { kicker: "InvoiceNow", title: "InvoiceNow, set up right the first time.", description: "GST InvoiceNow setup for Singapore businesses on Xero or your existing software." },
  "cca-f": { kicker: "CCA-F", title: "Claude Certified Architect Foundations", description: "An independent guide to the exam." },
  contact: { kicker: "Contact", title: "Scope your AI, cloud or DevOps initiative", description: "Most engagements start with a 30-minute conversation." },
  support: { kicker: "Support", title: "Engineers on call for AWS, DevOps and security" },
  blog: { kicker: "Blog", title: "Field notes from the Algorims team", description: "Agentic AI, MLOps, AWS cloud and DevOps engineering." },
  "case-studies": { kicker: "Case studies", title: "Systems we have built and shipped" },
  products: { kicker: "Products", title: "Products from Algorims" },
  solutions: { kicker: "Solutions", title: "Solutions by industry and problem" },
  "book-audit": { kicker: "WhatsApp audit", title: "Book a free 15-minute WhatsApp audit", description: "With a verified Meta Tech Provider in Singapore." },
  privacy: { kicker: "Legal", title: "Privacy" },
  terms: { kicker: "Legal", title: "Terms" },
  security: { kicker: "Trust", title: "Security" },
  "customer-stories/smac-tech-labs": { kicker: "Customer story", title: "SMAC Tech Labs: support responses in about a second" },
  "customer-stories/yukta": { kicker: "Customer story", title: "Yukta: invoice processing in about 20 seconds" },
  "customer-stories/syslatech": { kicker: "Customer story", title: "Syslatech: fewer repeat tickets" },
  "customer-stories/icea": { kicker: "Customer story", title: "Island City Elite Academy: quicker payment checks" },
};

/** Path ("/blog/foo", "/") -> OG card slug ("blog/foo", "home"). */
export const ogSlug = (pathname: string) => pathname.replace(/^\/+|\/+$/g, "") || "home";
