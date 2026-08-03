import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, SITE_URL } from "@/lib/blog";

// Ink/muted/rule track the lab tokens (see public/lab/style.css :root).
const INK = "#1a1a1a";
const MUTED = "#6f6a60";
// Deliberately NOT the lab's --accent (#b85a3e, a terracotta). The blog was
// the only place that used it; this is the brand red every other page runs.
const ACCENT = "#dc2626";
const RULE = "rgba(26,26,26,0.10)";
const CARD_BG = "#fbf7ee"; // a tick warmer than the page canvas for separation
// The site's pairing — Syne display, Inter body — not the separate editorial
// serif this page used to run. Syne is loaded at 600/700/800 with no italic;
// don't ask for other weights here or the browser synthesises them.
const DISPLAY = "'Syne', 'Inter', sans-serif";
const BODY = "'Inter', system-ui, sans-serif";
// Small tracked uppercase labels. Were JetBrains Mono, which this route never
// actually loaded, so they rendered in whatever mono the OS had.
const LABEL = "'Inter', system-ui, sans-serif";

export const metadata: Metadata = {
  // Descriptive on purpose — with the "| VDT Sites" template this lands at
  // ~54 chars. A bare "Blog" was flagged as too short by Bing's SEO audit.
  title: "Web Design & SEO Tips for Small Businesses",
  description:
    "Practical, no-nonsense advice on web design, website pricing, and SEO for small businesses, from the VDT Sites studio in Nanaimo, BC.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "Web Design & SEO Tips for Small Businesses | VDT Sites",
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

/* ─────────────────────────────────────────────────────────────────
 * Blog index page.
 *
 * Layout (top → bottom):
 *   1. Centered hero with eyebrow, big display title, kicker subtitle
 *   2. Hairline divider
 *   3. Featured-post card (first/newest post): full container width,
 *      generous padding, large title
 *   4. Recent posts grid (remaining posts): 2-col on desktop, 1-col
 *      on mobile; smaller cards with the same shape
 *
 * Everything uses inline styles to avoid specificity wars with the
 * lab's style.css (loaded by blog/layout.tsx for design tokens).
 * ────────────────────────────────────────────────────────────────── */
export default function BlogIndexPage() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <main
      style={{
        maxWidth: "1080px",
        margin: "0 auto",
        padding: "64px 32px 96px",
        fontFamily: BODY,
        color: INK,
      }}
    >
      {/* ── Hero ─────────────────────────────────────── */}
      <section
        style={{
          textAlign: "center",
          paddingBottom: "56px",
          marginBottom: "56px",
          borderBottom: `1px solid ${RULE}`,
        }}
      >
        <p
          style={{
            fontFamily: LABEL,
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: ACCENT,
            marginBottom: "20px",
          }}
        >
          The VDT Sites Blog
        </p>
        <h1
          style={{
            fontFamily: DISPLAY,
            fontWeight: 700,
            fontSize: "clamp(2rem, 3.8vw, 3rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            color: INK,
            marginBottom: "20px",
          }}
        >
          Straight answers about websites.
        </h1>
        <p
          style={{
            fontFamily: BODY,
            fontSize: "17px",
            lineHeight: 1.65,
            color: MUTED,
            maxWidth: "560px",
            margin: "0 auto",
          }}
        >
          No jargon, no fluff. Practical advice on web design, pricing, and SEO
          for small business owners.
        </p>
      </section>

      {/* ── Featured post ────────────────────────────── */}
      {featured && <FeaturedCard post={featured} />}

      {/* ── Recent posts grid ────────────────────────── */}
      {rest.length > 0 && (
        <>
          <h2
            style={{
              fontFamily: LABEL,
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: MUTED,
              marginTop: "72px",
              marginBottom: "24px",
            }}
          >
            More articles
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
              gap: "20px",
            }}
          >
            {rest.map((post) => (
              <CompactCard key={post.slug} post={post} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Featured card — biggest visual weight, used for the newest post.
 * ───────────────────────────────────────────────────────────────────── */
type PostLike = ReturnType<typeof getAllPosts>[number];

function FeaturedCard({ post }: { post: PostLike }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        background: CARD_BG,
        border: `1px solid ${RULE}`,
        borderRadius: "20px",
        padding: "56px 56px 48px",
        transition: "transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
      className="vdt-blog-card vdt-blog-card--featured"
    >
      <MetaRow post={post} />
      <h2
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          color: INK,
          marginBottom: "18px",
          marginTop: "18px",
        }}
      >
        {post.title}
      </h2>
      <p
        style={{
          fontFamily: BODY,
          fontSize: "17px",
          lineHeight: 1.7,
          color: MUTED,
          maxWidth: "70ch",
          marginBottom: "28px",
        }}
      >
        {post.excerpt}
      </p>
      <span
        style={{
          fontFamily: BODY,
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.02em",
          color: ACCENT,
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        Read article
        <span className="vdt-blog-arrow" style={{ display: "inline-block" }}>
          →
        </span>
      </span>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Compact card — used for older posts in the "More articles" grid.
 * ───────────────────────────────────────────────────────────────────── */
function CompactCard({ post }: { post: PostLike }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: "block",
        textDecoration: "none",
        background: "transparent",
        border: `1px solid ${RULE}`,
        borderRadius: "16px",
        padding: "28px 28px 24px",
        transition: "background 0.3s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.3s cubic-bezier(0.22, 0.61, 0.36, 1)",
      }}
      className="vdt-blog-card"
    >
      <MetaRow post={post} compact />
      <h3
        style={{
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: "1.15rem",
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
          color: INK,
          marginTop: "14px",
          marginBottom: "12px",
        }}
      >
        {post.title}
      </h3>
      <p
        style={{
          fontFamily: BODY,
          fontSize: "14px",
          lineHeight: 1.55,
          color: MUTED,
        }}
      >
        {post.excerpt}
      </p>
    </Link>
  );
}

/* ────────────────────────────────────────────────────────────────────
 * Category · Date · Read time strip.
 * ───────────────────────────────────────────────────────────────────── */
function MetaRow({ post, compact }: { post: PostLike; compact?: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontFamily: LABEL,
        fontSize: compact ? "10px" : "11px",
        fontWeight: 600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: MUTED,
      }}
    >
      <span style={{ color: ACCENT }}>{post.category}</span>
      <span aria-hidden>·</span>
      <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span>{post.readingMinutes} min read</span>
    </div>
  );
}
