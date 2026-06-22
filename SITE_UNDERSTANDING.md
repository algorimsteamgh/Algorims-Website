# Algorims Website Understanding

## What this repo is

This is a static marketing website for `algorims.com`, not a framework app.

- No build system showed up in the repo root.
- The site is shipped as plain HTML folders plus static assets.
- The brand/message is enterprise AI, agentic AI, AWS, DevOps, data, and Algorims products.

## Structure at a glance

- `index.html`
  Main site shell. Large inline HTML/CSS/JS file.
- `about/`, `services/`, `products/`, `agentic-ai/`, `case-studies/`, `blog/`, `contact/`, `support/`
  Folder-per-route static pages for direct URL access.
- `solutions/<slug>/index.html`
  Static entry pages for solution detail routes.
- `case-studies/<slug>/index.html`
  Static entry pages for case-study detail routes.
- `blog/<slug>/index.html`
  Static entry pages for blog detail routes.
- `assets/`
  Production images/logos/case-study art/product logos.
- `robots.txt`, `sitemap.xml`
  Hand-maintained SEO files.
- `deploy/nginx-algorims.conf`
  Static nginx config for origin hosting behind Cloudflare.

## How the site actually works

The site is mostly one big hand-authored document with inline rendering logic.

- `index.html` contains:
  - Tailwind via CDN
  - Lucide via CDN
  - Spline viewer for the 3D scene
  - large inline CSS block
  - large inline JS block
  - client-side router
  - embedded content/data for blog posts, case studies, solutions, products, forms
- JS route table lives in `index.html` and maps:
  - `/`
  - `/about`
  - `/services`
  - `/products`
  - `/agentic-ai`
  - `/case-studies`
  - `/blog`
  - `/contact`
  - `/support`
- Dynamic detail routes are also handled in the same file:
  - `/blog/<slug>`
  - `/solutions/<slug>`
  - `/case-studies/<slug>`

So conceptually this is an SPA shell, but operationally it is deployed as many static route copies for SEO and direct entry.

## Content model

Most content is hardcoded in JS arrays/functions inside `index.html`.

- `BLOG_POSTS`
  9 posts embedded in code.
- `CASE_STUDIES`
  5 case studies embedded in code.
- `SOLUTIONS`
  3 solution detail pages embedded in code.
- Products are also defined inline in the products page renderer.
- Contact/support copy and validation are inline too.

This means content edits are mostly code edits, not CMS edits.

## Deployment model

`deploy/nginx-algorims.conf` confirms a plain static deployment:

- nginx serves files from `/var/www/algorims`
- `try_files $uri $uri/ =404;`
- custom `404.html`
- Cloudflare sits in front
- assets get long cache
- HTML gets `no-cache`

Important consequence:

- Direct visits to `/about`, `/blog/...`, `/solutions/...` depend on the matching folder and `index.html` existing on disk.
- This is not a single-file SPA rewrite setup.

## Forms and integrations

Two forms are wired in `index.html`.

- Contact form
  Sends through Web3Forms with a fallback to `mailto:contactus@algorims.com`.
- Support form
  Sends through Web3Forms with a fallback to `mailto:support@algorims.com`.
- Support also links to Zoho Desk:
  `https://algorims.zohodesk.com.au/portal`

## SEO state

- Canonicals and social meta are present.
- `robots.txt` is minimal and points to the sitemap.
- `sitemap.xml` is manual/static.
- Google verification is still a placeholder in the HTML:
  `PASTE-YOUR-CODE-HERE`

## What looks important for future edits

1. Shared layout/JS changes are likely duplicated across many route files, not just root `index.html`.
2. SEO head tags differ per route folder, so route files are not safe to ignore.
3. There is no obvious generation script keeping these copies in sync.
4. Keep working files and screenshot dumps out of the published tree unless they are referenced by the site.

## Working assumption for next tasks

If you ask for a visual/content change, I should first decide whether:

- it belongs only in one route file, or
- it is a shared shell change that must be propagated to multiple static copies.

That duplication is the main maintenance risk in this repo.
