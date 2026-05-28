import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, SITE_URL } from "@/lib/blog";

// Aligned with the homepage's lab tokens (see public/lab/style.css :root).
const INK = "#1a1a1a";
const MUTED = "#6f6a60";
const ACCENT = "#b85a3e";
const SERIF = "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif";
const BODY = "'Inter', system-ui, sans-serif";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical, no-nonsense advice on web design, website pricing, and SEO for small businesses, from the VDT Sites studio in Nanaimo, BC.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Blog | VDT Sites",
    description:
      "Practical, no-nonsense advice on web design, pricing, and SEO for small businesses.",
  },
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="max-w-3xl mx-auto px-6 pt-16 sm:pt-24 pb-8">
      <header className="mb-14">
        <p
          className="text-[11px] tracking-[0.32em] uppercase mb-4"
          style={{ color: ACCENT, fontFamily: BODY }}
        >
          The VDT Sites Blog
        </p>
        <h1
          className="text-4xl sm:text-5xl leading-[1.05] tracking-tight mb-4"
          style={{ fontFamily: SERIF, fontWeight: 500, color: INK }}
        >
          Straight answers about websites.
        </h1>
        <p
          className="text-[17px] leading-[1.7] max-w-xl"
          style={{ color: MUTED, fontFamily: BODY }}
        >
          No jargon, no fluff. Practical advice on web design, pricing, and SEO
          for small business owners.
        </p>
      </header>

      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl p-6 sm:p-8 transition-colors"
              style={{ border: "1px solid rgba(21,17,11,0.12)" }}
            >
              <div
                className="flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase mb-3"
                style={{ color: MUTED, fontFamily: BODY }}
              >
                <span style={{ color: ACCENT }}>{post.category}</span>
                <span aria-hidden>·</span>
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <span aria-hidden>·</span>
                <span>{post.readingMinutes} min read</span>
              </div>
              <h2
                className="text-2xl sm:text-3xl leading-tight tracking-tight mb-3"
                style={{ fontFamily: SERIF, fontWeight: 500, color: INK }}
              >
                {post.title}
              </h2>
              <p
                className="text-[16px] leading-[1.65] mb-4"
                style={{ color: MUTED, fontFamily: BODY }}
              >
                {post.excerpt}
              </p>
              <span
                className="inline-flex items-center gap-2 text-[13px] tracking-wide"
                style={{ color: ACCENT, fontFamily: BODY }}
              >
                Read article
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
