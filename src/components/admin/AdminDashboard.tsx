"use client";

import { useState } from "react";
import type { ContactMessage } from "@/lib/admin";

type Tab = "messages" | "posts" | "copy";

// Labels for the contact form's "Schedule a call" time-window keys.
const SLOT_LABELS: Record<string, string> = {
  morning: "Morning (9 AM – 12 PM)",
  afternoon: "Afternoon (12 – 4 PM)",
  evening: "Evening (4 – 7 PM)",
  anytime: "Anytime",
};

const C = {
  bg: "#0E1116",
  panel: "#161A21",
  panelHi: "#1E232C",
  line: "rgba(255,255,255,0.10)",
  ink: "#E8EAED",
  inkMuted: "#8A92A0",
  accent: "#3B6FE0",
};

export default function AdminDashboard({
  email,
  messages: initialMessages,
}: {
  email: string;
  messages: ContactMessage[];
}) {
  const [tab, setTab] = useState<Tab>("messages");
  const [messages, setMessages] = useState(initialMessages);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/admin/login";
  }

  async function remove(id: string) {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    setBusyId(id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) setMessages((m) => m.filter((x) => x.id !== id));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="min-h-screen" style={{ background: C.bg, color: C.ink }}>
      {/* Top bar */}
      <header
        className="px-6 sm:px-10 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${C.line}` }}
      >
        <div className="flex items-center gap-3">
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
        <div className="flex items-center gap-4 text-xs" style={{ color: C.inkMuted }}>
          <span>{email}</span>
          <a href="/" className="hover:text-white transition-colors">
            View site →
          </a>
          <button
            type="button"
            onClick={signOut}
            className="hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 sm:px-10 py-8">
        {/* Tabs */}
        <nav className="flex gap-1 mb-8">
          {(
            [
              ["messages", `Messages${messages.length ? ` (${messages.length})` : ""}`],
              ["posts", "Blog Posts"],
              ["copy", "Site Copy"],
            ] as [Tab, string][]
          ).map(([id, label]) => {
            const active = tab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className="px-4 py-2 rounded-md text-[13px] font-medium transition-colors"
                style={{
                  background: active ? C.panelHi : "transparent",
                  color: active ? C.ink : C.inkMuted,
                }}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {tab === "messages" && (
          <section>
            {messages.length === 0 ? (
              <Empty
                title="No messages yet"
                body="Submissions from the site's contact form will appear here."
              />
            ) : (
              <ul className="space-y-3">
                {messages.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-lg p-5"
                    style={{ background: C.panel, border: `1px solid ${C.line}` }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-medium">{m.name}</p>
                        <a
                          href={`mailto:${m.email}`}
                          className="text-[13px] hover:underline"
                          style={{ color: C.accent }}
                        >
                          {m.email}
                        </a>
                        {m.phone && (
                          <a
                            href={`tel:${m.phone.replace(/[^+\d]/g, "")}`}
                            className="block text-[13px] hover:underline"
                            style={{ color: C.accent }}
                          >
                            {m.phone}
                          </a>
                        )}
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <time
                          className="text-[11px] tabular-nums"
                          style={{ color: C.inkMuted }}
                          dateTime={m.at}
                        >
                          {new Date(m.at).toLocaleString("en-CA", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </time>
                        <button
                          type="button"
                          onClick={() => remove(m.id)}
                          disabled={busyId === m.id}
                          className="text-[11px] px-2.5 py-1 rounded transition-colors disabled:opacity-50"
                          style={{
                            color: "#FF6B6B",
                            border: "1px solid rgba(255,107,107,0.3)",
                          }}
                        >
                          {busyId === m.id ? "..." : "Delete"}
                        </button>
                      </div>
                    </div>
                    {m.callDate && (
                      <p
                        className="mt-3 text-[13px] font-semibold"
                        style={{ color: "#FFB454" }}
                      >
                        📞 Call requested:{" "}
                        {new Date(`${m.callDate}T12:00:00Z`).toLocaleDateString(
                          "en-CA",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            timeZone: "UTC",
                          },
                        )}
                        {m.callTime
                          ? ` · ${Object.hasOwn(SLOT_LABELS, m.callTime) ? SLOT_LABELS[m.callTime] : m.callTime}`
                          : ""}
                      </p>
                    )}
                    <p
                      className="mt-3 text-[14px] leading-relaxed whitespace-pre-wrap"
                      style={{ color: "#C7CCD4" }}
                    >
                      {m.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {tab === "posts" && (
          <Empty
            title="Blog post management is coming next"
            body="Phase 2 will move blog posts into the database so you can create, edit, and remove them from here without a code deploy."
          />
        )}

        {tab === "copy" && (
          <Empty
            title="Site copy editing is coming next"
            body="Phase 3 will let you edit the site's key headlines and copy from here."
          />
        )}
      </div>
    </main>
  );
}

function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="rounded-lg p-12 text-center"
      style={{ background: C.panel, border: `1px solid ${C.line}` }}
    >
      <p className="font-medium mb-2">{title}</p>
      <p className="text-[13px] max-w-sm mx-auto leading-relaxed" style={{ color: C.inkMuted }}>
        {body}
      </p>
    </div>
  );
}
