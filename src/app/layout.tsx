import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileDrawer from "@/components/MobileDrawer";

// TAGGING HISTORY — read before touching GOOGLE_ADS_ID below.
//
// 2026-07-29: Google Analytics and the cookie-consent banner were removed.
// GA4 was consent-gated, so it only ever counted visitors who accepted and
// the numbers were structurally low. Its one real advantage was feeding
// conversions to Google Ads, and at the time VDT did not run Ads.
//
// 2026-08-06: VDT started running Ads (Performance Max, "We Can Design Your
// Website"), so the Ads tag below went in. Note what did NOT come back: GA4.
// The campaign needs conversion attribution, not behavioural analytics, and
// traffic measurement stays on Cloudflare Web Analytics, which is cookieless
// and counts everyone. That is why there is still no consent banner.
//
// gtag.js DOES set the first-party _gcl_au advertising cookie. /cookie-policy
// and /privacy-policy were rewritten in the same commit to say so. If you ever
// remove or change this tag, change those two pages with it — they are a
// published promise, not decoration.
//
// Conversions fire from public/lab/contact-card.js on confirmed delivery only.

const SITE_URL = "https://vdtsites.com";

// Google Ads account tag. Conversion labels live with the events that fire
// them, in contact-card.js, not here. The one exception is the phone snippet
// below: it is a config call, not an event, so it has to sit with the tag.
const GOOGLE_ADS_ID = "AW-18345910455";

// Call conversion tracking, added 2026-08-10.
//
// Until now the campaign could only see contact-form submissions. For a local
// trades-facing business the phone is plausibly most of the leads, so every
// bid decision was being made on a partial signal — and reported cost per lead
// was overstated by however many people called instead of typing.
//
// This is the "Calls from a number on your website" conversion. gtag swaps a
// Google forwarding number in for PHONE_NUMBER on sessions that arrived from
// an ad, then reports calls over 30 seconds as conversions. Organic visitors
// keep seeing the real number.
//
// Two things this depends on, both easy to break:
//  - The number must render as TEXT matching PHONE_NUMBER's format. Every page
//    prints it as 250-616-2087 and links it as tel:+12506162087. Change the
//    display format anywhere and the swap silently stops on that page.
//  - The config call must run on every page, which is why it lives here rather
//    than in a component.
//
// Calls placed straight from the ad are a SEPARATE conversion action ("Calls
// from ads") handled by the campaign's call asset. It needs no code.
const PHONE_CONVERSION_LABEL = `${GOOGLE_ADS_ID}/KI5tCITPrd8cELfBgaxE`;
const PHONE_NUMBER = "250-616-2087";

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
        {/* Google tag (gtag.js). PLAIN <script> elements, deliberately NOT
            next/script.

            next/script with strategy="afterInteractive" was tried first and
            looked fine in a browser, but it does NOT emit a <script> element
            server-side — it ships a <link rel="preload"> plus an entry in the
            RSC flight payload, and the real element is only created once React
            hydrates. Anything reading the HTML without running our JS therefore
            sees no tag at all, and Google Ads' own tag detector reported
            "Google tag wasn't detected on vdtsites.com" while the tag was in
            fact working for real visitors.

            Plain elements in <head> are what Google's install instructions ask
            for, and they put the tag in the served HTML where a detector can
            find it. async keeps it off the render path. */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');
gtag('config', '${PHONE_CONVERSION_LABEL}', {
  'phone_conversion_number': '${PHONE_NUMBER}'
});`,
          }}
        />

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

        {/* NOTE: the zoom-hero image preloads used to live here, in the root
            layout, which meant EVERY route paid for them — /contact, the blog,
            the legal pages and the ads landing page all fetched two large
            homepage-only images they never render (the browser flags it as an
            unused preload). They now live in app/page.tsx alongside the
            <picture> elements they actually serve. Keep them there. */}
      </head>
      <body>
        {children}
        {/* One drawer for every route. The three headers (#zoom-header and
            #site-chrome in page.tsx, <PageHeader> on the cream pages) each
            render only a [data-vdt-burger] button; this wires them all. */}
        <MobileDrawer />
      </body>
    </html>
  );
}
