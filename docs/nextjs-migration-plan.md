# Algorims Next.js Migration Status

## Status

Migration completed on July 3, 2026.

The site now runs as a Next.js App Router application with:

- filesystem routes under `app/`
- shared React layout components under `components/site/`
- typed content modules under `content/`
- Next metadata, sitemap, and robots routes
- server-side contact and support form handlers
- nginx configured as a reverse proxy to `next start`

## What Changed

### Phase 1: Foundation

- Next.js, React, TypeScript, Tailwind, PostCSS, and ESLint were added.
- The app shell moved to `app/layout.tsx`, `app/page.tsx`, and `app/globals.css`.
- Public assets are served from `public/assets`.

### Phase 2: Shared Layout

- Header, footer, mobile nav, and CTA are rendered from shared React components.
- Lucide CDN markup was replaced with `lucide-react` where the native Next UI owns rendering.

### Phase 3: Content Data

- Blog posts, case studies, solutions, and products were moved into typed local modules.
- Shared content types were added under `content/types.ts`.

### Phase 4: Routes

- Static, collection, and dynamic public URLs now resolve through Next routes.
- Unknown dynamic slugs return `notFound()`.

### Phase 5: SEO

- Route metadata moved into Next metadata APIs.
- Sitemap and robots are generated from `app/sitemap.ts` and `app/robots.ts`.
- Google Search Console verification is environment-driven.

### Phase 6: Forms

- Contact and support submissions now go through Next API routes.
- Web3Forms keys are read from `.env.local`.
- When keys are absent, the forms fall back to prefilled `mailto:` links.

### Phase 7: Browser-Only Features

- The Agentic AI Spline viewer is isolated in a client component.
- Legacy browser-only behaviors are kept in small client shims instead of the old SPA router.

### Phase 8: Cleanup And Deployment

- Generated static route copies and obsolete static-site scripts were removed.
- README and deployment notes now describe the Next.js runtime.
- nginx now proxies to `next start` instead of serving a flat HTML tree.

## Remaining Technical Debt

The migration is complete, but one transitional seam remains:

- Some routes still render through `lib/legacy-pages.ts`, which executes legacy page-builder functions from `assets/js/content.js` and `assets/js/site.js`.

That bridge is acceptable for now because:

- route parity is already in place
- the legacy render source is server-side only
- browser-only behaviors have already been isolated

Remove it only when you want to do a full native React rewrite of the remaining legacy-backed pages.

## Current Commands

```sh
npm run dev
npm run lint
npm run build
npm run start
npm run check
```

## Smoke Test Routes

- `/`
- `/about`
- `/services`
- `/products`
- `/agentic-ai`
- `/case-studies`
- `/case-studies/qsr-conversational-analytics`
- `/case-studies/ai-school-scheduler`
- `/case-studies/cicd-release-automation`
- `/case-studies/enterprise-knowledge-mining`
- `/case-studies/finance-document-automation`
- `/blog`
- `/blog/transforming-businesses-with-ai-ml-and-generative-ai`
- `/blog/unlocking-business-growth-with-aws-cloud-consulting`
- `/solutions/autonomous-customer-operations`
- `/solutions/intelligent-document-processing`
- `/solutions/operations-automation`
- `/contact`
- `/support`
- `/cca-f`

## Deferred Until Needed

- CMS integration
- Database-backed content
- Authentication
- Full visual redesign
- Multi-language routing
