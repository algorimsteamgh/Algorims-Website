import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { staticOgCards, type OgCard } from "../../data/ogPages";
import { renderOgCard } from "../../lib/og";

const clip = (text: string, max = 130) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

export const getStaticPaths = (async () => {
  const cards: Record<string, OgCard> = { ...staticOgCards };
  for (const entry of await getCollection("blog")) {
    cards[`blog/${entry.id}`] = { kicker: entry.data.category, title: entry.data.title, description: clip(entry.data.excerpt) };
  }
  for (const [collection, kicker] of [["solutions", "Solution"], ["products", "Product"], ["case-studies", "Case study"]] as const) {
    for (const entry of await getCollection(collection)) {
      const data = entry.data as { title: string; subtitle?: string };
      cards[`${collection}/${entry.id}`] = { kicker, title: data.title, description: data.subtitle && clip(data.subtitle) };
    }
  }
  return Object.entries(cards).map(([slug, card]) => ({ params: { slug }, props: { card } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderOgCard(props.card as OgCard)), { headers: { "Content-Type": "image/png" } });
