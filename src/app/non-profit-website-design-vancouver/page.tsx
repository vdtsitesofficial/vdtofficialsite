import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";

/**
 * /non-profit-website-design-vancouver
 *
 * Organic landing page for "non profit website design vancouver"
 * (110/mo, KD 5 — the lowest-difficulty term in the Aug 2026 Vancouver
 * keyword set, and the one worth proving the model on first).
 *
 * INDEXED, unlike /web-design-nanaimo. That page is noindex because it
 * competes with the homepage for the exact query the GBP effort targets.
 * Nothing on this site targets non-profits or Vancouver, so there is no
 * cannibalisation to avoid here.
 *
 * ── Why this is not a doorway page
 * The obvious way to chase a city keyword is to clone a page and swap the
 * place name. That is the textbook doorway pattern Google demotes, and with
 * /web-design-vancouver and friends presumably coming later, the temptation
 * is real. So this page is built around the AUDIENCE, not the city: Google
 * Ad Grants eligibility, donation handling, board and volunteer turnover,
 * funder accessibility expectations. Almost none of it would survive a
 * find-and-replace to another city, which is the test.
 *
 * ── The proof section, and its one hard rule
 * Paul Van Ryssel's council campaign is the proof, not CEVA: a campaign
 * runs on the same machinery a non-profit does (donations on two rails, a
 * compliance statement placed where the rules require, supporter forms, an
 * owned mailing list, self-serve editing) where CEVA is tournament
 * software. Sem's call, 2026-08-05.
 *
 * HARD RULE: never claim or imply a registered-charity client until there
 * is one. The page does not volunteer that there isn't one, which is a
 * normal thing not to say, but the line between "not mentioning it" and
 * "implying otherwise" is the whole ballgame here. Describe what was built
 * for a campaign and let the reader map it across.
 *
 * Ad Grants figures are Google's published terms, attributed as such rather
 * than promised. If Google changes them, change them here.
 *
 * ── Layout
 * mx-auto max-w-6xl containers with a two-column editorial split, matching
 * /services and /reviews. The first cut used left-aligned max-w-3xl and
 * stranded most of the viewport on wide screens.
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";
const URL = `${SITE}/non-profit-website-design-vancouver`;

/* Heading column left, body column right. Slightly wider on the right so
   prose gets a comfortable measure instead of a narrow gutter. */
const SPLIT =
  "grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]";

export const metadata: Metadata = {
  title: "Non-Profit Website Design in Vancouver, BC",
  /* 196 chars originally, which Google truncates around 160. Trimmed, and
     "not-for-profit" worked in: Semrush (Aug 2026) shows that spelling is a
     separate keyword family worth ~230/mo in the CA database that this page
     used zero times. */
  description:
    "Website design for Vancouver non-profits, not-for-profits and charities. Built for donations, volunteer editors and Google Ad Grants. Call 250-616-2087.",
  keywords: [
    "non profit website design vancouver",
    "not for profit website design",
    "nonprofit website design",
    "npo website design",
    "charity website design vancouver",
    "web design for nonprofits",
    "google ad grants website",
  ],
  alternates: { canonical: "/non-profit-website-design-vancouver" },
  openGraph: {
    title: "Non-Profit Website Design in Vancouver, BC | VDT Sites",
    description:
      "Websites for Vancouver non-profits and charities: donations, volunteer-friendly editing, and built to meet Google Ad Grants requirements.",
    url: "/non-profit-website-design-vancouver",
  },
  twitter: {
    title: "Non-Profit Website Design in Vancouver, BC | VDT Sites",
    description:
      "Websites for Vancouver non-profits and charities: donations, volunteer-friendly editing, and Google Ad Grants ready.",
  },
};

/* Visible FAQ + FAQPage schema ship together, always. Google's guidance is
   that the markup must match content a reader can actually see. */
const FAQS = [
  /* "What should a nonprofit website include" is 20/mo at KD 0 in the CA
     database (Semrush, Aug 2026), and it is the one question in that cluster
     with real volume and no competition. Deliberately spelled "nonprofit"
     here, one word: the page runs "non-profit" everywhere else and that
     spelling is its own keyword family. */
  {
    q: "What should a nonprofit website include?",
    a: "At minimum: a plain statement of your mission and who you serve, a page for each program, a way to give that works on a phone, your board and your charity registration number if you have one, and contact details that are not buried three clicks down. If you report to funders, add whatever they expect to find. Most organizations are better off doing those few things properly than adding pages nobody reads.",
  },
  {
    q: "How much does a non-profit website cost?",
    a: "Every project is quoted individually and you get one fixed price up front, agreed before any work starts. There is no hourly meter, which matters more than usual for a non-profit because an open-ended invoice is very hard to take to a board. If your funding arrives on a grant cycle, say so when you get in touch and we will work to that date rather than ours.",
  },
  {
    q: "Can our volunteers update the site without breaking it?",
    a: "Yes, and this is the requirement we design around first. You edit text and images directly on the live page: click the text, type the new version, save. There is no separate dashboard to learn and no training document to hand the next volunteer. When your board turns over, the site does not become unmaintainable.",
  },
  {
    q: "Will the site help us qualify for Google Ad Grants?",
    a: "Google decides eligibility, not us, and the main requirement in Canada is being a registered charity with the CRA. What we control is the website side of their policy: a live site on your own domain, a valid SSL certificate, and substantial original content that clearly explains your mission and who you serve. We build to that standard by default, so the site is not the thing holding your application up.",
  },
  {
    q: "Can you take donations on the site?",
    a: "Yes, including recurring monthly giving, and we have built donations with a card rail and an Interac e-transfer rail running side by side. Money is handled by a payment processor rather than stored by us. If you are a registered charity issuing tax receipts, the receipting requirements are the CRA's and we build around whatever your finance people or your donation platform already use.",
  },
  {
    q: "You are in Nanaimo, not Vancouver. Does that matter?",
    a: "Not for the work. Everything runs by phone, email and video call, and most of our clients across Vancouver Island never needed an in-person meeting either. What it does mean is that you are not paying for a downtown Vancouver office in your quote. If you specifically need someone in the room, we are the wrong fit and we will say so early.",
  },
  {
    q: "Do we own the website?",
    a: "Yes. Once the project is paid in full the site is yours, and we will hand over a full export of the code on request. For a non-profit that matters more than for most clients, because the person who commissioned it usually is not the person who inherits it three years later.",
  },
];

const DIFFERENCES = [
  {
    title: "The people editing it keep changing",
    body: "Boards rotate. The volunteer who ran the website moves away. A site that needs its original builder, or a manual, is a site that quietly stops being updated eighteen months after launch. We build the editing experience for whoever inherits it, not for whoever signs off on it.",
  },
  {
    title: "It has to ask for money without feeling like it",
    body: "A donate button is the easy part. The harder part is the page around it: what the money does, who it reaches, and why now. Recurring monthly giving is worth more than one-off donations to almost every organization, and it needs to be offered properly rather than buried as a checkbox.",
  },
  {
    title: "Funders and members actually read it",
    body: "Businesses get judged by customers. Non-profits get judged by funders, granting bodies, members and the occasional journalist, all of whom look for different things. Your programs, your board, your financials and your contact details need to be findable without a hunt.",
  },
  {
    title: "Accessibility is often not optional",
    body: "Plenty of funding agreements carry accessibility expectations, and beyond compliance the audience for a lot of non-profit work includes people using screen readers, keyboard navigation or high-contrast modes. Proper semantic structure, real contrast and keyboard-navigable menus are how we build anyway.",
  },
];

export default function NonProfitVancouverPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": URL,
        name: "Non-Profit Website Design in Vancouver, BC",
        description:
          "Website design for Vancouver non-profits and registered charities: donations, volunteer-friendly editing, and Google Ad Grants readiness.",
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": `${SITE}/#business` },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE },
            {
              "@type": "ListItem",
              position: 2,
              name: "Services",
              item: `${SITE}/services`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Non-Profit Website Design in Vancouver",
              item: URL,
            },
          ],
        },
      },
      {
        "@type": "Service",
        "@id": `${URL}#service`,
        name: "Non-Profit Website Design",
        serviceType:
          "Website design for non-profit and not-for-profit organizations, registered charities and member associations",
        provider: { "@id": `${SITE}/#business` },
        areaServed: [
          { "@type": "City", name: "Vancouver" },
          { "@type": "City", name: "Burnaby" },
          { "@type": "City", name: "Richmond" },
          { "@type": "City", name: "Surrey" },
          { "@type": "Place", name: "Metro Vancouver" },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${URL}#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-[#f4efe6] text-[#0d0d0d]">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHeader noSnippet />

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="relative px-6 pb-12 pt-10 md:px-14 md:pt-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-0 select-none text-[128px] font-extrabold leading-none tracking-tight text-[#0d0d0d]/[0.035] md:-right-6 md:text-[230px]"
            style={{ fontFamily: SYNE }}
          >
            VDT
          </span>

          <div className="relative mx-auto max-w-6xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
              Non-Profits &amp; Charities
            </p>
            <h1
              className="mt-4 max-w-[16ch] text-4xl font-bold leading-[1.05] md:text-[64px]"
              style={{ fontFamily: SYNE }}
            >
              Non-profit website design in Vancouver.
            </h1>

            <div className="mt-8 grid gap-x-16 gap-y-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <p className="text-[17px] leading-relaxed text-[#0d0d0d]/70">
                Websites for Vancouver non-profits, not-for-profit societies,
                registered charities and member associations. Built to take
                donations, to be updated by whichever volunteer has the login
                this year, and to meet the website requirements behind a Google
                Ad Grants application. One fixed price, hosting included, and
                you own it at the end.
              </p>
              <div className="flex flex-col items-start gap-4 md:pt-1">
                <Link
                  href="/contact"
                  className="rounded-full bg-[#0d0d0d] px-7 py-3.5 text-[14px] font-semibold text-[#f4efe6] transition-opacity hover:opacity-85"
                >
                  Get a free quote
                </Link>
                <a
                  href="tel:+12506162087"
                  className="text-[15px] font-semibold text-[#dc2626] underline underline-offset-4"
                >
                  Or call 250-616-2087
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── What makes a non-profit site different ───────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                What a non-profit site has to do that a business site
                doesn&rsquo;t
              </h2>
              <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70 md:pt-2">
                Most agencies will build you the same website they build a
                plumber, put a donate button on it and call the job done. These
                are the four things that actually change, and they change the
                build rather than the decoration.
              </p>
            </div>

            <div className="mt-14 grid gap-x-16 gap-y-11 md:grid-cols-2">
              {DIFFERENCES.map((d, i) => (
                <div key={d.title}>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="text-[13px] font-bold text-[#dc2626]"
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="text-xl font-bold leading-snug"
                      style={{ fontFamily: SYNE }}
                    >
                      {d.title}
                    </h3>
                  </div>
                  <p className="mt-3 pl-8 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {d.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Google Ad Grants ─────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                  The part most people miss
                </p>
                <h2
                  className="mt-4 text-3xl font-bold leading-tight md:text-[40px]"
                  style={{ fontFamily: SYNE }}
                >
                  Your website is what qualifies you for Google Ad Grants
                </h2>
              </div>

              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  Google gives eligible non-profits up to{" "}
                  <strong className="font-semibold text-[#0d0d0d]">
                    $10,000 USD every month
                  </strong>{" "}
                  in free search advertising through the Google Ad Grants
                  program. Not a discount. Ad credit, renewed monthly, for as
                  long as you stay compliant. For most small organizations that
                  is larger than the entire marketing budget.
                </p>
                <p>
                  In Canada the eligibility side is mostly out of your hands:
                  you generally need to be a registered charity with the CRA,
                  and verification runs through TechSoup. Certain organizations,
                  including government entities, hospitals and most schools, are
                  excluded by Google&rsquo;s own policy.
                </p>
                <p>
                  The half that is in your hands is the website. Google expects
                  a live site on a domain you own, a valid SSL certificate, and
                  substantial original content that makes clear what your
                  organization does and who it serves. Thin sites, sites still
                  on a free builder subdomain, and copy lifted from somewhere
                  else are exactly what gets applications held up.
                </p>
                <p className="border-l-2 border-[#dc2626] pl-5">
                  We build every site to that standard as a matter of course, so
                  if you decide to apply, the website is not the thing in your
                  way. We do not manage the application itself and we would be
                  wary of anyone who promises approval, because Google decides
                  it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Proof ────────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#dc2626]">
                  Proof
                </p>
                <h2
                  className="mt-4 text-3xl font-bold leading-tight md:text-[40px]"
                  style={{ fontFamily: SYNE }}
                >
                  Donations, volunteers and compliance, already built
                </h2>
              </div>

              <div className="space-y-5 text-[16px] leading-relaxed text-[#0d0d0d]/75 md:pt-2">
                <p>
                  A campaign runs on the same machinery a non-profit does, so
                  the closest match to your build is{" "}
                  <Link
                    href="/work/paul-van-ryssel"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    Paul Van Ryssel&rsquo;s city council campaign
                  </Link>
                  . Donations on two rails, card and Interac e-transfer, with a
                  reconciliation panel for matching transfers as they land. The
                  authorization statement the rules require, placed exactly
                  where they require it.
                </p>
                <p>
                  Four supporter forms, all bot-protected, delivering straight
                  to the inbox. A mailing list the campaign owns outright rather
                  than renting from a newsletter service. And on-page editing,
                  so when the message shifted, the site shifted the same hour
                  without anyone calling us.
                </p>
                <p>
                  Swap donors for supporters and grant reporting for campaign
                  finance and it is the same list. That is why we lead with it.{" "}
                  <Link
                    href="/work"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    We can show you our builds
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/reviews"
                    className="font-semibold text-[#dc2626] underline underline-offset-2"
                  >
                    the reviews from every one of them
                  </Link>
                  .
                </p>
                <p>
                  We are a small studio based in Nanaimo working with
                  organizations across Vancouver Island and the Lower Mainland.
                  Everything runs by phone, email and video call. The practical
                  effect for a Vancouver non-profit is that you get the work
                  without paying for downtown overhead in the quote, which for
                  an organization spending donor money is not a small thing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <h2
              className="text-3xl font-bold leading-tight md:text-[40px]"
              style={{ fontFamily: SYNE }}
            >
              Common questions
            </h2>
            <dl className="mt-12 grid gap-x-16 gap-y-10 md:grid-cols-2">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <dt
                    className="text-lg font-bold leading-snug"
                    style={{ fontFamily: SYNE }}
                  >
                    {f.q}
                  </dt>
                  <dd className="mt-3 text-[15px] leading-relaxed text-[#0d0d0d]/70">
                    {f.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="border-t border-black/10 px-6 py-16 md:px-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className={SPLIT}>
              <h2
                className="text-3xl font-bold leading-tight md:text-[40px]"
                style={{ fontFamily: SYNE }}
              >
                Tell us what your organization does.
              </h2>
              <div className="md:pt-2">
                <p className="text-[16px] leading-relaxed text-[#0d0d0d]/70">
                  A quote is free and there is no obligation at the end of it.
                  If your budget is tied to a grant cycle or a fiscal year end,
                  mention it and we will work to that date. If we are not the
                  right fit we will tell you and point you somewhere that is.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <Link
                    href="/contact"
                    className="rounded-full bg-[#dc2626] px-7 py-3.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-85"
                  >
                    Get a free quote
                  </Link>
                  <a
                    href="tel:+12506162087"
                    className="text-[15px] font-semibold text-[#0d0d0d] underline underline-offset-4"
                  >
                    250-616-2087
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-6 py-5 text-[12px] text-[#0d0d0d]/55 md:px-14">
        <span>© {new Date().getFullYear()} VDT Sites · Built in Nanaimo, BC</span>
        <nav aria-label="Legal" className="flex gap-5">
          <a href="/terms-of-service" className="hover:text-[#0d0d0d]">Terms</a>
          <a href="/privacy-policy" className="hover:text-[#0d0d0d]">Privacy</a>
          <a href="/cookie-policy" className="hover:text-[#0d0d0d]">Cookies</a>
        </nav>
      </footer>
    </div>
  );
}
