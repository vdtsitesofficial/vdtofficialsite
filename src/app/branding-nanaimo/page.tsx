import type { Metadata } from "next";
import ServiceLanding, { InLink } from "@/components/ServiceLanding";
import { PRICE_BRAND_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";
import { OG_IMAGE } from "@/lib/og";

/**
 * /branding-nanaimo
 *
 * Added 2026-10-11 from Search Console (3 months to Oct 10):
 *   branding packages nanaimo      108 impr  pos 35
 *   business card design nanaimo   103 impr  pos 17.5
 *   print design nanaimo           104 impr  pos 27
 *   graphic design nanaimo          96 impr  pos 58
 *   branding strategy nanaimo       37 impr  pos 92
 *   design studio nanaimo           55 impr  pos 59
 *
 * /logo-design-nanaimo keeps "logo design"; this page owns "branding
 * package" and business card design, and points back to it.
 *
 * Same positioning as the logo page (Sem, 2026-08-05): kit-led, the kit
 * includes the website, no standalone logo price. KIT mirrors
 * BRAND_INCLUDED on /services word for word, and cards are a print-ready
 * DESIGN, not printing (commit 1b614b9). Do not widen "print design" into
 * services VDT does not sell (signage production, brochures, printing).
 */

export const metadata: Metadata = {
  title: "Branding Packages in Nanaimo, BC",
  description:
    "Branding packages in Nanaimo: logo, business card design, invoice template, brand typefaces and your website, designed together for one price.",
  keywords: [
    "branding packages nanaimo",
    "business card design nanaimo",
    "brand identity nanaimo",
    "graphic design nanaimo",
    "print design nanaimo",
  ],
  alternates: { canonical: "/branding-nanaimo" },
  openGraph: {
    images: [OG_IMAGE],
    title: "Branding Packages in Nanaimo, BC | VDT Sites",
    description:
      "Logo, business card design, invoice template, typefaces and your website, designed together for one price.",
    url: "/branding-nanaimo",
  },
  twitter: {
    title: "Branding Packages in Nanaimo, BC | VDT Sites",
    description:
      "Logo, business card design, invoice template, typefaces and your website, designed together for one price.",
  },
};

/* Mirrors BRAND_INCLUDED on /services. Change both or neither. */
const KIT = [
  "A custom logo, in every format you need for web, print and signage",
  "Print-ready business card design, ready to be professionally printed",
  "A branded, editable invoice template",
  "Brand typefaces chosen and set up across your site",
  "And the website itself, designed around the brand rather than bolted onto it",
];

const FAQS = [
  {
    q: "What is in a branding package?",
    a: `Ours is the Full Brand Kit at ${PRICE_BRAND_FROM} ${CURRENCY}: a custom logo in every format, print-ready business card design, a branded editable invoice template, brand typefaces, and the website itself, all designed together. Hosting, your domain and support are ${PRICE_MONTHLY} a month after that, the same as every site we build.`,
  },
  {
    q: "Do you print the business cards?",
    a: "We design them and hand over print-ready files, so any print shop in Nanaimo or online can print them exactly as designed. You choose the printer and the paper, and you never get stuck because a shop asked for a file you do not have.",
  },
  {
    q: "Can you refresh our existing brand instead of starting over?",
    a: "Yes, and it is often the better brief. A refresh keeps the recognition your business has already earned while fixing what has dated. Send what you have and we will tell you honestly whether it needs a refresh or a restart.",
  },
  {
    q: "Do I own the logo and brand files?",
    a: "Yes. Once the project is paid in full the logo, the files and the website are yours outright. No licensing fee and no asking permission to put your logo on a truck.",
  },
  {
    q: "Why design the brand and website together?",
    a: "Because a brand and a site designed apart always look it. When the same people design both, the logo is built to sit on the site, the colours and typefaces carry through, and your business looks like one company everywhere a customer runs into it.",
  },
];

export default function BrandingNanaimoPage() {
  return (
    <ServiceLanding
      path="/branding-nanaimo"
      eyebrow="Branding Packages"
      h1="Branding packages in Nanaimo, website included."
      breadcrumbName="Branding Packages in Nanaimo"
      serviceName="Branding Package (Full Brand Kit)"
      serviceType="Brand identity package for small businesses: custom logo, business card design, invoice template, brand typefaces and website"
      description="Branding packages in Nanaimo, BC: custom logo, print-ready business card design, invoice template, brand typefaces and the website, designed together by VDT Sites."
      intro={
        <p>
          A brand is everything a customer sees: the logo, the business card,
          the invoice, the typefaces and the website. Our branding package
          designs all of them together so they read as one company, at{" "}
          {PRICE_BRAND_FROM} {CURRENCY} with the website included.
        </p>
      }
      sections={[
        {
          eyebrow: `The Full Brand Kit · ${PRICE_BRAND_FROM}`,
          heading: "One package, the whole identity",
          ticks: KIT,
          body: (
            <p>
              Every item and what the website build itself includes is listed
              on the <InLink href="/pricing">pricing page</InLink>. If you
              mainly need the logo, the{" "}
              <InLink href="/logo-design-nanaimo">logo design page</InLink>{" "}
              goes into how we approach it.
            </p>
          ),
        },
        {
          eyebrow: "Business cards and print",
          heading: "Business card design that is ready for the printer",
          body: (
            <>
              <p>
                Your cards are designed alongside the logo, in the same
                colours and typefaces as the site, and handed over as
                print-ready files. Take them to any Nanaimo print shop or an
                online printer and they come out exactly as designed.
              </p>
              <p>
                The logo comes in every format you need for web, print and
                signage, so the next thing you print, a sign, a shirt, a truck
                decal, already has the right file waiting.
              </p>
            </>
          ),
        },
        {
          eyebrow: "Why together",
          heading: "Why the brand and the website are one job",
          body: (
            <>
              <p>
                The most common brand problem we see in Nanaimo is not a bad
                logo. It is a decent logo, a website built by someone else two
                years later, social templates from a third place, and an
                invoice that matches none of it. Every piece was fine, and the
                company still looks assembled from parts.
              </p>
              <p>
                Designing the identity and the site together fixes that at the
                root. You can see the approach across{" "}
                <InLink href="/work">our client builds</InLink>, like{" "}
                <InLink href="/work/horizon-hues">Horizon Hues</InLink>, a
                Nanaimo electrical contractor we built a logo, a brand and a
                website for from scratch.
              </p>
            </>
          ),
        },
      ]}
      faqs={FAQS}
      ctaHeading="Show us what your business looks like today."
      ctaBody="Send whatever exists: the current logo, the site, a photo of the truck. We will tell you honestly what is worth keeping, what is dating you, and exactly what the package would cost. Free, and no obligation attached to it."
    />
  );
}
