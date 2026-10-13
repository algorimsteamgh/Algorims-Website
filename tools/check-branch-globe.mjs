import assert from 'node:assert/strict';
import { renderFrame, STATIC_ROTATION, focusRotation } from '../src/components/illustrations/branchGlobe.ts';
import { offices } from '../src/data/offices.ts';

for (const rotation of [STATIC_ROTATION, [0, 0], [180, -30], ...offices.map(({ id }) => focusRotation(offices, id))]) {
  const frame = renderFrame(rotation, [], offices);
  assert.ok(frame.land.startsWith('M'), 'Continents must render at every viewing angle');
  assert.ok(!/NaN|Infinity/.test(frame.land), 'Continents must have finite coordinates');
  assert.equal(frame.arcs.length, offices.length - 1);
  assert.equal(frame.anchors.length, offices.length);
}

const overview = renderFrame(STATIC_ROTATION, [], offices);
assert.ok(overview.anchors.every(({ visible }) => visible), 'All offices remain visible in the static fallback');
assert.equal(renderFrame(STATIC_ROTATION, [], offices, { graticule: false }).graticule, '', 'Mobile can omit the fine grid');
assert.notEqual(overview.land, renderFrame([0, 0], [], offices).land, 'Continents must rotate with the office markers');
console.log('Branch globe geometry checks passed.');
