"use client";

import { useState } from "react";
import { C, SYNE, FONT_HREF } from "./theme";

type Step = "email" | "pin";

export default function AdminLogin() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  async function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ step: "email", email }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) {
        setStep("pin");
      } else {
        setError(data.error ?? "Sign-in failed.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function submitPin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ step: "pin", email, pin }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) {
        window.location.href = "/admin";
      } else {
        setError(data.error ?? "Sign-in failed.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  /**
   * Focus ring is driven from React state, not a `focus:` utility class.
   * The inline `border` shorthand below outranks any stylesheet rule, so a
   * `focus:border-*` class here is silently dead — and with `outline-none`
   * also applied that left the inputs with NO visible keyboard focus at all.
   * Only one of the two inputs is mounted at a time, so one flag covers both.
   */
  const inputStyle: React.CSSProperties = {
    background: C.panelHi,
    border: `1px solid ${focused ? C.accent : C.line}`,
    boxShadow: focused ? `0 0 0 3px rgba(220,38,38,0.16)` : "none",
    color: C.ink,
  };

  const focusProps = {
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  };

  return (
    <main
      className="relative flex min-h-svh flex-col items-center justify-center overflow-x-clip px-6 py-16"
      style={{ background: C.bg, color: C.ink }}
    >
      <link href={FONT_HREF} rel="stylesheet" />

      {/* Ghost wordmark, the same device the public pages use behind their
          headings. Purely decorative, hidden from assistive tech. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[6%] -translate-x-1/2 select-none text-[110px] font-extrabold leading-none tracking-tight md:text-[190px]"
        style={{ fontFamily: SYNE, color: "rgba(13,13,13,0.035)" }}
      >
        VDT
      </span>

      <div
        className="relative w-full max-w-sm rounded-2xl p-8 backdrop-blur-sm"
        style={{
          background: C.panel,
          border: `1px solid ${C.line}`,
          boxShadow: "0 18px 40px rgba(13,13,13,0.07)",
        }}
      >
        <div className="mb-6 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/vdt-glass-logo.png"
            alt=""
            width={28}
            height={28}
            className="size-7 shrink-0"
          />
          <span
            className="text-[15px] font-bold tracking-tight"
            style={{ fontFamily: SYNE }}
          >
            VDT Sites
          </span>
          <span
            className="ml-auto rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]"
            style={{ background: "rgba(220,38,38,0.10)", color: C.accentDeep }}
          >
            Admin
          </span>
        </div>

        {step === "email" ? (
          <form onSubmit={submitEmail}>
            <h1
              className="text-[22px] font-bold leading-tight"
              style={{ fontFamily: SYNE }}
            >
              Sign in
            </h1>
            <p className="mb-5 mt-2 text-[13px] leading-relaxed" style={{ color: C.inkMuted }}>
              Enter your admin email and we&rsquo;ll send you a one-time
              sign-in code. There is no password to remember.
            </p>
            <label
              className="mb-1 block text-[12px] font-semibold"
              style={{ color: C.inkMuted }}
              htmlFor="admin-email"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              {...focusProps}
              className="w-full rounded-lg px-3 py-2.5 text-[14px] outline-none transition-shadow"
              style={inputStyle}
            />
            {error && (
              <p className="mt-4 text-[12px] font-medium" style={{ color: C.danger }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-lg py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: C.accent }}
            >
              {busy ? "Sending..." : "Email me a code"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitPin}>
            <h1
              className="text-[22px] font-bold leading-tight"
              style={{ fontFamily: SYNE }}
            >
              Check your email
            </h1>
            {/* Deliberately conditional ("If ... is an admin address"): the
                form must never confirm whether an address is on the
                allowlist, or /admin becomes an address oracle. */}
            <p className="mb-5 mt-2 text-[13px] leading-relaxed" style={{ color: C.inkMuted }}>
              If <span style={{ color: C.ink, fontWeight: 600 }}>{email}</span>{" "}
              is an admin address, a 6-digit code is on its way. It expires in
              10 minutes.
            </p>
            <label
              className="mb-1 block text-[12px] font-semibold"
              style={{ color: C.inkMuted }}
              htmlFor="admin-pin"
            >
              Sign-in code
            </label>
            <input
              id="admin-pin"
              type="text"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              {...focusProps}
              className="w-full rounded-lg px-3 py-2.5 text-center text-[18px] font-semibold tracking-[0.3em] outline-none transition-shadow"
              style={inputStyle}
            />
            {error && (
              <p className="mt-4 text-[12px] font-medium" style={{ color: C.danger }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy || pin.length !== 6}
              className="mt-6 w-full rounded-lg py-3 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: C.accent }}
            >
              {busy ? "Verifying..." : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setPin("");
                setError(null);
                setFocused(false);
              }}
              className="mt-3 w-full text-[12px] font-medium transition-opacity hover:opacity-70"
              style={{ color: C.inkMuted }}
            >
              Use a different email
            </button>
          </form>
        )}
      </div>

      {/* Anyone who lands here by typing the URL gets a way back to the site
          rather than a dead end. */}
      <a
        href="/"
        className="relative mt-8 text-[13px] font-semibold transition-opacity hover:opacity-70"
        style={{ color: C.inkMuted }}
      >
        ← Back to vdtsites.com
      </a>
    </main>
  );
}
