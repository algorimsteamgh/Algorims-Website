import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../dist/${path}`, import.meta.url), 'utf8');
const ccaf = read('cca-f/index.html');
const agentic = read('agentic-ai/index.html');
const notFound = read('404.html');

assert.doesNotMatch(ccaf, /onclick=/);
assert.equal((ccaf.match(/<details class="ccaf-domain"/g) ?? []).length, 5);
assert.equal((ccaf.match(/<article\b/g) ?? []).length, 6);
for (const target of ['domains', 'resources']) assert.match(ccaf, new RegExp(`href="#${target}"`));
assert.match(agentic, /id="agentic-title"/);
assert.match(agentic, /id="how-it-works"/);
assert.doesNotMatch(agentic, /spline-viewer/);
assert.match(notFound, /404 · Page not found/);
for (const path of ['/', '/services', '/contact']) assert.match(notFound, new RegExp(`href="${path}"`));
console.log('Migrated static pages: native controls and 404 links OK');
