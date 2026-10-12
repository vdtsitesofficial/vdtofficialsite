/* -----------------------------------------------------------------------
 * October 2026 posts, written as DRAFTS (noindex, out of the index and
 * sitemap, but readable at their URL) for Sem to approve. Publishing a
 * post is deleting its `draft: true` line.
 *
 * Each one feeds a service page added 2026-10-12 for a Search Console
 * cluster with impressions and no dedicated page:
 *   websiteHostingCostPost   -> /website-hosting-nanaimo  (hosting, domains)
 *   rebrandSignsPost         -> /branding-nanaimo         (branding packages)
 *   leavingWordPressPost     -> /web-development-nanaimo  (wordpress queries)
 *
 * House rules as in lib/blog.ts: VDT's own prices come from lib/pricing.ts,
 * market ranges are conservative and phrased as ranges, no em or en dashes,
 * never the word "real", no ranking guarantees, internal links only.
 * --------------------------------------------------------------------- */

import type { BlogPost } from "@/lib/blog";
import { PRICE_BUILD_FROM, PRICE_BRAND_FROM, PRICE_MONTHLY, CURRENCY } from "@/lib/pricing";
import { DEFAULT_AUTHOR } from "@/lib/authors";

export const websiteHostingCostPost: BlogPost = {
  slug: "website-hosting-cost-canada",
  title: "How Much Does Website Hosting Cost in Canada? (2026)",
  metaTitle: "Website Hosting Cost in Canada (2026)",
  description:
    "What small business website hosting costs in Canada in 2026, why the renewal price is the one that matters, and what should be included before you pay.",
  excerpt:
    "Hosting looks cheap until the first renewal. Here is what small business hosting costs in Canada, what the price should include, and the renewal trap to check before you sign up.",
  category: "Pricing",
  publishedAt: "2026-10-12",
  updatedAt: "2026-10-12",
  readingMinutes: 6,
  keywords: [
    "website hosting cost canada",
    "how much is website hosting",
    "small business web hosting canada",
    "domain and hosting cost",
    "website hosting nanaimo",
  ],
  author: DEFAULT_AUTHOR,
  draft: true,
  faqs: [
    {
      q: "How much does website hosting cost for a small business in Canada?",
      a: "Most small business sites pay somewhere between $20 and $60 a month, depending on whether you manage the hosting yourself or pay someone to look after it. The figure to compare is the renewal price plus everything you would otherwise pay for separately: the domain, the SSL certificate, backups and someone to call when something breaks.",
    },
    {
      q: "Why did my hosting bill go up after the first year?",
      a: "Because the first year was a promotional rate. Most budget hosting is sold at a discount for the first term and renews at the standard price, which is often two to four times higher. Check the renewal price before you sign up, not the headline price.",
    },
    {
      q: "Is the domain included in website hosting?",
      a: "Sometimes for the first year, rarely after. A domain is a separate registration that renews every year, roughly $15 to $25 for a .ca or .com. If a hosting plan says the domain is free, check whether it stays free at renewal and whose name it is registered in.",
    },
  ],
  content: [
    {
      kind: "p",
      text: "Website hosting is the one cost almost every small business underestimates, not because it is expensive but because it is sold cheap and renews at a different price. This is what hosting costs in Canada in 2026, what the number should include, and how to compare offers that look nothing alike.",
    },
    { kind: "h2", text: "The short answer" },
    {
      kind: "p",
      text: "Most small business websites in Canada spend somewhere between $20 and $60 a month to stay online. Where you land depends less on the hosting itself and more on who does the work around it: renewing the domain, keeping the security certificate valid, taking backups, and fixing things when they break.",
    },
    { kind: "h2", text: "What you are actually paying for" },
    {
      kind: "p",
      text: "Hosting on its own is just the server that sends your pages to visitors. A working website needs a few more pieces, and every one of them has to be paid for by somebody:",
    },
    {
      kind: "ul",
      items: [
        "the domain name, renewed every year",
        "an SSL certificate, so browsers do not warn visitors your site is not secure",
        "backups, so a mistake or a hack is an inconvenience rather than a disaster",
        "security updates and monitoring",
        "someone to call when the site goes down or something needs changing",
      ],
    },
    {
      kind: "p",
      text: "A cheap hosting plan covers the first item on the server side and leaves the rest to you. A managed plan covers all of it. Comparing the two on the monthly number alone is comparing a car to a car with insurance, fuel and a mechanic.",
    },
    { kind: "h2", text: "The renewal trap" },
    {
      kind: "p",
      text: "Budget hosting is usually sold at a promotional price for the first term, then renews at the standard rate, which is often two to four times higher. The same goes for domains bundled free for a year. None of this is hidden, exactly, but it is never the number in large print.",
    },
    {
      kind: "p",
      text: "Before you sign up for anything, find the renewal price for the hosting and the domain and write them down. That is what the site costs you from year two onward, which is most of its life.",
    },
    { kind: "h2", text: "Who owns the domain" },
    {
      kind: "p",
      text: "This matters more than the price. If someone else registered your domain in their own name and you lose touch with them, you can lose the address your customers, your Google listing and your email all depend on. Whoever registers it, make sure you know where it is held and that you can have it transferred to you on request.",
    },
    { kind: "h2", text: "How we price it" },
    {
      kind: "p",
      text: `For the sites we build, hosting is one flat ${PRICE_MONTHLY} a month: hosting on Cloudflare's global network, your domain registered and managed, the SSL certificate, backups, security monitoring and support from the people who built the site. There is no separate domain bill and no renewal jump. The details are on our [hosting and domains page](/website-hosting-nanaimo).`,
    },
    {
      kind: "p",
      text: `Building a new site? Builds start at ${PRICE_BUILD_FROM} ${CURRENCY}, and the full breakdown of what that covers is on [the pricing page](/pricing).`,
    },
    { kind: "h2", text: "What to ask any hosting provider" },
    {
      kind: "ul",
      items: [
        "What does this cost at renewal, not just the first year?",
        "Is the domain included, and whose name is it registered in?",
        "Are backups included, how often, and how do I get one back?",
        "Who do I call when the site goes down, and how fast do they answer?",
        "If I leave, what do I take with me?",
      ],
    },
    {
      kind: "p",
      text: "Any provider worth paying answers all five in one email. If the answers are vague, the bill eventually will not be.",
    },
  ],
};

export const rebrandSignsPost: BlogPost = {
  slug: "signs-your-business-needs-a-rebrand",
  title: "6 Signs Your Small Business Needs a Rebrand",
  metaTitle: "6 Signs Your Small Business Needs a Rebrand",
  description:
    "How to tell whether your logo and brand are holding your business back, when a refresh is enough, and what a small business branding package should include.",
  excerpt:
    "A dated logo rarely costs you a customer on its own. A brand that looks like it was assembled from parts does. Six signs it is time, and when a refresh beats a restart.",
  category: "Branding",
  publishedAt: "2026-10-12",
  updatedAt: "2026-10-12",
  readingMinutes: 5,
  keywords: [
    "signs you need a rebrand",
    "small business rebrand",
    "when to rebrand your business",
    "branding package small business",
    "branding packages nanaimo",
  ],
  author: DEFAULT_AUTHOR,
  draft: true,
  faqs: [
    {
      q: "How do I know if my business needs a rebrand?",
      a: "The clearest signs are a logo that does not work small or in one colour, a website, cards and invoices that do not match each other, a brand that describes the business you were rather than the one you are, and customers who remember your work but not your name. One of these is a refresh. Several together is a rebrand.",
    },
    {
      q: "What is the difference between a rebrand and a refresh?",
      a: "A refresh keeps the recognition you have already earned, the name, the core shape and colour, and fixes what has dated. A rebrand starts the identity over. Most small businesses need a refresh, and it is the cheaper and safer option when customers already know you.",
    },
    {
      q: "What should a small business branding package include?",
      a: "At minimum a logo in every format you need for web, print and signage, your colours and typefaces written down, and the pieces customers touch most: business cards, invoices and the website. A package that leaves out the website leaves out the place most customers see the brand first.",
    },
  ],
  content: [
    {
      kind: "p",
      text: "Most small businesses do not lose customers because of a dated logo. They lose them because the business looks assembled from parts: a logo from one designer, a website from another, an invoice from a template and a sign from whoever was cheapest. Here are six signs your brand is working against you, and how to tell a refresh from a full rebrand.",
    },
    { kind: "h2", text: "1. Your logo does not work small" },
    {
      kind: "p",
      text: "Look at your logo as a browser tab icon, a social profile picture, or embroidered on a shirt. If it turns into a blur, the detail that looked good on the original file is now working against you, because small is where most people see it.",
    },
    { kind: "h2", text: "2. Nothing matches" },
    {
      kind: "p",
      text: "Put your business card, your invoice, your website and your social profile side by side. Different colours, different fonts, slightly different versions of the logo? Customers notice that as a vague sense that the business is less established than it is.",
    },
    { kind: "h2", text: "3. You do not have the files" },
    {
      kind: "p",
      text: "If a print shop or a sign maker asks for a vector file and you have to email a former designer, or the only copy of your logo is a low resolution image, every new thing you print is a small crisis. A brand should come with every format you will ever need.",
    },
    { kind: "h2", text: "4. It describes the business you were" },
    {
      kind: "p",
      text: "A name, logo or tagline that made sense for the first service you offered can box you in once the business grows. If you keep explaining what you also do, the brand is describing a smaller company than yours.",
    },
    { kind: "h2", text: "5. You look like your competitors" },
    {
      kind: "p",
      text: "Search your trade and your town and look at the results as a customer would. If your logo, colours and style blend into the next three businesses, a customer remembers the work but not your name, and the next search sends them to someone else.",
    },
    { kind: "h2", text: "6. You avoid handing out your card" },
    {
      kind: "p",
      text: "This one is honest and common. If you apologise for your card, your website or your van before anyone has said a word, you already know.",
    },
    { kind: "h2", text: "Refresh or rebrand?" },
    {
      kind: "p",
      text: "If customers already know you, start with a refresh. Keep the name and what people recognise, usually the core shape and colour, and fix what has dated: clean up the logo, choose proper typefaces, and make every piece match. A full rebrand is for when the name or the identity itself no longer fits the business.",
    },
    { kind: "h2", text: "Do the brand and the website together" },
    {
      kind: "p",
      text: `The website is where most customers meet your brand first, so designing them apart almost guarantees they will not match. Our [branding package](/branding-nanaimo) is the Full Brand Kit at ${PRICE_BRAND_FROM} ${CURRENCY}: a custom logo in every format, print-ready business card design, a branded invoice template, brand typefaces, and the website itself, designed together. If it is mainly the logo you are after, [our logo design page](/logo-design-nanaimo) covers how we approach it.`,
    },
  ],
};

export const leavingWordPressPost: BlogPost = {
  slug: "moving-off-wordpress-without-losing-rankings",
  title: "Moving Your Website Off WordPress Without Losing Your Google Rankings",
  metaTitle: "Moving Off WordPress Without Losing Rankings",
  description:
    "How to move a small business website off WordPress safely: keep or redirect every URL, carry your email across, and resubmit to Google so rankings survive.",
  excerpt:
    "Leaving WordPress is not risky because of WordPress. It is risky because of the move. Here is the checklist that keeps your rankings and your email intact.",
  category: "Getting Started",
  publishedAt: "2026-10-12",
  updatedAt: "2026-10-12",
  readingMinutes: 6,
  keywords: [
    "moving off wordpress",
    "migrate from wordpress without losing seo",
    "leave wordpress small business",
    "wordpress alternative small business",
    "wordpress development nanaimo",
  ],
  author: DEFAULT_AUTHOR,
  draft: true,
  faqs: [
    {
      q: "Will I lose my Google rankings if I move off WordPress?",
      a: "Not if every old page address is either kept or redirected to its new equivalent with a permanent 301 redirect, and the new site is submitted to Google the day it launches. Rankings are lost when old URLs start returning errors, not because the platform changed.",
    },
    {
      q: "Will my email stop working when I move my website?",
      a: "It should not. Your email runs on records in your domain's DNS, separate from the website. Copy those records exactly before changing anything, then test that mail still arrives after the switch. Email breaks when someone moves the domain and forgets the email records.",
    },
    {
      q: "Why do small businesses leave WordPress?",
      a: "Usually upkeep: plugins and themes to update, something breaking after an update, security patches to keep on top of, and pages slowed down by a page builder. WordPress is a capable platform, but someone has to maintain it, and for many small businesses that someone does not exist.",
    },
  ],
  content: [
    {
      kind: "p",
      text: "WordPress runs a huge share of the web and there is nothing wrong with it. Small businesses leave it for one reason more than any other: upkeep. Plugins to update, something breaking after an update, and a site that has slowly got heavier. If that is you, the platform is not the risky part of leaving. The move is. Here is how to do it without losing your Google rankings or your email.",
    },
    { kind: "h2", text: "1. Record what you have before you touch anything" },
    {
      kind: "p",
      text: "Export a list of every URL on the current site, every page, post and image, and note which pages bring in search traffic. Google Search Console shows you exactly which pages get impressions and clicks. This list is the map you will check the new site against.",
    },
    { kind: "h2", text: "2. Keep or redirect every URL" },
    {
      kind: "p",
      text: "This is the step that decides whether rankings survive. Every old address must either exist on the new site or permanently redirect, with a 301, to the page that replaced it. An old address that returns an error is a page Google forgets, along with whatever it ranked for.",
    },
    {
      kind: "p",
      text: "Do not redirect everything to the homepage. Google treats that much like an error. Each old page should land on the closest new equivalent.",
    },
    { kind: "h2", text: "3. Copy your email records first" },
    {
      kind: "p",
      text: "Your email is not part of your website, but it lives in the same domain settings. Before changing where the domain points, copy every email record exactly, then send and receive a test message after the switch. When Westro moved off WordPress, their email carried across without dropping a message because this was done first. The [Westro case study](/work/westro) walks through it.",
    },
    { kind: "h2", text: "4. Launch, then tell Google" },
    {
      kind: "p",
      text: "On launch day, submit the new sitemap in Google Search Console and spot check the old URLs from your list: each should load or redirect. Watch Search Console for the following few weeks for pages reported as not found and fix any you missed.",
    },
    { kind: "h2", text: "5. Expect a short wobble, not a drop" },
    {
      kind: "p",
      text: "Positions can move around for a week or two while Google recrawls. That is normal. A sustained drop almost always traces back to a missed redirect or a page that lost its content, which is why the list from step one matters.",
    },
    { kind: "h2", text: "What to move to" },
    {
      kind: "p",
      text: "That depends on who will look after the site. Our [Wix alternatives comparison](/blog/wix-alternatives) covers the main options honestly, including the ones we do not sell. We build custom sites with no plugins to update, and we have moved businesses off WordPress and Wix with every page carried across. How we do it is on our [web development page](/web-development-nanaimo) and our [website redesign page](/website-redesign).",
    },
    {
      kind: "p",
      text: `If you would like the move done for you, builds start at ${PRICE_BUILD_FROM} ${CURRENCY} on a fixed quote, plus ${PRICE_MONTHLY} a month for hosting, your domain and support.`,
    },
  ],
};
