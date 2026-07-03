# Algorims Website Understanding

## What this repo is

This is now a Next.js App Router marketing site for `algorims.com`.

- Rendering is route-based under `app/`
- Shared UI lives in React components under `components/site/`
- SEO is handled through Next metadata plus `app/sitemap.ts` and `app/robots.ts`
- Contact and support forms post to Next API routes

## Transitional architecture

The app is not fully migrated away from legacy page builders yet.

- `app/page.tsx` is a native Next page
- Some routes still render HTML by calling legacy render functions through `lib/legacy-pages.ts`
- Those legacy renderers are loaded from `assets/js/content.js` and `assets/js/site.js`
- Browser-only behavior that still matters is patched in through small client components under `components/site/`

So the runtime is Next.js, but part of the page content still comes from the old JS render source.

## Structure at a glance

- `app/`
  Next routes, layout, metadata routes, and API handlers
- `components/site/`
  Header, footer, mobile nav, legacy enhancement shims, Spline wrapper
- `content/`
  Typed content modules for blog posts, case studies, products, and solutions
- `lib/legacy-pages.ts`
  Server-side VM bridge that executes the legacy page render functions
- `lib/site-metadata.ts`
  Shared page metadata builder
- `lib/web3forms.ts`
  Shared form helpers used by the API routes
- `assets/`
  Source assets plus the legacy JS render source still used by the bridge
- `public/assets/`
  Publicly served images and static files used by the Next app
- `deploy/nginx-algorims.conf`
  Reverse-proxy example for running `next start` behind nginx

## Forms and integrations

- Contact form:
  posts to `app/api/contact/route.ts`
- Support form:
  posts to `app/api/support/route.ts`
- Web3Forms keys live in `.env.local`
- If no keys are configured, the API returns a `mailto:` fallback
- Support still links to Zoho Desk:
  `https://algorims.zohodesk.com.au/portal`

## Deployment model

The site is no longer a flat static upload.

- Build with `npm run build`
- Run with `npm run start`
- Put nginx or another reverse proxy in front of the Next server
- `deploy/nginx-algorims.conf` assumes the app listens on `127.0.0.1:3000`

## Important editing rule

Before changing a page, check whether it is:

1. A native Next route or component change
2. A typed content change under `content/`
3. A legacy-rendered route that still depends on `assets/js/site.js` / `assets/js/content.js`

That distinction is the main maintenance constraint left in this repo.
