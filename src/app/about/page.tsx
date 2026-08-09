import type { Metadata } from "next";
import { CASE_STUDIES } from "@/lib/caseStudies";
import {
  TESTIMONIALS,
  REVIEW_COUNT,
  GOOGLE_REVIEWS_URL,
} from "@/lib/testimonials";
import Stars from "@/components/Stars";
import Reveal from "@/components/Reveal";
import PageHeader from "@/components/PageHeader";
import ServiceAreas from "@/components/ServiceAreas";

/**
 * /about — who VDT Sites actually is. Two founders, named and pictured,
 * because "who am I hiring" is the question every small-business owner
 * asks before they enquire. Mirrors the /work page's chrome (cream page,
 * Syne display, red accent) so the site reads as one thing.
 */

const SYNE = "'Syne', 'Inter', sans-serif";
const SITE = "https://vdtsites.com";

type Founder = {
  name: string;
  role: string;
  photo: string;
  /** Alt text — describes the person, not the file. */
  alt: string;
  bio: string;
  facts: string[];
};

const FOUNDERS: Founder[] = [
  {
    name: "Sem van Duist",
    role: "Design & build",
    photo: "/team/sem.webp",
    alt: "Sem van Duist, co-founder of VDT Sites",
    bio: "Sem studies computer science and accounting at VIU. The computer science half is where the building comes from. The accounting half is why he treats a website as something that has to pay for itself, not just look good in a portfolio.",
    facts: ["VIU student", "Computer science", "Accounting"],
  },
  {
    name: "Phillip Treitel",
    role: "App development",
    photo: "/team/phillip.webp",
    alt: "Phillip Treitel, co-founder of VDT Sites",
    bio: "Phillip runs the app side of VDT. When a project needs more than a website, something with logins, bookings or an actual app behind it, that half is his. He studies international business and marketing at VIU, which is also why he is the one asking who a product is really for before anybody starts building it.",
    facts: ["VIU student", "App development", "International business"],
  },
];

const PRINCIPLES = [
  {
    title: "No agency markup",
    body: "You pay for the work, not for an office, a sales team or a project manager forwarding your emails.",
  },
  {
    title: "You are never just a number",
    body: "Being small is the point. You reach us directly and hear back fast, usually the same day, from the person actually building your site. No ticket queue, no account manager you have never met, no waiting behind a thousand other clients at a big firm.",
  },
  {
    title: "Built to do a job",
    body: "A site that looks good but never brings in a call is a poster. We build for enquiries, bookings and phone calls.",
  },
];

/**
 * The reviews themselves (and the note on why there is no rating markup)
 * live in lib/testimonials.ts, shared with /reviews. /about shows the first
 * few as proof for the claims above them and links through for the rest.
 */
const ABOUT_TESTIMONIALS = TESTIMONIALS.slice(0, 2);

export const metadata: Metadata = {
  title: "About Us: The Team Behind VDT Sites",
  description:
    "Meet Sem van Duist and Phillip Treitel, the two VIU students in Nanaimo, BC building websites for Vancouver Island small businesses.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us: The Team Behind VDT Sites",
    description:
      "Meet Sem van Duist and Phillip Treitel, the two VIU students in Nanaimo, BC building websites for Vancouver Island small businesses.",
    images: [`${SITE}/team/sem.webp`],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us: The Team Behind VDT Sites",
    description:
      "Meet Sem van Duist and Phillip Treitel, the two VIU students in Nanaimo, BC building websites for Vancouver Island small businesses.",
    images: [`${SITE}/team/sem.webp`],
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-svh flex-col overflow-x-clip bg-[#f4efe6] text-[#0d0d0d]">
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap"
        rel="stylesheet"
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "@id": `${SITE}/about`,
            name: "About VDT Sites",
            isPartOf: { "@id": `${SITE}/#website` },
            about: { "@id": `${SITE}/#business` },
            mainEntity: {
              "@type": "Organization",
              name: "VDT Sites",
              url: SITE,
              founder: FOUNDERS.map((f) => ({
                "@type": "Person",
                name: f.name,
                jobTitle: f.role,
                image: `${SITE}${f.photo}`,
              })),
            },
          }),
        }}
      />

      {/* header — mirrors /work so the chrome is identical across pages */}
      <PageHeader activeHref="/about" />

      <main className="flex-1">
        {/* hero — headline + CTA only, left aligned, ghost wordmark filling
            the space. Matches /services; see Shared/Design Preferences on
            eyebrow kickers, hero paragraphs and centred hero patterns. */}
        <section className="relative px-6 pb-4 pt-10 md:px-14 md:pt-16">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 top-0 select-none text-[128px] font-extrabold leading-none tracking-tight text-[#0d0d0d]/[0.035] md:-right-6 md:text-[230px]"
            style={{ fontFamily: SYNE }}
          >
            VDT
          </span>
          <div className="relative mx-auto max-w-6xl">
            <h1
              className="max-w-[15ch] text-[40px] font-bold leading-[1.02] md:text-[76px]"
              style={{ fontFamily: SYNE }}
            >
              Two students who build websites that work.
            </h1>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
              <a
                href="/contact"
                className="rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
              >
                Get a free quote
              </a>
              <a
                href="/work"
                className="text-[15px] font-semibold underline decoration-black/25 decoration-2 underline-offset-[6px] transition-colors hover:decoration-[#dc2626]"
              >
                or see our work
              </a>
            </div>
          </div>
        </section>

        {/* the story, moved out of the hero so the hero stays headline + CTA */}
        <section className="px-6 pt-20 md:px-14 md:pt-28">
          <Reveal>
            <p
              className="mx-auto max-w-4xl text-[21px] leading-[1.55] md:text-[30px]"
              style={{ fontFamily: SYNE }}
            >
              We met on the VIU Mariners volleyball team and started VDT Sites
              because small businesses on the Island kept getting quoted agency
              prices for websites that never brought in a single call.{" "}
              <span className="text-[#0d0d0d]/45">
                Being students means low overhead and a lot of motivation to get
                it right. Staying small means you always deal with us directly,
                not a queue.
              </span>
            </p>
          </Reveal>
        </section>

        {/* founders */}
        <section className="px-6 pt-14 md:px-14 md:pt-20">
          <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
            {FOUNDERS.map((f) => (
              <article
                key={f.name}
                className="overflow-hidden rounded-2xl border border-black/10 bg-white/55"
              >
                {/* Fixed 4/5 box + object-cover normalises two source photos
                    shot at different crops. object-top keeps faces high. */}
                <div className="aspect-[4/5] w-full overflow-hidden bg-[#111318]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={f.photo}
                    alt={f.alt}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="px-5 pb-6 pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#dc2626]">
                    {f.role}
                  </p>
                  <h2
                    className="mt-1.5 text-[21px] font-bold"
                    style={{ fontFamily: SYNE }}
                  >
                    {f.name}
                  </h2>
                  <p className="mt-2.5 text-[14px] leading-[1.65] text-[#0d0d0d]/70">
                    {f.bio}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {f.facts.map((fact) => (
                      <li
                        key={fact}
                        className="rounded-full border border-black/10 px-3 py-1 text-[11.5px] text-[#0d0d0d]/60"
                      >
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* principles */}
        <section className="px-6 pt-16 md:px-14 md:pt-24">
          <div className="mx-auto max-w-4xl">
            <h2
              className="text-center text-[26px] font-bold md:text-[34px]"
              style={{ fontFamily: SYNE }}
            >
              How we work
            </h2>
            <div className="mt-9 grid gap-6 sm:grid-cols-3">
              {PRINCIPLES.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-black/10 bg-white/55 p-5"
                >
                  <h3
                    className="text-[16px] font-bold"
                    style={{ fontFamily: SYNE }}
                  >
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#0d0d0d]/70">
                    {p.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* testimonials — proof for the claims made directly above */}
        <section className="px-6 pt-16 md:px-14 md:pt-24">
          <div className="mx-auto max-w-4xl">
            <h2
              className="text-center text-[26px] font-bold md:text-[34px]"
              style={{ fontFamily: SYNE }}
            >
              What clients say
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-[15px] leading-relaxed text-[#0d0d0d]/60">
              Two of the {REVIEW_COUNT} real 5 star reviews left on our Google
              Business Profile.
            </p>

            <div className="mt-9 grid gap-6 sm:grid-cols-2">
              {ABOUT_TESTIMONIALS.map((t) => (
                <figure
                  key={t.author}
                  className="flex flex-col rounded-2xl border border-black/10 bg-white/55 p-6"
                >
                  <Stars />
                  <blockquote className="mt-3 flex-1 text-[15px] leading-[1.65] text-[#0d0d0d]/75">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-[13px] font-semibold text-[#0d0d0d]">
                    {t.author}
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-center">
              <a
                href="/reviews"
                className="text-[14px] font-semibold text-[#dc2626] hover:underline"
              >
                Read every review →
              </a>
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold text-[#0d0d0d]/60 transition-colors hover:text-[#dc2626]"
              >
                See them on Google →
              </a>
            </div>
          </div>
        </section>

        {/* client strip — breadth of work, and eight internal links into /work/* */}
        <section className="px-6 pt-16 md:px-14 md:pt-24">
          <div className="mx-auto max-w-4xl">
            <h2
              className="text-center text-[26px] font-bold md:text-[34px]"
              style={{ fontFamily: SYNE }}
            >
              Businesses we build for
            </h2>
            {/* The second sentence is a deliberate phrasing: it points at the
                non-profit service page without listing non-profits among
                businesses we HAVE built for, because we have not built for a
                registered charity yet. See the hard rule at the top of
                app/non-profit-website-design-vancouver/page.tsx. It also gives
                that page a second inbound link, which the Aug 5 Semrush crawl
                flagged it as needing. */}
            <p className="mx-auto mt-3 max-w-lg text-center text-[15px] leading-relaxed text-[#0d0d0d]/60">
              Coffee roasters, food trucks, counsellors, importers, tradespeople
              and clubs, mostly here on Vancouver Island. Running a non-profit
              or a charity? That build is different enough that{" "}
              <a
                href="/non-profit-website-design-vancouver"
                className="font-semibold text-[#dc2626] underline underline-offset-2"
              >
                non-profit website design
              </a>{" "}
              has its own page.
            </p>

            <ul className="mt-9 flex flex-wrap justify-center gap-3">
              {CASE_STUDIES.map((c) => (
                <li key={c.slug}>
                  <a
                    href={`/work/${c.slug}`}
                    className="inline-block rounded-full border border-black/10 bg-white/55 px-5 py-2.5 text-[14px] font-semibold text-[#0d0d0d] transition-colors hover:border-[#dc2626]/40 hover:text-[#dc2626]"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-8 text-center">
              <a
                href="/work"
                className="text-[14px] font-semibold text-[#dc2626] hover:underline"
              >
                See the full case studies →
              </a>
            </div>
          </div>
        </section>

        {/* cta */}
        <section className="px-6 py-20 text-center md:py-28">
          <h2
            className="mx-auto max-w-2xl text-[26px] font-bold leading-[1.15] md:text-[36px]"
            style={{ fontFamily: SYNE }}
          >
            Want to see what we&rsquo;d do with your site?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15.5px] leading-relaxed text-[#0d0d0d]/70">
            Tell us about the business and we&rsquo;ll come back with a straight
            answer on what it needs and what it costs.
          </p>
          {/* One button plus a call link, not two buttons side by side. */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
            <a
              href="/contact"
              className="rounded-full bg-[#dc2626] px-8 py-3.5 text-[15px] font-semibold text-white transition-[background-color,transform] duration-200 hover:bg-[#b91c1c] active:translate-y-[1px]"
            >
              Get a free quote
            </a>
            <a
              href="tel:+12506162087"
              className="text-[15px] font-semibold underline decoration-[#dc2626] decoration-2 underline-offset-[6px] transition-colors hover:text-[#dc2626]"
            >
              or call 250-616-2087
            </a>
          </div>
        </section>
      </main>

      <ServiceAreas />

      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 px-6 py-5 text-[12px] text-[#0d0d0d]/55 md:px-14">
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
