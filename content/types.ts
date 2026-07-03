type RichTextBlock =
  | {
      type: "p" | "h";
      text: string;
    }
  | {
      type: "ul";
      items: string[];
    };

type LinkRef = {
  href: string;
  label: string;
};

type LabelValue = {
  label: string;
  value: string;
};

type FAQ = {
  q: string;
  a: string;
};

type Metric = {
  value: string;
  label: string;
};

type ArchitectureAsset = {
  src: string;
  alt: string;
  caption: string;
};

type SectionPair = {
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
