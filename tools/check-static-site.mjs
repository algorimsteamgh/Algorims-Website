#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const files = [];
const failures = [];

const fail = (message) => failures.push(message);
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const count = (text, needle) => text.split(needle).length - 1;
const countScript = (html, src) => {
  const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return [...html.matchAll(new RegExp(`<script\\s+src="${escaped}(?:\\?[^"]+)?"\\s+defer><\\/script>`, "g"))].length;
};

const walk = (dir) => {
  for (const entry of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(rel);
    else if (entry.name === "index.html") files.push(rel.replace(/^\.\//, ""));
  }
};

const bodyOf = (html, file) => {
  const match = html.match(/<body[\s\S]*?<\/body>/);
  if (!match) fail(`${file}: missing <body> shell`);
  return match?.[0] || "";
};

walk(".");
files.push("404.html");
files.sort();

for (const file of ["assets/css/site.css", "assets/js/content.js", "assets/js/site.js", "footer.html"]) {
  if (!fs.existsSync(path.join(ROOT, file))) fail(`missing ${file}`);
}

for (const file of ["assets/js/content.js", "assets/js/site.js"]) {
  try {
    new vm.Script(read(file), { filename: file });
  } catch (error) {
    fail(`${file}: ${error.message}`);
  }
}

const sourceBody = bodyOf(read("contact/index.html"), "contact/index.html");

for (const file of files) {
  const html = read(file);
  const contentAt = html.indexOf('/assets/js/content.js');
  const siteAt = html.indexOf('/assets/js/site.js');

  if (count(html, '<link rel="stylesheet" href="/assets/css/site.css" />') !== 1) {
    fail(`${file}: expected one site.css link`);
  }
  if (countScript(html, "/assets/js/content.js") !== 1) {
    fail(`${file}: expected one content.js script`);
  }
  if (countScript(html, "/assets/js/site.js") !== 1) {
    fail(`${file}: expected one site.js script`);
  }
  if (!(contentAt >= 0 && siteAt > contentAt)) {
    fail(`${file}: content.js must load before site.js`);
  }
  if (html.includes("/* ---------- tiny helpers ---------- */")) {
    fail(`${file}: app script is still inline`);
  }
  if (count(html, "<style>") !== 0) {
    fail(`${file}: main style block is still inline`);
  }
  if (count(html, '<style id="__om-edit-overrides">') > 1) {
    fail(`${file}: expected at most one override style block`);
  }
  if (count(html, "<div data-footer></div>") !== 1) {
    fail(`${file}: expected one shared footer placeholder`);
  }
  if (html.includes('<footer class="relative mt-32 border-t border-border bg-secondary/40">')) {
    fail(`${file}: footer markup should live in footer.html`);
  }

  const chatCount = count(html, "window.chtlConfig");
  if (file === "index.html" ? chatCount !== 1 : chatCount !== 0) {
    fail(`${file}: Chatling should exist only on root index.html`);
  }

  if (file !== "index.html" && bodyOf(html, file) !== sourceBody) {
    fail(`${file}: route body shell drifted from contact/index.html`);
  }
}

if (read("assets/js/site.js").match(/["'`]assets\//)) {
  fail("assets/js/site.js: generated asset URLs must be absolute /assets/... paths");
}

const contentContext = vm.createContext({});
vm.runInContext(read("assets/js/content.js"), contentContext);
const contentCounts = vm.runInContext(
  "[BLOG_POSTS.length, CASE_STUDIES.length, SOLUTIONS.length, Object.keys(CASE_SCENES).length]",
  contentContext,
);
if (contentCounts.join(",") !== "9,7,3,5") {
  fail(`assets/js/content.js: unexpected content counts ${contentCounts.join(",")}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`checked ${files.length} HTML files, shared assets, content globals, and shell sync`);
