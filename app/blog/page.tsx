import type { Metadata } from "next";

import { LegacyEnhancementsLoader as LegacyEnhancements } from "../../components/site/LegacyEnhancementsLoader";
import { LegacyMarkup } from "../../components/site/LegacyMarkup";
import { collectionLegacyRoutes, renderLegacyPage } from "../../lib/legacy-pages";
import { buildPageMetadata } from "../../lib/site-metadata";

const route = collectionLegacyRoutes.blog;

export const metadata: Metadata = buildPageMetadata({
  title: route.title,
  description: route.description,
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <main className="flex-1 pt-24">
      <LegacyEnhancements />
      <LegacyMarkup html={renderLegacyPage(route.render)} />
    </main>
  );
}
