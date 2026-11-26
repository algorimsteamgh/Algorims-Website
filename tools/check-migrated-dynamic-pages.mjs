import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

for (const collection of ['blog', 'case-studies', 'products', 'solutions']) {
  const entries = readdirSync(new URL(`src/content/${collection}/`, root)).filter(name => name.endsWith('.json'));
  if (collection !== 'solutions') {
    const listing = read(`dist/${collection}/index.html`);
    for (const name of entries) {
      const slug = name.slice(0, -5);
      assert.ok(listing.includes(`/${collection}/${slug}`), `${collection} listing omits ${slug}`);
    }
  }
  for (const name of entries) {
    const slug = name.slice(0, -5);
    const html = read(`dist/${collection}/${slug}/index.html`);
    assert.match(html, /<h1\b[^>]*>.*?<\/h1>/s, `${collection}/${slug} has no heading`);
    assert.doesNotMatch(html, /<script[^>]+(?:site|content)\.js/, `${collection}/${slug} loads the legacy renderer`);
  }
}

const products = read('dist/products/index.html');
assert.equal((products.match(/class="product-row\b/g) ?? []).length, 5);
assert.equal((products.match(/class="app-slide\b/g) ?? []).length, 2);
assert.equal((products.match(/data-app-tab=/g) ?? []).length, 2);
assert.match(products, /id="products-title"/);

for (const [slug, required] of Object.entries({
  cxiq: ['Conversation feed', 'Two stacks, one product', 'One layer between your conversations and your systems', 'Let AI handle the routine. Let your team handle what matters.'],
  dociq: ['Processing feed', 'SGD $212.78', 'ap-southeast-1', 'APRA CPS 234/230', 'Stop paying manual document-keying prices.'],
  opsiq: ['Ticket feed', 'SGD $1,790', 'ap-south-1', 'Privacy Act 1988 / APPs', 'Let AI close the routine tickets.'],
  payiq: ['Posting feed', 'ANZ · Xero', 'One layer between your invoices and your books', 'Let your team review exceptions, not type invoices.'],
})) {
  const html = read(`dist/products/${slug}/index.html`);
  const copyText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
  for (const copy of required) assert.ok(copyText.includes(copy), `products/${slug} omits ${copy}`);
}

console.log('All collection routes and listing links are present.');

const homeCards = read('dist/index.html').match(/<article class="study-card\b[\s\S]*?<\/article>/g) ?? [];
const listingPanels = read('dist/case-studies/index.html').match(/<section\b[^>]*class="showcase-panel\b[\s\S]*?<\/section>/g) ?? [];
const studyLink = /\bhref="(\/case-studies\/[^"/]+)"/;
assert.equal(homeCards.length, 2, 'Homepage should feature two case studies');
for (const [index, card] of homeCards.entries()) {
  const href = card.match(studyLink)?.[1];
  assert.ok(href, `Homepage case study ${index + 1} should link to its detail page`);
  assert.equal(listingPanels[index]?.match(studyLink)?.[1], href, `Case studies showcase should feature ${href} at position ${index + 1}`);
  assert.match(card, /<h3\b/, 'Homepage cards must follow the section h2');
  assert.match(card, /loading="lazy"/, 'Below-the-fold previews should be lazy loaded');
}
console.log('Homepage case study links match the first two showcase entries.');
