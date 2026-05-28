import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogArticle from "@/components/BlogArticle";
import {
  getAllPosts,
  getPostBySlug,
  headingId,
  SITE_URL,
  type BlogPost,
} from "@/lib/blog";

// Aligned with the homepage's lab tokens (see public/lab/style.css :root).
const INK = "#1a1a1a";
const MUTED = "#6f6a60";
const ACCENT = "#b85a3e";
const SERIF = "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif";
const BODY = "'Inter', system-ui, sans-serif";

type RouteParams = { slug: string };

/* Pre-render every post at build time (static, fast, crawlable). */
export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
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

function wordCount(post: BlogPost): number {
  return post.content.reduce((sum, block) => {
    if (block.kind === "ul") {
      return sum + block.items.join(" ").split(/\s+/).length;
    }
    return sum + block.text.split(/\s+/).length;
  }, 0);
}

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

  /* BlogPosting structured data — earns the rich article treatment in
     search and feeds Google's understanding of authorship + dates. */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    wordCount: wordCount(post),
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

  /* Breadcrumb structured data — Home > Blog > Article. */
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

      <main
        className="max-w-2xl mx-auto px-6 pt-12 sm:pt-16 pb-10"
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "56px 24px 80px",
        }}
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="text-[11px] tracking-[0.18em] uppercase mb-10 flex items-center gap-2 flex-wrap"
          style={{ color: MUTED, fontFamily: BODY }}
        >
          <Link href="/" className="hover:underline">Home</Link>
          <span aria-hidden>/</span>
          <Link href="/blog" className="hover:underline">Blog</Link>
          <span aria-hidden>/</span>
          <span style={{ color: INK }}>{post.category}</span>
        </nav>

        {/* Header */}
        <article>
          <header className="mb-10">
            <p
              className="text-[11px] tracking-[0.28em] uppercase mb-5"
              style={{ color: ACCENT, fontFamily: BODY }}
            >
              {post.category}
            </p>
            <h1
              className="text-4xl sm:text-5xl leading-[1.08] tracking-tight mb-6"
              style={{ fontFamily: SERIF, fontWeight: 500, color: INK }}
            >
              {post.title}
            </h1>
            <div
              className="flex items-center gap-3 text-[13px] flex-wrap"
              style={{ color: MUTED, fontFamily: BODY }}
            >
              <span>By {post.author}</span>
              <span aria-hidden>·</span>
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              <span aria-hidden>·</span>
              <span>{post.readingMinutes} min read</span>
            </div>
          </header>

          {/* Table of contents */}
          <nav
            aria-label="On this page"
            className="rounded-xl p-5 mb-4"
            style={{
              background: "#FAF8F4",
              border: "1px solid rgba(21,17,11,0.10)",
            }}
          >
            <p
              className="text-[10px] tracking-[0.28em] uppercase mb-3"
              style={{ color: MUTED, fontFamily: BODY }}
            >
              On this page
            </p>
            <ul className="space-y-1.5">
              {sections.map((s) => (
                <li key={s.text}>
                  <a
                    href={`#${headingId(s.text)}`}
                    className="text-[14px] leading-snug hover:underline"
                    style={{ color: ACCENT, fontFamily: BODY }}
                  >
                    {s.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Body */}
          <BlogArticle content={post.content} />

          {/* End CTA */}
          <aside
            className="mt-16 rounded-2xl p-8 text-center"
            style={{ background: "#15110B", color: "#FAF5EC" }}
          >
            <p
              className="text-2xl sm:text-3xl leading-tight tracking-tight mb-3"
              style={{ fontFamily: SERIF, fontWeight: 500 }}
            >
              Thinking about a website?
            </p>
            <p
              className="text-[15px] leading-relaxed mb-6 max-w-md mx-auto"
              style={{ color: "rgba(250,245,236,0.72)", fontFamily: BODY }}
            >
              VDT Sites builds fast, modern, SEO-ready websites for small
              businesses. Tell us about your project and we&apos;ll reply
              within 24 hours.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-[11px] tracking-[0.24em] uppercase transition-transform hover:-translate-y-0.5"
              style={{ background: ACCENT, color: "#FFFFFF", fontFamily: BODY }}
            >
              Get a free quote →
            </Link>
          </aside>

          {/* Back link */}
          <div className="mt-10">
            <Link
              href="/blog"
              className="text-[13px] tracking-wide hover:underline"
              style={{ color: ACCENT, fontFamily: BODY }}
            >
              ← All articles
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}
