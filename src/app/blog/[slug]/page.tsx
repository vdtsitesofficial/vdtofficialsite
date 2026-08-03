import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogArticle from "@/components/BlogArticle";
import BlogReadingChrome from "@/components/BlogReadingChrome";
import {
  getAllPostSlugs,
  getPostBySlug,
  headingId,
  SITE_URL,
  type BlogPost,
} from "@/lib/blog";

type RouteParams = { slug: string };

/* Pre-render every post at build time (static, fast, crawlable).
   Drafts are included so a finished post can be reviewed at its real URL;
   they're held out of the index and sitemap and carry noindex below. */
export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

/* Per-post SEO metadata. */
export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Article not found" };

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.metaTitle,
    description: post.description,
    keywords: post.keywords,
    // An unpublished draft is reachable at its real URL for review, so it
    // has to say so to crawlers. Nothing else keeps it out of results.
    ...(post.draft ? { robots: { index: false, follow: false } } : {}),
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      siteName: "VDT Sites",
      title: post.metaTitle,
      description: post.description,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.description,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function wordCount(post: BlogPost): number {
  return post.content.reduce((sum, block) => {
    if (block.kind === "ul") {
      return sum + block.items.join(" ").split(/\s+/).length;
    }
    return sum + block.text.split(/\s+/).length;
  }, 0);
}

function monogram(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ────────────────────────────────────────────────────────────────────
 * The post page.
 *
 * Layout (top → bottom):
 *   • Hairline reading-progress bar (fixed, top of viewport)
 *   • Breadcrumb strip
 *   • Article header
 *       - tracked kicker (CATEGORY ─────)
 *       - asymmetric display title
 *       - lede (description)
 *       - byline with monogram avatar + meta
 *   • Two-column body (lg+): marginalia TOC | prose
 *   • Coda
 *       - signature strip (VDT Sites, Nanaimo BC | DATE · WORD COUNT)
 *       - CTA card
 *       - back-to-index link
 * ──────────────────────────────────────────────────────────────────── */
export default async function BlogPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const sections = post.content.filter(
    (b): b is Extract<typeof b, { kind: "h2" }> => b.kind === "h2",
  );
  const words = wordCount(post);

  /* BlogPosting structured data — earns the rich article treatment in
     search and feeds Google's understanding of authorship + dates. */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    wordCount: words,
    articleSection: post.category,
    keywords: post.keywords.join(", "),
    inLanguage: "en-CA",
    author: { "@type": "Organization", name: post.author, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: "VDT Sites",
      url: SITE_URL,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };

  /* FAQPage structured data. Only emitted when the post actually renders
     the questions further down, because Google requires FAQ markup to
     match content the reader can see. */
  const faqSchema = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hairline reading progress at the very top of the viewport.
          Width is driven by BlogReadingChrome (client). */}
      <div className="vdt-article__progress" aria-hidden="true" />
      <BlogReadingChrome />

      <article className="vdt-article">
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <header className="vdt-article__header">
          <nav aria-label="Breadcrumb" className="vdt-article__crumbs">
            {/* Plain <a> for cross-route navigation back to the homepage —
                forces a full reload so the lab JS (Three.js logo, portfolio
                carousel, fluid footer, testimonials) all re-initialize and
                the importmap is parsed by the browser on fresh page load. */}
            <a href="/">Home</a>
            <span className="sep" aria-hidden>
              /
            </span>
            <Link href="/blog">Blog</Link>
            <span className="sep" aria-hidden>
              /
            </span>
            <span className="here">{post.category}</span>
          </nav>

          <p className="vdt-article__kicker">{post.category}</p>

          <h1 className="vdt-article__title">{post.title}</h1>

          <p className="vdt-article__lede">{post.description}</p>

          <div className="vdt-article__byline">
            <span className="vdt-article__avatar" aria-hidden="true">
              {monogram(post.author)}
            </span>
            <div className="vdt-article__byline-text">
              <span>
                By <strong>{post.author}</strong>
              </span>
              <span className="vdt-article__byline-meta">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {"  ·  "}
                {post.readingMinutes} min read
                {"  ·  "}
                {words.toLocaleString()} words
              </span>
            </div>
          </div>
        </header>

        {/* ── MARGINALIA TOC ─────────────────────────────────────── */}
        <aside className="vdt-article__aside">
          <nav aria-label="On this page" className="vdt-toc">
            <div className="vdt-toc__label">In this piece</div>
            <ol className="vdt-toc__list">
              {sections.map((s) => (
                <li key={s.text} className="vdt-toc__item">
                  <a href={`#${headingId(s.text)}`}>{s.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        {/* ── PROSE BODY ─────────────────────────────────────────── */}
        <div className="vdt-article__body">
          <BlogArticle content={post.content} />
        </div>

        {/* ── CODA ───────────────────────────────────────────────── */}
        <div className="vdt-article__coda">
          {/* Visible FAQ. Must stay rendered: the FAQPage schema above
              describes exactly these questions, and markup without matching
              on-page content is against Google's guidelines. It's also the
              chunk an AI assistant is most likely to quote back to someone
              who asked the question directly. */}
          {post.faqs && post.faqs.length > 0 && (
            <section className="vdt-faq" aria-labelledby="faq-heading">
              <h2 className="vdt-faq__heading" id="faq-heading">
                Common questions
              </h2>
              <dl className="vdt-faq__list">
                {post.faqs.map((f) => (
                  <div key={f.q} className="vdt-faq__item">
                    <dt className="vdt-faq__q">{f.q}</dt>
                    <dd className="vdt-faq__a">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <div className="vdt-coda__sig">
            <span>VDT Sites, Nanaimo BC</span>
            <span className="stamp">
              {shortDate(post.publishedAt)} · {words.toLocaleString()} words
            </span>
          </div>

          <aside className="vdt-coda__cta">
            <h2 className="vdt-coda__cta-title">
              Thinking about a website? Tell us about it.
            </h2>
            <a href="/contact" className="vdt-coda__cta-btn">
              <span>Get a free quote</span>
              <span className="arrow" aria-hidden>
                →
              </span>
            </a>
          </aside>

          <div>
            <Link href="/blog" className="vdt-coda__back">
              <span aria-hidden>←</span>
              <span>All articles</span>
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
