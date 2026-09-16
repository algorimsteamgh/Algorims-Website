// The glob loaders give each JSON entry a stable ID derived from its filename.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/* ============================================================
   Shared block-level schema — the p/h/ul union used in
   BLOG_POSTS[].body in the legacy assets/js/content.js.
   Mirrors exactly the three block types handled by
   pageBlogPost()'s renderBlock() in assets/js/site.js.
   ============================================================ */
const paragraphBlock = z.object({
  type: z.literal("p"),
  // Legacy body text carries inline HTML (<strong>, <em>) — preserved verbatim,
  // rendered with set:html by the new Paragraph.astro component.
  text: z.string(),
});
const headingBlock = z.object({
  type: z.literal("h"),
  text: z.string(),
});
const listBlock = z.object({
  type: z.literal("ul"),
  items: z.array(z.string()),
});
const contentBlockSchema = z.discriminatedUnion("type", [
  paragraphBlock,
  headingBlock,
  listBlock,
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;

/* ============================================================
   Shared sub-schemas reused across case-studies / solutions / products
   (the three collections rendered through the legacy renderDetailPage()).
   ============================================================ */
const sourceLinkSchema = z.object({
  href: z.string(),
  label: z.string(),
});
const metaItemSchema = z.object({
  label: z.string(),
  value: z.string(),
});
const challengeSchema = z.object({
  lead: z.string(),
  items: z.array(z.string()),
});
const solutionStepSchema = z.object({
  h: z.string(),
  p: z.string(),
});
const awsServiceSchema = z.object({
  name: z.string(),
  desc: z.string(),
});
const architectureSchema = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string(),
});
const metricSchema = z.object({
  value: z.string(),
  label: z.string(),
});
const faqSchema = z.object({
  q: z.string(),
  a: z.string(),
});
const clientLogoSchema = z.object({
  src: z.string(),
  alt: z.string(),
  name: z.string(),
});
const flowStageSchema = z.object({
  icon: z.string(),
  title: z.string(),
  subtitle: z.string(),
  items: z.array(z.string()).optional(),
});
const flowSchema = z.object({
  title: z.string(),
  desc: z.string(),
  stages: z.array(flowStageSchema),
  footer: z.string().optional(),
});

/* ============================================================
   BLOG_POSTS → `blog` collection
   ============================================================ */
// NOTE: the legacy array is actually 9 posts, not the 8 the migration plan's
// Phase-0 inventory estimated — confirmed by counting BLOG_POSTS entries.
const blog = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/blog" }),
  schema: z.object({
    category: z.string(),
    title: z.string(),
    excerpt: z.string(),
    // Legacy dates are free-form display strings ("Sep 1, 2025") and 3 of the
    // 8 posts have an empty string ("") instead of a real date — preserved as
    // an optional string rather than coerced to z.date() to avoid inventing dates.
    date: z.string().optional(),
    read: z.string(),
    author: z.string(),
    art: z.string(),
    featured: z.boolean().optional(),
    body: z.array(contentBlockSchema),
  }),
});

/* ============================================================
   CASE_STUDIES → `case-studies` collection
   ============================================================ */
const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/case-studies" }),
  schema: z.object({
    source: sourceLinkSchema,
    kind: z.literal("Case Study"),
    tag: z.string(),
    title: z.string(),
    subtitle: z.string(),
    glyph: z.string(),
    accent: z.string(),
    clientLogo: clientLogoSchema.optional(),
    meta: z.array(metaItemSchema),
    intro: z.array(z.string()),
    challenge: challengeSchema,
    solutionTitle: z.string().optional(),
    solutionLead: z.string(),
    solution: z.array(solutionStepSchema),
    tech: z.array(z.string()).optional(),
    architecture: architectureSchema.optional(),
    // Legacy `results` entries carry inline <strong> HTML — preserved verbatim.
    results: z.array(z.string()),
    metrics: z.array(metricSchema),
    // Cross-collection relation: case studies only ever relate to other case
    // studies in the legacy data, but findDetail()/detailHref() in site.js
    // resolve across all three detail collections, so we keep this loose
    // (string slugs) rather than a single-collection `reference()` — a
    // Phase-3/4 page migrator can resolve the slug against whichever
    // collection actually holds it, exactly as `findDetail()` does today.
    related: z.array(z.string()),
  }),
});

/* ============================================================
   SOLUTIONS → `solutions` collection
   ============================================================ */
const solutions = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/solutions" }),
  schema: z.object({
    source: sourceLinkSchema,
    // Legacy data: 2 of 3 SOLUTIONS entries are tagged kind: "Case Study" and
    // 1 ("operations-automation") is tagged kind: "Solution" — both routed
    // through the same renderDetailPage(). Preserved verbatim, not normalised.
    kind: z.enum(["Case Study", "Solution"]),
    tag: z.string(),
    title: z.string(),
    subtitle: z.string(),
    glyph: z.string(),
    accent: z.string(),
    meta: z.array(metaItemSchema),
    intro: z.array(z.string()),
    challenge: challengeSchema,
    solutionTitle: z.string().optional(),
    solutionLead: z.string(),
    solution: z.array(solutionStepSchema),
    awsTitle: z.string().optional(),
    awsLead: z.string().optional(),
    aws: z.array(awsServiceSchema).optional(),
    tech: z.array(z.string()).optional(),
    architecture: architectureSchema.optional(),
    results: z.array(z.string()),
    metrics: z.array(metricSchema),
    faqs: z.array(faqSchema).optional(),
    related: z.array(z.string()),
  }),
});

/* ============================================================
   PRODUCTS → `products` collection
   ============================================================ */
const products = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/products" }),
  schema: z.object({
    source: sourceLinkSchema,
    kind: z.literal("Product"),
    tag: z.string(),
    title: z.string(),
    subtitle: z.string(),
    glyph: z.string(),
    accent: z.string(),
    meta: z.array(metaItemSchema),
    intro: z.array(z.string()),
    // Only DocIQ has a `flow` "how it fits" diagram in the legacy data.
    flow: flowSchema.optional(),
    challenge: challengeSchema,
    solutionTitle: z.string().optional(),
    solutionLead: z.string(),
    solution: z.array(solutionStepSchema),
    awsTitle: z.string().optional(),
    awsLead: z.string().optional(),
    aws: z.array(awsServiceSchema).optional(),
    tech: z.array(z.string()).optional(),
    architecture: architectureSchema.optional(),
    // No PRODUCTS entry has `results` in the legacy data (only `metrics`) —
    // kept optional for schema symmetry with case-studies/solutions.
    results: z.array(z.string()).optional(),
    metrics: z.array(metricSchema),
    faqs: z.array(faqSchema).optional(),
    related: z.array(z.string()),
  }),
});

export const collections = { blog, "case-studies": caseStudies, solutions, products };
