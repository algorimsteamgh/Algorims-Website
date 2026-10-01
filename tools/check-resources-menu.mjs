import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';

const layout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
const script = layout.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/import .*?;/g, '');
const code = ts.transpile(script);
for (const hover of [true, false]) {
  const handlers = {};
  let focused = false;
  let hovered = false;
  const child = {};
  const resources = {
    open: false,
    addEventListener: (name, handler) => { handlers[name] = handler; },
    matches: selector => selector === ':hover' ? hovered : focused,
    contains: target => target === child,
    querySelector: () => ({ focus: () => { focused = true; } }),
  };
  runInNewContext(code, {
    document: { querySelector: () => resources, getElementById: () => null },
    matchMedia: () => ({ matches: hover }),
    initNumberTickers() {}, location: { pathname: '/services' }, window: {},
  });
  if (!hover) { assert.equal(Object.keys(handlers).length, 0); continue; }
  handlers.mouseenter(); assert.equal(resources.open, true);
  handlers.mouseleave(); assert.equal(resources.open, false);
  handlers.mouseenter(); focused = true;
  handlers.mouseleave(); assert.equal(resources.open, true);
  handlers.focusout({ relatedTarget: child }); assert.equal(resources.open, true);
  handlers.focusout({ relatedTarget: null }); assert.equal(resources.open, false);
  handlers.mouseenter();
  handlers.keydown({ key: 'Escape' }); assert.equal(resources.open, false);
}
console.log('Resources hover, keyboard dismissal, and touch fallback OK');
