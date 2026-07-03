# Algorims Website

Next.js App Router marketing site for `algorims.com`.

## Main code paths

- `app/` - routes, layout, metadata routes, and API handlers
- `components/site/` - shared site UI and legacy client shims
- `content/` - typed blog, case study, solution, and product content
- `lib/legacy-pages.ts` - server-side bridge for pages still rendered from legacy JS
- `assets/js/content.js` and `assets/js/site.js` - legacy render source still used by the bridge
- `deploy/nginx-algorims.conf` - nginx reverse-proxy example for `next start`

## Commands

```sh
npm run dev
npm run lint
npm run build
npm run start
npm run check
```

`npm run check` runs lint plus a production build.

## Forms

Contact and support submissions go through Next API routes.

Set these in `.env.local` when you want live Web3Forms delivery:

```sh
WEB3FORMS_CONTACT_KEY=...
WEB3FORMS_SUPPORT_KEY=...
GOOGLE_SITE_VERIFICATION=...
```

Without Web3Forms keys, the forms fall back to a prefilled `mailto:` flow.

## Deployment

Build and run the app on the server:

```sh
npm ci
npm run build
npm run start
```

The included nginx config assumes the Next server is listening on `127.0.0.1:3000` and proxies public traffic to it.
