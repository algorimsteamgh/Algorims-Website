import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegacyEnhancements } from "../../components/site/LegacyEnhancements";
import { LegacyMarkup } from "../../components/site/LegacyMarkup";
import { renderLegacyPage, staticLegacyRoutes } from "../../lib/legacy-pages";
import { buildPageMetadata } from "../../lib/site-metadata";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return Object.keys(staticLegacyRoutes).map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const route =
      staticLegacyRoutes[slug as keyof typeof staticLegacyRoutes];
    if (!route) {
      return {};
    }
    return buildPageMetadata({
      title: route.title,
      description: route.description,
      path: `/${slug}`,
    });
  });
}

export default async function StaticLegacyRoutePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const route =
    staticLegacyRoutes[slug as keyof typeof staticLegacyRoutes];
  if (!route) {
    notFound();
  }

  const html = renderLegacyPage(route.render);

  return (
    <main key={slug} className="flex-1 pt-24">
      <LegacyEnhancements
        key={`legacy-enhancements-${slug}`}
        agenticAi={slug === "agentic-ai"}
        ccaf={slug === "cca-f"}
      />
      <LegacyMarkup key={`legacy-markup-${slug}`} html={html} />
    </main>
  );
}
