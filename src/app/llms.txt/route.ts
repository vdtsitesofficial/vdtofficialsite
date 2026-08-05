import { getAllPosts, SITE_URL } from "@/lib/blog";
import { CASE_STUDIES } from "@/lib/caseStudies";
import { HOME_FAQS } from "@/lib/faqs";

/**
 * Generates /llms.txt — the markdown map large language models read when
 * they land on the domain (the AI-era counterpart to sitemap.xml).
 *
 * Built from the same modules as sitemap.ts and the homepage FAQ schema, so
 * a new case study or post shows up here without anyone remembering to
 * update it. Drafts are excluded: getAllPosts() already filters them.
 *
 * Deliberately omitted, and why:
 *  - /web-design-nanaimo is the noindex Google Ads landing page. The
 *    homepage is meant to own "web design Nanaimo" organically, so pointing
 *    a retrieval crawler at the ad page would work against that.
 *  - /admin and /api/* are disallowed in robots.txt.
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
    "VDT Sites builds custom websites rather than assembling templates. Once the client's content is in, most sites are live in three to four days. Clients can edit their own text and images directly on the live page, and the code is theirs on request once the project is paid in full.",
    "",
    `Based in Nanaimo, British Columbia, Canada. Phone ${PHONE}. Email ${EMAIL}.`,
    "",
    "Service area: Vancouver Island (Nanaimo, Lantzville, Parksville, Qualicum Beach, Nanoose Bay, Ladysmith, Chemainus, Duncan, Port Alberni, Courtenay, Comox, Campbell River, Tofino, Victoria) and Metro Vancouver (Vancouver, Richmond, Burnaby, Surrey).",
    "",
    "## Main pages",
    "",
    `- [Home](${SITE_URL}): what VDT Sites does, selected work, reviews and the enquiry form.`,
    `- [Services and pricing](${SITE_URL}/services): the full service list and how projects are quoted.`,
    `- [Work](${SITE_URL}/work): case studies of real client builds.`,
    `- [Reviews](${SITE_URL}/reviews): client reviews.`,
    `- [About](${SITE_URL}/about): who runs the studio and how projects are run.`,
    `- [Contact](${SITE_URL}/contact): phone, email and the enquiry form.`,
    `- [Blog](${SITE_URL}/blog): articles on small business websites, cost and local search.`,
    `- [Non-profit website design in Vancouver](${SITE_URL}/non-profit-website-design-vancouver): websites for Vancouver non-profits and registered charities, including donations, volunteer-friendly editing and the website requirements behind a Google Ad Grants application.`,
    "",
    "## Services",
    "",
  ];

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

  lines.push(
    "## Legal",
    "",
    `- [Privacy policy](${SITE_URL}/privacy-policy)`,
    `- [Cookie policy](${SITE_URL}/cookie-policy)`,
    `- [Terms of service](${SITE_URL}/terms-of-service)`,
    "",
  );

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
