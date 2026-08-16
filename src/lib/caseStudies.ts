/**
 * Case-study content for /work and /work/[slug].
 *
 * Voice rules (Sem, 2026-07-28): plain and confident, first person "we",
 * professional but sounds like a person. NO em dashes or en dashes anywhere.
 * Every fact here is either visible on the live site or an engineering
 * detail that is ours to tell. No client pricing, no private context.
 */

import { getTestimonialByAuthor, type Testimonial } from "./testimonials";

export type CaseStat = { value: string; label: string };
export type CaseFeature = { title: string; body: string };

export type CaseStudy = {
  slug: string;
  name: string;
  /** Short kicker under the eyebrow, e.g. "Clinical hypnotherapy · Nanaimo, BC" */
  kicker: string;
  /** H1 for the page */
  headline: string;
  /** Lede paragraph directly under the H1 */
  intro: string;
  liveUrl: string;
  year: string;
  /** e.g. "Custom build · Self-serve editing · Booking" */
  stackLine: string;
  metaTitle: string;
  metaDescription: string;
  client: string;
  needed: string;
  builtIntro: string;
  built: CaseFeature[];
  design: string;
  stats: CaseStat[];
  result: string;
  /**
   * The Business Profile reviewer who is this project's client, matched on
   * `author` in lib/testimonials.
   *
   * The mapping lives here rather than on the review because most reviewers
   * are not case-study clients: friends and family have left us reviews
   * without ever getting a website built, so a review pointing at a project
   * would be the wrong default. A project knows who its client is; a review
   * does not know whether it belongs to one. Absent means the case study
   * renders no review block rather than borrowing someone else's words.
   */
  reviewAuthor?: string;
  /**
   * Name to show the review under, when the client signed it with another
   * business they own. Root 86 Coffee and Morky Auto Imports are one owner,
   * and on the Morky page the review reads as Morky's.
   */
  reviewAuthorAs?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "sherri-kozubal",
    name: "Sherri Kozubal",
    kicker: "Clinical hypnotherapy · Nanaimo, BC",
    headline: "A hypnotherapy website that feels like the work itself",
    intro:
      "Sherri came to us on Squarespace and left with a custom site that moves like light on water. Here is what went into it.",
    liveUrl: "https://sherrikozubal.com",
    year: "2026",
    stackLine: "Custom build · Motion design · Online booking · Blog",
    metaTitle: "Hypnotherapist Website Design in Nanaimo, BC",
    metaDescription:
      "How we rebuilt a Nanaimo clinical hypnotherapist's Squarespace site as a fast, custom website with calm motion design, online booking and her full blog. A VDT Sites case study.",
    client:
      "Sherri Kozubal is a Medical Intuitive and Clinical Hypnotherapist based right here in Nanaimo, working with clients around the world by phone and video. Her practice is calm, personal and precise, and her website needed to feel the same way.",
    needed:
      "Her previous site ran on Squarespace. It held her content, but it was slow on phones, locked to a template, and it did not feel like her. Her ask was specific: blues, silver and black, soft and interactive, an opening animation, and a site that works beautifully on every device.",
    builtIntro:
      "We rebuilt everything from scratch as a custom site and migrated every word of her content, so nothing was lost in the move.",
    built: [
      {
        title: "A living, breathing front page",
        body: "The site opens with a breath of light and settles into an aurora hero that drifts behind her introduction. Sections reveal themselves as you scroll, service cards tilt and glow as you move across them, and none of it gets in the way of reading.",
      },
      {
        title: "Booking built in",
        body: "Her Calendly booking calendar is embedded and themed to match the site, so booking a session never feels like leaving it.",
      },
      {
        title: "Her whole blog, moved over",
        body: "All seven of her posts came across word for word, with clean URLs search engines can keep ranking.",
      },
      {
        title: "The boring stuff, done properly",
        body: "Contact form with direct email delivery, her domain moved onto modern infrastructure, and www quietly redirecting to the main address so there is only one version of the site for Google to index.",
      },
    ],
    design:
      "The concept we designed around was a river of light: the whole site flows downward like a current, and the motion is always slow, soft and deliberate. Wellness sites often end up either sterile or sparkly. The goal here was calm with a pulse.",
    stats: [
      { value: "4.0MB → 2.3MB", label: "hero images, re-encoded for phones" },
      { value: "259KB → 165KB", label: "initial page weight after our mobile pass" },
      { value: "7 / 7", label: "blog posts migrated with nothing lost" },
    ],
    result:
      "A site that finally matches the experience of working with her, loads quickly on a phone in a parking lot, and runs on infrastructure she owns. Her old template subscription is gone for good.",
    reviewAuthor: "Sherri K",
  },
  {
    slug: "horizon-hues",
    name: "Horizon Hues",
    kicker: "Electrical contractor · Nanaimo, BC",
    headline: "A brand and a website for an electrician starting from nothing",
    intro:
      "Horizon Hues Installations is one electrician on Vancouver Island. There was no logo, no domain and no website when we started. We built the identity and the site together, then rebuilt the site onto our shared stack without changing a single pixel.",
    liveUrl: "https://horizonhues.ca",
    year: "2026",
    stackLine: "Custom build · Full brand kit · Self-serve editing",
    metaTitle: "Electrician Website Design in Nanaimo, BC",
    metaDescription:
      "How we built Horizon Hues Installations a logo, a brand and a five page website from scratch, then ported it onto the shared VDT stack with parity checked element for element so the design did not move.",
    client:
      "Horizon Hues Installations is Eric Pizzingrilli, a licensed electrical contractor working out of Nanaimo across Vancouver Island from Victoria up to Campbell River. Residential, commercial, service repair and EV chargers, and he is the person who quotes your job and the person who turns up to do it.",
    needed:
      "Everything. A new trade business has no logo, no domain, no email on its own name and nothing for a customer to find when they search. It also has the credibility problem every new contractor has: the certifications are real and hard won, but nobody sees them until they are put somewhere. And the site had to be one Eric could change himself, because he is out of cell service for stretches and cannot be waiting on someone else to fix a typo.",
    builtIntro:
      "We built the brand first, then the site around it, then moved the whole thing onto the same codebase every other VDT site runs.",
    built: [
      {
        title: "The identity, from a blank page",
        body: "Logo, three concepts, delivered in every format he will need for print, web and vehicle signage. The mark is an interlocking HH that reads as a horizon line, which is where the rest of the site came from. A business card and a reusable invoice template came with it, so the paperwork looks like the website.",
      },
      {
        title: "Credentials where a customer sees them",
        body: "Licensed Electrical Contractor, Red Seal, FSR Class A and Master Electrician, all four surfaced in the hero rather than buried on an About page. For a trade nobody can assess by looking, the certifications are the product, so they go above the fold.",
      },
      {
        title: "A rebuild that changed nothing on purpose",
        body: "The site launched as eight hand authored HTML files. We ported it onto Next.js on Cloudflare Workers with our shared inline editor, and checked parity element for element against the original rather than trusting our eyes. The design did not move. The original is still preserved at a git tag if we ever need to prove it.",
      },
      {
        title: "He edits it himself, in the browser",
        body: "Eric signs in with a code emailed to him, then clicks any words on the live page and retypes them. No dashboard, no password to lose, no ticket to us. Because the editor is shared across every site we run, a fix made once reaches his site too.",
      },
    ],
    design:
      "Electrical work happens in the dark and the sell is confidence, so the site is near black with a single amber accent and almost nothing else. The hero is a Vancouver Island treeline at dusk with one glowing line running along the horizon, which is the logo mark drawn at full width. Restraint is the point: a trade site that shouts reads as a franchise, and Horizon Hues is deliberately one person.",
    stats: [
      { value: "8 files → 1 stack", label: "hand authored HTML ported onto the shared VDT codebase" },
      { value: "0 visual changes", label: "parity machine checked element for element through the rebuild" },
      { value: "100%", label: "of page copy editable by Eric, in place on the live site" },
    ],
    result:
      "A new electrical contractor that looks established from the first search, with a brand he owns outright and a site he can change from a job site. The certifications that took years to earn are now the first thing anyone sees.",
  },
  {
    slug: "mo-coffee",
    name: "MO Coffee",
    kicker: "Coffee roaster · Nanaimo, BC",
    headline: "An online store for a roaster who does one coffee, properly",
    intro:
      "MO Coffee roasts one small-batch dark roast every week on Vancouver Island. We built the store, the checkout, the shipping and the back office that runs it.",
    liveUrl: "https://mocoffee.ca",
    year: "2026",
    stackLine: "E-commerce · Subscriptions · Live shipping rates · Full admin",
    metaTitle: "E-Commerce Website for a Coffee Roaster in Nanaimo",
    metaDescription:
      "How we built mocoffee.ca: Stripe checkout with subscriptions, live courier rates, branded order emails and a full back office for a small-batch Vancouver Island coffee roaster.",
    client:
      "MO Coffee is a small-batch roastery on Vancouver Island with one product and a strong opinion: a bag of coffee should be a full pound, always. Every bag of Hello Darkness is 454 grams, roasted weekly and shipped fresh.",
    needed:
      "Selling coffee online is more than a buy button. They needed real checkout with subscriptions, honest shipping prices instead of a flat guess, order emails that look like the brand, and a back office the owner could run alone without phoning us every week.",
    builtIntro:
      "We built the whole pipeline, from the first click to the box leaving the warehouse.",
    built: [
      {
        title: "Checkout that handles one-time and weekly",
        body: "Stripe powers single purchases and recurring subscriptions, with a branded confirmation and tracking email for every order. No marketplace fees, no third-party storefront.",
      },
      {
        title: "Live courier rates at checkout",
        body: "The store quotes real shipping prices from the couriers at the moment of purchase, cheapest option first. Customers see what shipping actually costs, and the roaster stops losing money on guesses.",
      },
      {
        title: "A back office that runs the business",
        body: "Orders, manual and wholesale orders, a wholesale client roster, and a monthly sales report with revenue by channel and exportable spreadsheets. When the owner picked up his first retail stockist, adding the store to the site took a few clicks, not a phone call to us.",
      },
      {
        title: "Owner-edited copy",
        body: "The owner edits his own site text directly on the page. He has made more than fifty edits himself since launch, which is exactly the point.",
      },
    ],
    design:
      "The brand stance drove the design. There is a whole page dedicated to the 454 gram promise, and the store keeps the focus on one product done well instead of a grid of options. Dark, warm and direct, like the roast.",
    stats: [
      { value: "31", label: "public pages, every one audited for phones and tablets" },
      { value: "3,720", label: "screen configurations tested clean before handoff" },
      { value: "454g", label: "always. The site is built around the promise" },
    ],
    result:
      "A store that sells while the roaster roasts. Orders come in, labels get printed, the monthly report adds itself up, and the site now backs a growing wholesale side alongside retail.",
  },
  {
    slug: "isle-air-chicken",
    name: "Isle Air Chicken",
    kicker: "Food truck · Vancouver Island, BC",
    headline: "A food truck website the owner runs from his phone",
    intro:
      "Air-fried chicken deserves better than a link in bio. We built Isle Air Chicken a site that shows the food huge, and gave the owner the keys.",
    liveUrl: "https://isleairchicken.ca",
    year: "2026",
    stackLine: "Custom build · Menu management · Self-serve editing · Light and dark",
    metaTitle: "Food Truck Website Design on Vancouver Island",
    metaDescription:
      "How we built isleairchicken.ca: a custom single-page food truck website with a full-screen menu slider and an on-page editor the owner uses to update his own menu.",
    client:
      "Isle Air Chicken is a Vancouver Island food truck doing something genuinely different: crispy chicken that is air-fried and seed-oil free. Like most food trucks, the business lived entirely on social media.",
    needed:
      "A food truck site has two jobs: make people hungry and tell them where the truck is. It also has to survive a menu that changes with the seasons without the owner needing a developer every time a sandwich gets renamed.",
    builtIntro:
      "We skipped the frameworks entirely and built this one from scratch, which keeps it tiny and quick.",
    built: [
      {
        title: "A full-screen hero built around the food",
        body: "The site opens on a full-screen slider where each dish floats over the page with its name and price. It is the closest a website gets to standing at the window.",
      },
      {
        title: "The owner edits everything",
        body: "Through a password-protected editor, the owner clicks any text on his live site and changes it: menu items, whole menu categories, hero slides, prices, contact details. There is undo and redo, and nothing to install.",
      },
      {
        title: "Light and dark themes",
        body: "The site follows the visitor's preference with a manual toggle, so it looks right at noon at the truck window and at midnight on a couch.",
      },
      {
        title: "The full legal set",
        body: "Terms, privacy and cookie pages tailored to the business, including a proper food allergen disclaimer. Small businesses skip this constantly. Ours do not.",
      },
    ],
    design:
      "No template could do this. The dish photography is the entire design, and everything else stays out of its way. Because the site is built from scratch with no framework, there is nothing heavy to download and nothing to slow it down.",
    stats: [
      { value: "0", label: "frameworks. Custom code, nothing wasted" },
      { value: "1 page", label: "that does the work of five" },
      { value: "100%", label: "of the menu editable by the owner, on the page" },
    ],
    result:
      "The truck has a home that makes people hungry, ranks for its own name, and never goes stale, because updating it is easier than posting to Instagram.",
  },
  {
    slug: "morky-auto-imports",
    name: "Morky Auto Imports",
    kicker: "Vehicle imports · Parksville, BC",
    headline: "A Japanese import service with a website to match the cars",
    intro:
      "Morky Auto Imports bids on Japanese auctions and lands hand-picked cars in BC driveways. The site had to carry that trust, and an entire inventory system.",
    liveUrl: "https://morkyautoimports.ca",
    year: "2026",
    stackLine: "Inventory system · Photo galleries · Local SEO · Self-serve admin",
    metaTitle: "Automotive Business Website Design in Parksville, BC",
    metaDescription:
      "How we built morkyautoimports.ca: a Japanese-inspired design, a self-managed car inventory with photo galleries, and vehicle structured data for search. A VDT Sites case study.",
    client:
      "Morky Auto Imports is a one-at-a-time Japanese auction import service based in Parksville. Buyers describe the car they want, Morky bids at the source auctions in Japan, then handles shipping, paperwork and BC compliance until the car is in the driveway.",
    needed:
      "Importing a car sight-unseen takes trust, so the site had to feel considered rather than salesy. It also needed a real inventory: cars arrive, sell and change price weekly, and all of that had to be manageable without touching code.",
    builtIntro:
      "We built it as two things in one: a brand site that earns the deposit, and an inventory platform behind it.",
    built: [
      {
        title: "A living inventory",
        body: "Every car gets its own page with a full photo gallery and lightbox viewer. Listings can show a price, show as sold, or invite an inquiry, switchable per car from the admin.",
      },
      {
        title: "Photos that upload themselves properly",
        body: "The admin compresses photos to a modern format automatically on upload, so thirty photos of an arrival go up in one batch and the pages stay fast.",
      },
      {
        title: "A car-finder instead of a contact form",
        body: "The contact page asks the question buyers actually have: what car are you looking for? Requests arrive structured, ready to act on before the next auction week.",
      },
      {
        title: "Local search, done thoroughly",
        body: "Nine city pages across the Island and Lower Mainland, vehicle structured data that lets Google understand each listing, breadcrumbs and a full sitemap.",
      },
    ],
    design:
      "The design borrows from sumi-e ink painting: warm paper, deep ink and a single vermilion accent, like a seal stamp on a document. It reads Japanese without a single cliche, and it makes a used-car inventory feel like a curated collection, which is exactly what it is.",
    stats: [
      { value: "229ms → single digits", label: "server compute per page after our caching work" },
      { value: "9", label: "local landing pages for Island and Lower Mainland buyers" },
      { value: "30", label: "photos per upload batch, compressed automatically" },
    ],
    result:
      "A site that sells a considered service the way it deserves, with an inventory the owner updates in minutes. The whole thing serves from cache in milliseconds.",
    reviewAuthor: "Root 86 Coffee",
    reviewAuthorAs: "Morky Auto Imports",
  },
  {
    slug: "therapeutic-value",
    name: "Therapeutic Value",
    kicker: "Counselling · British Columbia",
    headline: "A counselling site that left Squarespace and never looked back",
    intro:
      "Therapeutic Value Counselling Services needed off an expiring trial and onto something owned, fast and calm. We made the move painless.",
    liveUrl: "https://therapeuticvalue.ca",
    year: "2026",
    stackLine: "Custom build · Self-serve editing · Protected contact · Deliverability",
    metaTitle: "Counselling Website Design in BC",
    metaDescription:
      "How we moved a BC counselling practice off Squarespace onto a fast custom website with on-page editing, a bot-protected contact form and fixed email deliverability.",
    client:
      "Therapeutic Value is the counselling practice of Stephanie Dubinsky, BA, RTC, serving clients across British Columbia. The practice is warm and professional, and its website is often the first step a nervous client takes.",
    needed:
      "Her Squarespace trial was expiring, which was the push to stop renting. She wanted her existing site shape carried over, the ability to edit her own copy, and a site that would not make a person in a hard moment wait for a page to load.",
    builtIntro:
      "We rebuilt the site custom, kept her structure and voice, and fixed a few things nobody could see.",
    built: [
      {
        title: "Her site, but hers now",
        body: "Home, modalities, about and contact, rebuilt clean with her content and a calm visual rhythm. No template constraints, no subscription clock.",
      },
      {
        title: "Edit-in-place",
        body: "She asked to update her own copy, so every visible string on the site is editable by clicking it on the live page. Change, save, done.",
      },
      {
        title: "A contact form that filters bots, not people",
        body: "The form is protected by an invisible challenge instead of those squinting letter puzzles, and submissions land reliably in her inbox.",
      },
      {
        title: "Email that actually arrives",
        body: "We found and fixed her domain's email authentication along the way. Messages she sends now pass the checks that keep them out of spam folders. Not glamorous, quietly important.",
      },
    ],
    design:
      "Counselling sites should lower a visitor's shoulders. Soft space, unhurried type and no motion for motion's sake. The craft here is restraint.",
    stats: [
      { value: "145ms → 5-10ms", label: "server time per page after our performance rework" },
      { value: "100%", label: "of page copy editable by the owner, in place" },
      { value: "$0", label: "per month owed to a template platform" },
    ],
    result:
      "An owned, fast, self-serve site for a fraction of a platform subscription, with email deliverability fixed as a bonus. The practice controls its own front door now.",
  },
  {
    slug: "ceva-volleyball",
    name: "CEVA Volleyball",
    kicker: "Sports organization · Calgary, AB",
    headline: "A tournament platform, not just a team website",
    intro:
      "The Calgary Elite Volleyball Association needed more than a brochure. We built a database-backed platform that runs tournaments and still looks like a program you want to join.",
    liveUrl: "https://cevavolleyball.vdtsites.workers.dev",
    year: "2026",
    stackLine: "Web application · Database · Admin dashboards · Scoreboard-ready",
    metaTitle: "Sports Club and Tournament Website Design",
    metaDescription:
      "How we built a tournament management platform for a Calgary volleyball association: real database, admin dashboards, and a scoreboard-ready structure. A VDT Sites case study.",
    client:
      "CEVA is the Calgary Elite Volleyball Association, a competitive volleyball organization running multi-team tournaments. This is our proof that VDT goes past brochure sites: when a client needs real software, we build real software.",
    needed:
      "Tournaments generate structure: divisions, pools, teams, games, standings, news, photos. All of it changes in real time on event weekends, and none of it can depend on a developer being on call. The association needed a hub its own admins could drive.",
    builtIntro:
      "We designed the data first and the pages second, which is the difference between a site and a platform.",
    built: [
      {
        title: "A real tournament database",
        body: "Tournaments, divisions, pools, teams, games, news and photo galleries all live in a proper database with an admin interface over top. Nothing is hard-coded.",
      },
      {
        title: "One featured tournament, always",
        body: "Admins pick which tournament leads the homepage, and the site enforces that exactly one is featured at a time. Small rule, no broken homepage ever.",
      },
      {
        title: "Admin dashboards",
        body: "Create and edit tournaments, manage the calendar and control the public site from a protected dashboard built for volunteers, not developers.",
      },
      {
        title: "Built ahead for live scores",
        body: "The schema already models games and results, so live public scoreboards and standings are a phase two, not a rebuild.",
      },
    ],
    design:
      "Crest-led and proud of it. The site opens with the CEVA crest dropping into place, the hero tilts subtly with your mouse, and the crimson-and-white palette carries through every page. Athletics branding works when it feels earned rather than decorated.",
    stats: [
      { value: "~4ms", label: "typical page serve time from cache" },
      { value: "10+", label: "database tables modelling the sport properly" },
      { value: "1", label: "featured tournament, enforced by the platform itself" },
    ],
    result:
      "An association hub that its own people operate, with the structure already in place for live scoreboards. Brochure sites tell people about the program. This one runs it.",
  },
  {
    slug: "paul-van-ryssel",
    name: "Paul Van Ryssel",
    kicker: "Campaign website · Nanaimo, BC",
    headline: "A campaign website with the whole toolkit built in",
    intro:
      "A city council campaign needs to collect volunteers, take donations properly and change messaging fast. We gave Paul Van Ryssel's campaign all three.",
    liveUrl: "https://paulvanryssel.ca",
    year: "2026",
    stackLine: "Campaign forms · Donations · Mailing list · Self-serve editing",
    metaTitle: "Campaign Website Design in Nanaimo, BC",
    metaDescription:
      "How we built paulvanryssel.ca: volunteer and lawn sign forms, donations by card and e-transfer, a mailing list and on-page editing for a Nanaimo city council campaign.",
    client:
      "Paul Van Ryssel is a candidate for Nanaimo City Council. A campaign site is a sprint with a hard deadline: it has to inform, recruit and fundraise from day one, and stay current as the campaign evolves.",
    needed:
      "Five pages of platform and story, forms for every way a supporter can help, donations handled properly under BC campaign finance rules, and the ability for the campaign to edit its own message without waiting on anyone.",
    builtIntro:
      "We shipped the full campaign toolkit, not just the pages.",
    built: [
      {
        title: "Every door a supporter can knock on",
        body: "Volunteer, lawn sign, invite Paul to speak, contact and newsletter signup. Every form is protected against bots and delivers straight to the campaign inbox.",
      },
      {
        title: "Donations on two rails",
        body: "Supporters can give by card or by Interac e-transfer, and the campaign has a donations board with a reconciliation panel for matching e-transfers as they arrive. The required authorization statement sits exactly where the rules say it should.",
      },
      {
        title: "A mailing list the campaign owns",
        body: "Signups flow into a built-in list with a sender for campaign updates. No third-party newsletter subscription, no exported spreadsheets.",
      },
      {
        title: "Edit the message on the page",
        body: "The campaign edits its own copy directly on the live site, right down to picking the icons on the priority cards from a searchable picker. When messaging shifts, the site shifts the same hour.",
      },
    ],
    design:
      "Navy, gold and paper, with Paul photographed properly and framed consistently across every hero. Campaign sites drift toward clip art and clutter. This one stays disciplined, because the candidate's brand is steadiness.",
    stats: [
      { value: "4", label: "supporter forms, all bot-protected" },
      { value: "2", label: "donation rails: card and Interac e-transfer" },
      { value: "~200ms → single digits", label: "server time per page after caching" },
    ],
    result:
      "A campaign that runs its own website: edits its message, grows its list and takes donations cleanly, with the compliance details handled. All we do is watch it deploy itself.",
    reviewAuthor: "Paul Van Ryssel",
  },
  {
    slug: "unisol-accounting",
    name: "UniSol Accounting",
    kicker: "Accounting · Nanaimo, BC",
    headline: "An accounting website as clear as the advice behind it",
    intro:
      "UniSol Accounting was on WordPress and Elementor. We rebuilt it custom, moved the domain across without losing a single search result, and left them able to edit every word themselves.",
    liveUrl: "https://unisolaccounting.ca",
    year: "2026",
    stackLine: "Custom build · Self-serve editing · Service pages · Tax tools",
    metaTitle: "Accounting Website Design in Nanaimo, BC",
    metaDescription:
      "How we rebuilt a Nanaimo accounting firm's WordPress site as a fast custom website with click-to-edit copy, four service pages and a GST calculator, and moved the domain with every old URL redirected.",
    client:
      "UniSol Accounting Services is a Nanaimo accounting firm led by Rimpy Mahal, working with businesses and individuals across Vancouver Island on bookkeeping, corporate tax, personal income tax and financial consulting.",
    needed:
      "The old site was a WordPress and Elementor build: slower than it needed to be, awkward to change, and reading more like a brochure than like the person clients actually meet. They wanted something faster, clearer and genuinely theirs, without losing the search rankings the old site had earned.",
    builtIntro:
      "We rebuilt the whole site, then moved the domain onto it in a single afternoon with nothing lost on the way across.",
    built: [
      {
        title: "Every word editable, by them",
        body: "Sign in and click any text on the live page to change it. No dashboard to learn, no page builder, no ticket to us. Sign-in is a code emailed to them, so there is no shared password to keep track of.",
      },
      {
        title: "Four service pages that carry their own weight",
        body: "Bookkeeping, corporate tax, personal income tax and financial consulting each got a real page, restructured from the old text-heavy versions into checklists, steps and outcomes. We kept the original URLs so a decade of links and rankings pointed at the new pages on day one.",
      },
      {
        title: "A GST calculator that gets the cents right",
        body: "We ported the calculator from their old site and found its maths quietly wrong: it rounded to whole numbers and dropped the cents on every result. Same tool, ten countries of real rates, correct answers now.",
      },
      {
        title: "A move with no broken links",
        body: "Cutting a live domain over is where sites usually lose their search rankings. We inventoried every old URL first and redirected the ones that no longer existed, so the old blog posts and pages all still land somewhere real.",
      },
    ],
    design:
      "Accounting sells calm. Deep teal and paper, a serif that behaves like a person rather than a bank, and drone footage of Nanaimo instead of the stock handshake every accounting site reaches for. The hero is their actual town.",
    stats: [
      { value: "17 MB → 1.7 MB", label: "hero video, recompressed so phones are not punished for it" },
      { value: "116/116", label: "responsive checks passing across browsers and screen sizes" },
      { value: "100%", label: "of page copy editable by the firm, in place" },
    ],
    result:
      "A firm that owns its website, edits it without calling anyone, and kept every bit of search equity it had built up. The old site was something they paid for. This one works for them.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

/** A review as a case study should show it: verbatim words, project's label. */
export type CaseReview = Testimonial & { displayAuthor: string };

/**
 * This project's client review, if the client left one. `displayAuthor` is
 * what the page prints; `author` stays the name the review is signed with on
 * Google, so the two never silently drift apart.
 */
export function getCaseReview(cs: CaseStudy): CaseReview | undefined {
  if (!cs.reviewAuthor) return undefined;
  const t = getTestimonialByAuthor(cs.reviewAuthor);
  if (!t) return undefined;
  return { ...t, displayAuthor: cs.reviewAuthorAs ?? t.author };
}

/**
 * The case study a reviewer is the client of, for the "See their site" link on
 * /reviews. Returns undefined for the friends and family who reviewed us
 * without ever having a site built, which is most of the list.
 */
export function getCaseForAuthor(author: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.reviewAuthor === author);
}
