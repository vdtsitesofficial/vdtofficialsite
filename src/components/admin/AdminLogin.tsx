"use client";

import { useState } from "react";

const C = {
  bg: "#0E1116",
  panel: "#161A21",
  panelHi: "#1E232C",
  line: "rgba(255,255,255,0.10)",
  ink: "#E8EAED",
  inkMuted: "#8A92A0",
  accent: "#3B6FE0",
  danger: "#FF6B6B",
};

type Step = "password" | "pin";

export default function AdminLogin() {
  const [step, setStep] = useState<Step>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ step: "password", email, password }),
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

  const inputStyle: React.CSSProperties = {
    background: C.panelHi,
    border: `1px solid ${C.line}`,
    color: C.ink,
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: C.bg, color: C.ink }}
    >
      <div
        className="w-full max-w-sm rounded-xl p-8"
        style={{ background: C.panel, border: `1px solid ${C.line}` }}
      >
        <div className="flex items-center gap-3 mb-1">
          <span
            className="size-7 rounded-md flex items-center justify-center text-[11px] font-bold"
            style={{ background: C.accent, color: "#fff" }}
          >
            VDT
          </span>
          <span className="text-sm font-semibold tracking-wide">
            VDT Sites Admin
          </span>
        </div>

        {step === "password" ? (
          <form onSubmit={submitPassword} className="mt-6">
            <p className="text-[13px] mb-5" style={{ color: C.inkMuted }}>
              Sign in to manage the site.
            </p>
            <label className="block text-[12px] mb-1" style={{ color: C.inkMuted }}>
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-[14px] mb-4 outline-none"
              style={inputStyle}
            />
            <label className="block text-[12px] mb-1" style={{ color: C.inkMuted }}>
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md px-3 py-2 text-[14px] outline-none"
              style={inputStyle}
            />
            {error && (
              <p className="mt-4 text-[12px]" style={{ color: C.danger }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="mt-6 w-full rounded-md py-2.5 text-[13px] font-medium transition-opacity disabled:opacity-50"
              style={{ background: C.accent, color: "#fff" }}
            >
              {busy ? "Checking..." : "Continue"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitPin} className="mt-6">
            <p className="text-[13px] mb-5" style={{ color: C.inkMuted }}>
              We emailed a 6-digit code to{" "}
              <span style={{ color: C.ink }}>{email}</span>. Enter it below. It
              expires in 10 minutes.
            </p>
            <label className="block text-[12px] mb-1" style={{ color: C.inkMuted }}>
              Sign-in code
            </label>
            <input
              type="text"
              required
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-md px-3 py-2 text-[18px] tracking-[0.3em] text-center outline-none"
              style={inputStyle}
            />
            {error && (
              <p className="mt-4 text-[12px]" style={{ color: C.danger }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy || pin.length !== 6}
              className="mt-6 w-full rounded-md py-2.5 text-[13px] font-medium transition-opacity disabled:opacity-50"
              style={{ background: C.accent, color: "#fff" }}
            >
              {busy ? "Verifying..." : "Sign in"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("password");
                setPin("");
                setError(null);
              }}
              className="mt-3 w-full text-[12px] transition-colors hover:text-white"
              style={{ color: C.inkMuted }}
            >
              Back
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
