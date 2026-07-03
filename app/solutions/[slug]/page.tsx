import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegacyEnhancements } from "../../../components/site/LegacyEnhancements";
import { LegacyMarkup } from "../../../components/site/LegacyMarkup";
import { renderLegacyPage } from "../../../lib/legacy-pages";
import { buildPageMetadata } from "../../../lib/site-metadata";
import { solutions, solutionsBySlug } from "../../../content/solutions";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = solutionsBySlug[slug];
  if (!solution) {
    return {};
  }
  return buildPageMetadata({
    title: `${solution.title} - Algorims`,
    description: solution.subtitle,
    path: `/solutions/${slug}`,
    type: "article",
  });
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!solutionsBySlug[slug]) {
    notFound();
  }

  return (
    <main className="flex-1 pt-24">
      <LegacyEnhancements />
      <LegacyMarkup html={renderLegacyPage("pageSolution", slug)} />
    </main>
  );
}
