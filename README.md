# Algorims Website

Static Astro site. The production workflow runs `npm run verify` and uploads `dist/` to S3.

## Develop

```sh
npm ci
npm run dev
npm run verify
```

Edit pages and shared components in `src/`, editorial content in `src/content/`, and site styles in `src/styles/global.css` and `tailwind.config.mjs`. `src/layouts/BaseLayout.astro` owns the shared head, navigation, and footer. Files in `public/` are copied into the build.

The root HTML folders, `assets/`, `footer.html`, and `tools/sync-html-shell.mjs` are legacy rollback material, not production sources. `npm run check:legacy` checks that snapshot; don't run the shell sync when editing Astro pages.

See [REDESIGN_READINESS.md](REDESIGN_READINESS.md) for the redesign scope and release gate.
