import type { Metadata } from "next";

export const siteUrl = "https://www.algorims.com";
export const defaultOgImage = "/assets/algorims-icon-transparent.png";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

export function buildPageMetadata({
  title,
  description,
  path,
  type = "website",
}: PageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      url: path,
      siteName: "Algorims",
      title,
      description,
      images: [
        {
          url: defaultOgImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },
  };
}
