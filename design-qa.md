# Product Pages Design QA

**Source visual truth**

- `design-options/ref-light-theme.png` — 1487 × 1058 px; layout, hierarchy, framing, and palette reference.
- `design-options/ref-light-theme-1.png` — 1487 × 1058 px; illustration style reference only.
- Product-page content and relationships come from `src/content/products/*.json`.

**Implementation evidence**

- Browser-rendered routes: `http://localhost:4321/products/cxiq`, `/dociq`, `/opsiq`, and `/payiq`.
- Primary QA capture: `http://localhost:4321/products/dociq#system-title` in the active Chrome preview.
- Viewport: 1280 × 716 CSS px, device pixel ratio 2 (2560 × 1432 physical px before browser/tool normalization).
- Responsive capture: 390 × 844 CSS px at device pixel ratio 2.
- States checked: light, dark, desktop, mobile, FAQ expanded, and all four product variants.
- Console errors/warnings checked: none.
- Horizontal viewport overflow checked: none.

The source images are art-direction references rather than pixel-for-pixel versions of the product routes, so the comparison was normalized by composition and component scale instead of identical page crop.

## Findings

No actionable P0, P1, or P2 findings remain.

- **Fonts and typography:** DM Sans matches the current site system. Hero scale, optical weight, tight display tracking, body line length, and small uppercase labels follow the reference hierarchy without truncation at the checked breakpoints.
- **Spacing and layout rhythm:** Centered statement heroes, thin framed surfaces, restrained section borders, and consistent vertical spacing match the latest homepage language. Cards were reduced in favor of dividers and continuous grids.
- **Colors and visual tokens:** All page surfaces, text, borders, muted copy, and violet accents use semantic tokens. Light and dark themes retain clear foreground/background contrast with no hard-coded light surface left in the product template.
- **Image quality and asset fidelity:** Existing high-resolution light/dark isometric assets are used for the system relationship diagrams. They preserve the white node tiles, charcoal core, connector geometry, and violet line work. No emoji or placeholder art remains.
- **Copy and content:** Existing product claims, safeguards, metrics, evidence notes, and regional details are preserved. Section titles were tightened only where needed to establish a consistent decision hierarchy.
- **Accessibility:** One page-level `h1`, ordered section headings, semantic definition lists/tables/details, meaningful illustration alt text, keyboard-native FAQ disclosure, visible focus states, and mobile-safe reading order are present.

## Focused comparison evidence

- **Hero:** Compared the centered DocIQ/OpsIQ statement hero against the centered source statement. The implementation preserves the strong headline-to-supporting-copy ratio, sparse violet accenting, and paired primary/secondary actions.
- **System artwork:** Compared the DocIQ relationship artwork in both light and dark states against the illustration reference. Inputs, Algorims system, and outcomes are visibly connected and repeated as accessible captions below the art.
- **Activity feed:** Checked at desktop and 390 px. Lucide status symbols replace emoji, labels remain readable, and exception rows keep their status and explanation together.

## Comparison history

1. **Initial P2:** The first implementation used a flat three-card system diagram. It communicated the relationship but did not match the established isometric illustration DNA closely enough.
2. **Fix:** Replaced the flat diagram with existing product-relevant isometric light/dark artwork and kept explicit Inputs → Algorims system → Outcomes captions.
3. **Post-fix evidence:** Rechecked DocIQ at 1280 × 716 in light and dark themes. The correct theme asset switches cleanly, the relationship stays legible, and the captions align with the artwork. No P0/P1/P2 issues remain.

## Primary interactions tested

- Theme toggle switches product hero, feed, system artwork, sections, and CTA between light and dark tokens.
- FAQ disclosure expands and exposes its answer.
- Product, workflow, contact, and related-product links are present with valid route targets.

## Follow-up polish

- P3: If future product-specific illustration assets are commissioned, PayIQ can replace the current Xero-system artwork with an AP-specific version while retaining the same geometry and caption contract.

## September 21 consistency pass

- Checked the product index, CXIQ detail, blog, Agentic AI, a solution detail, and a case-study detail in the local browser at 1280px and/or 390px. The inspected routes have no horizontal overflow; light and dark product states were reviewed.
- Shared product proof bands, numbered groups, violet title phrases, restrained hover states, and reduced-motion fallbacks now follow `DESIGN_SYSTEM.md`. The product index uses consistent row geometry; its small glyph figures are intentional identifiers, not standalone system diagrams.
- `astro check`, build, dynamic-route, image-asset, and SEO checks pass. The full `npm run verify` still stops on the pre-existing CCA-F `data-dismiss-notice` assertion in `check-migrated-static-pages.mjs`; that page was not part of this redesign.
- P3: Dedicated artwork for each product-index row could add specificity later, provided it describes the actual product flow and follows the shared isometric illustration rules.

final result: passed with unrelated static-check failure noted
