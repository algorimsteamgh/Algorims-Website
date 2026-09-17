# Redesign readiness — September 17, 2026

## One source of truth

The production workflow builds Astro and uploads only `dist/`. Edit `src/`, `src/content/`, `src/data/`, `src/styles/global.css`, and `tailwind.config.mjs`. `BaseLayout.astro` owns the shared head, navigation, and footer. The old root HTML, `assets/`, shell sync script, and static-site check are rollback material, not inputs to the Astro build. `public/assets/` contains only assets the Astro build may publish. The untracked `design-options/` images are reference material; no design option has been selected in code.

## Duplication map

| Area | Current state | Redesign action |
| --- | --- | --- |
| Shared shell and navigation | One `src/layouts/BaseLayout.astro` for all 34 pages | Edit once. Keep desktop and mobile behavior together. |
| Colors, typography, spacing, buttons | `src/styles/global.css` tokens plus `tailwind.config.mjs` mappings | Start with tokens, then update only rules the new design needs. Check contrast and focus states. |
| Standard consultation CTA | Six Astro call sites now use `src/components/ConsultationCta.astro` | Edit once. `agentic-ai.astro` has different copy and links; keep its version distinct unless the redesign makes them identical. |
| Detail pages | Products, solutions, and case studies share `src/components/content/DetailPage.astro` and its section components | Change section layout once; retain product-specific `ProductDetails.astro` panels and collection-specific data. |
| Blog cards and art | `BlogCard.astro`, `BlogArt.astro`, `HeroArt.astro` are already shared | Change reusable card treatment there; keep article body in `BlogBody.astro`. |
| Contact and support forms | Both use `src/scripts/formSubmission.ts`; each page has different fields and validation | Reuse the submit helper; leave page validation separate unless the new form design makes it truly identical. Test success, errors, and mailto fallback. |
| Product listing versus product details | `src/data/productsListing.json` supplies listing-only fields; `src/content/products/*.json` supplies detail content | Keep the two shapes while the layouts differ. The listing already takes overlapping subtitle, glyph, and accent from the collection. |
| Editorial order and SEO exceptions | Blog/case-study order arrays and a few route-specific SEO overrides | Preserve order and metadata; do not turn these into a generic content system for this release. |
| Large one-off pages | Home, services, agentic AI, and CCA-F contain unique sections and animation markup | Redesign page by page. Extract a section only when the new design repeats it. |
| Legacy renderer, styles, route shells | Old root HTML and `assets/js`, `assets/css` remain for rollback; duplicate copies were removed from `public` | Do not edit or upload legacy code for the Astro release. Remove rollback source only after the release is stable. |

## Reuse and two-theme revamp plan

The Astro shell and content templates already prevent the most costly markup duplication. Do not create a generic section renderer for the large one-off pages: their sections have different content and behavior. Extract a section only after the new design uses the same layout on at least two routes. Preserve page copy, content collection schemas, slugs, and form behavior while changing presentation.

| Pass | Edit once | Apply to | Done when |
| --- | --- | --- | --- |
| 1. Theme foundation | `src/styles/global.css` semantic tokens and `tailwind.config.mjs` mappings | All pages using `background`, `foreground`, `card`, `secondary`, `muted`, `border`, `primary`, buttons, fields, and gradients | Both palettes have readable text, focus rings, and controls. The light palette remains visually stable. |
| 2. Site shell | `src/layouts/BaseLayout.astro` | Header, menus, mobile nav, footer, metadata, global assets | One shell works on every route at desktop and mobile widths in both themes. |
| 3. Repeated content | `ConsultationCta`, `DetailPage`, `BlogCard`, `BlogArt`, and existing content components | Blog, case studies, solutions, products | One component change updates every instance; brand accent values remain data, while neutral surfaces and text come from theme tokens. |
| 4. Product visuals | `ProductHero.astro`, `ProductDetails.astro`, `productsListing.json` | Four product detail pages and product index | Product accent colors remain distinct; white surfaces, neutral text, borders, status states, and proof cards work in both themes. |
| 5. Unique pages | The page that owns each section | Home, services, agentic AI, about, contact, support, CCA-F | Replace fixed neutral colors with semantic tokens. Keep intentional dark artwork or diagrams as explicit contrast islands. |
| 6. Theme control | A single control and preference script in `BaseLayout.astro` | All routes | System preference is the default, a user choice persists across navigation, and the first paint uses the correct theme. Add this after passes 1–5 so users never enter a partially styled theme. |

The first foundation edit is in place: `:root.dark` now defines the same semantic token names as the light palette, shared gradients read those tokens, and the navigation backdrop reads the `card` token. Dark mode is deliberately not enabled in the UI yet because product details and unique pages still contain fixed light colors.

### Route review order

1. Review the shell and shared CTA on `/`, `/services`, `/contact`, and `/support`; these expose navigation, forms, and common controls.
2. Review `/blog`, one `/blog/[slug]`, `/case-studies`, one `/case-studies/[slug]`, and one `/solutions/[slug]`; these cover the reused content templates.
3. Review `/products` and each of the four product routes; product-specific neutrals are the largest shared theme gap.
4. Review `/about`, `/agentic-ai`, and `/cca-f`; their SVGs, diagrams, and dense page-specific sections need visual decisions, not mechanical color replacement.
5. Review `/404` and every route at mobile width. Run `npm run verify`, then check keyboard focus, contrast, reduced motion, and form states in both themes.

Search for remaining fixed neutral colors with `rg -n 'bg-white|text-black|#[0-9a-fA-F]{3,8}|hsl\([0-9]|rgba?\(' src/pages src/components src/styles/global.css`. Treat SVG artwork, branded accents, and permanently dark panels separately from page surfaces. The two untracked `design-options/` images are dark references; select a visual direction and its light equivalent before changing typography or page composition.

## Fast path to September 18

1. **September 17: choose the visual direction and scope.** Pick which pages/sections change. Capture current desktop and mobile screenshots for those routes. Keep the original appearance until redesign work starts.
2. **Build shared styling first.** Update `global.css` tokens, `tailwind.config.mjs`, `BaseLayout.astro`, and the shared CTA/detail/card components only where the approved design calls for it. Then update one-off page sections. Keep content JSON and route slugs stable unless copy or URLs explicitly change.
3. **Run the same gate locally and in CI:** `npm run verify`. This checks Astro types, builds 34 pages, and checks routes, SEO, and forms. For changed pages, compare desktop and mobile screenshots; check keyboard navigation, touch targets, reduced motion, and form feedback.
4. **Before production upload:** confirm the CloudFront viewer-request function maps nested paths to `index.html`, confirm build-time form keys if direct form submission is needed, and test at least one nested route in the hosted environment. The workflow uses `aws s3 sync dist/ --delete`, so the previous deployment must be recoverable from Git and a previous build/artifact. No staging URL is configured in this repository.
5. **After deployment:** smoke-check `/`, a blog detail route, a case study, a product detail route, contact/support, `robots.txt`, and the sitemap. If routing or rendering fails, redeploy the previous known-good commit/build and invalidate CloudFront.

## Readiness gate today

The preparation refactor preserved parsed HTML on all 34 generated pages and produced byte-identical generated CSS. The only removed output files are unused legacy `assets/js/site.js`, `assets/js/content.js`, and `assets/css/site.css` copies. The local `npm run verify` gate passes (zero Astro diagnostics, 34 pages, route/SEO/form checks). Desktop dropdowns also open on keyboard focus. The visual redesign still needs a selected direction and scope, desktop/mobile screenshot review, and the hosted CloudFront/form-key checks before deployment.
