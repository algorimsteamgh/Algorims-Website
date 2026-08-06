import { LegacyEnhancementsLoader as LegacyEnhancements } from "../components/site/LegacyEnhancementsLoader";
import { LegacyMarkup } from "../components/site/LegacyMarkup";
import { renderLegacyPage } from "../lib/legacy-pages";
import { buildPageMetadata } from "../lib/site-metadata";

export const metadata = buildPageMetadata({
  title: "Algorims - The Future of Enterprise Is Autonomous. We Build It.",
  description:
    "Algorims builds autonomous, agentic AI systems for the enterprise - AI & Generative AI, Data & Analytics, AWS cloud, DevOps, and managed services that unlock the value buried in your data.",
  path: "/",
});

export default function HomePage() {
  return (
    <main className="flex-1 pt-24">
      <LegacyEnhancements />
      <LegacyMarkup html={renderLegacyPage("pageHome")} />
    </main>
  );
}
