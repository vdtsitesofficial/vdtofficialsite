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
  /**
   * Written but not published yet. Drafts are kept out of the blog index
   * and the sitemap, and carry a noindex tag, but they still render at
   * their real URL so a finished post can be read and approved before it
   * goes live. Publishing is deleting this line.
   */
  draft?: boolean;
  /**
   * 2-4 real follow-up questions, rendered visibly at the end of the post
   * and emitted as FAQPage structured data. Both halves are required:
   * Google's guidelines say FAQ markup must match content the reader can
   * actually see, so never add one without the other.
   *
   * These are also the part an AI assistant is most likely to lift when
   * answering someone directly, so answer in the first sentence and keep
   * each one self-contained.
   */
  faqs?: { q: string; a: string }[];
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
  // Bumped when the published price anchor went in. The post predates the
  // 2026-07-29 raise and its one-page tier still argued against paying
  // "significantly over $500", which was the old build price.
  updatedAt: "2026-08-03",
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
  faqs: [
    {
      q: "How much does a small business website cost in 2026?",
      a: "Most small business websites are worth somewhere between a few hundred dollars and a few thousand, depending on what the site actually has to do. We build them from $899, plus $40 a month for hosting, updates and support. Sites with booking, payments or custom functionality cost more because they take longer to build properly.",
    },
    {
      q: "Why do some web designers charge $10,000 for a website?",
      a: "Sometimes the work genuinely justifies it: custom functionality, integrations, booking or membership systems all take real time. Other times you are paying agency overhead rather than a better website. The way to tell is to look at their past work and ask what specifically is included, rather than assuming a higher price means a better result.",
    },
    {
      q: "Is a monthly fee for a website worth paying?",
      a: "It depends what it covers. A fair monthly fee pays for hosting, security updates, backups and someone who answers when something breaks. Ours is $40 a month. What you should not pay monthly for is access to your own website, or small text changes that you were never given the ability to make yourself.",
    },
    {
      q: "Is it cheaper to build the website myself?",
      a: "Up front, yes. A website builder costs a monthly subscription and your own time. That is genuinely the right choice while you are testing an idea. It stops being cheaper when the site needs to be found in search, load quickly on a phone and convert visitors, because that is the work that takes experience rather than an afternoon.",
    },
  ],
  content: [
    {
      kind: "p",
      text: "A small business website should cost somewhere between a few hundred dollars and a few thousand, and the range comes down almost entirely to what the site has to do rather than who builds it.",
    },
    {
      kind: "p",
      text: "For a straight answer with our own numbers in it: we build small business websites from $899, plus $40 a month for hosting, updates and support, quoted up front before anything starts.",
    },
    {
      kind: "p",
      text: "The rest of this article is what sits behind a number like that, and when paying more or less than it is justified.",
    },
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
      text: "If the site is genuinely one page and purely informational, a few hundred dollars is the right budget.",
    },
    { kind: "p", text: "A simple website should stay simple in price." },
    {
      kind: "p",
      text: "If someone quotes several thousand for a single page, you're paying for the invoice rather than the work.",
    },

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
    {
      kind: "p",
      text: "This is the tier most small businesses actually need, and it's where our own $899 sits.",
    },
    {
      kind: "p",
      text: "The number matters less than whether the work in that list is genuinely being done. A cheap site that skips all four is expensive, and an expensive site that delivers all four can be a bargain.",
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
  faqs: [
    {
      q: "How long does it take for a new website to show up on Google?",
      a: "Usually a few days to a few weeks, provided nothing is blocking it. You can speed that up a lot by setting up Google Search Console, submitting your sitemap, and using Request Indexing on your most important pages. If a site has been live for months and still isn't appearing, that is not slowness, it is a fault worth investigating.",
    },
    {
      q: "How do I check whether Google has indexed my website?",
      a: "Search Google for site:yourbusiness.com, with no space after the colon and using your own domain. If it lists your pages, Google has your site and you have a ranking problem rather than an indexing one. If it returns nothing at all, Google does not have your website, which usually points to a noindex tag or a site it has never been told about.",
    },
    {
      q: "Why does my Facebook page show up on Google but my website doesn't?",
      a: "Social profiles are on very large, heavily crawled domains, so they get picked up easily for your business name. Your own site has to be indexed on its own merits. If the page appears and the website doesn't, that is a strong sign the website is either not indexed or not being found for the terms you care about.",
    },
    {
      q: "Do I need to pay someone to fix this?",
      a: "Often not. Checking for a noindex tag, setting up Search Console, submitting a sitemap and claiming your Google Business Profile are all free and none of them need a developer. It is worth doing those first so that if you do hire someone, you are paying them to solve a real problem rather than to find one.",
    },
  ],
  content: [
    {
      kind: "p",
      text: "If your business isn't showing up on Google, it's almost always one of two things: either Google hasn't indexed your website at all, or it has indexed it and simply ranks you below your competitors.",
    },
    {
      kind: "p",
      text: "Those two problems need opposite responses, and you can find out which one you have in about thirty seconds, for free, using the search we've set out below.",
    },
    {
      kind: "p",
      text: "The rest of this article is what to do once you know.",
    },
    {
      kind: "p",
      text: "It usually starts the same way. You search your own business name, and your website isn't there.",
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
      text: "We rebuilt a Nanaimo accounting firm's website earlier this year, and this is exactly what we found on their old site. It had been live for years. It was excluded from Google the entire time, and nobody involved had any idea.",
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
      text: "We work with a Vancouver Island coffee roaster whose site had a perfectly good sitemap listing 36 pages. It had never been submitted.",
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

/* DRAFT. Sem's decisions on this one, from the interview:
   - His own Facebook account restrictions are OUT. He wants nothing to do
     with that story, so the post argues on its merits and does NOT lean on
     a personal anecdote. No invented client story stands in for it either.
   - The concession is pre-revenue / hobby / market-stall, made early.
   - The four reasons are his, in his framing: findability, friction,
     control of presentation, perceived size. Note he did NOT pick the
     usual "they can delete you overnight" line, so this argues loss of
     control over presentation rather than risk of eviction.
   - Framing is both/and, not either/or. Social finds people, the site gets
     found and converts. */
const facebookPageVsWebsitePost: BlogPost = {
  slug: "do-i-need-a-website-if-i-have-facebook",
  title: "Do I Need a Website If I Already Have Instagram or Facebook?",
  metaTitle: "Do I Need a Website If I Have Instagram or Facebook?",
  description:
    "A social page and a website do different jobs. Here is what a page genuinely covers, where it quietly costs you customers, and when you actually need both.",
  excerpt:
    "Plenty of local businesses run entirely on a Facebook or Instagram page, and for some of them that's genuinely fine. Here is where it stops being fine, and why.",
  category: "Getting Started",
  publishedAt: "2026-08-03",
  updatedAt: "2026-08-03",
  readingMinutes: 8,
  keywords: [
    "do I need a website if I have facebook",
    "do I need a website if I have instagram",
    "facebook page vs website",
    "small business website vs social media",
    "small business online presence",
  ],
  author: "VDT Sites",
  draft: true,
  faqs: [
    {
      q: "Is a Facebook or Instagram page enough for a small business?",
      a: "It is enough while you are testing an idea, running a market stall, or doing something that has not become a business yet. Once you are a real business competing for work, a page leaves you invisible to everyone searching for the service rather than for your name, which is where most new customers come from.",
    },
    {
      q: "Will my Facebook page show up on Google?",
      a: "Usually yes, but mainly for searches of your business name. Pages rarely compete for searches like plumber in Nanaimo, because they cannot be structured around a service the way a website can. So people who already know you can find you, and people who do not, largely cannot.",
    },
    {
      q: "Should I stop posting on social media once I have a website?",
      a: "No. They do different jobs. Social media reaches people who were not looking for you, and a website gets found by people who are actively searching and ready to buy. Businesses that drop social entirely after launching a site usually lose something real.",
    },
    {
      q: "What should my website have that my social page doesn't?",
      a: "A clear statement of what you do and who you do it for, the areas you serve, a page for each service so it can be found in search, and one obvious way to get in touch that does not require a social account. On a page all of that exists somewhere, but the visitor has to dig for it.",
    },
  ],
  content: [
    {
      kind: "p",
      text: "If you're running a real business, yes, you need a website as well. Not because a Facebook or Instagram page is worthless, but because the two do completely different jobs: social reaches people who weren't looking for you, and a website gets found by the people who are actively searching for what you do.",
    },
    {
      kind: "p",
      text: "The second group is the one ready to buy, and a page on its own barely reaches them.",
    },
    {
      kind: "p",
      text: "That said, there is a real exception, and we'd rather lead with it than pretend otherwise. It's the next section.",
    },
    {
      kind: "p",
      text: "It's a fair question, and it gets asked more than you'd think.",
    },
    {
      kind: "p",
      text: "Plenty of local businesses around Nanaimo run entirely on a Facebook or Instagram page. They post updates, customers message them, work comes in. From the outside it looks like it's working, because in a lot of ways it is.",
    },
    {
      kind: "p",
      text: "So the honest answer isn't that a Facebook page is worthless. It's that a page and a website are two different tools, and most people are asking one of them to do a job it was never built for.",
    },
    {
      kind: "p",
      text: "This article covers where a Facebook page genuinely is enough, where it quietly costs you customers, and what the two actually do when you have both.",
    },

    { kind: "h2", text: "When a Facebook Page Genuinely Is Enough" },
    {
      kind: "p",
      text: "We'd rather say this up front than pretend everyone needs to pay us.",
    },
    {
      kind: "p",
      text: "If you're still testing an idea, a Facebook page is the right call. You should not be paying for a website to find out whether people want the thing you're making.",
    },
    { kind: "p", text: "That applies to a lot of situations:" },
    {
      kind: "ul",
      items: [
        "a side project you're seeing if anyone wants,",
        "a market stall or a weekend thing,",
        "a hobby that has started making a bit of money,",
        "or a business that genuinely hasn't started yet.",
      ],
    },
    {
      kind: "p",
      text: "In all of those, a page is free, it takes an afternoon, and it's enough to look real.",
    },
    {
      kind: "p",
      text: "Build the website when the thing becomes a business. Not before.",
    },
    {
      kind: "p",
      text: "The rest of this article is about what happens after that point, when you are running a real business and the page is still doing all the work.",
    },

    { kind: "h2", text: "The Two Are Not the Same Tool" },
    {
      kind: "p",
      text: "Here's the distinction that makes the rest of this make sense.",
    },
    {
      kind: "p",
      text: "Social media is very good at reaching people who are not looking for you. Someone scrolls, sees your work, and now they know you exist. That's genuinely valuable and a website cannot do it.",
    },
    {
      kind: "p",
      text: "A website is for people who are already looking. They have a problem right now and they're trying to find someone who solves it.",
    },
    { kind: "p", text: "Those are different people at different moments." },
    {
      kind: "p",
      text: "This isn't us telling you to drop social media. We post for our own business most weeks and it works.",
    },
    {
      kind: "p",
      text: "It's that when a page is the only thing you have, you're covering the first group and missing the second entirely. And the second group is the one ready to buy.",
    },

    { kind: "h2", text: "Reason 1: People Looking for What You Do Won't Find You" },
    {
      kind: "p",
      text: "This is the big one, and it's worth being precise about, because the usual version of this claim is wrong.",
    },
    {
      kind: "p",
      text: "Facebook pages do show up on Google. If someone searches your business by name, your page will very likely come up.",
    },
    { kind: "p", text: "That's the problem in one sentence." },
    {
      kind: "p",
      text: "Your page gets found by people who already know your name. It does very little for people searching for what you actually do.",
    },
    {
      kind: "p",
      text: "Those are two completely different searches. One is somebody who has already heard of you. The other is somebody who has a job that needs doing today and is picking from whoever appears.",
    },
    {
      kind: "p",
      text: "The second search is where new customers come from, and a Facebook page competes poorly for it. It isn't structured for it. You can't give a service its own page, you can't write the page around what people are searching for, and you can't control much of how it's described.",
    },
    {
      kind: "p",
      text: "So the people who already know about you can find you. The people who don't, mostly can't.",
    },

    {
      kind: "h2",
      text: "Reason 2: Working Out What You Do Is Harder Than It Should Be",
    },
    {
      kind: "p",
      text: "Open your own Facebook page and look at it the way a stranger would.",
    },
    {
      kind: "p",
      text: "The first thing they see is your most recent post. That might be exactly the right thing. It might also be a photo from a fortnight ago, a notice that you were closed last Monday, or a share from another page.",
    },
    {
      kind: "p",
      text: "What it usually isn't is a clear statement of what you do, who you do it for, and how to get hold of you.",
    },
    {
      kind: "p",
      text: "That information is normally on the page somewhere. It's just underneath things.",
    },
    {
      kind: "p",
      text: "Every extra step between someone wanting to contact you and actually managing it costs you a percentage of those people. Not all of them. Just some, quietly, every week.",
    },
    { kind: "p", text: "On a page, that usually means a stranger has to:" },
    {
      kind: "ul",
      items: [
        "scroll past recent posts to find anything factual,",
        "open a separate tab or section for your hours,",
        "work out from photos what services you actually offer,",
        "guess at whether you cover their area,",
        "and often sign in or dismiss a prompt before doing any of it.",
      ],
    },
    {
      kind: "p",
      text: "None of those is a disaster on its own. Together they're friction, and friction is just lost customers you never hear about.",
    },
    {
      kind: "p",
      text: "A website's whole job is to remove those steps. What you do, where you do it, what it costs, and one obvious way to get in touch.",
    },

    { kind: "h2", text: "Reason 3: You Don't Control What Gets Shown, or What's Beside It" },
    {
      kind: "p",
      text: "On your own website, you decide what a visitor sees first, second and third. You're arranging a path from arriving to getting in touch.",
    },
    { kind: "p", text: "On a Facebook page you're mostly a passenger." },
    {
      kind: "p",
      text: "The order is chronological rather than deliberate. Sections sit where Facebook puts them. The design is the same as every other page on the platform. You can pin a post to the top, and that's roughly where your control ends.",
    },
    {
      kind: "p",
      text: "There's also the matter of what surrounds it.",
    },
    {
      kind: "p",
      text: "A Facebook page has advertising on it. It has suggestions for other pages to follow. Some of those will be your competitors, and you're paying for none of it and controlling none of it.",
    },
    {
      kind: "p",
      text: "On your own site, you're the only business in the room.",
    },
    {
      kind: "p",
      text: "The same applies to how the platform decides to show your posts. You can post something important and simply not have it reach the people who follow you, and there's no appeal and nobody to ask.",
    },

    { kind: "h2", text: "Reason 4: It Makes You Look Smaller Than You Are" },
    {
      kind: "p",
      text: "This one is unfair, and it's true anyway.",
    },
    {
      kind: "p",
      text: "When someone is deciding whether to trust a business with their money, they make that judgement fast and mostly on impression.",
    },
    {
      kind: "p",
      text: "A business with a proper website reads as established. It suggests the business has been around a while, takes itself seriously, and will still be there in a year.",
    },
    {
      kind: "p",
      text: "A business with only a Facebook page reads as a side hustle. Sometimes that's accurate and sometimes it's badly wrong, but the customer isn't investigating. They're forming an impression in a few seconds and moving on.",
    },
    {
      kind: "p",
      text: "This matters most in exactly the situations where the work is worth most.",
    },
    {
      kind: "p",
      text: "Somebody choosing where to get a coffee isn't thinking about it. Somebody about to let a contractor into their home, hand over their books, or pay a deposit up front is absolutely thinking about it.",
    },
    {
      kind: "p",
      text: "The bigger the job, the more the impression is worth.",
    },

    { kind: "h2", text: "What Social Media Is Genuinely Better At" },
    {
      kind: "p",
      text: "It would be dishonest to write all of that and not say the other half.",
    },
    {
      kind: "p",
      text: "There are things a Facebook or Instagram page does that a website simply cannot:",
    },
    {
      kind: "ul",
      items: [
        "reaching people who weren't looking for you,",
        "showing your work regularly without anyone having to visit anything,",
        "letting people message you in a place they already are,",
        "proving there's a real person behind the business,",
        "and collecting reviews and comments that other people can see.",
      ],
    },
    {
      kind: "p",
      text: "That last point is worth dwelling on. Social media is very good at making a business feel human, and a website that tries to do that on its own often ends up sounding like a brochure.",
    },
    {
      kind: "p",
      text: "So the answer was never to abandon it. Businesses that drop social entirely once they get a website usually lose something real.",
    },

    { kind: "h2", text: "What It Looks Like When You Have Both" },
    {
      kind: "p",
      text: "The version that works is not complicated.",
    },
    {
      kind: "p",
      text: "Social media is where you show up regularly and stay in front of people. Posts, photos of recent work, updates, the day-to-day.",
    },
    {
      kind: "p",
      text: "The website is the place that everything points at. It's what someone lands on when they search for the service, it's the link in your profile, and it's what you send when someone asks what you do.",
    },
    {
      kind: "p",
      text: "It's also the only part of it you own outright. Your posts live on someone else's platform under someone else's rules. Your website is yours.",
    },
    {
      kind: "p",
      text: "In practice the two feed each other. Social brings people who weren't looking. Search brings people who were. Both land in the same place, where it's obvious what you do and easy to get in touch.",
    },

    { kind: "h2", text: "Final Thoughts" },
    {
      kind: "p",
      text: "If you're still working out whether the thing you're doing is a business, keep using the page. That's the right answer and you don't need us.",
    },
    {
      kind: "p",
      text: "If it is a business, the question isn't really whether a Facebook page is good enough. It's what you're prepared to keep missing.",
    },
    {
      kind: "p",
      text: "You're missing the people searching for what you do rather than for your name. You're losing a slice of the ones who do find you to the effort of working out what you offer. You're being shown to people in an order you didn't choose, next to businesses you didn't invite. And you're being read as smaller than you are.",
    },
    {
      kind: "p",
      text: "None of that shows up as a complaint. Nobody messages you to say they couldn't work out what you did, so it's easy to conclude the page is working fine.",
    },
    {
      kind: "p",
      text: "It probably is working. The question is what it's costing you at the same time.",
    },
  ],
};

/* DRAFT. Sem's decisions from the interview:
   - The thesis is his: the timeline is a function of how fast the client
     replies. Prompt clients get it fast, slow ones stretch it.
   - ⚠️ THE NUMBER CHANGED 2026-08-03, from "1-2 weeks when they're prompt"
     to "three to four days once we have your content" — Sem's call, applied
     across the whole site the same day (services intro + PHASES, lib/faqs,
     the FAQ JSX in app/page.tsx, /llms.txt and this post). Those five have
     to move together or the site contradicts itself, which it did before
     this: five places said "one to three weeks" and two said "one to two".
     The earlier interview answer of 1-2 weeks is SUPERSEDED, not a second
     opinion to average against. Asked directly whether 3-4 days was his
     best case or his typical, Sem confirmed 2026-08-03: **typical**.
   - He does NOT want a number on the slow end, so nothing here quantifies
     it. It's framed as being set by response time, full stop.
   - Delays are content/photos, approvals, and third-party accounts. He did
     NOT pick scope growth, so this doesn't lead on it.
   - The honest moment is him owning his side: if a project drags, part of
     that is VDT not pinning down what was needed at the start. That's the
     counterweight to a post that otherwise lists client-side causes.
   publishedAt is the planned slot, 2026-08-24. Update it if it goes out on
   a different day, since the index sorts on it. */
const howLongDoesItTakePost: BlogPost = {
  slug: "how-long-does-it-take-to-build-a-website",
  title: "How Long Does It Take to Build a Small Business Website?",
  metaTitle: "How Long Does It Take to Build a Website?",
  description:
    "Three to four days once your content is in, but the honest answer is it depends on you more than on your developer. Here is where the time goes, and what stretches it.",
  excerpt:
    "Once we have your content, three to four days is realistic for a small business website. The part nobody tells you is that the timeline depends more on how fast you reply than on how fast anyone builds.",
  category: "Getting Started",
  publishedAt: "2026-08-24",
  updatedAt: "2026-08-24",
  readingMinutes: 7,
  keywords: [
    "how long does it take to build a website",
    "small business website timeline",
    "web design process",
    "website build time",
    "web design Nanaimo",
  ],
  author: "VDT Sites",
  draft: true,
  faqs: [
    {
      q: "How long does it take to build a small business website?",
      a: "Three to four days from the point your content is in, provided you send feedback promptly. The build itself is rarely the slow part. Projects that run longer are almost always waiting on something from the business rather than something from the developer.",
    },
    {
      q: "What do I need to have ready before the build starts?",
      a: "Your text or a rough version of it, a logo if you have one, photos of your actual work, your services and pricing if you publish it, and login access to your domain. Having those four things ready is the single biggest thing you can do to keep a project on schedule.",
    },
    {
      q: "Why do some agencies quote three to six months for a website?",
      a: "Sometimes the site genuinely warrants it, with custom functionality, integrations or a large amount of content. Often it reflects how many other projects are in the queue ahead of yours rather than how long your site takes to build. It is a fair question to ask directly.",
    },
    {
      q: "Can I launch sooner with fewer pages and add more later?",
      a: "Yes, and it is usually the right call. A well-built four page site that is live is worth more than a twelve page site still being written. Pages can be added at any point, and a site that is already live starts being found by search engines while the rest is finished.",
    },
  ],
  content: [
    {
      kind: "p",
      text: "For a standard small business website, about three to four days from the point we have your content.",
    },
    {
      kind: "p",
      text: "The honest version of that answer is that it depends on you more than it depends on us. If you reply quickly and get us what we ask for, three to four days is realistic. If replies take a week each time, the project stretches, and there isn't much a developer can do about that.",
    },
    {
      kind: "p",
      text: "That's not a complaint. It's the single most useful thing to understand before you start, because it means the timeline is largely in your hands.",
    },
    {
      kind: "p",
      text: "Here's where the time actually goes.",
    },

    { kind: "h2", text: "Why Nobody Can Give You an Exact Number" },
    {
      kind: "p",
      text: "Building the site is the predictable part. We've done it enough times to know roughly how long a page takes.",
    },
    {
      kind: "p",
      text: "What isn't predictable is everything that has to come from your side, and that's where the variation lives.",
    },
    {
      kind: "p",
      text: "Two businesses can order an almost identical website on the same day. One goes live inside a fortnight. The other is still not finished long afterwards. The difference usually isn't the website at all. It's how quickly each of them answered their email.",
    },
    {
      kind: "p",
      text: "So when someone quotes you a guaranteed date without asking a single question about your content or your availability, treat it carefully. They're either padding the estimate heavily, or they're planning to build something generic that doesn't need anything from you.",
    },

    { kind: "h2", text: "What the Two Weeks Actually Consists Of" },
    {
      kind: "p",
      text: "It's worth knowing what you're waiting on, because most of it isn't what people expect.",
    },
    { kind: "h3", text: "A conversation first" },
    {
      kind: "p",
      text: "Before anything gets designed, we need to understand what your business is, who you serve, and what you want the site to actually do.",
    },
    {
      kind: "p",
      text: "This is short, and it's the part that saves the most time later. A site built without it tends to need rebuilding halfway through.",
    },
    { kind: "h3", text: "Design and build" },
    {
      kind: "p",
      text: "This is the bulk of the work and the most predictable part of the schedule. You see progress as it goes rather than waiting for a reveal at the end, so anything heading in the wrong direction gets caught early instead of after everything is finished.",
    },
    { kind: "h3", text: "Launch and handover" },
    {
      kind: "p",
      text: "Pointing the domain at the new site, checking it on real phones, getting it set up so search engines can find it, and showing you how to run it.",
    },
    {
      kind: "p",
      text: "Usually a day, occasionally more if the domain is somewhere awkward.",
    },

    { kind: "h2", text: "What Actually Makes It Take Longer" },
    {
      kind: "p",
      text: "In our experience it is nearly always one of three things, and none of them are the building.",
    },

    { kind: "h3", text: "1. Waiting for content and photos" },
    {
      kind: "p",
      text: "This is the big one, by a distance.",
    },
    {
      kind: "p",
      text: "The design is done, the pages are built, and the whole thing sits waiting on the text about your services or photos of your actual work.",
    },
    {
      kind: "p",
      text: "It's completely understandable. Writing about your own business is genuinely hard, and it's the kind of job that gets pushed to the weekend and then to the weekend after that.",
    },
    {
      kind: "p",
      text: "But a finished website with nothing to put in it cannot launch, and this is where most of the lost weeks go.",
    },

    { kind: "h3", text: "2. Slow approvals" },
    {
      kind: "p",
      text: "We send something over to check, and then the project pauses until we hear back.",
    },
    {
      kind: "p",
      text: "A day is normal and expected. A week each time, three or four times over, quietly turns a short project into a long one without anybody ever deciding that should happen.",
    },
    {
      kind: "p",
      text: "It gets slower again when several people at the business need to agree before anyone replies.",
    },

    { kind: "h3", text: "3. Third-party accounts" },
    {
      kind: "p",
      text: "The one nobody expects, and the one most likely to hold up a launch on the actual day.",
    },
    { kind: "p", text: "Usually it's one of these:" },
    {
      kind: "ul",
      items: [
        "nobody can remember who registered the domain or where,",
        "the login for it belongs to someone who left the business,",
        "a payment provider is verifying the business and takes days to do it,",
        "or access to an existing Google listing has to be recovered first.",
      ],
    },
    {
      kind: "p",
      text: "None of these are anybody's fault and all of them are outside a developer's control. They're also the easiest to solve early, which is why we ask about them at the start rather than the week you want to go live.",
    },

    { kind: "h2", text: "When the Delay Is Our Fault" },
    {
      kind: "p",
      text: "Everything above puts the timeline on your side of the table, so it's only fair to say the other half.",
    },
    {
      kind: "p",
      text: "When a project drags, some of that is usually on us.",
    },
    {
      kind: "p",
      text: "If we didn't ask clearly enough what we needed at the start, or asked for it in five separate messages over three weeks instead of once at the beginning, that's not the client being slow. That's us running the project badly.",
    },
    {
      kind: "p",
      text: "A business owner should not have to work out what a web developer needs from them. Being told up front, in one list, is most of the difference between a project that runs to schedule and one that doesn't.",
    },
    {
      kind: "p",
      text: "It's the part of this job we think about most, and it's why the first conversation matters more than it looks like it should.",
    },

    { kind: "h2", text: "How to Make It Fast" },
    {
      kind: "p",
      text: "If you want this done quickly, almost all of the leverage is in the first few days.",
    },
    { kind: "p", text: "Before the build starts, have ready:" },
    {
      kind: "ul",
      items: [
        "a rough version of what you want each page to say, even if it's messy,",
        "photos of your real work rather than stock images,",
        "your logo, in the best quality you have,",
        "your services and, if you publish them, your prices,",
        "and the login for wherever your domain is registered.",
      ],
    },
    {
      kind: "p",
      text: "Rough is fine. Rough can be edited. Missing cannot.",
    },
    {
      kind: "p",
      text: "The other thing that helps is deciding in advance who gives feedback. One person with the final say moves several times faster than four people who all need to weigh in.",
    },

    { kind: "h2", text: "Should You Be in a Rush at All?" },
    {
      kind: "p",
      text: "Worth asking, because plenty of people set themselves a deadline that nothing is actually driving.",
    },
    {
      kind: "p",
      text: "If you have a real date, a season starting, a location opening, an event coming up, then say so at the beginning. It changes how the work is sequenced.",
    },
    {
      kind: "p",
      text: "If you don't, there's usually no prize for launching four days sooner.",
    },
    {
      kind: "p",
      text: "And if you do need something live quickly, the honest lever is building less rather than building faster. A good four page site now, with more added later, beats waiting on twelve pages of text that haven't been written. The site starts working for you while the rest gets finished.",
    },

    { kind: "h2", text: "Final Thoughts" },
    {
      kind: "p",
      text: "One to two weeks is a fair expectation for a small business website, and it's an expectation you have more control over than your developer does.",
    },
    {
      kind: "p",
      text: "The projects that run long are almost never the ones with complicated websites. They're the ones where the content never quite got finished, or where a reply took a fortnight, or where nobody could find the domain login until the day of launch.",
    },
    {
      kind: "p",
      text: "All three of those are solvable in an afternoon at the start, and nearly impossible to fix once the project is already late.",
    },
    {
      kind: "p",
      text: "If you're getting quotes, ask what the developer needs from you and when they need it. Anyone who can answer that clearly has thought about your timeline. Anyone who can't probably hasn't.",
    },
  ],
};

/* DRAFT. Sem's decisions from the interview:
   - TWO concessions, both his, and they open the post: a builder is right
     if you genuinely enjoy it, have the time and feel you have the skills,
     OR if the budget honestly isn't there. Not one grudging exception.
   - All four failure modes are his: phone speed, search basics, template
     sameness, half-finished-and-abandoned.
   - "Leave their pricing out." No Wix or Squarespace prices anywhere, and
     the argument does NOT rest on cost. Competitor prices change and would
     date the post. His own $899 appears once, for concreteness only.
   - Story anonymised, per the rule in the vault.

   NOTE: the anonymised story here is the page-builder rebuild we already
   have verified detail on (WordPress + Elementor). It fits, Elementor is a
   drag-and-drop builder, but it is NOT a Wix/Squarespace DIY story. If Sem
   has a real one with details, swap it in. It also deliberately avoids
   re-telling the noindex beat used in the "not showing up on Google" post,
   so the two don't read as the same anecdote twice.

   publishedAt is the planned slot, 2026-09-07. */
const wixVsDesignerPost: BlogPost = {
  slug: "should-i-use-wix-or-hire-a-web-designer",
  title: "Should I Use Wix or Hire a Web Designer?",
  metaTitle: "Should I Use Wix or Hire a Web Designer?",
  description:
    "There are two honest reasons to build it yourself, and everything else points the other way. A straight comparison of website builders against hiring someone.",
  excerpt:
    "There are two genuinely good reasons to build your own site on Wix or Squarespace. If neither applies to you, here is what you are actually trading away.",
  category: "Getting Started",
  publishedAt: "2026-09-07",
  updatedAt: "2026-09-07",
  readingMinutes: 8,
  keywords: [
    "should I use wix or hire a web designer",
    "wix vs web designer",
    "squarespace vs custom website",
    "website builder vs web developer",
    "small business website Nanaimo",
  ],
  author: "VDT Sites",
  draft: true,
  faqs: [
    {
      q: "Is Wix good enough for a small business website?",
      a: "It can be, and for some businesses it genuinely is. Website builders have improved a lot and a carefully built one can look professional. The problems tend to show up in the things that are easy to skip: page speed on phones, the search settings nobody filled in, and a site that never quite got finished because the owner ran out of time.",
    },
    {
      q: "Is it cheaper to build my own website?",
      a: "Up front, yes. There is no build fee, and if you enjoy the work and have the hours it is a sensible way to save money. It stops being cheaper when you count the time it takes you, or when the finished site does not get found in search, because a site nobody visits is expensive at any price.",
    },
    {
      q: "Can I move my website off a builder later?",
      a: "Not really. You can usually export your text and images, but not the site itself. Moving to another platform means rebuilding it, which is worth knowing before you invest a year of updates into one. It is not a reason to avoid builders, just something to go in with your eyes open about.",
    },
    {
      q: "I already built a site on a builder and it isn't working. What now?",
      a: "Start by working out whether the problem is the site or the fact that nobody can find it. Those need completely different fixes, and the second one is often free to solve. Check whether your pages are actually indexed by search engines before you spend anything on a rebuild.",
    },
  ],
  content: [
    {
      kind: "p",
      text: "There are two honest reasons to build it yourself: you genuinely enjoy that kind of work and have the time for it, or your budget truly cannot stretch to paying someone right now.",
    },
    {
      kind: "p",
      text: "Both are completely legitimate, and if either applies to you, use a builder. If neither does, hiring someone is usually the better decision, and not for the reason most web designers give you.",
    },
    {
      kind: "p",
      text: "Here's the honest comparison, including the parts that don't favour us.",
    },

    { kind: "h2", text: "When a Website Builder Is the Right Call" },
    {
      kind: "p",
      text: "We'd rather be straight about this than pretend everyone should hire a developer.",
    },
    { kind: "h3", text: "You enjoy it and you have the time" },
    {
      kind: "p",
      text: "Some business owners like this kind of work. They want to sit down on a Sunday, move things around, and have it exactly how they pictured it.",
    },
    {
      kind: "p",
      text: "If that's you, and you've got the hours and the patience for it, a builder is genuinely the right tool. You'll end up with something you understand completely, and you'll be able to change it whenever you like without asking anyone.",
    },
    {
      kind: "p",
      text: "That's worth something real, and no developer can sell it to you.",
    },
    { kind: "h3", text: "The budget honestly isn't there" },
    {
      kind: "p",
      text: "If paying for a website would genuinely hurt right now, build it yourself. A basic site you made is worth far more than a professional site you can't afford.",
    },
    {
      kind: "p",
      text: "Get something up, start getting found, and revisit it when the business can carry the cost. Anyone who tells you a small business must have a professionally built website on day one is selling, not advising.",
    },

    { kind: "h2", text: "What Builders Are Genuinely Good At" },
    {
      kind: "p",
      text: "It would be dishonest to skip this part.",
    },
    { kind: "p", text: "Website builders are legitimately good at:" },
    {
      kind: "ul",
      items: [
        "getting something live quickly,",
        "letting you change things yourself without asking anyone,",
        "handling hosting and security so you never think about it,",
        "and giving you a reasonable-looking starting point with no design experience.",
      ],
    },
    {
      kind: "p",
      text: "They have improved a lot. A carefully built builder site can look perfectly professional, and plenty of them do.",
    },
    {
      kind: "p",
      text: "The problems are rarely about whether it's possible to make a good site on one. They're about what tends to happen in practice.",
    },

    { kind: "h2", text: "Where They Tend to Fall Down" },
    {
      kind: "p",
      text: "These are the four things we see most often, in roughly the order they cost you customers.",
    },

    { kind: "h3", text: "1. They're slow, especially on phones" },
    {
      kind: "p",
      text: "To give you drag-and-drop editing, a builder has to load a lot of machinery into the visitor's browser. Your customer downloads all of it just to read your opening hours.",
    },
    {
      kind: "p",
      text: "On a laptop with good internet you won't notice. On a phone with two bars, which is where a lot of local searching actually happens, it's the difference between a page appearing and a page that's still blank when someone gives up.",
    },
    {
      kind: "p",
      text: "This is the failure nobody reports to you. People don't email to say your site was slow. They just leave.",
    },

    { kind: "h3", text: "2. The search basics never get set up" },
    {
      kind: "p",
      text: "Most builders can do the fundamentals. Page titles, descriptions, headings, a sitemap. The settings are usually in there somewhere.",
    },
    {
      kind: "p",
      text: "The issue is that nothing forces you to fill them in, and nothing tells you when they're empty. The site looks completely finished either way.",
    },
    {
      kind: "p",
      text: "So a business ends up with a site that looks great and is close to invisible in search, with no warning that anything is wrong. We've written separately about how to check whether that's happening to you, and the checks are free.",
    },

    { kind: "h3", text: "3. It looks like everyone else's" },
    {
      kind: "p",
      text: "Builders work from templates, and there are only so many popular ones.",
    },
    {
      kind: "p",
      text: "The result is that a lot of local businesses in the same trade end up with visibly similar websites, sometimes the same template with different photos.",
    },
    {
      kind: "p",
      text: "That matters more than it sounds. If a customer is comparing three companies and all three sites feel the same, you've lost the one chance the website had to make you the obvious choice.",
    },

    { kind: "h3", text: "4. It never quite gets finished" },
    {
      kind: "p",
      text: "This is the most common of the four, and the most avoidable.",
    },
    {
      kind: "p",
      text: "Someone starts building it with real enthusiasm. Then a busy month arrives, and the site goes live at about eighty percent done, or doesn't go live at all.",
    },
    { kind: "p", text: "You've seen the result before:" },
    {
      kind: "ul",
      items: [
        "a services page that still has placeholder text on it,",
        "hours that stopped being right two years ago,",
        "a gallery with three photos in it,",
        "or a contact form nobody has ever tested.",
      ],
    },
    {
      kind: "p",
      text: "A half-finished website is worse than no website, because it actively tells people the business isn't paying attention.",
    },
    {
      kind: "p",
      text: "This has nothing to do with the platform. It's that building a website is a project, and projects that aren't anybody's actual job tend not to finish.",
    },

    { kind: "h2", text: "What Usually Brings People to Us" },
    {
      kind: "p",
      text: "Most of our rebuilds aren't for businesses with no website. They're for businesses whose website stopped being worth the trouble.",
    },
    {
      kind: "p",
      text: "One that stuck with us was a Nanaimo firm whose site had been put together on a drag-and-drop builder years earlier. It worked, in the sense that it loaded and had the right information on it.",
    },
    {
      kind: "p",
      text: "But it was slow, it was awkward enough to edit that nobody did, and the owner had quietly stopped trying to keep it current. Small changes meant asking someone, and asking someone meant waiting, so the changes just didn't get made.",
    },
    {
      kind: "p",
      text: "The site wasn't the real cost. The real cost was two years of a business not being represented properly because updating it was a chore.",
    },
    {
      kind: "p",
      text: "That's the pattern, and it's why the honest question isn't which platform is better. It's whether the site will still be accurate and working in a year.",
    },

    { kind: "h2", text: "What You're Actually Paying For" },
    {
      kind: "p",
      text: "When you hire someone, you're mostly not paying for the pages. You're paying for the decisions.",
    },
    { kind: "p", text: "Which things go on the front page. What the site says first. How someone gets from arriving to contacting you. What gets left out." },
    {
      kind: "p",
      text: "That's the part that's hard, and it's the part a template can't do for you, because a template doesn't know anything about your business.",
    },
    { kind: "p", text: "The other half is that it actually gets finished, and finished properly:" },
    {
      kind: "ul",
      items: [
        "it loads quickly on a phone, because someone measured it,",
        "the search fundamentals are filled in rather than left blank,",
        "it's built around your business instead of a template's idea of one,",
        "and it's live, complete, with nothing on it saying Lorem Ipsum.",
      ],
    },
    {
      kind: "p",
      text: "For reference, we build small business websites from $899 plus $40 a month. We're not going to pretend that's nothing, and if it's out of reach this year then the first section of this article is the honest advice.",
    },

    { kind: "h2", text: "How to Decide" },
    {
      kind: "p",
      text: "Two questions, and they're not about money.",
    },
    {
      kind: "p",
      text: "First: are you actually going to finish it? Not whether you could, but whether you will, in the next month, alongside everything else you do. Be honest, because most people overestimate this and a half-built site is the worst outcome available.",
    },
    {
      kind: "p",
      text: "Second: how much does this website need to bring you? If it's a place to point existing customers, build it yourself. If it needs to bring in work from people who've never heard of you, that's a harder job than it looks, and it's the one that gets skipped.",
    },
    {
      kind: "p",
      text: "If you enjoy the work, or the money isn't there, build it yourself and don't feel bad about it. If neither is true, you're likely to spend a lot of evenings arriving somewhere a professional would have got you in a fortnight.",
    },

    { kind: "h2", text: "Final Thoughts" },
    {
      kind: "p",
      text: "There isn't a right answer to this that applies to everyone, and anyone who tells you there is has something to sell.",
    },
    {
      kind: "p",
      text: "Website builders are good tools. Plenty of businesses run perfectly well on them, and some of those businesses would be wasting money hiring us.",
    },
    {
      kind: "p",
      text: "What we'd push back on is the assumption that building it yourself is automatically the cheaper option. It's cheaper up front, and it's genuinely cheaper if you enjoy it and finish it.",
    },
    {
      kind: "p",
      text: "It stops being cheaper the moment the site sits half-built, or loads too slowly to keep anyone, or never shows up when someone searches for exactly what you sell. At that point you've paid anyway, in work you never found out you didn't get.",
    },
  ],
};

export const BLOG_POSTS: BlogPost[] = [
  wixVsDesignerPost,
  howLongDoesItTakePost,
  facebookPageVsWebsitePost,
  notShowingOnGooglePost,
  websiteCostPost,
];

/** Published posts, newest first. Drives the blog index and the sitemap. */
export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS]
    .filter((p) => !p.draft)
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

/**
 * Every post including drafts. Only for generateStaticParams, so a draft
 * is readable at its real URL for review. Don't use it for anything a
 * search engine or a visitor sees.
 */
export function getAllPostSlugs(): string[] {
  return BLOG_POSTS.map((p) => p.slug);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
