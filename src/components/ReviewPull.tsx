import { TESTIMONIALS, GOOGLE_REVIEWS_URL } from "@/lib/testimonials";
import Stars from "@/components/Stars";

/**
 * One real review, quoted near a page's CTA (SEO Plan suggestion 9,
 * approved by Sem 2026-08-10 with two conditions: shown clean, and only
 * where the reviewer honestly matches the page, city pages get a quote
 * ONLY when the reviewer is from that city).
 *
 * The quote is looked up from lib/testimonials by author so the text has
 * exactly one home; that file's word-for-word rule applies here too. If
 * the author is ever removed there, this renders nothing rather than a
 * broken card, and the page keeps working.
 */
export default function ReviewPull({ author }: { author: string }) {
  const t = TESTIMONIALS.find((x) => x.author === author);
  if (!t) return null;

  return (
    <figure className="mt-8 max-w-xl border-l-2 border-[#dc2626] pl-5">
      <Stars />
      <blockquote className="mt-2 text-[15px] leading-relaxed text-[#0d0d0d]/75">
        &ldquo;{t.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-[13px] font-semibold text-[#0d0d0d]/60">
        {t.author} ·{" "}
        <a
          href={GOOGLE_REVIEWS_URL}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[#dc2626] underline underline-offset-2"
        >
          review on Google
        </a>
      </figcaption>
    </figure>
  );
}
