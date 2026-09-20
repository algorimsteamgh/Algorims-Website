# Algorims design system

This file is the implementation source of truth for new pages and redesign work. `design-options/ref-light-theme.png` defines page composition and palette. `design-options/ref-light-theme-1.png` defines illustration style only.

## Visual idea

Algorims pages should feel like precise enterprise-system blueprints: white or charcoal canvas, thin rules, compact statement-led sections, sparse violet emphasis, and diagrams that explain an input → system → outcome relationship.

Avoid generic card walls, oversized empty areas, glass effects, decorative gradients, floating orbs, and motion without meaning.

## Foundation

- Typography: DM Sans. Display headings use `600`, tight tracking, and balanced wrapping. Body copy is 16–18px with a 1.6–1.7 line height.
- Color: use the semantic tokens in `src/styles/global.css`. Violet is an accent, never a page surface.
- Frame: `container-x` is the shared 1280px page width. Major sections use a 1px top divider.
- Rhythm: 72–96px desktop section padding and 56–64px mobile. A hero should reveal its visual or proof content in the first viewport.
- Shape: pills for buttons; 16–24px radii for content surfaces; almost no shadow.

## Hierarchy contract

Every landing section should contain, in order:

1. A small uppercase violet eyebrow.
2. One clear heading with exactly one meaningful phrase in violet.
3. At most one short supporting paragraph.
4. One visual, proof band, or interaction that explains the section.

Use `.heading-accent` for the violet phrase. Do not color the whole heading. Avoid repeating the same centered-heading composition in consecutive sections; alternate centered, split, and proof-band layouts.

## Interaction contract

- Use one simple motion idea per section: a 2–4px lift, an accent rule drawing in, a connector pulse, or a numbered step reveal.
- Hover must clarify clickability or structure. Keep feedback between 150–300ms.
- Preserve keyboard focus and `prefers-reduced-motion` fallbacks.
- Numbered groups use `01`, `02`, `03` to show sequence or comparison, not as decoration.

## Illustration contract

- Reuse the geometry demonstrated by `src/components/illustrations/SystemDiagram.astro`.
- Use white isometric node tiles, a charcoal central platform, fine charcoal connectors and square anchors, sparse violet line icons, and a faint diagonal construction grid.
- Every diagram must communicate a real relationship and include meaningful alternative text. On small screens, simplify or hide nonessential geometry rather than shrinking labels.
- Never imply Microsoft, Google, IBM, Oracle, or SAP partnerships without evidence.

## Product suite contract

The product index and every product detail page share the same geometry, spacing, proof band, heading treatment, and interaction language. Product identity comes from its name, glyph, content, live feed, metrics, and system diagram—not a different layout or decorative gradient.

Product-specific colors may identify a glyph or functional state. Headline emphasis remains Algorims violet so every product visibly belongs to the same suite.

## Reusable implementation

- Tokens and shared utilities: `src/styles/global.css`
- Site frame, navigation, theme, and footer: `src/layouts/BaseLayout.astro`
- System illustration baseline: `src/components/illustrations/SystemDiagram.astro`
- Product detail geometry: `src/components/content/ProductHero.astro`, `ProductPage.astro`, and `ProductDetails.astro`
- Repeated CTA: `src/components/ConsultationCta.astro`

Before shipping a new page, check desktop and mobile in both themes, keyboard focus, reduced motion, heading order, and whether the first viewport establishes a clear hierarchy.
