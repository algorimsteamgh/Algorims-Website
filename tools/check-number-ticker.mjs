import assert from 'node:assert/strict';
import { tickerFrame } from '../src/scripts/numberTicker.ts';

assert.equal(tickerFrame('40+', 0), '01+');
assert.equal(tickerFrame('99.9%', .5), '50.0%');
assert.equal(tickerFrame('99.99%', 1), '99.99%');
assert.equal(tickerFrame('24/7', .5), '12/7');
assert.equal(tickerFrame('7+', 1), '07+');
