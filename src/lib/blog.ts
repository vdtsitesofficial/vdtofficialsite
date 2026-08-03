/* -----------------------------------------------------------------------
 * Blog content + types.
 *
 * Posts are stored as typed content blocks (not raw HTML) so the
 * renderer can output clean, semantic, SEO-friendly markup — proper
 * heading hierarchy, real <ul>s, one <h1> owned by the page.
 * --------------------------------------------------------------------- */

export const SITE_URL = "https://vdtsites.com";

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "h3"; text: string }
  | { kind: "ul"; items: string[] };

export type BlogPost = {
  slug: string;
  /** Article H1 — the on-page headline. */
  title: string;
  /** <title> tag — can be tuned for the SERP independently of the H1. */
  metaTitle: string;
  /** Meta description — ~150-160 chars, written to earn the click. */
  description: string;
  /** Short excerpt shown on the blog index card. */
  excerpt: string;
  category: string;
  /** ISO date. */
  publishedAt: string;
  updatedAt: string;
  readingMinutes: number;
  /** Topical keywords — informs OG + internal relevance, not meta-keywords. */
  keywords: string[];
  /** Author shown on the post + used in Article structured data. */
  author: string;
  content: Block[];
};

/** Slugify a heading into an anchor id (used for the table of contents). */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const websiteCostPost: BlogPost = {
  slug: "small-business-website-cost-2026",
  title: "How Much Does It Cost to Build a Website for My Small Business?",
  metaTitle: "How Much Does a Small Business Website Cost? (2026 Guide)",
  description:
    "A clear, no-nonsense breakdown of what a small business website should really cost in 2026: realistic pricing tiers, what to watch for, and what actually matters before you hire a developer.",
  excerpt:
    "One company quotes $500, another quotes $15,000. Here is what a small business website should realistically cost in 2026, and what actually matters when you pay for one.",
  category: "Pricing",
  publishedAt: "2026-05-15",
  updatedAt: "2026-05-15",
  readingMinutes: 8,
  keywords: [
    "small business website cost",
    "how much does a website cost",
    "website pricing 2026",
    "web developer for small business",
    "custom website vs website builder",
    "local SEO for small business",
  ],
  author: "VDT Sites",
  content: [
    {
      kind: "p",
      text: "If you own a small business, chances are you've looked into getting a website built and immediately ran into confusion.",
    },
    {
      kind: "p",
      text: "One company quotes you $500. Another quotes you $15,000. Someone else says they can do it in a weekend. Another agency makes it sound like a six-month project.",
    },
    { kind: "p", text: "So what's the truth?" },
    {
      kind: "p",
      text: "As a web development company that works with small businesses regularly, we've seen both sides of the industry. We've seen amazing developers creating websites that genuinely help businesses grow, and we've also seen business owners pay absurd amounts of money for websites that barely function properly.",
    },
    {
      kind: "p",
      text: "The reality is that small business websites are often far more complicated, and far more overpriced, than they need to be.",
    },
    {
      kind: "p",
      text: "This article breaks down what small business websites should realistically cost in 2026, what actually matters when paying for one, and what business owners should watch out for before hiring a developer.",
    },

    { kind: "h2", text: "The Biggest Problem in the Website Industry" },
    {
      kind: "p",
      text: "One thing we've noticed over and over again is that many small businesses are being overcharged for websites that aren't even that good.",
    },
    {
      kind: "p",
      text: "A lot of business owners assume that if they paid a premium price, they must be getting a premium website.",
    },
    { kind: "p", text: "Unfortunately, that's not always true." },
    {
      kind: "p",
      text: "We regularly come across businesses that already have websites but clearly need redesigns because:",
    },
    {
      kind: "ul",
      items: [
        "their websites look outdated,",
        "pages don't work properly,",
        "contact forms are broken,",
        "mobile versions are poorly designed,",
        "SEO was never set up,",
        "or the website simply doesn't convert visitors into customers.",
      ],
    },
    {
      kind: "p",
      text: "For a small business owner, that can be incredibly frustrating.",
    },
    {
      kind: "p",
      text: "Not only did they already spend a large amount of money, but now they're stuck paying for a redesign because the original website never properly helped their business in the first place.",
    },
    {
      kind: "p",
      text: "The hidden cost of a bad website is not just the money spent building it.",
    },
    {
      kind: "p",
      text: "It's the leads you never receive. It's the customers who leave because the site feels unprofessional. It's the people who try to contact you through a broken form and never hear back.",
    },
    {
      kind: "p",
      text: "Every bit of friction on a website can directly impact sales.",
    },

    { kind: "h2", text: "Why Does One Website Cost $800 and Another Cost $15,000?" },
    {
      kind: "p",
      text: "This is one of the most common questions business owners ask.",
    },
    {
      kind: "p",
      text: "The honest answer is that sometimes the expensive website is genuinely more advanced, and other times it is simply overpriced.",
    },
    { kind: "p", text: "A higher-priced website may include:" },
    {
      kind: "ul",
      items: [
        "advanced booking systems,",
        "payment integrations,",
        "custom-built functionality,",
        "CRM integrations,",
        "membership systems,",
        "custom animations,",
        "SEO setup,",
        "or fully tailored design work.",
      ],
    },
    {
      kind: "p",
      text: "Those features take time and experience to build properly.",
    },
    {
      kind: "p",
      text: "However, many businesses are also paying agency-level prices for websites that are ultimately very basic.",
    },
    {
      kind: "p",
      text: "One thing we've learned through experience is that development speed improves massively after completing many projects.",
    },
    {
      kind: "p",
      text: "When you've already built booking systems, payment systems, scheduling systems, and custom integrations multiple times before, it becomes much easier and more affordable to implement those systems again.",
    },
    {
      kind: "p",
      text: "That doesn't lower the quality. It simply means the developer is experienced.",
    },
    {
      kind: "p",
      text: "Some companies charge enormous premiums simply because they bill heavily for their time.",
    },
    {
      kind: "p",
      text: "Other developers are able to provide advanced functionality more affordably because they've already solved these problems many times before.",
    },

    { kind: "h2", text: "What Actually Makes a Website Cheap or Expensive?" },
    { kind: "p", text: "Not all websites are built equally." },
    { kind: "p", text: "A very cheap website is often:" },
    {
      kind: "ul",
      items: [
        "built from a generic template,",
        "lacking proper SEO setup,",
        "poorly optimized for mobile,",
        "minimally customized,",
        "slow,",
        "or designed without conversion in mind.",
      ],
    },
    {
      kind: "p",
      text: "Many websites today technically “exist,” but they don't actually help businesses grow.",
    },
    {
      kind: "p",
      text: "A good website should do more than simply display information.",
    },
    { kind: "p", text: "It should:" },
    {
      kind: "ul",
      items: [
        "build trust,",
        "make the business look credible,",
        "rank on Google,",
        "generate leads,",
        "and make it easy for customers to contact or book with the business.",
      ],
    },
    {
      kind: "p",
      text: "The biggest difference between an average website and a great website is usually not complexity.",
    },
    { kind: "p", text: "It's attention to detail." },
    { kind: "p", text: "The best websites are:" },
    {
      kind: "ul",
      items: [
        "visually clean,",
        "unique,",
        "easy to use,",
        "mobile-friendly,",
        "SEO-focused,",
        "and built specifically around the business.",
      ],
    },

    {
      kind: "h2",
      text: "What Small Businesses Should Look For Before Hiring a Web Developer",
    },
    {
      kind: "p",
      text: "There are so many web developers today that it can honestly be difficult to know who is genuinely good.",
    },
    {
      kind: "p",
      text: "Some developers create beautiful, highly converting websites.",
    },
    {
      kind: "p",
      text: "Others produce websites that look unprofessional, fail to convert customers, and still charge premium pricing.",
    },
    {
      kind: "p",
      text: "The single most important thing a business owner should do before hiring someone is look at past projects.",
    },
    {
      kind: "p",
      text: "Do the websites actually look modern? Do they feel professional? Would you trust those businesses after seeing their websites?",
    },
    { kind: "p", text: "That matters." },
    { kind: "p", text: "A few other important things to look for include:" },

    { kind: "h3", text: "1. Mobile Compatibility" },
    {
      kind: "p",
      text: "A huge percentage of website traffic now comes from mobile devices.",
    },
    {
      kind: "p",
      text: "If your website only looks good on desktop, you are losing customers.",
    },
    {
      kind: "p",
      text: "A proper website should feel smooth and professional on both mobile and PC.",
    },

    { kind: "h3", text: "2. SEO Setup" },
    {
      kind: "p",
      text: "SEO is one of the most overlooked parts of small business websites.",
    },
    {
      kind: "p",
      text: "Many businesses spend heavily on ads while ignoring local SEO and organic traffic.",
    },
    {
      kind: "p",
      text: "For service businesses especially, local SEO can generate free ongoing leads in your area.",
    },
    {
      kind: "p",
      text: "That means your website should be properly structured for search engines from the beginning.",
    },

    { kind: "h3", text: "3. Ownership" },
    { kind: "p", text: "Business owners should always understand:" },
    {
      kind: "ul",
      items: [
        "who owns the website,",
        "who owns the domain,",
        "where the website is hosted,",
        "and whether they are locked into a specific platform.",
      ],
    },

    { kind: "h3", text: "4. Edit Policies" },
    { kind: "p", text: "Some developers charge for every tiny change." },
    {
      kind: "p",
      text: "Even changing a few words on a page can become expensive.",
    },
    {
      kind: "p",
      text: "That can become frustrating very quickly for small businesses.",
    },

    { kind: "h3", text: "5. Ongoing Support" },
    {
      kind: "p",
      text: "A website is not something you launch once and ignore forever.",
    },
    { kind: "p", text: "Businesses grow. Services change. Features evolve." },
    { kind: "p", text: "Good support matters." },

    {
      kind: "h2",
      text: "Are DIY Website Builders Like Wix or Squarespace Worth It?",
    },
    { kind: "p", text: "Platforms like:" },
    {
      kind: "ul",
      items: [
        "Wix,",
        "Squarespace,",
        "Shopify,",
        "GoDaddy,",
        "and AI website builders",
      ],
    },
    { kind: "p", text: "can absolutely be useful." },
    {
      kind: "p",
      text: "For some business owners, they are a perfectly fine solution.",
    },
    { kind: "p", text: "But there are tradeoffs." },
    {
      kind: "p",
      text: "The biggest issue with many DIY website builders is that websites often start looking very similar.",
    },
    { kind: "p", text: "The creative flexibility is more limited." },
    { kind: "p", text: "Custom functionality can become restrictive." },
    {
      kind: "p",
      text: "And businesses that want a unique online presence often hit limitations quickly.",
    },
    { kind: "p", text: "That doesn't mean those platforms are bad." },
    { kind: "p", text: "It simply means they are designed for simplicity first." },
    {
      kind: "p",
      text: "A custom-built website gives far more flexibility when it comes to:",
    },
    {
      kind: "ul",
      items: [
        "unique design,",
        "advanced integrations,",
        "performance,",
        "SEO structure,",
        "and tailored functionality.",
      ],
    },
    {
      kind: "p",
      text: "For businesses that want something more unique and scalable, custom development usually becomes the better long-term option.",
    },

    {
      kind: "h2",
      text: "So… What Should a Small Business Website Actually Cost?",
    },
    {
      kind: "p",
      text: "Pricing varies massively depending on what is being built.",
    },
    { kind: "p", text: "However, here's a realistic general breakdown." },

    { kind: "h3", text: "Simple One-Page Website" },
    {
      kind: "p",
      text: "If the website is extremely basic and mostly informational, paying significantly over $500 may not make sense.",
    },
    { kind: "p", text: "A simple website should stay simple in price." },

    { kind: "h3", text: "Standard 3 to 5 Page Business Website" },
    { kind: "p", text: "This depends heavily on:" },
    {
      kind: "ul",
      items: [
        "design quality,",
        "SEO work,",
        "responsiveness,",
        "content,",
        "and customization.",
      ],
    },
    { kind: "p", text: "A proper business website should:" },
    {
      kind: "ul",
      items: [
        "look professional,",
        "work well on mobile,",
        "include SEO foundations,",
        "and help convert visitors.",
      ],
    },

    { kind: "h3", text: "Advanced Websites With Integrations" },
    { kind: "p", text: "Once you start adding:" },
    {
      kind: "ul",
      items: [
        "booking systems,",
        "payment processing,",
        "advanced forms,",
        "custom dashboards,",
        "scheduling systems,",
        "or custom functionality,",
      ],
    },
    { kind: "p", text: "pricing becomes highly customizable." },
    {
      kind: "p",
      text: "There is no universal fixed price because the complexity can vary dramatically.",
    },

    { kind: "h2", text: "Why Monthly Website Fees Can Be Fair" },
    { kind: "p", text: "Some business owners dislike monthly website pricing." },
    {
      kind: "p",
      text: "However, reasonable monthly pricing can actually make a lot of sense.",
    },
    { kind: "p", text: "Monthly fees often cover:" },
    {
      kind: "ul",
      items: [
        "hosting,",
        "domain management,",
        "maintenance,",
        "support,",
        "small edits,",
        "updates,",
        "and ongoing assistance.",
      ],
    },
    { kind: "p", text: "The important thing is transparency." },
    { kind: "p", text: "Business owners should clearly understand:" },
    {
      kind: "ul",
      items: [
        "what is included,",
        "what they own,",
        "and what additional costs may exist.",
      ],
    },

    { kind: "h2", text: "What We Personally Focus On" },
    {
      kind: "p",
      text: "When building websites, we focus on everything that genuinely benefits the business.",
    },
    { kind: "p", text: "That includes:" },
    {
      kind: "ul",
      items: [
        "custom design,",
        "mobile and desktop compatibility,",
        "SEO setup,",
        "Google Business Profile assistance,",
        "hosting,",
        "domain setup,",
        "contact forms,",
        "booking systems,",
        "payment integrations,",
        "support,",
        "and training.",
      ],
    },
    {
      kind: "p",
      text: "We also provide inline editing systems so businesses can make certain small text changes themselves without constantly needing to contact us.",
    },
    { kind: "p", text: "The goal is not just to build a website." },
    { kind: "p", text: "The goal is to create something that:" },
    {
      kind: "ul",
      items: [
        "looks professional,",
        "stands out,",
        "generates leads,",
        "and genuinely helps the business grow.",
      ],
    },

    { kind: "h2", text: "Every Small Business Needs an Online Presence" },
    {
      kind: "p",
      text: "One thing we strongly believe is that there isn't just one type of business that benefits from having a website.",
    },
    {
      kind: "p",
      text: "Today, every business benefits from having a professional online presence.",
    },
    {
      kind: "p",
      text: "Without one, businesses are simply missing opportunities.",
    },
    { kind: "p", text: "People search online before making decisions." },
    { kind: "p", text: "If your business:" },
    {
      kind: "ul",
      items: [
        "doesn't appear professionally online,",
        "lacks credibility,",
        "or feels outdated,",
      ],
    },
    {
      kind: "p",
      text: "potential customers often move on to competitors.",
    },
    { kind: "p", text: "A good website builds trust immediately." },

    { kind: "h2", text: "Final Thoughts" },
    {
      kind: "p",
      text: "If there's one thing small business owners should take away from this article, it's this:",
    },
    {
      kind: "p",
      text: "Websites are not nearly as complicated as they seem when you find the right person to work with.",
    },
    {
      kind: "p",
      text: "For many businesses, the process can honestly become just a few conversations.",
    },
    { kind: "p", text: "After that, you suddenly have:" },
    {
      kind: "ul",
      items: [
        "an online presence,",
        "more credibility,",
        "lead generation opportunities,",
        "and a business that feels far more established.",
      ],
    },
    { kind: "p", text: "A website should not feel like a burden." },
    {
      kind: "p",
      text: "It should feel like an investment that actively helps your business grow.",
    },
    {
      kind: "p",
      text: "And in today's world, having a strong online presence is almost always a benefit to your business.",
    },
  ],
};

/* Both stories in this post are real jobs of ours, told without naming the
   client. Naming them would publish, on our own site, that a named local
   business was invisible on Google, which is their call to make and not
   ours. It would also contradict the UniSol case study over on /work, which
   describes the move as keeping the search equity the old site had earned. */
const notShowingOnGooglePost: BlogPost = {
  slug: "why-isnt-my-business-showing-up-on-google",
  title: "Why Isn't My Business Showing Up on Google?",
  metaTitle: "Why Isn't My Business Showing Up on Google?",
  description:
    "Your website exists but Google never shows it. Here are the real reasons that happens, the free checks that tell you which one you have, and how to fix each.",
  excerpt:
    "You search your own business name and your website isn't there. Before you spend a dollar on ads or SEO, here is how to find out whether Google can even see your site.",
  category: "SEO",
  publishedAt: "2026-08-03",
  updatedAt: "2026-08-03",
  readingMinutes: 9,
  keywords: [
    "why isn't my business showing up on google",
    "website not showing up on google",
    "website not indexed",
    "google search console sitemap",
    "business not on google maps",
    "local SEO Nanaimo",
  ],
  author: "VDT Sites",
  content: [
    {
      kind: "p",
      text: "You search your own business name, and your website isn't there.",
    },
    {
      kind: "p",
      text: "Maybe a directory listing shows up. Maybe a competitor does. Maybe your Facebook page. But not the website you paid for.",
    },
    {
      kind: "p",
      text: "It's one of the most common things small business owners come to us about, and it's usually followed by the same two guesses: that they need to start paying for ads, or that they need to write a lot more content.",
    },
    {
      kind: "p",
      text: "Most of the time, neither is the problem.",
    },
    {
      kind: "p",
      text: "In our experience the cause is almost always something smaller and far more fixable, and in the worst cases it's a single line of code quietly telling Google to stay away.",
    },
    {
      kind: "p",
      text: "This article walks through the real reasons a business website doesn't show up on Google, the free checks that tell you which one applies to you, and what to do about each.",
    },

    { kind: "h2", text: "First, There Are Two Different Problems Here" },
    {
      kind: "p",
      text: "Before checking anything, it's worth separating two situations that feel identical but are completely different.",
    },
    {
      kind: "p",
      text: "The first is that Google doesn't have your website at all. It has never stored your pages, so there is nothing for it to show anyone, no matter what they search.",
    },
    {
      kind: "p",
      text: "The second is that Google does have your website, but ranks it below your competitors.",
    },
    {
      kind: "p",
      text: "These need opposite responses.",
    },
    {
      kind: "p",
      text: "The second one is a long game. It's content, reviews, local signals and time.",
    },
    {
      kind: "p",
      text: "The first one is usually a technical fault, and it can often be fixed the same day.",
    },
    {
      kind: "p",
      text: "Spending months on SEO while the first problem is the real one is wasted effort, which is exactly why this is the thing to check before anything else.",
    },

    { kind: "h2", text: "The 30 Second Check That Tells You Which One You Have" },
    {
      kind: "p",
      text: "Go to Google and search this, using your own domain:",
    },
    {
      kind: "p",
      text: "site:yourbusiness.com",
    },
    {
      kind: "p",
      text: "No space after the colon, and no www needed.",
    },
    {
      kind: "p",
      text: "That search asks Google one question: which pages of this website do you actually have?",
    },
    { kind: "p", text: "There are three possible answers." },
    {
      kind: "ul",
      items: [
        "You see a healthy list of your pages, which means Google has your site and you have a ranking problem, not an indexing one,",
        "you see only one or two results when your site has many pages, which means most of your website is missing from Google,",
        "or you see nothing at all, which means Google does not have your website in any form.",
      ],
    },
    {
      kind: "p",
      text: "That last one sounds alarming, and it should. It also means the fix is usually quick.",
    },
    {
      kind: "p",
      text: "If you got the second or third answer, keep reading. The next two sections cover the causes we run into most.",
    },

    {
      kind: "h2",
      text: "Reason 1: Your Website Is Telling Google Not to List It",
    },
    {
      kind: "p",
      text: "Every website can carry an instruction that tells search engines to leave it out of results entirely. It's called a noindex tag.",
    },
    {
      kind: "p",
      text: "It exists for good reasons. While a site is being built, you don't want a half-finished version showing up in search results, so developers switch that instruction on deliberately.",
    },
    {
      kind: "p",
      text: "The problem is what happens at launch. It's one checkbox, on a settings page nobody opens twice, and if it doesn't get switched back off, the finished website goes live permanently invisible.",
    },
    {
      kind: "p",
      text: "Nothing about the site looks wrong. It loads perfectly. You can send someone the link and it works. Your business simply never appears in a search result again.",
    },
    {
      kind: "p",
      text: "We rebuilt a local accounting firm's website earlier this year, and this is exactly what we found on their old site. It had been live for years. It was excluded from Google the entire time, and nobody involved had any idea.",
    },
    {
      kind: "p",
      text: "The owner had assumed her firm was simply losing to bigger competitors. She wasn't losing to anyone. She wasn't in the race.",
    },
    { kind: "h3", text: "How to check for it" },
    {
      kind: "p",
      text: "The site: search above will already have hinted at this, because a noindexed site usually returns nothing at all.",
    },
    {
      kind: "p",
      text: "To confirm it, open your website, right click anywhere on the page and choose View Page Source. Then search that page for the word robots.",
    },
    {
      kind: "p",
      text: "If you find a line containing noindex, that's your answer, and it's the whole problem.",
    },
    {
      kind: "p",
      text: "Removing it is a small change for whoever maintains your site. Google usually starts picking the site up within days.",
    },

    { kind: "h2", text: "Reason 2: Google Doesn't Know Your Pages Exist" },
    {
      kind: "p",
      text: "This is the quieter version, and in some ways the more frustrating one, because everything genuinely is set up correctly.",
    },
    {
      kind: "p",
      text: "Google finds pages by following links. That works well for your homepage, which everyone links to, and much less well for the pages buried deeper in your site.",
    },
    {
      kind: "p",
      text: "A sitemap solves that. It's a single file listing every page on your website, so Google doesn't have to stumble across them.",
    },
    {
      kind: "p",
      text: "Most modern websites generate one automatically. The step that gets missed is telling Google it's there, which happens in a free tool called Google Search Console.",
    },
    {
      kind: "p",
      text: "We work with a local coffee roaster whose site had a perfectly good sitemap listing 36 pages. It had never been submitted.",
    },
    {
      kind: "p",
      text: "Three months after launch, Google had indexed 3 of those 36 pages.",
    },
    {
      kind: "p",
      text: "The city pages, the articles and the shop were all invisible, while paid advertising was running to the same website the whole time.",
    },
    {
      kind: "p",
      text: "Submitting the sitemap took about thirty seconds. All 36 pages were discovered immediately.",
    },
    {
      kind: "p",
      text: "That's the part worth sitting with. Months of a website being mostly invisible, undone by pressing a button nobody knew needed pressing.",
    },
    { kind: "h3", text: "How to check for it" },
    {
      kind: "p",
      text: "Sign in to Google Search Console, add your website if it isn't there already, and open the Sitemaps section.",
    },
    {
      kind: "p",
      text: "You want to see a sitemap listed, with a status of Success, and a page count that roughly matches how many pages your site actually has.",
    },
    {
      kind: "p",
      text: "If that section is empty, that's very likely your problem.",
    },

    { kind: "h2", text: "Reason 3: Your Website Is Genuinely New" },
    {
      kind: "p",
      text: "If your site launched in the last few weeks, some of this is simply patience.",
    },
    {
      kind: "p",
      text: "Google has to discover a new website, crawl it, and decide where it belongs. That takes time, and it takes longer for a brand new domain with nothing linking to it yet.",
    },
    {
      kind: "p",
      text: "That said, new is not a reason to sit and wait quietly.",
    },
    {
      kind: "p",
      text: "Set up Search Console, submit your sitemap, and use the Request Indexing option on your most important pages. That turns a wait of weeks into a wait of days.",
    },

    {
      kind: "h2",
      text: "Reason 4: You're Thinking of Google Maps, Not Google Search",
    },
    {
      kind: "p",
      text: "Plenty of the time, the real complaint isn't about the website at all.",
    },
    {
      kind: "p",
      text: "When someone searches for a service near them, the map with three businesses pinned on it usually sits above everything else. For a local business, that block is often more valuable than the normal results underneath it.",
    },
    {
      kind: "p",
      text: "That block does not come from your website. It comes from your Google Business Profile, which is a separate free listing you control.",
    },
    {
      kind: "p",
      text: "A business can have an excellent website and be completely absent from the map, because the two are managed in different places.",
    },
    {
      kind: "p",
      text: "If that's the gap, the work is on the profile itself:",
    },
    {
      kind: "ul",
      items: [
        "claim and verify the listing,",
        "choose the right primary category, which matters more than almost anything else,",
        "set the areas you actually serve,",
        "add real photos rather than stock,",
        "keep your hours accurate,",
        "and ask happy customers for reviews, steadily rather than all at once.",
      ],
    },
    {
      kind: "p",
      text: "We rebuilt our own profile from scratch not long ago and watched it go from invisible to competitive on local searches, without touching the website.",
    },

    {
      kind: "h2",
      text: "Reason 5: Google Has Your Site, It Just Doesn't Rank It",
    },
    {
      kind: "p",
      text: "If the site: search returned a healthy list of your pages, none of the above is your problem.",
    },
    { kind: "p", text: "You're indexed. You're just not winning." },
    {
      kind: "p",
      text: "That's a genuinely different piece of work, and it's slower, but the usual causes are consistent:",
    },
    {
      kind: "ul",
      items: [
        "your pages don't mention the towns you actually serve,",
        "every page is written around your business rather than around what customers search for,",
        "your site is slow, especially on a phone,",
        "you have far fewer reviews than the businesses above you,",
        "or nobody else on the internet links to you.",
      ],
    },
    {
      kind: "p",
      text: "The one that catches most small businesses is the second one.",
    },
    {
      kind: "p",
      text: "A page headed Welcome To Our Website is competing for nothing. A page about the specific service you offer, in the specific town you offer it in, is competing for something real.",
    },

    { kind: "h2", text: "The Order to Check These In" },
    {
      kind: "p",
      text: "If you do nothing else from this article, do these four things in this order:",
    },
    {
      kind: "ul",
      items: [
        "run the site: search on your own domain to find out whether Google has your website at all,",
        "if it returns nothing, check your page source for a noindex tag,",
        "set up Google Search Console and confirm your sitemap is submitted and succeeding,",
        "and claim your Google Business Profile if you haven't, because for a local business that listing often matters more than the website's own ranking.",
      ],
    },
    {
      kind: "p",
      text: "All four are free, and none of them require a developer to investigate.",
    },
    {
      kind: "p",
      text: "They will tell you whether you have a technical fault worth fixing this week, or a longer piece of work worth planning properly.",
    },

    { kind: "h2", text: "Final Thoughts" },
    {
      kind: "p",
      text: "The thing that stands out to us about both of the real examples in this article is that neither business had done anything wrong.",
    },
    {
      kind: "p",
      text: "They paid for websites. The websites were built. The sites loaded and looked fine.",
    },
    {
      kind: "p",
      text: "One had a single line of code excluding it from Google, and the other had a file that was never handed over. In both cases the businesses were quietly paying the cost for months or years without knowing there was anything to find.",
    },
    {
      kind: "p",
      text: "That's the honest reason we're writing this one down.",
    },
    {
      kind: "p",
      text: "Being invisible on Google usually isn't a sign that you need to spend more money. It's usually a sign that something small is broken, and nobody has looked.",
    },
    {
      kind: "p",
      text: "The checks above take a few minutes and cost nothing. It's worth knowing which situation you're in before anyone sells you a solution to the other one.",
    },
  ],
};

export const BLOG_POSTS: BlogPost[] = [notShowingOnGooglePost, websiteCostPost];

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
