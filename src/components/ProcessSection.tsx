"use client";

import { motion } from "framer-motion";
import ScrollReveal, { SCROLL_STAGGER_CHILD } from "@/components/ScrollReveal";

const STEPS = [
  {
    n: "01",
    title: "Discovery",
    body: "We chat about your business, goals, and vision. No jargon, just a straight conversation about what you need.",
  },
  {
    n: "02",
    title: "Design & Build",
    body: "We design and build from scratch, checking in regularly. You see progress and can give feedback throughout.",
  },
  {
    n: "03",
    title: "Launch",
    body: "Your site goes live. We make sure everything runs perfectly and walk you through managing it yourself.",
  },
];

export default function ProcessSection() {
  return (
    <section
      className="themed-section py-24 sm:py-32 px-6 sm:px-12"
      style={{
        background: "var(--theme-bg-alt)",
        color: "var(--theme-ink)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <p
            className="text-[11px] tracking-[0.32em] uppercase mb-6"
            style={{ color: "var(--theme-ink-muted)" }}
          >
            The process
          </p>
          <h2
            className="text-5xl sm:text-6xl leading-[0.95] tracking-tight mb-14 max-w-2xl"
            style={{ fontFamily: "var(--theme-font-display)" }}
          >
            Simple process.
            <br />
            Great results.
          </h2>
        </ScrollReveal>

        <ScrollReveal
          variant="stagger"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6"
        >
          {STEPS.map((s) => (
            <motion.div
              key={s.n}
              variants={SCROLL_STAGGER_CHILD}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="p-7 sm:p-8 flex flex-col gap-4"
              style={{
                background: "var(--theme-bg)",
                border: "1px solid var(--theme-line)",
                borderRadius: "var(--theme-radius-lg)",
                boxShadow: "var(--theme-shadow)",
              }}
            >
              <span
                className="text-3xl tracking-tight"
                style={{
                  color: "var(--theme-ink-muted)",
                  fontFamily: "var(--theme-font-display)",
                }}
              >
                {s.n}
              </span>
              <h3
                className="text-2xl tracking-tight"
                style={{
                  color: "var(--theme-accent)",
                  fontFamily: "var(--theme-font-display)",
                }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{
                  color: "var(--theme-ink-muted)",
                  fontFamily: "var(--theme-font-body)",
                }}
              >
                {s.body}
              </p>
            </motion.div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
