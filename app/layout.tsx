import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Script from "next/script";

import { Footer } from "../components/site/Footer";
import { Header } from "../components/site/Header";
import { buildPageMetadata, siteUrl } from "../lib/site-metadata";

import "./globals.css";
import "../assets/css/site.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildPageMetadata({
    title: "Algorims - The Future of Enterprise Is Autonomous. We Build It.",
    description:
      "Algorims builds autonomous, agentic AI systems for the enterprise - AI & Generative AI, Data & Analytics, AWS cloud, DevOps, and managed services that unlock the value buried in your data.",
    path: "/",
  }),
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/assets/algorims-favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} min-h-screen flex flex-col`}>
        <Header />
        {children}
        <Footer />
        <Script id="chtl-config" strategy="afterInteractive">
          {`window.chtlConfig = { chatbotId: "6125825243" };`}
        </Script>
        <Script
          async
          data-id="6125825243"
          id="chtl-script"
          src="https://chatling.ai/js/embed.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
