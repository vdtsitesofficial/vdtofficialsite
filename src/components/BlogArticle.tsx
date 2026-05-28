import { Block, headingId } from "@/lib/blog";

/* ────────────────────────────────────────────────────────────────────
 * BlogArticle — editorial long-form renderer.
 *
 * Emits semantic HTML with minimal inline noise. The visual layer
 * (drop cap, em-dash bullets, sectional ornaments, italic h3) lives
 * in blog/layout.tsx's <style> block under the .vdt-prose namespace.
 *
 * h2 elements get data-num="I" / "II" / "III" — the CSS pulls that
 * into a small mono kicker above each section title.
 *
 * Section breaks: every h2 except the first is preceded by a
 * <div class="vdt-ornament">…❦…</div> fleuron so the eye gets a
 * pause between sections.
 * ──────────────────────────────────────────────────────────────────── */

const ROMAN = [
  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
];

function roman(n: number): string {
  return ROMAN[n - 1] ?? String(n);
}

export default function BlogArticle({ content }: { content: Block[] }) {
  let h2Index = 0;

  return (
    <div className="vdt-prose">
      {content.map((block, i) => {
        if (block.kind === "h2") {
          h2Index += 1;
          const num = roman(h2Index);
          // Section break before every h2 except the first.
          const showOrnament = h2Index > 1;
          return (
            <div key={i}>
              {showOrnament && (
                <div className="vdt-ornament" aria-hidden="true">
                  <span className="vdt-ornament__mark">&#10086;</span>
                </div>
              )}
              <h2 id={headingId(block.text)} data-num={num}>
                {block.text}
              </h2>
            </div>
          );
        }

        if (block.kind === "h3") {
          return (
            <h3 key={i} id={headingId(block.text)}>
              {block.text}
            </h3>
          );
        }

        if (block.kind === "ul") {
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          );
        }

        return <p key={i}>{block.text}</p>;
      })}
    </div>
  );
}
