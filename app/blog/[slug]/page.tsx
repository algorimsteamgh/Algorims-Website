import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegacyEnhancementsLoader as LegacyEnhancements } from "../../../components/site/LegacyEnhancementsLoader";
import { LegacyMarkup } from "../../../components/site/LegacyMarkup";
import { blogPosts, blogPostsBySlug } from "../../../content/blog";
import { renderLegacyPage } from "../../../lib/legacy-pages";
import { buildPageMetadata } from "../../../lib/site-metadata";

type Params = {
  slug: string;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsBySlug[slug];
  if (!post) {
    return {};
  }
  return buildPageMetadata({
    title: `${post.title} - Algorims`,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  if (!blogPostsBySlug[slug]) {
    notFound();
  }

  return (
    <main className="flex-1 pt-24">
      <LegacyEnhancements />
      <LegacyMarkup html={renderLegacyPage("pageBlogPost", slug)} />
    </main>
  );
}
