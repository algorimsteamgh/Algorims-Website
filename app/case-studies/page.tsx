import type { Metadata } from "next";

import { LegacyEnhancementsLoader as LegacyEnhancements } from "../../components/site/LegacyEnhancementsLoader";
import { LegacyMarkup } from "../../components/site/LegacyMarkup";
import { collectionLegacyRoutes, renderLegacyPage } from "../../lib/legacy-pages";
import { buildPageMetadata } from "../../lib/site-metadata";

const route = collectionLegacyRoutes["case-studies"];

export const metadata: Metadata = buildPageMetadata({
  title: route.title,
  description: route.description,
  path: "/case-studies",
});

export default function CaseStudiesIndexPage() {
  return (
    <main className="flex-1 pt-24">
      <LegacyEnhancements />
      <LegacyMarkup html={renderLegacyPage(route.render)} />
    </main>
  );
}
