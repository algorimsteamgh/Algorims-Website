import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const layout = readFileSync(new URL("../src/layouts/BaseLayout.astro", import.meta.url), "utf8");
assert.doesNotMatch(layout, /theme-toggle|algorims-theme|prefers-color-scheme/, "light theme is fixed and the toggle is hidden");
console.log("Light theme check passed");
