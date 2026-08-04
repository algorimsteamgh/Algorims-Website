repo: algorimsteamgh/Algorims-Website
branch: main

## Last sync
date: 2026-08-04T00:00:00Z

### Updated in this project
- Deployed the site locally (root-relative asset paths fixed for local preview).
- Added CXIQ, DocIQ, OpsIQ, PayIQ as full Algorims site pages (routes /products/cxiq, /products/dociq, /products/opsiq, /products/payiq) with shared header/footer/fonts/colors.
- Added Algokisan, Algoride, Algomart behind a "Load more" toggle on the Products page.
- Fixed Contact Us links to route to the real /contact page; removed duplicate Results sections on product pages.

## Screen map
| Screen | Repo files |
|---|---|
| Products listing | assets/js/site.js (pageProducts), products/index.html |
| CXIQ / DocIQ / OpsIQ / PayIQ detail pages | assets/js/content.js (PRODUCTS array), assets/js/site.js (pageProductDetail, renderDetailPage, ROUTES) |
| Site-wide header/footer/router | assets/js/site.js, footer.html |
