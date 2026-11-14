import { offices } from "../data/offices";

const SITE = "https://www.algorims.com";
const abs = (path: string) => new URL(path, SITE).toString();

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "Algorims",
  url: `${SITE}/`,
  logo: abs("/assets/algorims-icon-transparent.webp"),
  sameAs: ["https://www.linkedin.com/company/algorims/"],
  location: offices.map((office) => ({
    "@type": "Place",
    name: `Algorims ${office.city}`,
    address: { "@type": "PostalAddress", addressLocality: office.city, addressCountry: office.country, streetAddress: office.lines.join(", ") },
    geo: { "@type": "GeoCoordinates", latitude: office.lat, longitude: office.lon },
  })),
});

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE}/#website`,
  url: `${SITE}/`,
  name: "Algorims",
  publisher: { "@id": `${SITE}/#organization` },
});

export const breadcrumbSchema = (crumbs: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, index) => ({ "@type": "ListItem", position: index + 1, name: crumb.name, item: abs(crumb.path) })),
});

/** Parses legacy display dates ("Sep 1, 2025"); returns undefined for blanks. */
export const isoDate = (display?: string) => {
  if (!display) return undefined;
  const parsed = new Date(`${display} 12:00:00 UTC`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString().slice(0, 10);
};

export const blogPostingSchema = (post: { id: string; title: string; excerpt: string; author: string; date?: string }) => {
  const published = isoDate(post.date);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: abs(`/blog/${post.id}`),
    mainEntityOfPage: abs(`/blog/${post.id}`),
    image: abs(`/og/blog/${post.id}.png`),
    author: { "@type": "Organization", name: post.author },
    publisher: { "@id": `${SITE}/#organization` },
    ...(published && { datePublished: published, dateModified: published }),
  };
};
