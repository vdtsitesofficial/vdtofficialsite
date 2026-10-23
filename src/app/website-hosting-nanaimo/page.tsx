import type { Metadata } from "next";
import ServiceLanding, { InLink } from "@/components/ServiceLanding";
import { PRICE_BUILD_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";
import { OG_IMAGE } from "@/lib/og";

/**
 * /website-hosting-nanaimo
 *
 * Added 2026-10-11 from Search Console (3 months to Oct 10):
 *   domain services nanaimo          195 impr  pos 22
 *   domain name services nanaimo     107 impr  pos 40
 *   website hosting services nanaimo  64 impr  pos 1.8
 *   domain names nanaimo              54 impr  pos 65
 *   website hosting nanaimo           47 impr  pos 2.1
 *
 * Hosting already ranks (from /website-maintenance and /services); the
 * domain queries do not, because no page talks about domains as a
 * service. This page covers both and links to /website-maintenance for
 * the care plan itself.
 *
 * Scope, kept honest: hosting is the $40 monthly that comes with every
 * site VDT builds or rebuilds. We do not sell bare hosting for sites we
 * did not build. The email promise here is that a domain move keeps
 * existing email working (Westro, Smugglers' Cove); mailboxes, Google
 * Workspace and forwarding have their own page, /business-email (added
 * 2026-10-22 when VDT became a Zoho Workplace partner).
 * The included list mirrors INCLUDED on /services.
 */

export const metadata: Metadata = {
  title: "Website Hosting and Domains in Nanaimo, BC",
  description:
    "Website hosting and domain services in Nanaimo: Cloudflare hosting, your domain, SSL, backups and support in one $40 a month fee. No renewal surprises.",
  keywords: [
    "website hosting nanaimo",
    "domain services nanaimo",
    "domain name services nanaimo",
    "website hosting services nanaimo",
    "domain names nanaimo",
  ],
  alternates: { canonical: "/website-hosting-nanaimo" },
  openGraph: {
    images: [OG_IMAGE],
    title: "Website Hosting and Domains in Nanaimo | VDT Sites",
    description:
      "Cloudflare hosting, your domain, SSL, backups and support in one flat monthly fee.",
    url: "/website-hosting-nanaimo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Hosting and Domains in Nanaimo | VDT Sites",
    description:
      "Cloudflare hosting, your domain, SSL, backups and support in one flat monthly fee.",
  },
};

/* Mirrors INCLUDED on /services. Change both or neither. */
const INCLUDED = [
  "Hosting on Cloudflare's global network",
  "Your domain name registered and managed",
  "SSL security certificate",
  "Backups and security monitoring",
  "Ongoing support from the person who built it",
  "Minor text and image edits free for the first month",
];

const FAQS = [
  {
    q: "How much is website hosting in Nanaimo?",
    a: `Ours is ${PRICE_MONTHLY} a month, flat, and it covers hosting, your domain, SSL, backups, monitoring and support. There is no separate domain bill, no hosting renewal that jumps after the first year, and no extra charge when something needs fixing.`,
  },
  {
    q: "Do you register domain names?",
    a: "Yes. We register and manage your domain for you as part of the monthly fee, including the DNS setup and renewals, so you never lose it to an expired card or a login nobody remembers.",
  },
  {
    q: "Will my email keep working if you move my domain?",
    a: "Yes, and we check it before anything switches over. When we moved westro.ca and smugglerscovepub.com, their email carried across without dropping a message, because the email records are copied and tested before the domain moves.",
  },
  {
    q: "Can you host a website you did not build?",
    a: "Hosting comes with the sites we build or rebuild, because we look after what we can stand behind. If your current site needs a new home, the usual route is a rebuild that keeps every page and ranking, explained on our website redesign page.",
  },
  {
    q: "Where is the site actually hosted?",
    a: "On Cloudflare's global network, which serves your pages from a location close to each visitor. For a Nanaimo business that means the site loads fast here on the Island and anywhere else a customer happens to be.",
  },
];

export default function WebsiteHostingNanaimoPage() {
  return (
    <ServiceLanding
      path="/website-hosting-nanaimo"
      eyebrow="Hosting & Domains"
      h1="Website hosting and domains in Nanaimo, one flat fee."
      breadcrumbName="Website Hosting and Domains in Nanaimo"
      serviceName="Website Hosting and Domain Management"
      serviceType="Website hosting, domain registration and management, SSL, backups and support for small business websites"
      description="Website hosting and domain services in Nanaimo, BC: Cloudflare hosting, domain registration and DNS, SSL, backups and support for one monthly fee from VDT Sites."
      intro={
        <p>
          Hosting, your domain, the security certificate, backups and support,
          handled for you in one {PRICE_MONTHLY} a month fee. No separate
          registrar to log into, no hosting bill that doubles at renewal, and
          one local number to call when something needs changing.
        </p>
      }
      sections={[
        {
          eyebrow: `Everything in the ${PRICE_MONTHLY} a month`,
          heading: "What the monthly fee covers",
          ticks: INCLUDED,
          body: (
            <p>
              The care plan in detail, and what happens when you need a change,
              is on the{" "}
              <InLink href="/website-maintenance">website maintenance page</InLink>.
            </p>
          ),
        },
        {
          eyebrow: "Domain services",
          heading: "Your domain name, registered and looked after",
          body: (
            <>
              <p>
                We register your domain, set up the DNS, and keep it renewed.
                We hold it on your behalf, it is yours once the fees are paid,
                and we transfer it to you whenever you ask. In the meantime you
                never have to think about it. The details are in section 20 of
                our <InLink href="/terms-of-service">terms</InLink>.
              </p>
              <p>
                Already have a domain somewhere else? We move it across with
                the email records copied and tested first, so the site and
                your inbox both keep working on switch day, the way we did for{" "}
                <InLink href="/work/westro">Westro</InLink> and{" "}
                <InLink href="/work/smugglers-cove">Smugglers&apos; Cove Pub</InLink>.
                Want email on your domain, or a move to a new mail provider?
                That is on our{" "}
                <InLink href="/business-email">business email page</InLink>.
              </p>
            </>
          ),
        },
        {
          eyebrow: "Why it is bundled",
          heading: "One bill instead of three companies",
          body: (
            <>
              <p>
                Most small business sites in Nanaimo are spread across a
                registrar, a hosting company and whoever built the site. When
                something breaks, each one points at the others, and the
                renewal notices go to an email address nobody checks.
              </p>
              <p>
                Hosting comes with every site we build, from{" "}
                {PRICE_BUILD_FROM} {CURRENCY}, so the people who built it are
                the people who host it and answer the phone. Moving an existing
                site? The{" "}
                <InLink href="/website-redesign">website redesign page</InLink>{" "}
                explains how we carry your pages and rankings across.
              </p>
            </>
          ),
        },
      ]}
      faqs={FAQS}
      ctaHeading="Tired of juggling hosting, domains and renewals?"
      ctaBody="Tell us where your site and domain live today. We will tell you what moving it would involve and give you a fixed price for the whole thing. Free, and no obligation attached to it."
    />
  );
}
