import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LAB_V } from "@/lib/labVersion";

const SITE_URL = "https://vdtsites.com";

// viewport-fit=cover lets the page draw into the notch / home-bar safe-area
// insets on modern phones; themeColor tints the mobile browser chrome cream.
export const viewport: Viewport = {
  themeColor: "#f4efe6",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Website Design Nanaimo & Vancouver Island | VDT Sites",
    template: "%s | VDT Sites",
  },
  description:
    "Custom website design for small businesses in Nanaimo and across Vancouver Island. Fast, modern, SEO-ready websites that turn visitors into customers.",
  keywords: [
    "website design Nanaimo",
    "web design Nanaimo",
    "website design Vancouver Island",
    "web design Vancouver Island",
    "Nanaimo web designer",
    "small business websites",
    "web developer BC",
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
    title: "Website Design Nanaimo & Vancouver Island | VDT Sites",
    description:
      "Custom website design for small businesses in Nanaimo and across Vancouver Island. Fast, modern, SEO-ready websites that turn visitors into customers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Design Nanaimo & Vancouver Island | VDT Sites",
    description:
      "Custom website design for small businesses in Nanaimo and across Vancouver Island.",
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
          href={`/lab/assets/background-mobile.png?v=${LAB_V}`}
          media="(max-width: 720px)"
        />
        <link
          rel="preload"
          as="image"
          href={`/lab/assets/background.png?v=${LAB_V}`}
          media="(min-width: 721px)"
        />
        <link
          rel="preload"
          as="image"
          href={`/lab/assets/laptop-mobile.png?v=${LAB_V}`}
          media="(max-width: 720px)"
        />
        <link
          rel="preload"
          as="image"
          href={`/lab/assets/laptop.png?v=${LAB_V}`}
          media="(min-width: 721px)"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
