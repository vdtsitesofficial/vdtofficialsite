"use client";

/* -----------------------------------------------------------------------
 * /design-3 — "LIQUID"
 *
 * Soft maximalist glass aesthetic. Animated pastel gradient mesh drifts
 * behind everything. Glass panels with backdrop blur hold the content,
 * rounded generously, soft shadows. DM Serif Display italic carries the
 * personality; Inter handles the rest at a quiet weight. Floating blob
 * shapes anchor the spatial composition. Romantic, premium, lived-in.
 * --------------------------------------------------------------------- */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const C = {
  ink: "#231541",
  inkSoft: "#4D3B6E",
  inkMuted: "#7A6F92",
  accent: "#8A5BF0", // electric violet
  accentSoft: "#FFB3C1", // hot pink
  glassBorder: "rgba(255,255,255,0.55)",
  glassBg: "rgba(255,255,255,0.45)",
  glassBgStrong: "rgba(255,255,255,0.65)",
};

const F = {
  display: "'DM Serif Display', 'Fraunces', Georgia, serif",
  body: "'Inter', system-ui, sans-serif",
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function LiquidPage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden antialiased relative"
      style={{ color: C.ink, fontFamily: F.body, background: "#F8EBF0" }}
    >
      <MeshBackdrop />
      <Nav />
      <Hero />
      <About />
      <Process />
      <Contact />
      <Foot />
    </main>
  );
}

/* ------------------ ANIMATED GRADIENT MESH --------------------------- */
function MeshBackdrop() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {/* Base pastel wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #FDE8EE 0%, #E9DEFD 40%, #D9F2EA 75%, #FBE5F0 100%)",
        }}
      />
      {/* Drifting orbs - independent loops at different periods so the
          composition never quite repeats. */}
      <Orb top="-8%" left="-12%" size="48rem" color="#FFB3C1" duration={28} delay={0} />
      <Orb top="22%" left="62%" size="42rem" color="#8A5BF0" duration={34} delay={-8} />
      <Orb top="68%" left="8%" size="38rem" color="#7DE3C3" duration={31} delay={-15} />
      <Orb top="52%" left="55%" size="34rem" color="#FFCDA8" duration={36} delay={-22} />
      {/* Faint grain so the gradient doesn't feel sterile */}
      <div
        className="absolute inset-0 opacity-[0.4] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
    </div>
  );
}

function Orb({
  top,
  left,
  size,
  color,
  duration,
  delay,
}: {
  top: string;
  left: string;
  size: string;
  color: string;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        top,
        left,
        width: size,
        height: size,
        background: color,
        filter: "blur(80px)",
        opacity: 0.55,
      }}
      animate={{
        x: [0, 60, -40, 0],
        y: [0, -50, 30, 0],
        scale: [1, 1.15, 0.95, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

/* --------------------------- NAV ------------------------------------ */
function Nav() {
  return (
    <header className="sticky top-5 z-40 px-4">
      <div
        className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 px-5 py-3.5 rounded-full"
        style={{
          background: C.glassBgStrong,
          border: `1px solid ${C.glassBorder}`,
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          boxShadow: "0 8px 32px rgba(123,91,230,0.10)",
        }}
      >
        <a
          className="flex items-center gap-2.5"
          style={{ fontFamily: F.display, fontStyle: "italic", color: C.ink }}
        >
          <span className="size-8 rounded-full grid place-items-center text-white text-xs"
            style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.accentSoft})` }}>
            v
          </span>
          <span className="text-lg leading-none">VDT Sites</span>
        </a>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <a href="#about" style={{ color: C.inkSoft }}>About</a>
          <a href="#process" style={{ color: C.inkSoft }}>Process</a>
          <a href="#contact" style={{ color: C.inkSoft }}>Contact</a>
        </nav>
        <a
          href="#contact"
          className="text-xs sm:text-sm px-5 py-2.5 rounded-full transition-transform hover:scale-[1.03] inline-flex items-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentSoft} 100%)`,
            color: "#FFFFFF",
            fontWeight: 500,
          }}
        >
          Start a project
          <span>→</span>
        </a>
      </div>
    </header>
  );
}

/* --------------------------- HERO ------------------------------------ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={ref} className="pt-20 sm:pt-28 pb-24 sm:pb-36 px-6 sm:px-10 relative">
      <div className="max-w-[1280px] mx-auto grid grid-cols-12 gap-8 items-center">
        <motion.div className="col-span-12 md:col-span-8" style={{ y: y1 }}>
          <motion.p
            className="text-xs tracking-[0.32em] uppercase mb-8"
            style={{ color: C.inkMuted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, ease }}
          >
            Two-person studio · Nanaimo, BC
          </motion.p>
          <motion.h1
            className="leading-[0.92] tracking-[-0.015em]"
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
              color: C.ink,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
          >
            Two people.
          </motion.h1>
          <motion.h2
            className="italic leading-[0.92] tracking-[-0.02em]"
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(3.5rem, 11vw, 9.5rem)",
              background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentSoft} 100%)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1, ease }}
          >
            No nonsense.
          </motion.h2>
          <motion.p
            className="mt-9 text-base sm:text-lg leading-[1.55] max-w-lg"
            style={{ color: C.inkSoft }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease }}
          >
            A two-person studio in Nanaimo, BC. We build websites for people who want results,
            not invoices.
          </motion.p>
          <motion.div
            className="mt-10 flex gap-3 flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease }}
          >
            <a
              href="#contact"
              className="px-7 py-3.5 rounded-full text-sm inline-flex items-center gap-2 transition-transform hover:scale-[1.03]"
              style={{
                background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentSoft} 100%)`,
                color: "#FFFFFF",
                fontWeight: 500,
                boxShadow: "0 10px 30px rgba(123,91,230,0.25)",
              }}
            >
              Start a project
              <span>→</span>
            </a>
            <a
              href="#process"
              className="px-7 py-3.5 rounded-full text-sm transition-colors"
              style={{
                background: C.glassBg,
                border: `1px solid ${C.glassBorder}`,
                color: C.ink,
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
              }}
            >
              See how we work
            </a>
          </motion.div>
        </motion.div>

        {/* Floating stat card */}
        <motion.div
          className="col-span-12 md:col-span-4"
          style={{ y: y2 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1, ease }}
        >
          <div
            className="p-8 rounded-[2rem] relative"
            style={{
              background: C.glassBgStrong,
              border: `1px solid ${C.glassBorder}`,
              backdropFilter: "blur(28px) saturate(180%)",
              WebkitBackdropFilter: "blur(28px) saturate(180%)",
              boxShadow: "0 24px 60px rgba(123,91,230,0.18)",
            }}
          >
            <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: C.inkMuted }}>
              currently
            </p>
            <p
              className="leading-[1.05] italic mb-6"
              style={{
                fontFamily: F.display,
                fontSize: "2.5rem",
                color: C.ink,
              }}
            >
              Accepting <br />new projects
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Turnaround" value="1–4w" />
              <Stat label="Replies in" value="24h" />
              <Stat label="Built" value="VIU" />
              <Stat label="Base" value="Nanaimo" />
            </div>
            <div
              className="absolute -top-3 -right-3 size-12 rounded-full grid place-items-center"
              style={{
                background: "#FFFFFF",
                boxShadow: "0 6px 20px rgba(123,91,230,0.25)",
              }}
            >
              <span style={{ color: C.accent }}>✦</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl px-3 py-3" style={{ background: "rgba(255,255,255,0.55)" }}>
      <p className="text-[10px] tracking-[0.22em] uppercase" style={{ color: C.inkMuted }}>
        {label}
      </p>
      <p
        className="mt-1"
        style={{ fontFamily: F.display, fontSize: "1.5rem", color: C.ink }}
      >
        {value}
      </p>
    </div>
  );
}

/* --------------------------- ABOUT ----------------------------------- */
function About() {
  const bullets = [
    { k: "No agency markup", v: "You pay for the work, not the overhead." },
    { k: "Fast turnaround", v: "Most projects done in 1–4 weeks." },
    { k: "Direct communication", v: "You work with the people building it." },
  ];

  return (
    <section id="about" className="px-6 sm:px-10 py-24 sm:py-36">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          className="rounded-[2.5rem] p-8 sm:p-14 grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-14"
          style={{
            background: C.glassBgStrong,
            border: `1px solid ${C.glassBorder}`,
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            boxShadow: "0 30px 80px rgba(123,91,230,0.12)",
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease }}
        >
          <div className="col-span-1 md:col-span-5">
            <p className="text-xs tracking-[0.32em] uppercase mb-6" style={{ color: C.inkMuted }}>
              About
            </p>
            <h3
              className="leading-[0.95] tracking-[-0.015em] mb-8"
              style={{
                fontFamily: F.display,
                fontSize: "clamp(2.5rem, 6vw, 4.75rem)",
                color: C.ink,
              }}
            >
              <span className="italic">Young,</span> driven,
              <br />
              built for this.
            </h3>
            <p
              className="text-base leading-[1.65] max-w-md"
              style={{ color: C.inkSoft }}
            >
              We&apos;re Van Dusit &amp; Tristel — two VIU students in Nanaimo, BC. Genuine
              design passion, business-minded execution. Being students means low overhead and
              big motivation.
            </p>
          </div>

          <div className="col-span-1 md:col-span-7 space-y-3">
            {bullets.map((b, i) => (
              <motion.div
                key={b.k}
                className="rounded-2xl px-6 py-5 flex items-start gap-5"
                style={{ background: "rgba(255,255,255,0.55)", border: `1px solid ${C.glassBorder}` }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: 0.1 * i, duration: 0.6, ease }}
              >
                <span
                  className="size-9 shrink-0 rounded-full grid place-items-center text-white text-sm"
                  style={{
                    background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentSoft} 100%)`,
                  }}
                >
                  ✓
                </span>
                <div>
                  <p
                    className="mb-1"
                    style={{
                      fontFamily: F.display,
                      fontSize: "1.4rem",
                      color: C.ink,
                    }}
                  >
                    {b.k}
                  </p>
                  <p className="text-sm leading-[1.55]" style={{ color: C.inkSoft }}>
                    {b.v}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* --------------------------- PROCESS --------------------------------- */
function Process() {
  const STEPS = [
    {
      n: "01",
      title: "Discovery",
      body: "A real conversation about what your business is, who you serve, what done looks like.",
      icon: "✶",
    },
    {
      n: "02",
      title: "Design & Build",
      body: "We design and build from scratch. You see progress weekly and shape it as we go.",
      icon: "✧",
    },
    {
      n: "03",
      title: "Launch",
      body: "We ship, set things up, and walk you through running it yourself.",
      icon: "✦",
    },
  ];

  return (
    <section id="process" className="px-6 sm:px-10 py-24 sm:py-36">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="text-xs tracking-[0.32em] uppercase mb-5" style={{ color: C.inkMuted }}>
            How it works
          </p>
          <h3
            className="leading-[0.95] tracking-[-0.015em]"
            style={{
              fontFamily: F.display,
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              color: C.ink,
            }}
          >
            A <span className="italic">simple</span> process.
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              className="rounded-[1.75rem] p-7 sm:p-8 relative overflow-hidden"
              style={{
                background: C.glassBgStrong,
                border: `1px solid ${C.glassBorder}`,
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                boxShadow: "0 18px 48px rgba(123,91,230,0.10)",
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.12 * i, duration: 0.7, ease }}
              whileHover={{ y: -6 }}
            >
              {/* Decorative orb in corner */}
              <div
                className="absolute -top-12 -right-12 size-40 rounded-full opacity-50 blur-2xl"
                style={{
                  background:
                    i === 0
                      ? "#FFB3C1"
                      : i === 1
                        ? "#8A5BF0"
                        : "#7DE3C3",
                }}
              />
              <div className="relative">
                <div className="flex items-baseline justify-between mb-6">
                  <span
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ color: C.inkMuted }}
                  >
                    {s.n}
                  </span>
                  <span
                    className="text-2xl"
                    style={{ color: C.accent }}
                  >
                    {s.icon}
                  </span>
                </div>
                <h4
                  className="leading-[0.95] mb-4"
                  style={{
                    fontFamily: F.display,
                    fontSize: "2.5rem",
                    color: C.ink,
                  }}
                >
                  <span className="italic">{s.title}</span>
                </h4>
                <p className="text-sm leading-[1.65]" style={{ color: C.inkSoft }}>
                  {s.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- CONTACT --------------------------------- */
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
    <section id="contact" className="px-6 sm:px-10 py-24 sm:py-36">
      <div className="max-w-[960px] mx-auto">
        <motion.div
          className="rounded-[2.5rem] p-8 sm:p-14 text-center"
          style={{
            background: C.glassBgStrong,
            border: `1px solid ${C.glassBorder}`,
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            boxShadow: "0 30px 80px rgba(123,91,230,0.16)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
        >
          <p className="text-xs tracking-[0.32em] uppercase mb-5" style={{ color: C.inkMuted }}>
            Get in touch
          </p>
          <h3
            className="leading-[0.95] tracking-[-0.015em] mb-6"
            style={{
              fontFamily: F.display,
              fontSize: "clamp(2.75rem, 6vw, 5rem)",
              color: C.ink,
            }}
          >
            Ready to <span className="italic">start?</span>
          </h3>
          <p
            className="text-base leading-[1.65] max-w-md mx-auto mb-10"
            style={{ color: C.inkSoft }}
          >
            Tell us about your project. We&apos;ll reply within 24 hours with a quote and a
            recommended scope.
          </p>

          {status === "ok" ? (
            <div className="py-12">
              <div
                className="size-16 rounded-full mx-auto mb-4 grid place-items-center text-white text-2xl"
                style={{
                  background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentSoft} 100%)`,
                }}
              >
                ✓
              </div>
              <p
                className="italic"
                style={{ fontFamily: F.display, fontSize: "2rem", color: C.ink }}
              >
                Message received.
              </p>
              <p className="text-sm mt-2" style={{ color: C.inkSoft }}>
                We&apos;ll reply within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4 text-left max-w-xl mx-auto" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LiqField name="name" label="Your name" type="text" />
                <LiqField name="email" label="Email" type="email" />
              </div>
              <LiqField name="message" label="What are you building?" multiline />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />
              {status === "error" && (
                <p className="text-sm" style={{ color: C.accent }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 rounded-full text-sm transition-transform hover:scale-[1.01] disabled:opacity-60 inline-flex items-center justify-center gap-2 mt-2"
                style={{
                  background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentSoft} 100%)`,
                  color: "#FFFFFF",
                  fontWeight: 500,
                  boxShadow: "0 14px 36px rgba(123,91,230,0.30)",
                }}
              >
                {status === "sending" ? "Sending..." : "Send message"}
                <span>→</span>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function LiqField({
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
    <label className="block">
      <span
        className="block text-xs tracking-[0.22em] uppercase mb-2"
        style={{ color: C.inkMuted }}
      >
        {label}
      </span>
      {multiline ? (
        <textarea
          name={name}
          required
          rows={5}
          className="w-full px-5 py-4 rounded-2xl outline-none resize-none transition-all"
          style={{
            background: "rgba(255,255,255,0.65)",
            border: `1px solid ${C.glassBorder}`,
            color: C.ink,
            fontFamily: F.body,
          }}
        />
      ) : (
        <input
          name={name}
          type={type ?? "text"}
          required
          className="w-full px-5 py-3.5 rounded-full outline-none transition-all"
          style={{
            background: "rgba(255,255,255,0.65)",
            border: `1px solid ${C.glassBorder}`,
            color: C.ink,
            fontFamily: F.body,
          }}
        />
      )}
    </label>
  );
}

/* --------------------------- FOOTER ---------------------------------- */
function Foot() {
  return (
    <footer className="px-6 sm:px-10 pb-10">
      <div
        className="max-w-[1280px] mx-auto rounded-full px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        style={{
          background: C.glassBgStrong,
          border: `1px solid ${C.glassBorder}`,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          color: C.inkSoft,
        }}
      >
        <p style={{ fontFamily: F.display, fontStyle: "italic" }}>
          VDT Sites — Liquid edition
        </p>
        <p className="tracking-[0.24em] uppercase">© {new Date().getFullYear()} · Nanaimo BC</p>
      </div>
    </footer>
  );
}
