import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

import { cache } from "react";

type LegacyRendererName =
  | "pageHome"
  | "pageAbout"
  | "pageServices"
  | "pageProducts"
  | "pageAgenticAI"
  | "pageCaseStudies"
  | "pageBlog"
  | "pageCCAF"
  | "pageContact"
  | "pageSupport"
  | "pageBlogPost"
  | "pageCaseStudy"
  | "pageSolution";

type LegacyContext = Record<LegacyRendererName, (...args: string[]) => string>;

export const staticLegacyRoutes = {
  about: {
    title: "About - Algorims",
    description:
      "Algorims is an AWS Advanced Consulting Partner engineering autonomous AI, data, and cloud systems for the enterprise.",
    render: "pageAbout",
  },
  services: {
    title: "Services - Algorims",
    description:
      "AI & Generative AI, Data & Analytics, AWS cloud engineering, DevOps, application development and managed services from Algorims.",
    render: "pageServices",
  },
  products: {
    title: "Products - Algorims",
    description:
      "Explore Algorims products - AI-powered platforms that turn enterprise data into autonomous, measurable outcomes.",
    render: "pageProducts",
  },
  "agentic-ai": {
    title: "Agentic AI - Algorims",
    description:
      "Beyond automation: Algorims builds agentic AI systems that reason, decide, and act autonomously on Amazon Nova, Kendra and S3 Vectors.",
    render: "pageAgenticAI",
  },
  "cca-f": {
    title: "CCA-F Study Overview - Algorims",
    description:
      "Independent CCA-F study overview with domain summaries, preparation roadmap, and official Anthropic learning links.",
    render: "pageCCAF",
  },
  contact: {
    title: "Contact - Algorims",
    description:
      "Get in touch with Algorims to scope your AI, cloud, or DevOps initiative. Most engagements start with a 30-minute conversation.",
    render: "pageContact",
  },
  support: {
    title: "Support - Algorims",
    description:
      "Algorims support - submit a ticket or reach our engineers for AWS, DevOps, security, and infrastructure issues.",
    render: "pageSupport",
  },
} satisfies Record<
  string,
  {
    title: string;
    description: string;
    render: LegacyRendererName;
  }
>;

export const collectionLegacyRoutes = {
  blog: {
    title: "Blog - Algorims",
    description:
      "Insights on agentic AI, MLOps, AWS cloud, and DevOps engineering from the Algorims team.",
    render: "pageBlog",
  },
  "case-studies": {
    title: "Case Studies - Algorims",
    description:
      "Real-world results from Algorims - agentic AI, cloud, and data engineering case studies with measured business impact.",
    render: "pageCaseStudies",
  },
} satisfies Record<
  string,
  {
    title: string;
    description: string;
    render: LegacyRendererName;
  }
>;

const postprocessLegacyHtml = (html: string) =>
  html
    .replace(/\bbtn-primary\b/g, "btn-hero")
    .replace(/<spline-viewer[\s\S]*?<\/spline-viewer>/, '<div data-agentic-spline></div>');

const createStubElement = () => ({
  nodeType: 1,
  className: "",
  innerHTML: "",
  setAttribute() {},
  addEventListener() {},
  append() {},
  remove() {},
  classList: {
    add() {},
    remove() {},
    contains() {
      return false;
    },
  },
  style: {},
});

const loadLegacyContext = cache((): LegacyContext => {
  const contentPath = path.join(process.cwd(), "assets/js/content.js");
  const sitePath = path.join(process.cwd(), "assets/js/site.js");
  const contentSrc = fs.readFileSync(contentPath, "utf8");
  const siteSrc = fs.readFileSync(sitePath, "utf8");
  const cut = siteSrc.indexOf("/* ---------- Router ---------- */");
  if (cut === -1) {
    throw new Error("Failed to isolate legacy page renderers");
  }

  const sandbox = {
    console,
    window: {},
    document: {
      createElement: createStubElement,
      createTextNode: (text: string) => ({ nodeType: 3, textContent: text }),
      querySelector: () => null,
    },
    navigator: {},
    location: { href: "https://www.algorims.com/" },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
    },
    setTimeout,
    clearTimeout,
    URL,
  };

  vm.createContext(sandbox);
  vm.runInContext(
    `${contentSrc}\n${siteSrc.slice(0, cut)}\nthis.__legacy = {
      pageHome,
      pageAbout,
      pageServices,
      pageProducts,
      pageAgenticAI,
      pageCaseStudies,
      pageBlog,
      pageCCAF,
      pageContact,
      pageSupport,
      pageBlogPost,
      pageCaseStudy,
      pageSolution
    };`,
    sandbox,
  );

  return (sandbox as typeof sandbox & { __legacy: LegacyContext }).__legacy;
});

export const renderLegacyPage = (
  rendererName: LegacyRendererName,
  ...args: string[]
) => {
  const renderer = loadLegacyContext()[rendererName];
  if (!renderer) {
    throw new Error(`Legacy renderer not found: ${rendererName}`);
  }
  return postprocessLegacyHtml(renderer(...args));
};
