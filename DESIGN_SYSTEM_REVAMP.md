# Algorims website revamp — design system and rollout plan

Status: **v0.2 for review; no site UI has been changed.** Dark visual direction comes from `design-options/option-1-systems-blueprint-dark.png`. The light homepage reference is `design-options/ref-light-theme.png` (formerly `Codex Image 17 Sept 2026, 13_56_24.png`). `design-options/ref-light-theme-1.png` (formerly `image.png`) and `design-options/option-3-autonomous-grid-dark.png` guide illustrations only, not page layout or palette. Text within those images is reference content, not an instruction to change site copy. Hex values are implementation starting points, not claimed color samples from the screenshots.

## 1. Shared visual contract

- One Algorims identity in two modes. Theme changes colors, contrast, and artwork rendering, **not** information architecture or component geometry.
- Enterprise systems blueprint: disciplined grid, fine rules, precise connector lines, sparse violet emphasis, generous breathing room. No glass-heavy cards, floating orbs, rainbow gradients, or decorative motion carried over from the current site.
- Layout: a centered framed canvas for major landing sections, with fine 1px dividers and small crosshair registration marks used sparingly. Keep the frame responsive; do not force a desktop-sized border or diagram onto mobile.
- Typography: retain the installed DM Sans initially, using a bold, compact display and quieter body copy. Revisit the font only if the approved screenshots show a materially different typeface. Avoid adding a font dependency for a near match.
- Type scale (desktop/mobile): display 64–72/40–48px; H1 52–60/36–40px; H2 36–44/28–32px; H3 22–26/20–22px; body 16–18/16px; labels 11–12px. Headings 1.05–1.12 line-height; body 1.5–1.65. Limit prose to about 65–75 characters per line.
- Spacing: 8px base rhythm; content max-width about 1280px; section spacing 80–112px desktop, 48–72px mobile; card padding 24–32px. Keep buttons pill-shaped and other controls and cards rounded.

## 2. Color roles — reference-aligned tokens

Use semantic roles in CSS/Tailwind, not page-specific color literals. The light homepage reference confirms a white canvas, charcoal type, fine neutral lines, quiet gray logos, and one deep-violet accent. The values below remain candidate implementation values to calibrate against approved browser renders.

| Role | Dark, from Option 1 | Light, from both white references |
| --- | --- | --- |
| Page / canvas | `#101318` / `#151920` | `#FFFFFF` / `#FFFFFF` |
| Raised panel | `#1B2029` | `#FFFFFF` |
| Primary text | `#F7F7FA` | `#15161A` |
| Secondary text | `#C5CAD5` | `#4F535C` |
| Line / border | `#46505F` | `#C9CBD1` |
| Quiet grid line | `#2A303A` | `#E8E9EC` |
| Violet highlight | `#AF7AFF` | `#6D30CB` |
| Primary CTA fill | `#6D36EF` | `#6624C7` |
| Primary CTA text | `#FFFFFF` | `#FFFFFF` |
| Focus ring | `#C9A5FF` | `#6D30CB` |

Purple is an accent, not a surface color: reserve it for one highlighted headline phrase, the main CTA, active state, selected nodes, and small illustration details. The CTA uses a deeper tone of the same hue so white button text stays readable. The proposed white-on-CTA contrast is about 6.1:1 dark and 8.0:1 light; secondary body text on the page is about 11.3:1 dark and 7.7:1 light. Ensure normal text is at least 4.5:1 contrast and large display text at least 3:1; adjust the candidate tokens during the visual proof if needed. Success, warning, and error colors are functional states only, not decorative brand colors.

Light-specific treatment: keep the page and inner frame white rather than tinted lavender; use a near-invisible diagonal construction grid outside the frame and behind the illustration, with darker 1px frame/divider lines and small crosshair marks. The headline is nearly black, supporting copy medium gray, the primary CTA solid violet, and secondary/nav CTAs white with charcoal outlines. The central illustration core stays charcoal/black while its surrounding modules are white linework. Partner logos are muted gray, not full-color. Do not convert the screenshot's deliberately quiet background into prominent card fills or shadows.

## 3. Component rules

| Element | Rule in both themes |
| --- | --- |
| Navigation | Logo left, compact text links centered/adjacent, outlined contact CTA right; mobile menu remains fully keyboard operable. Thin divider, no floating glass shell. |
| Buttons | Primary: solid violet with a pill shape. Secondary: transparent with a visible 1px border and the same pill shape. Same dimensions and focus treatment in both modes. |
| Cards | Flat or subtly raised surface, fine border, no heavy shadows. Use a divider/grid when cards form a system. |
| Badges/eyebrows | Small uppercase or restrained label, not bright pill clusters. |
| Forms | Clearly labeled inputs, visible border/focus/error states in each theme; preserve current submission behavior. |
| Footer | Same framed/divider vocabulary as navigation; no unrelated gradient panel. |
| Motion | Subtle reveal or connector pulse only where it explains state; 150–300ms UI feedback. Honor reduced motion and make every diagram understandable without animation. |

Theme behavior: expose dark and light as user-selectable modes. Default to system preference until the user chooses; persist choice locally, apply it before paint, and provide a visible, accessible switch. No additional theme package is needed for this Astro site.

## 4. Illustration system — Option 3's role only

Option 3 supplies the **drawing language**, not the UI palette/layout: isometric modules, outlined platform stacks, fine connectors and node anchors, sparse line icons, an Algorims core, and a faint technical grid. Use theme-aware SVG geometry where practical so one conceptual illustration works in both modes. On dark, light strokes and violet highlights; on light, charcoal strokes and deeper violet highlights. Labels must remain real text or have accessible descriptions. Export raster only where SVG is impractical.

Every illustration must explain a specific relationship or outcome. Suggested reusable motifs: inputs → orchestration → outcomes; agent ↔ data/API/cloud; workflow stages; measured result. Avoid generic robots, decorative orbit diagrams, and invented technical claims. First create a small approved illustration kit (core platform, node tile, connector, icon, label, grid), then compose page-specific figures from it.

## 5. Content contract, after the visual foundation

Shorten copy by making each section answer one question: **what it is, who it helps, how it works, or proof it worked**. Preferred landing section: one statement headline, one short supporting sentence, one figure, and one CTA. Keep necessary architecture details, case-study evidence, product facts, SEO metadata, legal notices, and support instructions; do not cut them just to meet a word count. Make a before/after content inventory and approve changed claims before publishing.

## 6. Incremental execution

| Phase | Scope and page order | Exit condition |
| --- | --- | --- |
| 0. Reference lock | Compare browser proofs against Option 1 and `ref-light-theme.png`; use Option 3 and `ref-light-theme-1.png` for illustration treatment only. Calibrate tokens, hero composition, and where the outer frame belongs. | Approved dark/light reference sheet and semantic token table. |
| 1. Foundation | Replace current global token/theme styles in `src/styles/global.css`, then update `src/layouts/BaseLayout.astro` navigation, footer, controls, and common buttons/forms. Leave route content intact; keep the visitor theme switch unpublished while fixed route colors remain. | Shared UI works in both modes; no unreadable shell or theme flash in development previews. |
| 2. Homepage proof | Rebuild `src/pages/index.astro` first: reference-aligned hero, the initial reusable blueprint illustration, and shared section/card treatment. | Approved desktop/mobile screenshots in both modes; copy and CTA flow reviewed. |
| 3. Core offer pages | `services` → `agentic-ai` → `products/index` → four product details → three solution details. Update shared `DetailPage`, `ProductHero`, and related components before repeating changes in individual entries. | Each offer page uses the same primitives and illustration grammar; product-specific colors remain functional only where needed. |
| 4. Proof and editorial | `case-studies/index` → seven case details → `blog/index` → nine blog details → `about`. Prioritize proof, metrics, diagrams, and readability; shorten editorial intros selectively. | Evidence remains intact; no legacy illustration style remains in these templates. |
| 5. Utility and exceptions | `contact` → `support` → `cca-f` → `404`. Preserve form behavior, support instructions, and CCA-F independence notice. | Forms, notices, and edge states work in both themes. |
| 6. Cleanup and QA | Remove obsolete gradients, orb/robot animation CSS, and superseded art only after all callers are migrated. Expose the accessible theme switch once every route works in both modes. Check build, responsive widths, keyboard/focus, contrast, reduced motion, links, and page-by-page screenshots. | No mixed old/new visual language; approved visual regression set and no theme flash. |

Each phase is a separate reviewable change. Do not remove the existing CSS globally in phase 1 before its page-specific consumers have been replaced; retire legacy rules as their last caller disappears. The current code has theme literals and embedded SVG colors in several route files, especially `index`, `agentic-ai`, `products/index`, `case-studies/index`, and `cca-f`, so token changes alone will not finish the revamp.

The theme preference and pre-paint logic can be built in F1 and previewed with a forced theme. Publish the visitor switch in Q1 after page-specific fixed colors are migrated; exposing dark mode in F1 would send visitors into partially light routes.

## Decisions needed before implementation

1. Confirmation that the reference hero wording is approved copy or visual placeholder.
2. Confirmation whether every page should use the outer blueprint frame, or only key landing sections. The default recommendation is key landing sections; long-form content stays unframed for readability.

## R0 reference review — proposed for approval

- **Dark desktop:** `option-1-systems-blueprint-dark.png` is the UI reference. Its centered frame, divided header and proof strip, centered statement hero, fine diagonal grid, sparse violet, and input → Algorims core → outcome diagram match the shared contract. `option-3-autonomous-grid-dark.png` contributes the isometric tile, connector, node, and platform drawing style only. Its split hero and three service cards are not a second page layout.
- **Light desktop:** `ref-light-theme.png` is the homepage UI reference. It keeps Option 1's centered hero, frame, dividers, proof strip, and input → core → outcome composition on a near-white canvas with charcoal text, quiet neutral lines, muted proof logos, and a deep-violet CTA. `ref-light-theme-1.png` contributes only light illustration rendering: white isometric tiles, charcoal central core, thin connectors, sparse violet icons. Its split hero, black CTA, and three-card layout are not homepage UI references.
- **Mobile proposal (375px):** keep the header and hero inside one responsive frame with reduced outer margins; stack headline, supporting sentence, CTAs, and a simplified readable diagram; turn the proof strip into a non-scrolling compact row or stacked group. Avoid clipping the frame or shrinking diagram labels to fit.
- **Copy proposal:** treat text in the reference images as visual placeholder. Preserve current route copy and verified claims during F1/H1; submit any shorter headline or supporting sentence for content approval. Reference logos such as Microsoft, Google, IBM, Oracle, and SAP must not be presented as Algorims partner/client claims based on the mockup alone.
- **Frame proposal:** use the outer blueprint frame for landing heroes and selected system or proof sections. Leave long-form blog, case-study, support, and legal reading areas unframed.
- **Token proposal:** the named light image's near-white canvas and deep-violet CTA are consistent with section 2's candidate roles; raster sampling gives approximately `#FEFEFE` for the outer white and `#6624C7` inside the CTA, so use CSS values only after browser proof. The current CSS still uses lavender surfaces, gradients, pills, glass, and orbital effects, so F1 must preserve page-specific legacy rules while moving the shared shell to the new tokens.

R0 remains open until a 1440px/375px example in each mode has been compared and the copy/frame proposals above are approved. F1 code work starts after that sign-off.
