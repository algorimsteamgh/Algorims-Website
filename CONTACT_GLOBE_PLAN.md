# Contact page — branch globe plan

Status: **implemented 2026-10-13** (placement below form, slow auto-rotate). Not committed.

## Goal

Add a globe to `/contact` that draws arcs from the Singapore HQ to every branch listed on the page:

| Office | Role | Lat, Lon |
|---|---|---|
| Singapore | HQ (arc origin) | 1.28, 103.85 |
| Prosper, TX, United States | Branch | 33.24, -96.80 |
| Tirupati, India | Branch | 13.63, 79.42 |
| Bengaluru, India | Branch | 12.99, 77.76 |

## Placement (recommended)

New section **below** the contact grid: "Where we work". The form stays the first thing people see.

```
[ hero: Let's build what's next ]
[ details | form ]                 ← unchanged, keeps conversion priority
[ WHERE WE WORK                     ]
[  globe (left, ~60%) | office list ]  ← list items are the text alternative
```

Hovering or focusing an office in the list highlights its arc and anchor on the globe. On mobile (<700px), the globe sits on top at a smaller size with no labels inside the art, and the list stacks below it.

## Visual spec (AGENTS.md visual DNA)

- Orthographic globe drawn as **inline SVG**: thin charcoal outline, faint graticule (15°), land shown as a dotted grid (dots sampled at build time). No photo texture, no gradients, almost no shadow.
- Faint diagonal construction grid and corner crosshairs behind the globe, like `CaseQsrDiagram.astro`.
- Offices are drawn as **square anchors** in charcoal. The HQ gets a violet square with a thin ring.
- Arcs are great-circle paths in **violet**, raised slightly off the surface. A dash animation travels HQ → branch.
- Colors come from local illustration tokens (`--wire-stroke`, `--violet-core`, `--canvas-grid`, `--crosshair`), with light and dark values copied from the case diagrams. The art works in `.dark`.
- No text labels inside the SVG. Names live in the HTML list. The SVG has `role="img"` and an `aria-label` that lists all four offices.

## Technical approach

- New component: `src/components/illustrations/BranchGlobe.astro`.
- **Build time** (Astro frontmatter): `d3-geo` + `topojson-client` + `world-atlas` (land-110m) sample land dots and compute the initial static SVG. The page works with JavaScript off, using a fixed view centred near 45°N, 30°E, where all four offices are on the visible face.
- **Client** (small `<script>`, bundled by Astro): uses `d3-geo` only, with the dot coordinates passed as JSON in `data-*`. It rotates the globe slowly, hides arcs and dots on the back face (clip angle 90°), pauses on hover or focus, and pauses when the globe is off-screen (IntersectionObserver). With `prefers-reduced-motion`, it shows the static view and doesn't animate.
- Dependencies: `d3-geo`, `topojson-client`, `world-atlas`. The last two are only used at build time; `d3-geo` ships about 15 KB gzip to the client on `/contact` only.
- Dot density is capped at about 1.5k points so each SVG frame stays cheap.

## Design-skill usage

The installed Design plugin (`design~g2`) supplies the review gates:
- `design-system`: check that the tokens and stroke weights match the existing illustrations.
- `accessibility-review`: WCAG 2.1 AA review covering the text alternative, reduced motion, contrast in both themes, and keyboard focus on the list.
- `design-critique`: final visual critique against `ref-light-theme.webp` and the AGENTS.md DNA.

## Phases

1. **Deps + data**: install the three packages and add an office data module, `src/data/offices.ts`, which becomes the single source for both the contact details and the globe.
2. **Component**: build `BranchGlobe.astro` (static SVG plus the client rotation script).
3. **Integrate**: add the "Where we work" section to `contact.astro`, render the branch addresses from `offices.ts`, and wire up the list ↔ arc highlight.
4. **Verify**: run `npm run check` and `npm run build`, take screenshots at 1440, 768 and 375 widths in light and dark, test with reduced motion, and run the design-skill reviews.
5. **Fix + report**: apply the review findings and summarise the diff. Nothing is committed without approval.

## Execution prompts (for autonomous run)

### P1 — Deps + data
> In /Users/vms_algorims/Algorims-Website (Astro 5, static), run `npm i d3-geo topojson-client world-atlas` and `npm i -D @types/d3-geo @types/topojson-client`. Create `src/data/offices.ts` exporting `offices: { id, city, country, role: "hq" | "branch", lines: string[], lat, lon }[]` for Singapore HQ (2 Central Boulevard, #32-01 / IOI Central Boulevard Towers / Singapore 018916; 1.28, 103.85), Prosper US (Algorims Inc. / 990 Corinthian Rd, Prosper, TX 75078; 33.24, -96.80), Tirupati (existing address in contact.astro; 13.63, 79.42) and Bengaluru (existing address; 12.99, 77.76). Copy the address text verbatim from `src/pages/contact.astro`. Run `npm run check`.

### P2 — Component
> Create `src/components/illustrations/BranchGlobe.astro`. Follow AGENTS.md and copy the token pattern (light and `.dark` values for `--wire-stroke`, `--violet-core`, `--canvas-grid`, `--crosshair`) from `src/components/illustrations/CaseQsrDiagram.astro`. In the frontmatter, import `offices`, load `world-atlas/land-110m.json`, convert it with `topojson-client.feature`, and sample land dots on a ~2.2° lat/lon grid with `geoContains`. Cap the result at about 1500 points. Build a `geoOrthographic` projection (viewBox 560×560, radius 240, rotate [-30, -45]) and render the static SVG: an outline circle (stroke 1.25), a 15° graticule (stroke 0.5, low opacity), land dots (r 1.1, charcoal at low opacity), great-circle arcs HQ→branch (violet, stroke 1.5, `stroke-dasharray` dash animation, `pathLength=1`), 6px charcoal square anchors at each branch, and a violet square plus a thin ring at the HQ. Give every arc and anchor `data-office={id}`. Add a background diagonal grid pattern and corner crosshairs. Put no text in the SVG. Set `role="img"` and an aria-label naming all offices and saying arcs connect Singapore HQ to each branch. Embed the dot coords and offices as JSON in `data-globe`. Client `<script>`: import `geoOrthographic`, `geoPath`, `geoGraticule10` and `geoInterpolate` from d3-geo. Rotate λ at about 6°/s using requestAnimationFrame. Keep φ at -25 so all offices pass through view. Re-render only the path `d` attributes and dot visibility, culling by `geoDistance` > π/2. Pause on `mouseenter`/`focusin` of the section and when off-screen (IntersectionObserver). If `matchMedia('(prefers-reduced-motion: reduce)')` matches, never start. Expose `highlight(id)` through a `globe:highlight` CustomEvent on the root element, which adds `.is-active` to the matching arc and anchor and dims the others. Responsive: max-width 560px, `width:100%`. Under 700px, drop the graticule and halve the dot count by rendering only every other dot.

### P3 — Integrate
> In `src/pages/contact.astro`, render the Headquarters and Branches blocks from `offices.ts` and keep the current markup and classes. Below the `.contact-grid` section, add `<section class="container-x pb-16 lg:pb-24" aria-labelledby="presence-title">` with the kicker "Where we work", an h2 "One team across three countries.", and a two-column grid (globe | office list) inside the same 1px border / 1.5rem radius frame as `.contact-grid`. Each list item is a `<button type="button" data-office>` showing city, country and role. On hover or focus it dispatches `globe:highlight` with its id, and on leave or blur it clears the highlight. Mobile: one column, globe first. Reuse the existing `.contact-label` and `.contact-place` styles. Don't change the form.

### P4 — Verify
> Run `npm run check && npm run build`. Start `npm run dev`. Use Playwright (via npx) to screenshot `/contact` at 1440, 768 and 375 widths, in light and with `.dark` on `<html>`, and again with `reducedMotion: 'reduce'`. Confirm all four arcs and anchors render, that there is no horizontal scroll at 375, that there are no console errors, and that the form still submits its validation path. Then read and apply the checklists in `~/.claude/plugins/synced/47efb066-bdb7-4516-8ca3-3ed0972cbf79_2c0d2d87-9d35-4e63-b926-04173de70c15/design~g2/skills/{design-system,accessibility-review,design-critique}/SKILL.md` to the screenshots and code. Output a findings list ranked by severity.

### P5 — Fix + report
> Fix every high and medium finding from P4. Re-run P4's checks. Report the changed files, screenshots, and any remaining low findings. Don't commit.
