"use client";

import { useEffect } from "react";

/* ────────────────────────────────────────────────────────────────────
 * BlogReadingChrome — two pieces of editorial polish:
 *
 *   1. A 2px hairline at the very top of the viewport that grows
 *      left → right as the reader scrolls through the article body.
 *      Updates on rAF for buttery animation; CSS does the actual
 *      width transition (0.08s linear) so we don't fight react.
 *
 *   2. Active-section tracking in the marginalia TOC. We watch every
 *      h2 inside .vdt-prose with IntersectionObserver and toggle
 *      .is-active on the matching .vdt-toc__item so the current
 *      section gets the accent border + italic.
 *
 * No render output of its own — the progress bar element is rendered
 * by the page (we just write to its style.width) and the TOC items
 * are rendered by the page (we just toggle their classes).
 * ──────────────────────────────────────────────────────────────────── */
export default function BlogReadingChrome() {
  useEffect(() => {
    const progressEl = document.querySelector<HTMLElement>(
      ".vdt-article__progress",
    );
    const article = document.querySelector<HTMLElement>(".vdt-article__body");
    if (!progressEl || !article) return;

    // ── reading progress ──
    let rafId = 0;
    const updateProgress = () => {
      rafId = 0;
      const rect = article.getBoundingClientRect();
      const total = Math.max(1, article.offsetHeight - window.innerHeight);
      const scrolled = Math.max(
        0,
        Math.min(total, window.innerHeight - rect.top - window.innerHeight),
      );
      // Simpler: how far through the article are we, clamped 0..1.
      const start = window.scrollY + rect.top; // article top in doc coords
      const end = start + article.offsetHeight - window.innerHeight;
      const here = Math.max(0, Math.min(1, (window.scrollY - start) / (end - start || 1)));
      progressEl.style.width = `${(here * 100).toFixed(2)}%`;
      // unused but kept for future use
      void scrolled;
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateProgress, { passive: true });

    // ── active TOC item ──
    const tocItems = Array.from(
      document.querySelectorAll<HTMLElement>(".vdt-toc__item"),
    );
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".vdt-prose h2[id]"),
    );

    const setActive = (id: string | null) => {
      tocItems.forEach((li) => {
        const a = li.querySelector<HTMLAnchorElement>("a");
        if (!a) return;
        const target = a.getAttribute("href")?.replace(/^#/, "") ?? "";
        li.classList.toggle("is-active", target === id);
      });
    };

    let activeId: string | null = sections[0]?.id ?? null;
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the topmost visible section.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          activeId = visible[0].target.id;
          setActive(activeId);
        }
      },
      {
        rootMargin: "-120px 0px -60% 0px",
        threshold: 0,
      },
    );
    sections.forEach((s) => observer.observe(s));
    setActive(activeId);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateProgress);
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
