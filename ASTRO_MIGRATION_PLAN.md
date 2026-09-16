# Astro Migration Plan — algorims.com

24 routes, hand-rolled client-side renderer (`assets/js/site.js`, 5384 lines) + `assets/js/content.js` data arrays, shared HTML shell synced via custom script, Tailwind via CDN. No build step exists today.

Target: Astro SSG with content collections, real layouts, native routing. No UI framework needed (see framework-fit check below) — every interactive bit ports to a plain scoped `<script>` tag, not a hydrated island.

## Current state (confirmed by exploration)

- No Astro config exists yet — only a stale `.astro/` cache dir and an empty `src/{pages,layouts,components,data,content,styles}` scaffold.
- Site is 100% client-rendered: every route's HTML shell is mostly an empty `<div id="app">`, filled by `pageXxx()` functions in `site.js` reading data out of `content.js`.
- Nav/footer kept in sync across 24 `index.html` files by `tools/sync-html-shell.mjs`.
- Tailwind loaded via `cdn.tailwindcss.com` script tag, config re-inlined in every page head.
- This is a rebuild onto Astro's routing + rendering model, not a lift-and-shift.

## Framework-fit check (done before committing to this plan)

Audited every interactive function in `site.js` — contact/support form validation, the radial orbital timeline widget, hero SVG animations. All are plain DOM/vanilla-JS, none touch a UI framework or hold complex client state.

**Conclusion: no React/Vue/Svelte integration needed.** Astro is used here purely for its build-time wins (file routing, content collections, component templating) — every current `bind*()` function ports to a plain scoped `<script>` tag on its page, not an Astro "island" component.

Compared against:
- **11ty** — comparable win, weaker built-in image/sitemap tooling than Astro.
- **Bare Vite + partials** — lowest migration cost but means hand-rolling routing/content-collections that Astro gives for free. Not worth reinventing.

## Open risk

`uploads/Algorims-Website-main/` and `uploads/*.html` look like a stray re-upload of the repo itself (nested copy). Confirm with user whether this is an intentional backup or accidental artifact before Phase 1 touches asset structure.

---

## Phase 0 — Recon & Inventory

Goal: full map before touching anything. No code changes.

| Task | Agent | Status | Notes |
|---|---|---|---|
| Catalog all 24 routes + dynamic slug patterns (blog/[slug], case-studies/[slug], products/[slug], solutions/[slug]) | route-mapper | Done | Confirmed via `find` |
| Diff each `pageXxx()` function against its data source; document per-page component boundaries | render-auditor | Todo | site.js has ~20 `pageXxx()` functions, several shared helpers (`ctaBlock`, `sectionHeader`, `blogCard`, etc) |
| Extract content.js arrays (BLOG_POSTS, CASE_STUDIES, SOLUTIONS, PRODUCTS) → shape for Astro content collections / JSON | content-modeler | Todo | 4 arrays, ~1200 lines, body uses a typed block schema (p/h/ul) — maps cleanly to content collections |
| Inventory interactive/JS-only behaviors needing a scoped page script (forms, radial orbital, nav scroll bind, hero anims) | interactivity-auditor | Done | `bindContactForm`, `bindSupportForm`, `bindRadialOrbital`, `bindHeroNodes`, `bindSplineScene`, `bindNavbar` — all vanilla DOM/JS, confirmed no UI framework needed, port as plain `<script>` tags |
| Confirm no build step currently exists (Tailwind CDN, no bundler) — decide Astro's Tailwind integration path | route-mapper | Done | Confirmed: `cdn.tailwindcss.com` script tag, config inlined in each HTML head |

## Phase 1 — Astro Scaffold & Design System Base

Goal: working empty Astro app, styled shell, deployed to a preview URL, before any real page migrates.

| Task | Agent | Status | Notes |
|---|---|---|---|
| Init Astro project (astro.config.mjs, tsconfig, package.json scripts) inside repo — decide: replace root or subfolder during transition | scaffold-builder | Done | Built directly in repo root (not a subfolder) — branch already isolates from live site, decided no need for throwaway subfolder. Pinned `astro@5.18.2` (not the latest 7.x) because `@astrojs/tailwind@6.0.2`'s peerDependencies cap at `astro ^3\|\|^4\|\|^5`. `npm audit` flags Astro <=7.2.7 for several CVEs (XSS in `define:vars`/spread props/view-transitions, server-island replay, SSRF in prerendered error-page fetch, AVIF RCE) fixed only in 7.3.2 — all server/SSR-surface issues that don't apply to this SSG-only, no-SSR static export, but flagging for awareness since upgrading past Astro 5 would require dropping `@astrojs/tailwind` in favor of Tailwind 4's native Vite plugin (bigger config rewrite, out of scope for Phase 1). `tsconfig.json` extends `astro/tsconfigs/base`, excludes `dist`/`assets`/`uploads`/`public` (legacy JS under `public/assets/js` isn't meant to be type-checked). |
| Install & configure `@astrojs/tailwind`, port tailwind.config (currently inlined per-page) to single config | scaffold-builder | Done | `tailwind.config.mjs` at repo root — ported 1:1 from the inline `tailwind.config` script block in `index.html` (colors, fontFamily, backgroundImage, boxShadow, borderRadius, keyframes, animation, container). Wired via `@astrojs/tailwind` integration in `astro.config.mjs` with `applyBaseStyles: false` (site.css already defines the design tokens/resets — avoids double-loading). Did not port the `?plugins=typography` CDN param / `@tailwindcss/typography` plugin — grepped `site.js` and confirmed `blog-prose` is a custom CSS class, not Tailwind's `prose` utilities, so the plugin was unused; left `plugins: []`, easy to add back if a real usage turns up during Phase 3. Installed `tailwindcss@3.4.19` (pinned to 3.x — required by `@astrojs/tailwind`'s peer range; Tailwind 4 uses a different CSS-first config format incompatible with the ported object-style config). |
| Build `BaseLayout.astro` (head/meta/nav/footer) replacing `tools/sync-html-shell.mjs` pattern entirely | layout-builder | Done | `src/layouts/BaseLayout.astro`. Nav was confirmed JS-generated (`renderNav()` in `assets/js/site.js`, driven by `NAV_LINKS`/`PRODUCT_MENU`/`RESOURCES_MENU`/`COMPANY_MENU`), not static HTML — ported to static Astro markup (desktop nav w/ 3 hover dropdowns, mobile flat list, "New" badge on the Claude/cca-f link) since Astro doesn't need the client router to draw it. Footer ported 1:1 from `footer.html`, copyright year now computed at build time (`{new Date().getFullYear()}`) instead of a runtime `#copy-year` fill. Head takes `title`/`description`/`ogImage`/`canonical` as component props with sensible defaults; Tailwind CDN `<script>` + inline `tailwind.config` block removed (now handled entirely by `@astrojs/tailwind` + root `tailwind.config.mjs` from the scaffold-builder pass). Did NOT port `bindNavbar()` scroll-state JS, the History-API client router, or active-link highlighting — those are Phase 5 (interactivity-porter/router-retirer). Only a minimal inline `<script is:inline>` for the mobile-menu toggle + a `lucide.createIcons()` call was added so the mobile nav button and icons aren't visually dead; third-party `<script>` tags (lucide, Spline viewer, Chatling) marked `is:inline` to keep `astro check` clean since they're unprocessed passthrough tags, not TS. `src/pages/index.astro` placeholder now wraps its trivial body in `<BaseLayout>` to prove the layout renders end-to-end; real content migration still belongs to Phase 3. |
| Port `assets/css/site.css` + design tokens into Astro global styles / Tailwind theme | layout-builder | Done | Copied to `src/styles/global.css`, imported once in `BaseLayout.astro`'s frontmatter (`import "../styles/global.css"`) so Vite bundles/hashes it — no more raw `<link>` to a static css path. Checked for the previously-flagged dead `.btn-primary` duplicate from the earlier Next.js attempt: **not present** in this copy, already clean. Found a different, real dead-CSS bug instead: line 1135 was a raw, unevaluated JS template-literal expression (`${[0,1,...].map(i => \`.csa-pt-${i} {...}\`).join(...)}`) that had leaked verbatim into the `.css` file — this is present in the legacy `assets/css/site.css` too, meaning it's currently broken on the live site (invalid CSS token, browser silently drops the rule, so the case-studies-page chart dots `.csa-pt-0`..`.csa-pt-10` get no `animation-delay` stagger today). Expanded it into 11 static rules (`.csa-pt-0` through `.csa-pt-10`, delays 0.20s–2.00s per the original `0.2 + i*0.18` formula) in `global.css` — this is a Phase-1 fix that restores intended behavior, not just a straight port; flagging here since it's a visible behavior change vs. current prod (case-studies page only, chart-dot stagger). Checked for raw-value duplication against `tailwind.config.mjs`: none — `tailwind.config.mjs` correctly references the same `hsl(var(--...))` custom properties that `global.css`'s `:root` defines, so `global.css` stays the token source of truth and both coexist without conflict, as scaffolded. |
| Migrate static assets (`assets/`, `public/`) into Astro `public/` or `src/assets/` per Astro image-optimization conventions | scaffold-builder | Done | Copied (not moved) every file from `assets/{css,js,products,trusted,partners,case-studies}` and the four loose root images into the matching `public/assets/*` scaffold subdirs — no restructuring beyond matching what already existed. Verified file-list parity between `assets/` and `public/assets/` (`diff` of sorted relative paths = empty) and confirmed `git status --short assets/` is empty (legacy dir untouched). `public/assets/design` and `public/assets/illustrations` scaffold dirs stay empty — no legacy source files map to them yet. |

## Phase 2 — Content Modeling

Goal: content.js data → typed Astro content collections. Unblocks all page migration.

| Task | Agent | Status | Notes |
|---|---|---|---|
| Define content collection schemas (zod) for blog, case-studies, solutions, products | content-modeler | Done | Used Astro 5's Content Layer API (`defineCollection({ loader, schema })` in `src/content/config.ts`, imported from `astro:content`/`astro/loaders`) rather than the older glob-loader-implicit `type: "content"` pattern — this is the correct, current API for pinned `astro@5.18.2`. Kept the config at `src/content/config.ts` (not the newer `src/content.config.ts` root convention) since `src/content/{blog,case-studies,solutions,products}` was already scaffolded there in Phase 1. Body block schema modeled as a proper Zod `discriminatedUnion("type", [...])` over `p`/`h`/`ul` (exported as `ContentBlock`), not `any` or loose objects — matches `renderBlock()` in `pageBlogPost()` in `assets/js/site.js` exactly. Case-studies/solutions/products share sub-schemas (`meta`, `challenge`, `solution` steps, `aws`, `architecture`, `metrics`, `faqs`, etc.) reflecting that all three render through the same legacy `renderDetailPage()`. `related` kept as `z.array(z.string())` (bare slugs) rather than a single-collection `reference()`, since legacy `findDetail()` resolves a related slug across all three detail collections, not one. |
| Convert BLOG_POSTS array → `src/content/blog/*.md` or `*.json` entries | content-modeler | Done | **Data-fidelity finding:** the live array actually has **9** posts, not the 8 estimated in the Phase-0 inventory row above — verified by counting `BLOG_POSTS` entries at runtime. Chose `*.json` over Markdown: bodies are pure structured `p`/`h`/`ul` blocks with inline HTML (`<strong>`/`<em>`) and no prose-authoring need, so JSON is a lossless 1:1 mirror of the source array (one file per post, `slug` becomes the filename/`id`, loaded via `glob({ pattern: "**/*.json", base: "./src/content/blog" })`). Converted programmatically (executed `content.js` in a Node `vm` context and serialized each array element to `JSON.stringify`) rather than hand-transcribed, to eliminate transcription risk across ~1200 lines of source. 3 of 9 posts have `date: ""` in the source (empty string, not missing) — preserved verbatim as an optional string rather than invented or coerced to `z.date()`. |
| Convert CASE_STUDIES, SOLUTIONS, PRODUCTS arrays → respective collections | content-modeler | Done | 7 case studies, 3 solutions, 4 products — all converted 1:1 as JSON entries via the same scripted extraction, all fields preserved (including HTML-bearing `results[]`/`challenge.items[]`/list-item strings, `clientLogo`, `architecture`, `flow`, `faqs`). **Data-fidelity note:** in `SOLUTIONS`, 2 of 3 entries carry `kind: "Case Study"` and one (`operations-automation`) carries `kind: "Solution"` — both already routed through the identical `renderDetailPage()` in the legacy renderer, so the `solutions` collection schema keeps `kind: z.enum(["Case Study", "Solution"])` rather than normalizing it, to avoid silently changing displayed copy. `CASE_SCENES` (the slug-keyed supplementary-visual lookup at the bottom of `content.js`) is not a list of entries, so it was kept out of the content-collections system entirely and moved to `src/data/caseScenes.json` as a plain data module, per the Phase-0 row's suggestion to decide collections vs. plain data module per type. All four collections validated cleanly against their Zod schemas via `astro sync` on first pass — no coercion or shape mismatches found. |
| Write shared render components for content blocks (Paragraph, Heading, List) used across blog/case-study/solution detail pages | component-builder | Done | Built under `src/components/content/`: `Paragraph.astro`, `Heading.astro`, `List.astro` for the blog `p`/`h`/`ul` union, dispatched by `Block.astro` (switches on `block.type`) and wrapped by `BlogBody.astro` (reproduces `<article class="blog-prose">...</article>`). Also ported every other block type `renderDetailPage()` renders, since case-studies/solutions/products share that one legacy function: `Eyebrow`, `MetricCard`, `ChallengeList`, `SolutionSteps`, `AwsServices` (+ `awsIcon.ts`, the keyword→Lucide-icon mapper ported 1:1), `ArchitectureFigure`, `TechStack`, `ResultsGrid`, `Faqs`, `FlowDiagram` (DocIQ's "how it fits" diagram — reproduces the legacy hardcoded stage-index-0/1 connector captions verbatim rather than silently fixing that data/render coupling), and `RelatedWork`. All markup/Tailwind classes copied verbatim from `assets/js/site.js` for pixel parity; icons emit the same `<i data-lucide="...">` tags the legacy `icon()` helper produces, unchanged from how `BaseLayout.astro` already hydrates them. **Flagged, not fixed:** `blog-prose` (emitted by both the legacy renderer and the new `BlogBody.astro`) is not defined anywhere in `assets/css/site.css` or `src/styles/global.css` — it's a dead/unstyled class in production today; left as-is for exact visual parity rather than inventing prose styling that doesn't exist live. `astro check` (26 files) and `npm run build` both pass with 0 errors/warnings after adding all schemas, data, and components. |

## Phase 3 — Static Page Migration (batch 1, no dynamic routing)

Goal: home, about, services, agentic-ai, contact, support, cca-f, 404 — one-off pages with no slug pattern.

| Task | Agent | Status | Notes |
|---|---|---|---|
| `index.html` (pageHome) → `src/pages/index.astro` | page-migrator-a | Done | Static SVG and scoped node-inspection script; keyboard access added. |
| `about/` (pageAbout) → `src/pages/about.astro` | page-migrator-a | Done | Static hero animation and scoped journey reveal script. |
| `services/` (pageServices) → `src/pages/services.astro` | page-migrator-a | Done | Static hero animation; home service anchors target real section IDs. |
| `agentic-ai/` (pageAgenticAI) → `src/pages/agentic-ai.astro` | page-migrator-b | Done | Static page with scoped Spline loader behavior. |
| `contact/` (pageContact) → `src/pages/contact.astro` | page-migrator-b | Done | Scoped form validation/submission; `PUBLIC_WEB3FORMS_CONTACT_KEY` enables direct sending, otherwise mailto fallback. No key copied into new source. |
| `support/` (pageSupport) → `src/pages/support.astro` | page-migrator-b | Done | Scoped form behavior and attachment label; `PUBLIC_WEB3FORMS_SUPPORT_KEY` enables direct sending, otherwise mailto fallback. |
| `cca-f/` (pageCCAF) → `src/pages/cca-f.astro` | page-migrator-c | Done | Scoped notice dismissal, domain accordions, and scenario jumps; removed inline event handlers. |
| `404.html` → `src/pages/404.astro` | page-migrator-c | Done | Dedicated not-found page with links to home, services, and contact. |

Phase 3 verified: `npx astro check` reports 0 diagnostics; `npm run build` emits all 8 routes; focused form and static-page checks pass. The copied legacy `public/assets/js/site.js` has placeholder Web3Forms keys so the Astro build does not expose the old values.

## Phase 4 — Dynamic Route Migration (batch 2, slug-based)

Goal: collection-backed listing + detail pages using `getStaticPaths`.

| Task | Agent | Status | Notes |
|---|---|---|---|
| blog/ index (pageBlog) → `src/pages/blog/index.astro` | page-migrator-d | Done | Preserves featured post, editorial order, card art, and hero SVG. |
| blog/[slug] (pageBlogPost) → `src/pages/blog/[slug].astro` + `getStaticPaths` from collection | page-migrator-d | Done | All 9 collected posts rendered through one template with article body and related links. |
| case-studies/ index (pageCaseStudies) → `src/pages/case-studies/index.astro` | page-migrator-e | Done | Preserves hero SVG, covers, cards, and ordering. |
| case-studies/[slug] (pageCaseStudy → renderDetailPage) → `src/pages/case-studies/[slug].astro` | page-migrator-e | Done | All 7 case studies use shared `DetailPage.astro`, including scenes and related work. |
| products/ index (pageProducts) → `src/pages/products/index.astro` | page-migrator-f | Done | Preserves 8 cards, brand rail, load-more control, and interactive radial orbital. |
| products/[slug] (pageProductDetail) → `src/pages/products/[slug].astro` | page-migrator-f | Done | All 4 products use the shared collection-backed detail template. |
| solutions/[slug] (pageSolution → renderDetailPage) → `src/pages/solutions/[slug].astro` | page-migrator-f | Done | All 3 solutions use the same detail template. |

Phase 4 verified: `npx astro check` reports 0 diagnostics; `npm run build` emits 34 routes; `tools/check-migrated-dynamic-pages.mjs` confirms every collection entry has a built page, every listing links to its entries, and the product controls are present. The four legacy standalone product detail HTML pages contain additional custom marketing copy and layout beyond the collection data; compare these in Phase 6 visual/content parity before cutover.

## Phase 5 — Navigation, Routing & Cross-Cutting JS

Goal: retire the hand-rolled client router; verify no behavior regresses.

| Task | Agent | Status | Notes |
|---|---|---|---|
| Replace `navigateTo()`/`currentPath()`/`renderNav()` client router with native Astro multi-page navigation | router-retirer | Done | Astro pages and `BaseLayout.astro` use ordinary links and build-time active nav state; none loads legacy `site.js`. Browser navigation replaces the old History API router. A small redirect preserves old root hash URLs (`/#/services`). No view transitions added: no page behavior depends on SPA transitions. |
| `bindNavbar()` (scroll-based nav state) → plain scoped script in BaseLayout.astro | router-retirer | Done | Layout script updates nav background/padding on scroll and keeps the mobile menu's `aria-expanded` in sync. |
| `bindJourneyTimeline()`, `bindHeroNodes()`, `bindSplineScene()`, radial orbital bind logic → scoped `<script>` per page | interactivity-porter | Done | Journey, hero nodes, and Spline done in Phase 3; radial orbital and product page controls done in Phase 4. |
| Chatling chatbot script → verify still injected site-wide | interactivity-porter | Done | Already included in `BaseLayout.astro` in Phase 1. |
| CloudFront Function fix for broken sub-route direct loads (recent commit `d237078`) — confirm still needed under Astro's real static output | router-retirer | Done | Retain `deploy/cloudfront-function.js`: Astro emits `/route/index.html`, while the S3 REST origin requires an exact object key. The function maps `/route` and `/route/` to that key. Confirm the function is attached before Phase 6 cutover; the original commit said the attachment script had not yet run. |

Phase 5 verified: `npx astro check` reports 0 diagnostics; `npm run build` emits 34 routes; static and dynamic page checks pass. Built pages contain active nav state and no reference to legacy `site.js`.

## Phase 6 — QA, SEO Parity & Cutover

Goal: byte-for-byte confidence before DNS/deploy switch.

| Task | Agent | Status | Notes |
|---|---|---|---|
| Visual regression: diff every route (Astro build vs live site) — reuse existing Playwright baseline setup if present | qa-verifier | In progress | No prior baseline found. Product pages now restore their unique feeds, diagrams, market claims, and CTAs; final browser comparison pending. |
| SEO metadata parity check (title/description/OG tags per route) vs current per-page hardcoded meta | qa-verifier | Done | Titles/descriptions match legacy on the 33 indexable routes; OG tags and canonicals checked in the built output. The 404 is intentionally noindex. |
| robots.txt + sitemap.xml regenerate (`@astrojs/sitemap` integration) | qa-verifier | Done | Astro generates `sitemap-index.xml` and `sitemap-0.xml`; generated `robots.txt` points to the index. |
| Env var / secrets check for build (Web3Forms keys, Google verification placeholder) — confirm `.env` wiring survives move to Astro's `import.meta.env` | qa-verifier | Done locally | `.env.example` contains only empty placeholders. Workflow maps GitHub Secrets to build variables; secret presence and live form delivery still need verification. Legacy root `assets/js/site.js` still contains hardcoded keys but is excluded by the new `dist/` upload. |
| Lighthouse / perf pass — confirm Astro output beats current CDN-Tailwind + CSR baseline | qa-verifier | In progress | Lighthouse binary unavailable; browser and asset-level comparison underway. |
| Deploy cutover plan (staging URL → swap prod), rollback path documented | cutover-lead | Drafted | Workflow builds/checks `dist/`, guards on CloudFront rewrite, retains old S3 objects. No staging URL identified; AWS CLI session expired. |
| Delete legacy: `site.js`, `content.js`, `tools/sync-html-shell.mjs`, per-page index.html files, `uploads/` dir | cutover-lead | Todo | Only after cutover confirmed stable — keep on a branch for one release cycle before deleting |

Local Phase 6 checks pass: `npx astro check` (0 diagnostics), `npm run build` (34 pages), and the migrated static, dynamic, SEO, and form checks. `npm audit --omit=dev` reports 2 low, 1 high, and 1 critical finding in the pinned Astro 5 dependency tree. The [critical AVIF advisory](https://github.com/advisories/GHSA-26w7-cxv4-gfx2) requires processing an untrusted AVIF image; this repository has no AVIF files or Astro image optimization calls. Upgrading Astro and replacing the Tailwind integration is separate follow-up work.

### Cutover and rollback

The deployment workflow on this branch now builds Astro and uploads `dist/` only. It retains existing S3 objects for the first release. No staging distribution or URL is configured in this repository, and the local AWS session is expired, so CloudFront attachment and a hosted preview still need verification before production cutover.

1. Reauthenticate AWS. Confirm the distribution's default behavior has the published `algorims-spa-index-rewrite` viewer-request function attached; attach it with `deploy/attach-cloudfront-function.sh` if absent. Confirm the deploy role can read the distribution config for the workflow preflight.
2. Configure the GitHub Actions `WEB3FORMS_CONTACT_KEY` and `WEB3FORMS_SUPPORT_KEY` secrets if direct form delivery is required. Without them, both forms use the existing mailto fallback. Add a real Google verification token only if one exists.
3. Run the Astro build and checks, then inspect the built site with `npm run preview`. A hosted staging check requires a staging bucket/distribution or equivalent infrastructure; none is currently identified. Do not treat the local preview as a CloudFront routing test.
4. After approval, merge the migration branch to `main`. The workflow uploads `dist/` and invalidates CloudFront. Smoke-check `/`, one nested blog route, one product route, `robots.txt`, `sitemap.xml`, and contact/support submission behavior through the production URL.
5. If the new site fails, revert the migration merge on `main` and rerun the previous root-sync deployment workflow. Legacy source and S3 objects are retained for this release; do not delete them before the rollback window closes.

---

## Subagent Roster

Suggested split — spawn per phase, not all at once. Names are role tags for the tracker above, not literal tool names.

| Agent | Type | Phase | Description |
|---|---|---|---|
| route-mapper | Explore | 0 | Read-only. Maps every route, slug pattern, and data dependency. No writes. |
| render-auditor | Explore | 0 | Diffs each `pageXxx()` function against rendered DOM output; documents component boundaries for later extraction. |
| content-modeler | general-purpose | 0 / 2 | Owns content.js → Astro content collection schema and data conversion end to end. |
| interactivity-auditor | Explore | 0 | Flags every `bind*()`/animation function as script-port candidate vs dead-on-migration. |
| scaffold-builder | general-purpose | 1 | Astro init, Tailwind integration, asset migration. Writes the skeleton everyone else builds on. |
| layout-builder | general-purpose | 1 | `BaseLayout.astro` + global styles. Single highest-leverage component — retires shell-sync script. |
| component-builder | general-purpose | 2 | Shared content-block renderers (paragraph/heading/list) used by every detail page template. |
| page-migrator-a..f | general-purpose ×6 | 3–4 | One per route cluster (static pages, blog, case-studies, products+solutions). Run in parallel once Phase 1–2 land — each is independent once layout + content collections exist. |
| router-retirer | general-purpose | 5 | Removes client-side router, replaces with native Astro navigation. Touches every page — run after Phase 3–4 complete, not in parallel with them. |
| interactivity-porter | general-purpose | 5 | Ports remaining `bind*()` behaviors into scoped `<script>` tags. |
| qa-verifier | general-purpose | 6 | Visual regression, SEO parity, sitemap/robots, secrets check, perf pass. Gate before cutover. |
| cutover-lead | you + user | 6 | Deploy swap and legacy deletion — high blast radius, human-approved steps only, no autonomous agent. |

**Sequencing rule:** Phase 0 must fully close before Phase 1 starts. Phase 1+2 must close before any page-migrator spawns (they need BaseLayout + collections to exist). page-migrator-a..f can run fully parallel once unblocked. Phase 5 and 6 are strictly serial after all pages land — router retirement and cutover touch shared state, no parallel agents there.
