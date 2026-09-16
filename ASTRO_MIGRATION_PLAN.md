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
| Define content collection schemas (zod) for blog, case-studies, solutions, products | content-modeler | Todo | Body block schema (p/h/ul/etc from content.js) — model as union type or convert to MDX |
| Convert BLOG_POSTS array → `src/content/blog/*.md` or `*.json` entries | content-modeler | Todo | 8 posts |
| Convert CASE_STUDIES, SOLUTIONS, PRODUCTS arrays → respective collections | content-modeler | Todo | Cross-check against `src/data/` (currently empty scaffold) — decide collections vs plain data module per type |
| Write shared render components for content blocks (Paragraph, Heading, List) used across blog/case-study/solution detail pages | component-builder | Todo | Replaces `renderDetailPage()` / `pageBlogPost()` logic |

## Phase 3 — Static Page Migration (batch 1, no dynamic routing)

Goal: home, about, services, agentic-ai, contact, support, cca-f, 404 — one-off pages with no slug pattern.

| Task | Agent | Status | Notes |
|---|---|---|---|
| `index.html` (pageHome) → `src/pages/index.astro` | page-migrator-a | Todo | Includes `aiHeroVisual()` — inline SVG, no JS needed at runtime |
| `about/` (pageAbout) → `src/pages/about.astro` | page-migrator-a | Todo | `aboutHeroAnim()` → scoped script |
| `services/` (pageServices) → `src/pages/services.astro` | page-migrator-a | Todo | `servicesHeroAnim()` → scoped script |
| `agentic-ai/` (pageAgenticAI) → `src/pages/agentic-ai.astro` | page-migrator-b | Todo | Largest single-page function (~430 lines) — may need sub-components |
| `contact/` (pageContact) → `src/pages/contact.astro` | page-migrator-b | Todo | `bindContactForm` → scoped script; check Web3Forms API key handling — keys belong in env, not inline (prior incident: keys were found hardcoded in git history) |
| `support/` (pageSupport) → `src/pages/support.astro` | page-migrator-b | Todo | `bindSupportForm` → scoped script |
| `cca-f/` (pageCCAF) → `src/pages/cca-f.astro` | page-migrator-c | Todo | |
| `404.html` → `src/pages/404.astro` | page-migrator-c | Todo | |

## Phase 4 — Dynamic Route Migration (batch 2, slug-based)

Goal: collection-backed listing + detail pages using `getStaticPaths`.

| Task | Agent | Status | Notes |
|---|---|---|---|
| blog/ index (pageBlog) → `src/pages/blog/index.astro` | page-migrator-d | Todo | `blogCard()`, `blogHeroAnim()` |
| blog/[slug] (pageBlogPost) → `src/pages/blog/[slug].astro` + `getStaticPaths` from collection | page-migrator-d | Todo | 7 posts currently pre-rendered as individual index.html — becomes one dynamic template |
| case-studies/ index (pageCaseStudies) → `src/pages/case-studies/index.astro` | page-migrator-e | Todo | `caseStudiesHeroAnim()`, `caseCover()` |
| case-studies/[slug] (pageCaseStudy → renderDetailPage) → `src/pages/case-studies/[slug].astro` | page-migrator-e | Todo | 7 case studies |
| products/ index (pageProducts) → `src/pages/products/index.astro` | page-migrator-f | Todo | `radialOrbital()`, `bindRadialOrbital()`, `bindProductsPage()` — heaviest interactivity, plan the scoped script carefully |
| products/[slug] (pageProductDetail) → `src/pages/products/[slug].astro` | page-migrator-f | Todo | cxiq, dociq, opsiq, payiq |
| solutions/[slug] (pageSolution → renderDetailPage) → `src/pages/solutions/[slug].astro` | page-migrator-f | Todo | 3 solutions, shares `renderDetailPage()` with case-studies — one shared Astro layout |

## Phase 5 — Navigation, Routing & Cross-Cutting JS

Goal: retire the hand-rolled client router; verify no behavior regresses.

| Task | Agent | Status | Notes |
|---|---|---|---|
| Replace `navigateTo()`/`currentPath()`/`renderNav()` client router with native Astro multi-page navigation | router-retirer | Todo | Biggest architectural change — confirm no SPA transition behavior is load-bearing (optionally adopt Astro View Transitions for the fade/slide feel, still zero-framework) |
| `bindNavbar()` (scroll-based nav state) → plain scoped script in BaseLayout.astro | router-retirer | Todo | |
| `bindJourneyTimeline()`, `bindHeroNodes()`, `bindSplineScene()`, radial orbital bind logic → scoped `<script>` per page | interactivity-porter | Todo | No framework state needed — direct DOM port from site.js |
| Chatling chatbot script → verify still injected site-wide | interactivity-porter | Todo | Prior session confirmed it's in `app/layout.tsx` from an earlier Next.js attempt — needs re-adding to `BaseLayout.astro` |
| CloudFront Function fix for broken sub-route direct loads (recent commit `d237078`) — confirm still needed under Astro's real static output | router-retirer | Todo | Astro SSG emits real per-route HTML files, may make this CloudFront workaround unnecessary — verify then possibly remove |

## Phase 6 — QA, SEO Parity & Cutover

Goal: byte-for-byte confidence before DNS/deploy switch.

| Task | Agent | Status | Notes |
|---|---|---|---|
| Visual regression: diff every route (Astro build vs live site) — reuse existing Playwright baseline setup if present | qa-verifier | Todo | Prior session noted a Playwright visual baseline was committed at some point — check if reusable |
| SEO metadata parity check (title/description/OG tags per route) vs current per-page hardcoded meta | qa-verifier | Todo | |
| robots.txt + sitemap.xml regenerate (`@astrojs/sitemap` integration) | qa-verifier | Todo | |
| Env var / secrets check for build (Web3Forms keys, Google verification placeholder) — confirm `.env` wiring survives move to Astro's `import.meta.env` | qa-verifier | Todo | Prior incident: Web3Forms keys were found hardcoded in git history — do not repeat in Astro build |
| Lighthouse / perf pass — confirm Astro output beats current CDN-Tailwind + CSR baseline | qa-verifier | Todo | |
| Deploy cutover plan (staging URL → swap prod), rollback path documented | cutover-lead | Todo | Coordinate with CloudFront config from recent commits |
| Delete legacy: `site.js`, `content.js`, `tools/sync-html-shell.mjs`, per-page index.html files, `uploads/` dir | cutover-lead | Todo | Only after cutover confirmed stable — keep on a branch for one release cycle before deleting |

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
