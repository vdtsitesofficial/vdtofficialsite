"use client";

/* -----------------------------------------------------------------------
 * /design-2 — "TERMINAL"
 *
 * Brutalist hacker-terminal aesthetic. Pure black canvas, terminal-green
 * accent, JetBrains Mono everywhere, Anton condensed for shout-display
 * type. Fake window chrome, scan lines, ASCII separators, marquee strip,
 * blinking cursor, glitch hover states. Reads like a CLI, not a marketing
 * site - which is exactly the pitch: two engineers, no agency theater.
 * --------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const C = {
  bg: "#08090A",
  bgAlt: "#0F1112",
  bgHi: "#16181A",
  ink: "#E8E8E8",
  inkMuted: "#7A7A7A",
  accent: "#00FF66", // terminal green
  alt: "#FF6B3D", // amber-orange warnings
  grid: "rgba(255,255,255,0.04)",
  hair: "rgba(255,255,255,0.10)",
};

const F = {
  display: "'Anton', 'Arial Narrow', sans-serif",
  mono: "'JetBrains Mono', 'IBM Plex Mono', ui-monospace, monospace",
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function TerminalPage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden antialiased relative"
      style={{
        background: C.bg,
        color: C.ink,
        fontFamily: F.mono,
        backgroundImage: `
          linear-gradient(${C.grid} 1px, transparent 1px),
          linear-gradient(90deg, ${C.grid} 1px, transparent 1px)
        `,
        backgroundSize: "48px 48px",
      }}
    >
      {/* Subtle scan-line overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0, transparent 2px, #fff 2px, #fff 3px)",
        }}
      />

      <WindowChrome />
      <Hero />
      <MarqueeBar />
      <About />
      <Process />
      <Contact />
      <StatusBar />
    </main>
  );
}

/* ---------------------- WINDOW CHROME -------------------------------- */
function WindowChrome() {
  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-5 py-3"
      style={{
        background: C.bgAlt,
        borderBottom: `1px solid ${C.hair}`,
        fontFamily: F.mono,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="size-3 rounded-full" style={{ background: "#FF5F57" }} />
          <span className="size-3 rounded-full" style={{ background: "#FEBC2E" }} />
          <span className="size-3 rounded-full" style={{ background: "#28C840" }} />
        </div>
        <p className="text-[11px] ml-3 hidden sm:block" style={{ color: C.inkMuted }}>
          vdt@studio:~/sites/vdt-sites
        </p>
      </div>
      <nav className="hidden md:flex items-center gap-5 text-[11px]" style={{ color: C.inkMuted }}>
        <a href="#about" className="hover:text-[var(--g)]" style={{ ["--g" as never]: C.accent }}>
          ./about
        </a>
        <a href="#process" className="hover:text-[var(--g)]" style={{ ["--g" as never]: C.accent }}>
          ./process
        </a>
        <a href="#contact" className="hover:text-[var(--g)]" style={{ ["--g" as never]: C.accent }}>
          ./contact
        </a>
      </nav>
      <span className="text-[11px]" style={{ color: C.accent }}>
        ● online
      </span>
    </div>
  );
}

/* ---------------------------- HERO ----------------------------------- */
function Hero() {
  return (
    <section
      className="px-6 sm:px-10 pt-16 sm:pt-24 pb-24 sm:pb-32 relative"
      style={{ borderBottom: `1px solid ${C.hair}` }}
    >
      <div className="max-w-[1340px] mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease }}
          className="text-[11px] mb-10 flex items-center gap-3 flex-wrap"
          style={{ color: C.inkMuted }}
        >
          <span style={{ color: C.accent }}>{">"}</span>
          <Typed text="cat ./manifesto.txt" />
        </motion.div>

        <motion.h1
          className="leading-[0.82] tracking-tight uppercase"
          style={{
            fontFamily: F.display,
            fontSize: "clamp(4.5rem, 16vw, 16rem)",
          }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.2 }}
        >
          TWO PEOPLE.
        </motion.h1>
        <motion.h1
          className="leading-[0.82] tracking-tight uppercase mt-3"
          style={{
            fontFamily: F.display,
            fontSize: "clamp(4.5rem, 16vw, 16rem)",
            color: C.accent,
          }}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.35 }}
        >
          NO NONSENSE_
          <span
            className="inline-block w-[0.3em] h-[0.85em] -mb-[0.05em] ml-1 align-baseline"
            style={{ background: C.accent, animation: "blink 1s steps(1) infinite" }}
          />
        </motion.h1>

        <motion.div
          className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7, ease }}
        >
          <div
            className="p-5 text-[13px] leading-[1.65]"
            style={{
              border: `1px solid ${C.hair}`,
              background: C.bgAlt,
              color: C.ink,
            }}
          >
            <p style={{ color: C.inkMuted }}>// readme.md</p>
            <p className="mt-2">
              A two-person studio in Nanaimo, BC. We build websites for people who want results,
              not invoices.
            </p>
          </div>
          <div className="flex items-end gap-3 flex-wrap">
            <a
              href="#contact"
              className="text-[12px] uppercase tracking-wider px-7 py-3 transition-colors group inline-flex items-center gap-2"
              style={{
                background: C.accent,
                color: C.bg,
                fontFamily: F.mono,
                fontWeight: 600,
              }}
            >
              <span style={{ opacity: 0.6 }}>$</span>
              <span>get_started</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a
              href="#process"
              className="text-[12px] uppercase tracking-wider px-7 py-3 transition-colors"
              style={{
                border: `1px solid ${C.hair}`,
                color: C.ink,
                fontFamily: F.mono,
              }}
            >
              ./how_it_works
            </a>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}

function Typed({ text }: { text: string }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [text]);
  return (
    <span style={{ color: C.ink }}>
      {shown}
      <span className="inline-block w-[7px] h-[14px] ml-[2px] align-middle" style={{ background: C.ink, animation: "blink 1s steps(1) infinite" }} />
    </span>
  );
}

/* ---------------------- MARQUEE STRIP -------------------------------- */
function MarqueeBar() {
  const items = [
    "RUN: NEXT.JS",
    "STACK: REACT 19 / TS / TAILWIND",
    "TURNAROUND: 1–4 WEEKS",
    "STUDENTS NOT AGENTS",
    "VIU / NANAIMO BC",
    "NO RETAINERS",
    "DIRECT DEALING",
    "RESULTS > INVOICES",
  ];

  return (
    <section
      className="overflow-hidden"
      style={{ background: C.accent, color: C.bg, borderBottom: `1px solid ${C.hair}` }}
    >
      <motion.div
        className="flex whitespace-nowrap py-3 text-[12px] tracking-wider"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ fontFamily: F.mono, fontWeight: 600 }}
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10 px-5">
            {items.map((t, j) => (
              <span key={j} className="flex items-center gap-10">
                <span>{t}</span>
                <span>✦</span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------------------------- ABOUT ---------------------------------- */
function About() {
  const lines = [
    "no_agency_markup",
    "fast_turnaround",
    "direct_communication",
  ];

  return (
    <section
      id="about"
      className="px-6 sm:px-10 py-24 sm:py-36"
      style={{ borderBottom: `1px solid ${C.hair}` }}
    >
      <div className="max-w-[1340px] mx-auto grid grid-cols-12 gap-6 sm:gap-10">
        <motion.div
          className="col-span-12 md:col-span-3 text-[11px]"
          style={{ color: C.inkMuted }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <p>{">"}<span style={{ color: C.accent }}> ./about.md</span></p>
          <p className="mt-3">// chapter 02</p>
        </motion.div>

        <motion.div
          className="col-span-12 md:col-span-9"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease }}
        >
          <h2
            className="uppercase leading-[0.9] tracking-tight mb-10"
            style={{
              fontFamily: F.display,
              fontSize: "clamp(3rem, 9vw, 8rem)",
            }}
          >
            YOUNG · DRIVEN ·
            <br />
            <span style={{ color: C.accent }}>BUILT FOR THIS</span>
          </h2>

          <div
            className="p-6 sm:p-8 text-[14px] leading-[1.7] mb-10"
            style={{
              border: `1px solid ${C.hair}`,
              background: C.bgAlt,
            }}
          >
            <p style={{ color: C.inkMuted }}>{`/**`}</p>
            <p className="pl-2" style={{ color: C.inkMuted }}>
              {" * Van Dusit & Tristel — two VIU students in Nanaimo, BC."}
            </p>
            <p className="pl-2" style={{ color: C.inkMuted }}>
              {" * Genuine design passion + business-minded execution."}
            </p>
            <p className="pl-2" style={{ color: C.inkMuted }}>
              {" * Low overhead, big motivation. Every site does its job."}
            </p>
            <p style={{ color: C.inkMuted }}>{` */`}</p>
          </div>

          <ul className="font-mono text-[14px] space-y-2">
            {lines.map((l, i) => (
              <motion.li
                key={l}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
              >
                <span style={{ color: C.accent }}>✓</span>
                <span>const</span>
                <span style={{ color: C.alt }}>{l}</span>
                <span style={{ color: C.inkMuted }}>= true;</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------- PROCESS -------------------------------- */
function Process() {
  const STEPS = [
    {
      n: "01",
      key: "discovery",
      title: "DISCOVERY",
      body: "We listen. What your business is, who you serve, what 'done' looks like. A real conversation — not a discovery deck.",
      duration: "~ 30min call",
    },
    {
      n: "02",
      key: "design_build",
      title: "DESIGN & BUILD",
      body: "Design and build from a blank page. You see progress weekly. Feedback loops are short and direct.",
      duration: "1–3 weeks",
    },
    {
      n: "03",
      key: "launch",
      title: "LAUNCH",
      body: "We ship the site, set up everything you need to run it, and walk you through doing it yourself.",
      duration: "1 day",
    },
  ];

  return (
    <section
      id="process"
      className="px-6 sm:px-10 py-24 sm:py-36"
      style={{ background: C.bgAlt, borderBottom: `1px solid ${C.hair}` }}
    >
      <div className="max-w-[1340px] mx-auto">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-[11px] mb-4" style={{ color: C.inkMuted }}>
            {">"} <span style={{ color: C.accent }}>./process.sh</span>
          </p>
          <h2
            className="uppercase leading-[0.9] tracking-tight"
            style={{
              fontFamily: F.display,
              fontSize: "clamp(3rem, 9vw, 8rem)",
            }}
          >
            03_STEPS.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              className="p-6 sm:p-7 relative group transition-all"
              style={{
                background: C.bg,
                border: `1px solid ${C.hair}`,
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * i, duration: 0.6, ease }}
              whileHover={{ borderColor: C.accent }}
            >
              <div className="flex items-baseline justify-between mb-8">
                <span
                  className="text-[11px]"
                  style={{ color: C.inkMuted, fontFamily: F.mono }}
                >
                  step.{s.key}
                </span>
                <span
                  className="text-[11px] tabular-nums"
                  style={{ color: C.accent, fontFamily: F.mono }}
                >
                  {s.duration}
                </span>
              </div>
              <p
                className="leading-none mb-3"
                style={{
                  fontFamily: F.display,
                  fontSize: "5rem",
                  color: C.accent,
                }}
              >
                {s.n}
              </p>
              <h3
                className="uppercase leading-none mb-4"
                style={{
                  fontFamily: F.display,
                  fontSize: "2rem",
                }}
              >
                {s.title}
              </h3>
              <p className="text-[13px] leading-[1.65]" style={{ color: C.inkMuted }}>
                {s.body}
              </p>

              {/* Decorative ASCII bracket */}
              <div
                className="absolute top-4 right-4 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: C.accent }}
              >
                {"[ active ]"}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- CONTACT -------------------------------- */
function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: String(fd.get("name") ?? ""),
          email: String(fd.get("email") ?? ""),
          message: String(fd.get("message") ?? ""),
          website: String(fd.get("website") ?? ""),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      (e.target as HTMLFormElement).reset();
      setStatus("ok");
    } catch {
      setError("Network error.");
      setStatus("error");
    }
  }

  return (
    <section
      id="contact"
      className="px-6 sm:px-10 py-24 sm:py-36"
      style={{ borderBottom: `1px solid ${C.hair}` }}
    >
      <div className="max-w-[1340px] mx-auto grid grid-cols-12 gap-6 sm:gap-10">
        <div className="col-span-12 md:col-span-5">
          <p className="text-[11px] mb-4" style={{ color: C.inkMuted }}>
            {">"} <span style={{ color: C.accent }}>./contact.sh</span>
          </p>
          <h2
            className="uppercase leading-[0.9] tracking-tight mb-8"
            style={{
              fontFamily: F.display,
              fontSize: "clamp(3rem, 8vw, 7rem)",
            }}
          >
            READY?
          </h2>
          <p className="text-[14px] leading-[1.65] max-w-md" style={{ color: C.inkMuted }}>
            Tell us about the project. We reply within 24 hours with a quote and a recommended
            scope.
          </p>
          <div
            className="mt-12 p-5 text-[12px] space-y-1 max-w-sm"
            style={{
              background: C.bgAlt,
              border: `1px solid ${C.hair}`,
              fontFamily: F.mono,
            }}
          >
            <p>
              <span style={{ color: C.inkMuted }}>location:</span> Nanaimo, BC
            </p>
            <p>
              <span style={{ color: C.inkMuted }}>email:</span>{" "}
              <span style={{ color: C.accent }}>hello@vdtsites.com</span>
            </p>
            <p>
              <span style={{ color: C.inkMuted }}>status:</span> <span style={{ color: C.accent }}>accepting work</span>
            </p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7">
          {status === "ok" ? (
            <div
              className="p-10 text-center"
              style={{
                border: `1px solid ${C.accent}`,
                background: C.bgAlt,
                color: C.accent,
                fontFamily: F.mono,
              }}
            >
              <p className="text-2xl mb-2">{"[ message_received ]"}</p>
              <p className="text-[13px]" style={{ color: C.inkMuted }}>
                Reply incoming within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="p-6 sm:p-8 space-y-6"
              style={{
                background: C.bgAlt,
                border: `1px solid ${C.hair}`,
                fontFamily: F.mono,
              }}
              noValidate
            >
              <TermField name="name" label="name" type="text" />
              <TermField name="email" label="email" type="email" />
              <TermField name="message" label="message" multiline />

              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />

              {status === "error" && (
                <p className="text-[12px]" style={{ color: C.alt }}>
                  {"// error: "} {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="text-[12px] uppercase tracking-wider px-8 py-3 transition-all disabled:opacity-60 inline-flex items-center gap-2"
                style={{
                  background: C.accent,
                  color: C.bg,
                  fontFamily: F.mono,
                  fontWeight: 600,
                }}
              >
                <span style={{ opacity: 0.7 }}>$</span>
                <span>{status === "sending" ? "sending..." : "submit"}</span>
                <span>→</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function TermField({
  name,
  label,
  type,
  multiline,
}: {
  name: string;
  label: string;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div className="text-[14px]">
      <label
        className="flex items-baseline gap-2 mb-2 text-[12px]"
        htmlFor={`term-${name}`}
      >
        <span style={{ color: C.inkMuted }}>vdt@:~$</span>
        <span style={{ color: C.accent }}>read</span>
        <span>{label}</span>
      </label>
      {multiline ? (
        <textarea
          id={`term-${name}`}
          name={name}
          rows={4}
          required
          className="w-full bg-transparent outline-none resize-none border-l-2 pl-3 py-1 transition-colors focus:border-l-[color:var(--g)]"
          style={{
            color: C.ink,
            borderLeftColor: C.hair,
            ["--g" as never]: C.accent,
          }}
        />
      ) : (
        <input
          id={`term-${name}`}
          name={name}
          type={type ?? "text"}
          required
          className="w-full bg-transparent outline-none border-l-2 pl-3 py-1 transition-colors focus:border-l-[color:var(--g)]"
          style={{
            color: C.ink,
            borderLeftColor: C.hair,
            ["--g" as never]: C.accent,
          }}
        />
      )}
    </div>
  );
}

/* ---------------------- STATUS BAR (FOOTER) -------------------------- */
function StatusBar() {
  return (
    <footer
      className="px-5 py-3 flex items-center justify-between text-[11px] flex-wrap gap-3"
      style={{
        background: C.bgAlt,
        color: C.inkMuted,
        fontFamily: F.mono,
      }}
    >
      <div className="flex items-center gap-5 flex-wrap">
        <span style={{ color: C.accent }}>● ready</span>
        <span>VDT Sites v1.0</span>
        <span>build: production</span>
      </div>
      <div className="flex items-center gap-5">
        <span>{new Date().getFullYear()}</span>
        <span>nanaimo · bc</span>
      </div>
    </footer>
  );
}
