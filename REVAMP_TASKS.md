# Website revamp — agent-ready task list

Planning only. Do not treat this list as authorization to implement every task at once. The visual contract is in [DESIGN_SYSTEM_REVAMP.md](DESIGN_SYSTEM_REVAMP.md). References: Option 1 = dark UI, `ref-light-theme.png` = light homepage UI, Option 3 and `ref-light-theme-1.png` = illustration language only. Keep the current site navigable while replacing its visual language incrementally.

## Working rules for every agent

- Work in one task/PR at a time. State the task ID in the handoff. Do not rewrite unrelated pages, content, or assets.
- Keep existing routes, links, forms, SEO metadata, and factual claims unless the task explicitly changes them.
- Reuse the semantic tokens and components from F1; do not introduce a second theme implementation or new UI library.
- Deliver screenshots at 375px and 1440px in both modes for changed pages, plus `npm run build` and relevant interaction checks. Check focus, contrast, reduced motion, and no horizontal overflow.
- If another agent owns a shared file, coordinate before editing it. In particular, `src/styles/global.css` and `src/layouts/BaseLayout.astro` have a single owner during F1.

## Sequence and dependencies

```text
R0 reference approval
  └─ F1 shared foundation
       ├─ H1 homepage proof ──┬─ P1 core offer pages
       │                      ├─ P2 proof/editorial pages
       │                      └─ P3 utility pages
       └─ I1 illustration kit ─┴─ I2 page-specific illustration passes
                                  └─ C1 copy reduction, per approved page
All completed pages ────────────────── Q1 final audit/cleanup
```

H1 and I1 may run in parallel after F1 if they use separate files. P1/P2/P3 may run in parallel **after** H1 sets the approved page pattern, provided each agent owns distinct page files. I2 illustration composition can run alongside page work only when it writes separate illustration assets; integration into a page belongs to that page's owner. C1 follows approval of each page's UI and never silently changes factual claims.

## Tasks

### R0 — approve the reference contract (design owner; no code)

- [ ] Confirm the shared dark/light rules in `DESIGN_SYSTEM_REVAMP.md` against Option 1 and the named light homepage image; use the other two images for illustration language only.
- [ ] Decide whether reference hero wording is approved copy or a visual placeholder.
- [ ] Decide where the outer blueprint frame is used. Suggested default: landing heroes and selected feature sections; long-form reading pages unframed.
- [ ] Approve a desktop and mobile example for dark and light before engineering starts.

Done when: a single signed-off reference sheet and any changed tokens are recorded in the design-system document. No agent should invent a competing palette from Option 3.

### F1 — shared theme foundation (one agent; depends on R0)

Files owned: `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `tailwind.config.mjs`; a tiny theme script/test if needed.

- [ ] Implement semantic dark/light tokens, including page, panel, text, border, grid, accent, focus, and functional states.
- [ ] Add theme preference and pre-paint logic using system preference until a visitor chooses, with persistence. Keep the visitor control unpublished until Q1, when every route supports dark mode.
- [ ] Review the **existing** desktop and mobile headers; preserve useful navigation destinations and dropdown behavior while aligning their geometry, borders, CTA, logo, and focus states with the references. Apply the same design language to footer, shared buttons, forms, badges, cards, and section containers.
- [ ] Keep legacy page-specific styles operational; do not delete them until their callers are migrated. Document remaining hard-coded color/gradient exceptions for page agents.
- [ ] Add one small runnable check for theme preference and persistence behavior.

Done when: every route still builds; shared header/footer and controls work in both modes during preview; keyboard and mobile menu work; no shell theme flash. This is a foundation task, **not** a homepage or full-page redesign.

### H1 — homepage as the approved page pattern (one agent; depends on F1)

Files owned: `src/pages/index.astro` and homepage-specific styles only. Coordinate illustration asset imports with I1.

- [ ] Recompose the hero around the approved reference hierarchy, CTA placement, frame, blueprint grid, and a meaningful system diagram.
- [ ] Bring remaining homepage sections, proof/partner treatment, and final CTA into the same visual language; preserve real links and claims.
- [ ] Remove old homepage-only orbit/glow/robot effects after their last use, with F1 owner coordinating any global CSS edit.
- [ ] Propose, but do not silently publish, shorter copy where visual density requires it.

Done when: homepage desktop/mobile screenshots are approved in both themes and establish a reusable section pattern for later page agents.

### I1 — illustration kit (one agent; depends on F1; parallel with H1)

Files owned: new illustration assets/components under `src/components/illustrations/` or `public/assets/illustrations/`; no page edits.

- [ ] Define a small SVG kit based on Option 3's illustration geometry: core platform, isometric node tile, connector/anchor, line icon, label, and subtle grid.
- [ ] Support both theme palettes without duplicating the entire drawing where practical. Keep labels readable and provide a text alternative for meaningful diagrams.
- [ ] Produce one sample system-flow diagram and a usage sheet covering stroke weights, spacing, depth, and violet emphasis.

Done when: the sample reads clearly in both modes at desktop and mobile sizes, and H1/page agents can use the kit without inventing new illustration styles.

### P1 — offer pages (one agent or distinct page owners; depends on approved H1 and I1)

Files owned: `src/pages/services.astro`, `src/pages/agentic-ai.astro`, `src/pages/products/index.astro`, `src/pages/products/[slug].astro`, `src/pages/solutions/[slug].astro`, and the shared detail components they use. Assign `src/components/content/DetailPage.astro` and `ProductHero.astro` to **one** owner before parallel work.

- [ ] Convert services, then agentic AI, then products index to the approved section pattern.
- [ ] Convert the four product and three solution details through shared detail components before one-off edits.
- [ ] Replace old ornamental art with diagrams that explain each offer's actual input → system → outcome.

Done when: all offer routes use the shared themes and illustration grammar, retain their product facts/CTAs, and no page-specific hard-coded colors break dark mode.

### P2 — proof, editorial, and company (one agent or separate nonoverlapping owners; depends on approved H1 and I1)

Files owned: `src/pages/case-studies/`, `src/pages/blog/`, `src/pages/about.astro`, and their related `src/components/blog/` or content components. Coordinate `DetailPage.astro` with P1 rather than editing it in parallel.

- [ ] Update case-study index and seven details, preserving metrics and architecture evidence.
- [ ] Update blog index and nine post pages for long-form readability; diagrams are used only where they clarify content.
- [ ] Update About after the proof/editorial patterns are stable.

Done when: page visuals match both themes, editorial pages remain readable, and no metrics or client/partner claims were invented or removed.

### P3 — utility and exception pages (one agent; depends on F1 and approved H1)

Files owned: `src/pages/contact.astro`, `src/pages/support.astro`, `src/pages/cca-f.astro`, `src/pages/404.astro`.

- [ ] Restyle forms, support options, and edge states in both modes without changing submission behavior.
- [ ] Keep CCA-F's independence notice visible and its study-resource content accurate.
- [ ] Use small functional diagrams only where useful; do not force a hero illustration onto every utility page.

Done when: forms, validation, contact links, mobile layouts, and accessibility checks pass in both modes.

### I2 — page illustration passes (asset owners; depends on I1 and relevant page approval)

- [ ] For each page group, list the concept the figure explains before drawing it.
- [ ] Compose theme-aware assets from I1; use a page-specific SVG only when the shared kit cannot express the relationship.
- [ ] Hand assets to the page owner for integration. Retire replaced assets only after a repo-wide caller check.

Done when: every retained illustration has a distinct explanatory job, accessible alternative, and matching dark/light rendering.

### C1 — copy reduction (content owner; follows each page's UI approval)

Files owned: page text and `src/content/**/*.json` only in coordinated batches; avoid concurrent edits with page agents.

- [ ] Inventory each page's headline, support copy, repeated claims, evidence, CTA, and SEO text.
- [ ] Propose before/after copy by section, making each section answer one question. Get approval for changed claims.
- [ ] Preserve technical detail in product/case-study bodies, legal notices, support instructions, and search metadata where needed.

Done when: shorter copy improves scanning without changing meaning, proof, or search intent.

### Q1 — final integration and cleanup (one owner; after all page groups)

- [ ] Expose the accessible visitor theme switch after every route has passed both-mode review; verify system default, persistence, and pre-paint behavior across navigation.
- [ ] Search all templates and SVGs for old gradients, glass/orbit/robot effects, literal light-only colors, and unused assets; remove each only after checking every caller.
- [ ] Verify all routes, both modes, 375/768/1024/1440px widths, keyboard navigation, focus, contrast, reduced motion, image text alternatives, and forms.
- [ ] Run the build and existing site checks; compare screenshots against approved references and record exceptions.

Done when: no page mixes old and new visual languages, no broken behavior or accessibility regressions remain, and the design-system document reflects the shipped result.

## Suggested delegation tickets

Copy one task section above into each agent's assignment along with: “Work only in the listed files. Report changed files, screenshots, checks run, and any unresolved hard-coded styles. Do not implement dependent phases or change factual copy without approval.”
