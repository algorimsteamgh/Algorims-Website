#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE = "contact/index.html";
const WRITE = process.argv.includes("--write");
const CHECK = process.argv.includes("--check") || !WRITE;

const usage = () => {
  console.log("Usage: node tools/sync-html-shell.mjs [--check|--write]");
  console.log("Syncs the shared route <body> shell from contact/index.html.");
};

if (process.argv.includes("--help")) {
  usage();
  process.exit(0);
}

const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");

const walk = (dir) => {
  const out = [];
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (rel === "uploads") continue;
    if (entry.isDirectory()) out.push(...walk(rel));
    else if (entry.name === "index.html") out.push(rel);
  }
  return out;
};

const bodyOf = (html, file) => {
  const match = html.match(/<body[\s\S]*?<\/body>/);
  if (!match) throw new Error(`Missing <body> shell in ${file}`);
  return match[0];
};

const sourceBody = bodyOf(read(SOURCE), SOURCE);
const targets = ["404.html", ...walk(".")]
  .map((p) => p.replace(/^\.\//, ""))
  .filter((p) => p !== "index.html")
  .sort();

let changed = 0;
for (const file of targets) {
  const html = read(file);
  const body = bodyOf(html, file);
  if (body === sourceBody) continue;

  changed += 1;
  if (WRITE) {
    fs.writeFileSync(path.join(ROOT, file), html.replace(body, sourceBody));
    console.log(`synced ${file}`);
  } else if (CHECK) {
    console.log(`stale ${file}`);
  }
}

if (CHECK && changed) {
  console.error(`${changed} stale HTML shell(s). Run: node tools/sync-html-shell.mjs --write`);
  process.exit(1);
}

console.log(`${WRITE ? "synced" : "checked"} ${targets.length} route shell(s); ${changed} changed`);
