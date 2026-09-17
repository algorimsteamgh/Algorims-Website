# Homepage typography rollout

## Goal

Use the homepage as the typography reference across the site, starting with `/services`. Match font family, responsive sizes, weights, line heights, letter spacing, text color, and emphasis by **text role**. Keep page content and section structure intact.

## Current state

- `src/layouts/BaseLayout.astro` loads DM Sans. `src/styles/global.css` applies it to body text and headings, and `tailwind.config.mjs` maps both `sans` and `display` to DM Sans. The font family already matches across Astro pages.
- `src/pages/index.astro` owns the current homepage type rules in its scoped `<style>`: 600-weight headings; a hero title at `clamp(2.7rem, 5.2vw, 4.8rem)` with `1` line height and `-.06em` tracking; section titles at `clamp(2.2rem, 3.7vw, 3.7rem)` with `1.06` line height and `-.05em` tracking; 700-weight uppercase kickers at `.72rem` with `.18em` tracking; and hero copy at `clamp(1rem, 1.4vw, 1.15rem)` with `1.65` line height. The hero title becomes `2.4rem` below 600px.
- `src/pages/services.astro` uses a different Tailwind type scale (`text-5xl md:text-6xl` for its hero, `text-4xl md:text-5xl` for practice headings), tighter generic tracking, gradient heading emphasis, and different label styling.

## Phase 1 — Services, first implementation

1. Map the Services text to homepage roles: hero title and introduction; practice eyebrow, heading, description, list, and metric; closing heading, copy, and links. Match roles rather than giving every heading the hero size.
2. Update `src/pages/services.astro` to use the homepage's responsive size, weight, line height, tracking, and solid violet emphasis where equivalent. Apply the same kicker treatment to “Our Services” and practice labels. Keep the four practices, existing copy, anchor IDs (`cloud`, `devops`, `dev`, `xero`), and accessible SVG text intact.
3. Use the existing DM Sans setup. If the same typography rule is needed on both pages, move only that repeated rule into `src/styles/global.css` as a reusable class and apply it on both pages. Do not change global `h1`/`h2` rules in a way that alters unrelated pages.
4. Compare `/services` with `/` at mobile and desktop widths, in light and dark themes. Check heading wrapping, readable body and diagram labels, button text, overflow, and contrast. Run `npm run check` and `npm run build`.

**Done when:** the Services page follows the homepage typography by role at both widths and themes, retains its content and working anchors, and passes the build checks.

## Later phases — one page group at a time

| Priority | Pages | Main work |
| --- | --- | --- |
| 2 | `src/pages/agentic-ai.astro`, `src/pages/about.astro` | Align hero, section headings, eyebrows, body copy, and emphasis. |
| 3 | `src/pages/products/index.astro`, `src/pages/case-studies/index.astro`, `src/pages/blog/index.astro` | Align listing-page hierarchy and card typography. |
| 4 | `src/components/content/DetailPage.astro` and its content components, plus `src/pages/blog/[slug].astro` | Align shared detail and article typography once, then review every route using it. |
| 5 | `src/pages/contact.astro`, `src/pages/support.astro`, `src/pages/cca-f.astro`, remaining pages | Align page headings, labels, form text, and supporting copy. |

For each group, compare against the homepage at mobile and desktop widths, check light and dark themes, then run `npm run check` and `npm run build`. Add shared classes only when a rule has a second real use. This keeps the rollout incremental and avoids changing untouched pages accidentally.
