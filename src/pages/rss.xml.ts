import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getBlogPosts } from "../components/blog/posts";
import { isoDate } from "../lib/schema";

export async function GET(context: APIContext) {
  const posts = await getBlogPosts();
  return rss({
    title: "Algorims Blog",
    description: "Insights on agentic AI, MLOps, AWS cloud, and DevOps engineering from the Algorims team.",
    site: context.site!,
    trailingSlash: false,
    items: posts.map((post) => {
      const date = isoDate(post.data.date);
      return {
        title: post.data.title,
        description: post.data.excerpt,
        link: `/blog/${post.id}`,
        categories: [post.data.category],
        // Posts without a recorded date are listed without pubDate rather than a made-up one.
        ...(date && { pubDate: new Date(date) }),
      };
    }),
  });
}
