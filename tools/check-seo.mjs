import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
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
  } else if (file === "customer-stories/icea/index.html") {
    assert(html.includes('name="robots" content="noindex, follow"'), "Island City draft must be noindex");
  } else {
    assert.equal(canonical, site + (file === "index.html" ? "/" : `/${file.replace(/\/index\.html$/, "")}`));
    canonicals.add(canonical);
    const slug = file === "index.html" ? "home" : file.replace(/\/index\.html$/, "");
    const image = tag(html, /<meta property="og:image" content="([^"]+)"/);
    assert.equal(image, `${site}/og/${slug}.png`, `${file}: per-page OG image`);
    assert(existsSync(join(dist, `og/${slug}.png`)), `${file}: OG image file missing`);
    assert.equal(tag(html, /<meta name="twitter:image" content="([^"]+)"/), image, `${file}: twitter image`);
    assert(html.includes(`<link rel="alternate" hreflang="en" href="${canonical}"`), `${file}: hreflang en`);
    assert(html.includes(`<link rel="alternate" hreflang="x-default" href="${canonical}"`), `${file}: hreflang x-default`);
    const types = [...html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)].map((m) => JSON.parse(m[1])["@type"]);
    assert(types.includes("Organization"), `${file}: Organization JSON-LD`);
    if (/^blog\/[^/]+\//.test(file)) assert(types.includes("BlogPosting") && types.includes("BreadcrumbList"), `${file}: article JSON-LD`);
    if (/^(blog|solutions|products|case-studies)\/[^/]+\//.test(file)) assert(types.includes("BreadcrumbList"), `${file}: breadcrumbs`);
  }
}

const sitemap = read("sitemap-0.xml");
const urls = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1] === site ? `${site}/` : match[1]));
assert.deepEqual(urls, canonicals, "sitemap routes must match canonical pages");
const feed = read("rss.xml");
assert(feed.includes("<item>") && feed.includes(`${site}/blog/`), "rss.xml must list blog posts");
assert(!/<script type="application\/ld\+json"/.test(read("404.html")), "noindex pages must not emit JSON-LD");
assert(read("robots.txt").includes(`${site}/sitemap-index.xml`), "robots.txt must point to sitemap index");
console.log(`SEO check passed: ${canonicals.size} indexable pages`);
