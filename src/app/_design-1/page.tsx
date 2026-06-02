"use client";

/* -----------------------------------------------------------------------
 * /design-1 — "SPECIMEN"
 *
 * An editorial type-foundry specimen page. Heavy serif typography at
 * extreme sizes, asymmetric 12-col grid with marginalia, hairlines as
 * the primary structural device, an ochre accent that appears sparingly.
 * Italic Fraunces does the heavy emotional lifting; the rest is held in
 * place by Hanken Grotesk and disciplined whitespace.
 * --------------------------------------------------------------------- */

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const C = {
  bg: "#F5F0E6",
  bgDeep: "#EBE3D2",
  ink: "#1A1612",
  inkMuted: "#6B5D4F",
  accent: "#C4622B",
  hair: "rgba(26, 22, 18, 0.18)",
};

const F = {
  display: "'Fraunces', 'Iowan Old Style', Georgia, serif",
  body: "'Hanken Grotesk', system-ui, sans-serif",
};

const ease = [0.22, 1, 0.36, 1] as const;

export default function SpecimenPage() {
  return (
    <main
      className="min-h-screen overflow-x-hidden antialiased"
      style={{ background: C.bg, color: C.ink, fontFamily: F.body }}
    >
      <TopBar />
      <Hero />
      <BigType />
      <About />
      <Process />
      <Contact />
      <FootBar />
    </main>
  );
}

/* ---------------------------- TOP BAR --------------------------------- */
function TopBar() {
  return (
    <div
      className="sticky top-0 z-40"
      style={{
        background: `${C.bg}f5`,
        borderBottom: `1px solid ${C.hair}`,
        backdropFilter: "blur(6px)",
      }}
    >
      <div className="max-w-[1340px] mx-auto px-6 sm:px-10 py-4 flex items-center justify-between text-[12px]">
        <a className="flex items-baseline gap-1.5" style={{ fontFamily: F.display, fontWeight: 500 }}>
          <span className="text-lg leading-none">VDT</span>
          <span className="italic text-lg leading-none" style={{ color: C.accent }}>
            Sites
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-9 uppercase tracking-[0.28em]">
          <a href="#about" className="transition-opacity hover:opacity-60">About</a>
          <a href="#process" className="transition-opacity hover:opacity-60">Process</a>
          <a href="#contact" className="transition-opacity hover:opacity-60">Contact</a>
        </nav>
        <a
          href="#contact"
          className="uppercase tracking-[0.24em] inline-flex items-center gap-2 group"
        >
          <span className="border-b border-transparent group-hover:border-current">Get a quote</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
      </div>
    </div>
  );
}

/* ---------------------------- HERO ------------------------------------ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);

  return (
    <section ref={ref} className="pt-24 sm:pt-36 pb-20 sm:pb-28 px-6 sm:px-10">
      <div className="max-w-[1340px] mx-auto grid grid-cols-12 gap-6 sm:gap-10">
        {/* Marginalia */}
        <motion.aside
          className="col-span-12 md:col-span-2 flex md:flex-col gap-x-6 gap-y-3 text-[10px] uppercase tracking-[0.32em]"
          style={{ color: C.inkMuted, y }}
        >
          <Margin n={0}>№ 001</Margin>
          <Margin n={1}>Studio</Margin>
          <Margin n={2}>Est. 2026</Margin>
          <Margin n={3}>Nanaimo · BC</Margin>
        </motion.aside>

        {/* Headline block */}
        <div className="col-span-12 md:col-span-10">
          <motion.h1
            className="leading-[0.85] tracking-[-0.02em]"
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(4rem, 14vw, 12.5rem)",
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease }}
          >
            Two
          </motion.h1>
          <motion.h1
            className="italic leading-[0.85] tracking-[-0.025em]"
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(4rem, 14vw, 12.5rem)",
              color: C.accent,
            }}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1.1, ease }}
          >
            people.
          </motion.h1>
          <motion.h2
            className="leading-[0.9] tracking-[-0.015em] mt-3 sm:mt-5"
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 8.5vw, 7.5rem)",
              color: C.inkMuted,
            }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease }}
          >
            No nonsense.
          </motion.h2>

          <motion.div
            className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-12 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.8, ease }}
          >
            <div className="md:col-span-5">
              <p className="text-[15px] leading-[1.65]" style={{ color: C.inkMuted }}>
                A two-person studio in Nanaimo, BC.
                <br />
                We build websites for people who want
                <br />
                results, not invoices.
              </p>
            </div>
            <div className="md:col-span-7 flex items-end gap-3 flex-wrap">
              <a
                href="#contact"
                className="text-[11px] tracking-[0.24em] uppercase px-9 py-4 transition-all hover:opacity-85"
                style={{ background: C.ink, color: C.bg, fontFamily: F.body }}
              >
                Get a quote
              </a>
              <a
                href="#process"
                className="text-[11px] tracking-[0.24em] uppercase px-9 py-4 transition-colors"
                style={{
                  border: `1px solid ${C.ink}`,
                  color: C.ink,
                  fontFamily: F.body,
                }}
              >
                Our process
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Margin({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.05 * n, duration: 0.8, ease }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------- BIG TYPE STRIP ------------------------------- */
function BigType() {
  return (
    <section
      className="overflow-hidden py-2"
      style={{ borderTop: `1px solid ${C.hair}`, borderBottom: `1px solid ${C.hair}` }}
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      >
        {Array.from({ length: 2 }).map((_, i) => (
          <span
            key={i}
            className="flex shrink-0 items-baseline gap-12 px-12 leading-none py-6"
            style={{
              fontFamily: F.display,
              fontSize: "clamp(3rem, 8vw, 6.5rem)",
              fontWeight: 400,
              color: C.ink,
            }}
          >
            {["Websites", "Identity", "Strategy", "Copywriting", "Launch", "Care"].map((w, j) => (
              <span key={j} className={j % 2 ? "italic" : ""} style={{ color: j === 1 ? C.accent : undefined }}>
                {w} <span style={{ color: C.inkMuted }}>·</span>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------------------------- ABOUT ----------------------------------- */
function About() {
  const bullets = [
    "No agency markup. You pay for the work, not the overhead.",
    "Fast turnaround. Most projects done in 1–4 weeks.",
    "Direct communication. You work with the people building it.",
  ];

  return (
    <section id="about" className="py-28 sm:py-36 px-6 sm:px-10" style={{ background: C.bgDeep }}>
      <div className="max-w-[1340px] mx-auto grid grid-cols-12 gap-6 sm:gap-10">
        <motion.div
          className="col-span-12 md:col-span-3 text-[10px] uppercase tracking-[0.32em]"
          style={{ color: C.inkMuted }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
        >
          <p>02 — About the studio</p>
        </motion.div>

        <motion.div
          className="col-span-12 md:col-span-9"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease }}
        >
          <h3
            className="leading-[0.92] tracking-[-0.02em] mb-12"
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 7vw, 5.75rem)",
            }}
          >
            Young, <span className="italic" style={{ color: C.accent }}>driven,</span>
            <br />
            built for this.
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
            <p className="text-[16px] leading-[1.7]" style={{ color: C.inkMuted }}>
              We&apos;re <span style={{ color: C.ink }}>Van Dusit &amp; Tristel</span> — two VIU
              students in Nanaimo, BC. Genuine passion for design, business-minded approach to every
              project. Being students means low overhead and big motivation. Every site we build is
              crafted to do its job, not just look the part.
            </p>
            <ul className="space-y-5">
              {bullets.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ delay: 0.1 * i, duration: 0.6, ease }}
                  className="flex gap-4 items-baseline pb-5"
                  style={{ borderBottom: `1px solid ${C.hair}` }}
                >
                  <span
                    className="text-[11px] tracking-[0.28em] uppercase shrink-0 w-10"
                    style={{
                      color: C.accent,
                      fontFamily: F.display,
                      fontStyle: "italic",
                      fontWeight: 500,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[15px] leading-[1.55]">{b}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------- PROCESS --------------------------------- */
function Process() {
  const STEPS = [
    {
      n: "01",
      title: "Discovery",
      body: "We listen — what your business is, who you serve, what success looks like. A real conversation, not a discovery deck.",
    },
    {
      n: "02",
      title: "Design & Build",
      body: "We design and build from a blank page. You see progress weekly and shape it as we go. No black-box agency theater.",
    },
    {
      n: "03",
      title: "Launch",
      body: "We ship the site, set up everything you need to run it, and walk you through doing it yourself.",
    },
  ];

  return (
    <section id="process" className="py-28 sm:py-36 px-6 sm:px-10">
      <div className="max-w-[1340px] mx-auto">
        <motion.div
          className="grid grid-cols-12 gap-6 mb-16 sm:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease }}
        >
          <p
            className="col-span-12 md:col-span-3 text-[10px] uppercase tracking-[0.32em]"
            style={{ color: C.inkMuted }}
          >
            03 — How it works
          </p>
          <h3
            className="col-span-12 md:col-span-9 leading-[0.95] tracking-[-0.02em]"
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(2.5rem, 7vw, 5.75rem)",
            }}
          >
            A short <span className="italic" style={{ color: C.accent }}>process,</span> from
            sketch to ship.
          </h3>
        </motion.div>

        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              className="grid grid-cols-12 gap-6 py-10 sm:py-14 group"
              style={{ borderTop: `1px solid ${C.hair}` }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.1 * i, duration: 0.7, ease }}
            >
              <div
                className="col-span-2 sm:col-span-1 leading-none"
                style={{
                  fontFamily: F.display,
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: C.accent,
                }}
              >
                {step.n}
              </div>
              <h4
                className="col-span-10 sm:col-span-4 leading-[0.95] tracking-[-0.015em]"
                style={{
                  fontFamily: F.display,
                  fontSize: "clamp(2rem, 5vw, 3.75rem)",
                  fontWeight: 400,
                }}
              >
                {step.title}
              </h4>
              <p
                className="col-span-12 sm:col-span-7 text-[15px] leading-[1.65] sm:pl-12"
                style={{ color: C.inkMuted }}
              >
                {step.body}
              </p>
            </motion.div>
          ))}
          <div style={{ borderTop: `1px solid ${C.hair}`, height: 0 }} />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- CONTACT --------------------------------- */
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
      className="py-28 sm:py-40 px-6 sm:px-10"
      style={{ background: C.ink, color: C.bg }}
    >
      <div className="max-w-[1340px] mx-auto grid grid-cols-12 gap-6 sm:gap-10">
        <div className="col-span-12 md:col-span-5">
          <p className="text-[10px] uppercase tracking-[0.32em] mb-8" style={{ color: "rgba(245,240,230,0.5)" }}>
            04 — Get in touch
          </p>
          <h3
            className="leading-[0.92] tracking-[-0.02em] mb-8"
            style={{
              fontFamily: F.display,
              fontWeight: 400,
              fontSize: "clamp(2.75rem, 6.5vw, 5.5rem)",
            }}
          >
            Ready to get
            <br />
            <span className="italic" style={{ color: C.accent }}>started?</span>
          </h3>
          <p className="text-[15px] leading-[1.65] max-w-md" style={{ color: "rgba(245,240,230,0.65)" }}>
            Tell us about the project. We&apos;ll reply within 24 hours with a quote and what we
            think the right scope is.
          </p>
          <div className="mt-12 space-y-2 text-[13px]" style={{ color: "rgba(245,240,230,0.6)" }}>
            <p>Nanaimo, British Columbia</p>
            <p>hello@vdtsites.com</p>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7 md:pl-10">
          {status === "ok" ? (
            <div className="py-20 text-center">
              <p
                className="italic mb-3"
                style={{ fontFamily: F.display, fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Message received.
              </p>
              <p className="text-sm" style={{ color: "rgba(245,240,230,0.65)" }}>
                We&apos;ll be in touch within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-0" noValidate>
              {[
                { name: "name", label: "Name", type: "text" },
                { name: "email", label: "Email", type: "email" },
              ].map((f) => (
                <SpecField key={f.name} {...f} />
              ))}
              <SpecField name="message" label="Project" type="text" multiline />
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden
              />
              {status === "error" && (
                <p className="mt-4 text-sm" style={{ color: C.accent }}>
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "sending"}
                className="mt-10 inline-flex items-center gap-3 text-[11px] tracking-[0.24em] uppercase px-9 py-4 transition-all hover:opacity-85 disabled:opacity-50"
                style={{ background: C.accent, color: C.bg, fontFamily: F.body }}
              >
                {status === "sending" ? "Sending..." : "Send →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function SpecField({
  name,
  label,
  type,
  multiline,
}: {
  name: string;
  label: string;
  type: string;
  multiline?: boolean;
}) {
  return (
    <label
      className="grid grid-cols-12 gap-4 items-baseline py-5 group"
      style={{ borderBottom: `1px solid rgba(245,240,230,0.18)` }}
    >
      <span
        className="col-span-3 italic text-sm leading-none"
        style={{
          color: "rgba(245,240,230,0.55)",
          fontFamily: F.display,
          fontWeight: 400,
        }}
      >
        {label}
      </span>
      {multiline ? (
        <textarea
          name={name}
          required
          rows={3}
          className="col-span-9 bg-transparent outline-none resize-none text-[18px] leading-[1.5]"
          style={{ color: C.bg, fontFamily: F.body }}
        />
      ) : (
        <input
          name={name}
          type={type}
          required
          className="col-span-9 bg-transparent outline-none text-[18px]"
          style={{ color: C.bg, fontFamily: F.body }}
        />
      )}
    </label>
  );
}

/* ---------------------------- FOOTER ---------------------------------- */
function FootBar() {
  return (
    <footer
      className="px-6 sm:px-10 py-10"
      style={{ background: C.bg, color: C.inkMuted, borderTop: `1px solid ${C.hair}` }}
    >
      <div className="max-w-[1340px] mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between text-[11px] tracking-wide">
        <p style={{ fontFamily: F.display, fontStyle: "italic", fontSize: "0.95rem" }}>
          VDT Sites — Specimen edition № 001
        </p>
        <p className="uppercase tracking-[0.28em]">© {new Date().getFullYear()} · Nanaimo BC</p>
      </div>
    </footer>
  );
}
