import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const layout = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
const script = layout.match(/<script is:inline>\s*([\s\S]*?algorims-theme[\s\S]*?)<\/script>/)?.[1];
assert.ok(script, "theme initialization script exists");

for (const [saved, systemDark, expected] of [
  [null, false, false],
  [null, true, true],
  ["light", true, false],
  ["dark", false, true],
]) {
  let actual;
  runInNewContext(script, {
    localStorage: { getItem: () => saved },
    matchMedia: () => ({ matches: systemDark }),
    document: { documentElement: { classList: { toggle: (_, value) => { actual = value; } } } },
  });
  assert.equal(actual, expected);
}
console.log("Theme preference check passed");
