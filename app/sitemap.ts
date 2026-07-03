import type { MetadataRoute } from "next";

import { blogPosts } from "../content/blog";
import { caseStudies } from "../content/case-studies";
import { solutions } from "../content/solutions";
import { collectionLegacyRoutes, staticLegacyRoutes } from "../lib/legacy-pages";
import { siteUrl } from "../lib/site-metadata";

const staticPaths = ["/", ...Object.keys(staticLegacyRoutes).map((slug) => `/${slug}`)];
const collectionPaths = Object.keys(collectionLegacyRoutes).map((slug) => `/${slug}`);
const blogPaths = blogPosts.map((post) => `/blog/${post.slug}`);
const caseStudyPaths = caseStudies.map((study) => `/case-studies/${study.slug}`);
const solutionPaths = solutions.map((solution) => `/solutions/${solution.slug}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    ...staticPaths,
    ...collectionPaths,
    ...blogPaths,
    ...caseStudyPaths,
    ...solutionPaths,
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
  }));
}
