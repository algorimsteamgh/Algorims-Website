import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

// Fully static site (SSG) — no SSR needed. See ASTRO_MIGRATION_PLAN.md.
export default defineConfig({
  site: "https://www.algorims.com",
  trailingSlash: "never",
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => !["/404", "/customer-stories/syslatech"].includes(new URL(page).pathname),
    }),
    tailwind({
      // global.css includes Tailwind's base, components, and utilities.
      // Skip the integration's second copy of those styles.
      applyBaseStyles: false,
    }),
  ],
});
