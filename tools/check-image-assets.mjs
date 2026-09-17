import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function check(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) check(path);
    else if (/\.(html|css)$/.test(entry.name)) {
      for (const [, asset] of readFileSync(path, "utf8").matchAll(/\/assets\/([\w/-]+\.(?:png|webp|svg|jpe?g|gif))/g)) {
        if (!existsSync(join("dist/assets", asset))) throw new Error(`${path}: missing /assets/${asset}`);
      }
    }
  }
}

check("dist");
console.log("Referenced image assets exist.");
