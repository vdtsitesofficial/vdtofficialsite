import type { Metadata } from "next";
import ServiceLanding, { InLink } from "@/components/ServiceLanding";
import { PRICE_BUILD_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";
import { OG_IMAGE } from "@/lib/og";

/**
 * /web-development-nanaimo
 *
 * Added 2026-10-11 from Search Console (3 months to Oct 10): the web
 * development cluster had impressions and no page of its own.
 *   web development nanaimo        118 impr  pos 20
 *   website development nanaimo     98 impr  pos 10
 *   ecommerce development nanaimo   84 impr  pos 1.5
 *   wordpress development nanaimo  113 impr  pos 2.8
 *   web developer nanaimo           26 impr  pos 10
 *
 * The homepage and /web-design-nanaimo own "web design"; this page owns
 * "development": the functional builds (stores, inventories, platforms,
 * forms, payments) from the case studies.
 *
 * WordPress queries rank here because of the migration stories. VDT does
 * NOT build on WordPress, and the page says so plainly rather than
 * pretending to; it speaks to the people searching it, who are mostly
 * owners of a WordPress site that has become a chore.
 *
 * Every claim maps to a case study in lib/caseStudies.ts. Do not add a
 * capability here that no shipped project demonstrates.
 */

export const metadata: Metadata = {
  title: "Web Development in Nanaimo, BC: Custom Built",
  description:
    "Custom web development in Nanaimo: online stores, inventories, booking, payments and admin tools, built from scratch by two local developers. From $899 CAD.",
  keywords: [
    "web development nanaimo",
    "website development nanaimo",
    "web developer nanaimo",
    "ecommerce development nanaimo",
    "custom web development vancouver island",
  ],
  alternates: { canonical: "/web-development-nanaimo" },
  openGraph: {
    images: [OG_IMAGE],
    title: "Web Development in Nanaimo, BC | VDT Sites",
    description:
      "Online stores, inventories, booking, payments and admin tools, custom built in Nanaimo by two local developers.",
    url: "/web-development-nanaimo",
  },
  twitter: {
    title: "Web Development in Nanaimo, BC | VDT Sites",
    description:
      "Online stores, inventories, booking, payments and admin tools, custom built in Nanaimo by two local developers.",
  },
};

const FAQS = [
  {
    q: "What is the difference between web design and web development?",
    a: "Design is how the site looks and reads. Development is what it does: the store, the booking, the inventory, the forms and the admin screens behind them. Most local sites need a little of both. We do both on every project, so the person who designs a page is never handing it to someone else to make it work.",
  },
  {
    q: "How much does custom web development cost in Nanaimo?",
    a: `A custom built site starts at ${PRICE_BUILD_FROM} ${CURRENCY}, plus ${PRICE_MONTHLY} a month for hosting, your domain, security, backups and support. Projects with a store, an inventory, accounts or a database cost more because there is more to build and test, and you get a fixed quote before anything starts, never an hourly bill.`,
  },
  {
    q: "Do you build on WordPress?",
    a: "No. Every site we build is custom code, which is why there are no plugins to update or break and no page builder slowing it down. We do move businesses off WordPress regularly, redirecting every old address so their Google standing carries across.",
  },
  {
    q: "Can you build an online store?",
    a: "Yes. MO Coffee is a Nanaimo roaster we built a full store for: checkout with subscriptions, live courier shipping rates, branded order emails and a back office the owner runs alone. Smaller shops with a handful of products are a lighter build of the same thing.",
  },
  {
    q: "Can I update the site myself after it is built?",
    a: "Yes. Every site comes with an editor that lets you change text and images directly on the live page. Inventories, menus and products get their own simple admin screens, so the day to day changes never need a developer.",
  },
  {
    q: "Who actually writes the code?",
    a: "Sem and Phillip, the two of us, here in Nanaimo. No subcontractors and no account managers, so the person you talk to is the person building it.",
  },
];

export default function WebDevelopmentNanaimoPage() {
  return (
    <ServiceLanding
      path="/web-development-nanaimo"
      eyebrow="Web Development"
      h1="Web development in Nanaimo, custom built from scratch."
      breadcrumbName="Web Development in Nanaimo"
      serviceName="Custom Web Development"
      serviceType="Custom website and web application development for small businesses: online stores, inventories, booking, payments and admin tools"
      description="Custom web development in Nanaimo, BC: online stores, inventories, booking, payments and admin tools, built from scratch by VDT Sites."
      intro={
        <p>
          When a website has to do something, sell, book, take a donation,
          manage stock, it stops being a design job and becomes a development
          one. We build those sites from scratch for Nanaimo and Vancouver
          Island businesses, with no templates and no plugins, from{" "}
          {PRICE_BUILD_FROM} {CURRENCY} on a fixed quote.
        </p>
      }
      sections={[
        {
          eyebrow: "What we build",
          heading: "The working parts behind a small business site",
          body: (
            <p>
              Each of these is a shipped project you can open and click
              through. The full write-ups are in{" "}
              <InLink href="/work">our work</InLink>.
            </p>
          ),
          items: [
            {
              title: "Ecommerce development",
              body: (
                <p>
                  An online store with checkout, subscriptions, live courier
                  shipping rates, branded order emails and a back office the
                  owner runs alone. See{" "}
                  <InLink href="/work/mo-coffee">MO Coffee</InLink>, a Nanaimo
                  coffee roaster.
                </p>
              ),
            },
            {
              title: "Inventories and listings the owner manages",
              body: (
                <p>
                  Stock that arrives, sells and changes price every week,
                  managed from a simple admin screen with photo galleries, no
                  developer needed. See{" "}
                  <InLink href="/work/morky-auto-imports">
                    Morky Auto Imports
                  </InLink>{" "}
                  in Parksville.
                </p>
              ),
            },
            {
              title: "Forms, payments and mailing lists",
              body: (
                <p>
                  Volunteer and sign up forms, donations by card and
                  e-transfer, and a mailing list, all on one site the owner
                  edits on the page. See the{" "}
                  <InLink href="/work/paul-van-ryssel">Paul Van Ryssel</InLink>{" "}
                  campaign site.
                </p>
              ),
            },
            {
              title: "Platforms with a database and admin dashboards",
              body: (
                <p>
                  When a client needs a full application, we build one: a
                  tournament platform with divisions, pools, standings and
                  admin dashboards that change live on event weekends. See{" "}
                  <InLink href="/work/ceva-volleyball">CEVA</InLink>.
                </p>
              ),
            },
            {
              title: "Menus, hours and specials the staff update",
              body: (
                <p>
                  A pub that edits its own menu, prices and weekly specials
                  right on the page, with menu data Google can read. See{" "}
                  <InLink href="/work/smugglers-cove">Smugglers&apos; Cove Pub</InLink>.
                </p>
              ),
            },
          ],
        },
        {
          eyebrow: "WordPress, Wix and Squarespace",
          heading: "Moving off a platform without losing your rankings",
          body: (
            <>
              <p>
                A lot of the developers Nanaimo businesses end up searching for
                are WordPress developers, usually because the site has become a
                chore: plugins to update, something breaking after every
                update, and a page builder slowing every page down.
              </p>
              <p>
                We do not build on WordPress. We rebuild the site as custom
                code and move it across with every old address kept or
                redirected, so Google finds the new site where it left the
                old one. We have done it from WordPress for{" "}
                <InLink href="/work/westro">Westro</InLink> and from Wix for{" "}
                <InLink href="/work/junk-matters">Junk Matters</InLink>, and
                the{" "}
                <InLink href="/website-redesign">website redesign page</InLink>{" "}
                explains how the move is done.
              </p>
            </>
          ),
        },
        {
          eyebrow: "How it is built",
          heading: "Fast, owned by you, and edited by you",
          ticks: [
            "Custom code on a modern stack, hosted on Cloudflare's global network",
            "An editor so you change text and images on the live page yourself",
            "A fixed quote before any work starts, never an hourly bill",
            "You own the site once it is paid in full",
            `Hosting, domain, SSL, backups and support for ${PRICE_MONTHLY} a month`,
          ],
          body: (
            <p>
              The whole offer, including what the build fee buys, is on the{" "}
              <InLink href="/pricing">pricing page</InLink>.
            </p>
          ),
        },
      ]}
      faqs={FAQS}
      ctaHeading="Tell us what the site needs to do."
      ctaBody="Describe the job in plain words: what customers should be able to do, and what you want to manage yourself. We will tell you what it takes to build and give you a fixed price. Free, and no obligation attached to it."
    />
  );
}
