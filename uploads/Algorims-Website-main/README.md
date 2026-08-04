# Algorims Website

Static marketing site served as plain HTML folders plus shared assets.

## Files to edit

- `assets/css/site.css` - shared site styling.
- `assets/js/content.js` - editable blog, case study, and solution content.
- `assets/js/site.js` - router, rendering, forms, and page behavior.
- `contact/index.html` - source body shell for non-root route pages.

## Checks

```sh
npm run check
npm run sync:shell
```

## Local smoke test

```sh
npm run serve
```

Then open `http://localhost:4173`.

## Shell sync

After editing shared nav/footer/body markup in `contact/index.html`, run:

```sh
npm run sync:shell:write
npm run check
```

Root `index.html` is intentionally not synced because it has root-only favicon/base/chatbot behavior.
