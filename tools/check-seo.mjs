import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dist = new URL("../dist/", import.meta.url).pathname;
const site = "https://www.algorims.com";
const read = (file) => readFileSync(join(dist, file), "utf8");
const tag = (html, pattern) => html.match(pattern)?.[1];
const unescape = (value) => value.replaceAll("&#39;", "'").replaceAll("&quot;", '"').replaceAll("&amp;", "&");
const canonicals = new Set();

for (const file of readdirSync(dist, { recursive: true }).filter((file) => file.endsWith(".html"))) {
  const html = read(file);
  const title = tag(html, /<title>([^<]+)<\/title>/);
  const description = tag(html, /<meta name="description" content="([^"]+)"/);
  const canonical = tag(html, /<link rel="canonical" href="([^"]+)"/);
  assert(title && description && canonical, `${file}: missing metadata`);
  assert.equal(unescape(tag(html, /<meta property="og:title" content="([^"]+)"/)), unescape(title), `${file}: OG title`);
  assert.equal(tag(html, /<meta property="og:description" content="([^"]+)"/), description, `${file}: OG description`);
  assert.equal(tag(html, /<meta property="og:url" content="([^"]+)"/), canonical, `${file}: OG URL`);
  assert(!html.includes("PASTE-YOUR-CODE-HERE"), `${file}: placeholder verification code`);
  if (file === "404.html") {
    assert(html.includes('name="robots" content="noindex, follow"'), "404 must be noindex");
  } else {
    assert.equal(canonical, site + (file === "index.html" ? "/" : `/${file.replace(/\/index\.html$/, "")}`));
    canonicals.add(canonical);
  }
}

const sitemap = read("sitemap-0.xml");
const urls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] === site ? `${site}/` : match[1]));
assert.deepEqual(urls, canonicals, "sitemap routes must match canonical pages");
assert(read("robots.txt").includes(`${site}/sitemap-index.xml`), "robots.txt must point to sitemap index");
console.log(`SEO check passed: ${canonicals.size} indexable pages`);
