import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const ccaf = read('cca-f/index.html');
const agentic = read('agentic-ai/index.html');
const notFound = read('404.html');

assert.doesNotMatch(ccaf, /onclick=/);
assert.match(ccaf, /data-dismiss-notice/);
for (let index = 0; index < 5; index++) {
  assert.match(ccaf, new RegExp(`data-toggle-domain="${index}" aria-expanded="false" aria-controls="ccaf-panel-${index}"`));
  assert.match(ccaf, new RegExp(`id="ccaf-panel-${index}" data-ccaf-panel="${index}"`));
  assert.match(ccaf, new RegExp(`data-open-domain="${index}"`));
}
for (let index = 0; index < 6; index++) assert.match(ccaf, new RegExp(`data-scroll-scenario="${index}"`));
assert.match(agentic, /id="hero-spline"/);
assert.match(agentic, /id="spline-loader"/);
assert.match(notFound, /404 · Page not found/);
for (const path of ['/', '/services', '/contact']) assert.match(notFound, new RegExp(`href="${path}"`));
console.log('Migrated static pages: controls and 404 links OK');
