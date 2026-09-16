import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

// Fully static site (SSG) — no SSR needed. See ASTRO_MIGRATION_PLAN.md.
export default defineConfig({
  site: "https://www.algorims.com",
  output: "static",
  integrations: [
    tailwind({
      // We hand-roll tailwind.config.mjs (ported from the per-page inline
      // config) and site.css already defines the design tokens, so skip
      // Astro's generated base stylesheet to avoid double-loading resets.
      applyBaseStyles: false,
    }),
  ],
});
