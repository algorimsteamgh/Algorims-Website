export type RichTextBlock =
  | {
      type: "p" | "h";
      text: string;
    }
  | {
      type: "ul";
      items: string[];
    };

export type LinkRef = {
  href: string;
  label: string;
};

export type LabelValue = {
  label: string;
  value: string;
};

export type FAQ = {
  q: string;
  a: string;
};

export type Metric = {
  value: string;
  label: string;
};

export type ArchitectureAsset = {
  src: string;
  alt: string;
  caption: string;
};

export type SectionPair = {
  h: string;
  p: string;
};

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  read: string;
  author: string;
  art: string;
  featured?: boolean;
  body: RichTextBlock[];
};

export type CaseScene = {
  alt: string;
  caption: string;
};

export type NarrativeEntry = {
  slug: string;
  source: LinkRef;
  kind: string;
  tag: string;
  title: string;
  subtitle: string;
  glyph: string;
  accent: string;
  meta: LabelValue[];
  intro: string[];
  challenge: {
    lead: string;
    items: string[];
  };
  solutionTitle?: string;
  solutionLead: string;
  solution: SectionPair[];
  tech?: string[];
  architecture?: ArchitectureAsset;
  awsLead?: string;
  aws?: Array<{
    name: string;
    desc: string;
  }>;
  results: string[];
  metrics: Metric[];
  faqs?: FAQ[];
  related: string[];
};

export type ProductFeature = {
  icon: string;
  label: string;
  desc: string;
};

export type ProductMode = {
  icon: string;
  title: string;
  desc: string;
};

export type ProductSafetyItem = {
  icon: string;
  label: string;
};

export type ProductCTA = {
  label: string;
  href: string;
};

export type Product = {
  id: string;
  name: string;
  status: string;
  live: boolean;
  tagline: string;
  body: string;
  bgFrom: string;
  bgTo: string;
  accent: string;
  logoBg: string;
  glyph?: string;
  logo?: string;
  features?: ProductFeature[];
  modes?: ProductMode[];
  safety?: ProductSafetyItem[];
  readMore?: string;
  cta?: ProductCTA;
  comingSoon?: boolean;
};
