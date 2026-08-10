import { getAllPosts, SITE_URL } from "@/lib/blog";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { HOME_FAQS } from "@/lib/faqs";
import { LEGAL_PAGES, MAIN_PAGES } from "@/lib/pages";
import { PRICE_BUILD_FROM } from "@/lib/pricing";

/**
 * Generates /llms.txt — the markdown map large language models read when
 * they land on the domain (the AI-era counterpart to sitemap.xml).
 *
 * Built from the same modules as sitemap.ts and the homepage FAQ schema, so
 * a new page, case study or post shows up here without anyone remembering
 * to update it. Drafts are excluded: getAllPosts() already filters them.
 *
 * The "Main pages" and "Legal" lists come from lib/pages.ts. They were
 * hand-written here until 2026-08-10, while sitemap.ts hand-wrote the same
 * list separately, and the two drifted: this file described an 11 page site
 * for the two months it took to build 21, so AI retrieval crawlers never
 * saw /pricing or any of the money pages. Do not reintroduce a literal
 * array here.
 *
 * Deliberately omitted, and why: see the exclusion notes in lib/pages.ts
 * (/web-design-nanaimo is noindex on purpose, /admin and /api/* are
 * disallowed in robots.txt).
 *
 * Voice: no em dashes or en dashes (see lib/caseStudies.ts).
 */

// Prerendered at build time. Nothing here reads a request or a binding.
export const dynamic = "force-static";

const PHONE = "250-616-2087";
const EMAIL = "vdtsites@gmail.com";

const SERVICE_GROUPS: [string, string[]][] = [
  [
    "Websites",
    [
      "Custom website design",
      "Website redesign",
      "Small business websites",
      "Online stores",
      "Landing pages",
    ],
  ],
  [
    "Hosting and care",
    ["Website hosting", "Website maintenance", "Domain registration"],
  ],
  [
    "Local SEO and search",
    [
      "Local SEO",
      "Google Business Profile setup",
      "Search engine optimisation",
    ],
  ],
  ["Logo and brand", ["Logo design", "Brand identity design"]],
  ["App development", ["Mobile app development"]],
];

function build(): string {
  const posts = getAllPosts();

  const lines: string[] = [
    "# VDT Sites",
    "",
    "> Custom website design, hosting and local SEO for small businesses in Nanaimo, BC and across Vancouver Island. Fixed price up front, hosting and domain included in one flat monthly fee, and you own the site.",
    "",
    `VDT Sites builds custom websites rather than assembling templates. Once the client's content is in, most sites are live in three to four days; that covers the ${PRICE_BUILD_FROM} website package, and extra work bought alongside it is quoted and scheduled separately. Clients can edit their own text and images directly on the live page, and once the project is paid in full the website is theirs: the design, the content and everything on it.`,
    "",
    `Based in Nanaimo, British Columbia, Canada. Phone ${PHONE}. Email ${EMAIL}.`,
    "",
    "Service area: Vancouver Island (Nanaimo, Lantzville, Parksville, Qualicum Beach, Nanoose Bay, Ladysmith, Chemainus, Duncan, Port Alberni, Courtenay, Comox, Campbell River, Tofino, Victoria) and Metro Vancouver (Vancouver, Richmond, Burnaby, Surrey).",
    "",
    "## Main pages",
    "",
  ];

  for (const p of MAIN_PAGES) {
    lines.push(`- [${p.label}](${SITE_URL}${p.path}): ${p.description}`);
  }

  lines.push("", "## Services", "");

  for (const [group, services] of SERVICE_GROUPS) {
    lines.push(`- ${group}: ${services.join(", ")}.`);
  }

  lines.push("", "## Case studies", "");
  for (const c of CASE_STUDIES) {
    lines.push(
      `- [${c.name}](${SITE_URL}/work/${c.slug}): ${c.kicker}. ${c.headline}.`,
    );
  }

  lines.push("", "## Blog posts", "");
  for (const p of posts) {
    lines.push(`- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.description}`);
  }

  lines.push("", "## Common questions", "");
  for (const { q, a } of HOME_FAQS) {
    lines.push(`### ${q}`, "", a, "");
  }

  lines.push("## Legal", "");
  for (const p of LEGAL_PAGES) {
    lines.push(`- [${p.label}](${SITE_URL}${p.path}): ${p.description}`);
  }
  lines.push("");

  return lines.join("\n");
}

export function GET(): Response {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
