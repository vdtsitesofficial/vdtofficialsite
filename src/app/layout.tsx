import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://vdtsites.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "VDT Sites: Web Design for Small Business in Nanaimo, BC",
    template: "%s | VDT Sites",
  },
  description:
    "VDT Sites is a two-person web design studio in Nanaimo, BC. We build fast, modern, SEO-ready websites for small businesses.",
  keywords: [
    "web design Nanaimo",
    "small business websites",
    "web developer BC",
    "website design Vancouver Island",
    "VDT Sites",
  ],
  authors: [{ name: "VDT Sites" }],
  creator: "VDT Sites",
  publisher: "VDT Sites",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_URL,
    siteName: "VDT Sites",
    title: "VDT Sites: Web Design for Small Business in Nanaimo, BC",
    description:
      "A two-person web design studio in Nanaimo, BC. Fast, modern, SEO-ready websites for small businesses.",
  },
  twitter: {
    card: "summary_large_image",
    title: "VDT Sites: Web Design for Small Business",
    description:
      "A two-person web design studio in Nanaimo, BC. Fast, modern websites for small businesses.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Site-wide font baseline. The OLD showcase design loaded Fraunces,
            Hanken Grotesk, IBM Plex Mono, and DM Serif Display — those were
            decommissioned when the lab took over the homepage and the blog
            shifted to Cormorant Garamond + Inter. Page-specific fonts
            (Syne, Cormorant Garamond, Unbounded, etc.) are loaded by each
            page's own <link> so they don't ship on every route. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@300..700&display=swap"
          rel="stylesheet"
        />

        {/* Preload the homepage zoom-hero images. They're the largest
            assets above the fold (~3.9 MB on mobile combined) and the
            lab JS waits for both to load before fading out the loading
            overlay. Preloading shaves the perceived blank window on
            slow networks. The bg-image preloads are media-gated so
            phones don't pull the desktop asset and vice versa. */}
        <link
          rel="preload"
          as="image"
          href="/lab/assets/background-mobile.png"
          media="(max-width: 720px)"
        />
        <link
          rel="preload"
          as="image"
          href="/lab/assets/background.png"
          media="(min-width: 721px)"
        />
        <link
          rel="preload"
          as="image"
          href="/lab/assets/laptop-mobile.png"
          media="(max-width: 720px)"
        />
        <link
          rel="preload"
          as="image"
          href="/lab/assets/laptop.png"
          media="(min-width: 721px)"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
