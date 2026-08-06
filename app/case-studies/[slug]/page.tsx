import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegacyEnhancementsLoader as LegacyEnhancements } from "../../../components/site/LegacyEnhancementsLoader";
import { LegacyMarkup } from "../../../components/site/LegacyMarkup";
import { caseStudies, caseStudiesBySlug } from "../../../content/case-studies";
import { renderLegacyPage } from "../../../lib/legacy-pages";
import { buildPageMetadata } from "../../../lib/site-metadata";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudiesBySlug[slug];
  if (!study) {
    return {};
  }
  return buildPageMetadata({
    title: `${study.title} - Algorims`,
    description: study.subtitle,
    path: `/case-studies/${slug}`,
    type: "article",
  });
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!caseStudiesBySlug[slug]) {
    notFound();
  }

  return (
    <main className="flex-1 pt-24">
      <LegacyEnhancements />
      <LegacyMarkup html={renderLegacyPage("pageCaseStudy", slug)} />
    </main>
  );
}
