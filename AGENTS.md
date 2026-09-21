# Algorims visual rules

For homepage and future illustration work:

- `design-options/ref-light-theme.webp` is the **light homepage layout and palette reference**: centered statement hero, thin framed canvas and dividers, white ground, charcoal text, sparse deep violet, a single large system diagram, and a restrained proof strip.
- `design-options/ref-light-theme-1.webp` is the **illustration style reference only**. Do not copy its split hero, card layout, black CTA, or headline treatment into the homepage.
- Every new illustration should share one visual DNA: isometric white node tiles, a charcoal central platform, fine charcoal connector lines and square anchors, sparse violet line icons, faint diagonal construction grid, minimal labels, and almost no shadow. Use the same geometry and stroke weight across pages.
- Illustrations must show a real relationship such as inputs → Algorims system → outcomes. Keep text outside artwork when possible; meaningful diagrams need an accessible text alternative. At small widths, simplify the diagram instead of shrinking labels until unreadable.
- Use `src/components/illustrations/SystemDiagram.astro` as the starting example for geometry, colors, and responsive treatment. Prefer inline SVG and semantic theme tokens so art works in light and dark modes.
- Do not present the Microsoft, Google, IBM, Oracle, or SAP logos from the reference mockup as actual Algorims partners or clients without evidence.

These rules supersede the older planning status and illustration interpretation in `DESIGN_SYSTEM_REVAMP.md` for implementation work.
