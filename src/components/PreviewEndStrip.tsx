"use client";

import { useTheme } from "@/components/ThemeProvider";

/**
 * A small "exit the preview" strip that sits directly under the
 * carousel hero. Visually breaks the showcase from the real VDT
 * brand info that follows.
 *
 * Stays unthemed (black on white) so it can't be mistaken for part
 * of whatever theme is currently active above it.
 */
export default function PreviewEndStrip() {
  const { active, themes, setActiveId } = useTheme();
  const otherCount = themes.length - 1;

  return (
    <section
      className="relative z-10 bg-black text-white"
      aria-label="End of preview"
    >
      <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-8 sm:py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-start gap-4 min-w-0">
          <span
            aria-hidden
            className="inline-block mt-1 size-2 rounded-full shrink-0"
            style={{ background: active.accent }}
          />
          <div className="min-w-0">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/55 mb-2">
              End of preview · You just saw <span className="text-white">{active.name}</span>
            </p>
            <p className="text-base sm:text-lg leading-snug max-w-2xl">
              That&apos;s one of <strong className="text-white">{otherCount + 1} live demos</strong>{" "}
              of what we can build. Below this line is VDT Sites itself, a
              two-person studio in Nanaimo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => {
              const i = themes.findIndex((t) => t.id === active.id);
              const next = themes[(i + 1) % themes.length];
              setActiveId(next.id);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="rounded-full border border-white/30 text-white px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase hover:bg-white/10 transition-colors"
          >
            Next style →
          </button>
          <a
            href="#about"
            className="rounded-full bg-white text-black px-5 py-2.5 text-[11px] tracking-[0.22em] uppercase hover:bg-amber-300 transition-colors"
          >
            About VDT
          </a>
        </div>
      </div>
    </section>
  );
}
