import { getCollection } from "astro:content";

// Preserve the editorial order from the former BLOG_POSTS array.
const order = [
  "transforming-businesses-with-ai-ml-and-generative-ai",
  "unlocking-business-growth-with-aws-cloud-consulting",
  "driving-digital-transformation-with-microsoft-azure",
  "driving-innovation-with-devops-agile-devsecops-and-scrum",
  "smart-cloud-migration-and-optimization",
  "architecture-of-an-enterprise-ai-agent",
  "rag-isnt-the-answer-what-comes-after-retrieval",
  "internal-platforms-engineers-actually-want-to-use",
  "typed-everything-strict-types-across-the-stack",
];

export async function getBlogPosts() {
  const posts = await getCollection("blog");
  return posts.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}
