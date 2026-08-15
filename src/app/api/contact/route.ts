import { NextResponse } from "next/server";
import { saveMessage } from "@/lib/admin";

type Payload = {
  name: string;
  email: string;
  message: string;
  phone?: string; // optional callback number
  callDate?: string; // "Schedule a call": YYYY-MM-DD
  callTime?: string; // "Schedule a call": slot key from TIME_SLOTS
  website?: string; // honeypot
};

// Whitelisted call windows (Pacific time). Keys arrive from the client,
// labels go into the notification email and admin inbox.
const TIME_SLOTS: Record<string, string> = {
  morning: "Morning (9 AM – 12 PM)",
  afternoon: "Afternoon (12 – 4 PM)",
  evening: "Evening (4 – 7 PM)",
  anytime: "Anytime",
};

type SendEmailBinding = { send(message: unknown): Promise<void> };
type Env = {
  SEND_EMAIL?: SendEmailBinding;
  CONTACT_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
};

async function getEnv(): Promise<Env | null> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const ctx = mod.getCloudflareContext();
    return (ctx?.env as Env | undefined) ?? null;
  } catch {
    return null;
  }
}

function stripDisplayName(addr: string): string {
  const m = /<([^>]+)>/.exec(addr);
  return m ? m[1] : addr.trim();
}

async function deliver(
  from: string,
  to: string,
  subject: string,
  text: string,
  replyTo: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const env = await getEnv();

  if (!env?.SEND_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[VDTTest contact form] (dev, no SEND_EMAIL binding)");
      console.log({ from, to, replyTo, subject, text });
      return { ok: true };
    }
    return { ok: false, reason: "SEND_EMAIL binding not configured." };
  }

  try {
    const raw = [
      `From: ${from}`,
      `To: ${to}`,
      `Reply-To: ${replyTo}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset="utf-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      text,
    ].join("\r\n");

    // Built-in Workers module - resolved at runtime, not bundle time.
    const spec = ["cloudflare", "email"].join(":");
    const mod = (await import(/* @vite-ignore */ /* webpackIgnore: true */ spec)) as {
      EmailMessage: new (from: string, to: string, raw: string) => unknown;
    };
    const msg = new mod.EmailMessage(
      stripDisplayName(from),
      stripDisplayName(to),
      raw,
    );
    await env.SEND_EMAIL.send(msg);
    return { ok: true };
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e);
    console.error("[VDTTest contact form] send_email threw:", reason);
    return { ok: false, reason };
  }
}

/**
 * Native (no-JS) submissions: the form's action/method fallback POSTs
 * application/x-www-form-urlencoded when contact-card.js never ran (blocked
 * GSAP CDN, dead hydration from stale HTML). Those requests come from a
 * browser expecting a page, not JSON — so they get a small self-contained
 * HTML answer. This path exists because a dead-JS submit used to reload the
 * page looking successful while sending nothing (a real enquiry was lost
 * ~2026-08-01; found 2026-08-15).
 */
function htmlReply(status: number, title: string, detail: string) {
  const html = [
    `<!doctype html><html lang="en"><head><meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1">`,
    `<meta name="robots" content="noindex">`,
    `<title>${title} — VDT Sites</title></head>`,
    `<body style="margin:0;min-height:100svh;display:flex;align-items:center;justify-content:center;background:#f4efe6;color:#0d0d0d;font-family:Inter,system-ui,sans-serif;text-align:center;padding:24px">`,
    `<div><h1 style="font-size:26px;margin:0 0 12px">${title}</h1>`,
    `<p style="font-size:15px;line-height:1.6;opacity:.75;max-width:26rem;margin:0 auto 20px">${detail}</p>`,
    `<a href="/contact" style="color:#dc2626;font-weight:600">Back to the contact page</a></div>`,
    `</body></html>`,
  ].join("");
  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export async function POST(req: Request) {
  const contentType = req.headers.get("content-type") ?? "";
  // A native form submit is urlencoded; the JS handler always sends JSON.
  const isNative = contentType.includes("application/x-www-form-urlencoded");

  const raw = await req.text();
  if (raw.length > 10_000) {
    return isNative
      ? htmlReply(413, "Message too long", "Please shorten your message and try again.")
      : NextResponse.json({ error: "Message is too long." }, { status: 413 });
  }

  let body: Payload;
  if (isNative) {
    const params = new URLSearchParams(raw);
    body = {
      name: params.get("name") ?? "",
      email: params.get("email") ?? "",
      message: params.get("message") ?? "",
      phone: params.get("phone") ?? "",
      callDate: params.get("callDate") ?? "",
      callTime: params.get("callTime") ?? "",
      website: params.get("website") ?? "",
    };
  } else {
    try {
      const parsed: unknown = JSON.parse(raw);
      // A cast alone would let `null`, arrays, or non-string fields through to
      // `.trim()` calls below and 500 the route.
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
      }
      body = parsed as Payload;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  }

  // Errors below this point can come from either path; answer in kind.
  const fail = (status: number, error: string) =>
    isNative
      ? htmlReply(status, "That didn't go through", error)
      : NextResponse.json({ error }, { status });
  const succeed = () =>
    isNative
      ? htmlReply(
          200,
          "Message sent",
          "Thanks — we got your message and will get back to you within one business day.",
        )
      : NextResponse.json({ ok: true });

  // Honeypot - silently accept for naive bots.
  if (typeof body.website === "string" && body.website.length > 0) {
    return succeed();
  }

  const name = typeof body.name === "string" ? body.name : "";
  const email = typeof body.email === "string" ? body.email : "";
  const message = typeof body.message === "string" ? body.message : "";
  // Optional callback number: free-form (people type "250-616-2087" or
  // "+1 (250) ..."), just bounded and stripped of line breaks. Type-guarded:
  // a non-string phone in the JSON is ignored, not a 500.
  const phone = (typeof body.phone === "string" ? body.phone : "")
    .replace(/[\r\n]+/g, " ")
    .trim()
    .slice(0, 40);

  // "Schedule a call" intent: both fields present makes it a call request,
  // one without the other is a malformed submission.
  const callDate = (typeof body.callDate === "string" ? body.callDate : "").trim();
  const callTime = (typeof body.callTime === "string" ? body.callTime : "").trim();
  const isCall = Boolean(callDate || callTime);

  if (!name.trim() || !email.trim() || (!isCall && !message.trim())) {
    return fail(400, "All fields are required.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return fail(400, "That email doesn't look right.");
  }
  if (isCall) {
    // Object.hasOwn: a plain `TIME_SLOTS[callTime]` check passes prototype
    // keys ("__proto__", "toString", ...) since the lookup walks the chain.
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(callDate) ||
      !Object.hasOwn(TIME_SLOTS, callTime)
    ) {
      return fail(400, "Pick a day and a time window for the call.");
    }
    if (!phone) {
      return fail(400, "We need a phone number to call you at.");
    }
    // Round-trip the date so impossible days ("2026-02-31") are rejected
    // rather than left to engine-specific Date normalization, then bound it
    // to today-in-Pacific (the business timezone) through 90 days out.
    const picked = new Date(`${callDate}T12:00:00Z`);
    const roundTrips =
      !Number.isNaN(picked.getTime()) &&
      picked.toISOString().slice(0, 10) === callDate;
    const todayPacific = new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/Vancouver",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    const DAY = 24 * 60 * 60 * 1000;
    if (
      !roundTrips ||
      callDate < todayPacific ||
      picked.getTime() > Date.now() + 90 * DAY
    ) {
      return fail(400, "Pick a day within the next couple of months.");
    }
  }

  const env = await getEnv();
  // No placeholder fallbacks: if the addresses aren't configured we DON'T send
  // (never email an example.com stranger). The submission is still saved to KV
  // below, so the lead is captured in /admin regardless.
  const to = env?.CONTACT_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL ?? null;
  const from = env?.CONTACT_FROM_EMAIL ?? process.env.CONTACT_FROM_EMAIL ?? null;
  const emailConfigured = Boolean(to && from);
  // Strip CR/LF from the user-supplied name before it enters the Subject
  // header (header-injection guard); the body keeps the original text.
  const safeName = name.trim().replace(/[\r\n]+/g, " ");
  const callDateLabel = isCall
    ? new Date(`${callDate}T12:00:00Z`).toLocaleDateString("en-CA", {
        weekday: "long",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      })
    : "";
  const subject = isCall
    ? `Call request from ${safeName} — ${callDateLabel}, ${TIME_SLOTS[callTime]}`
    : `New inquiry from ${safeName} via the VDT Sites contact form`;
  const text = [
    `From: ${name} <${email}>`,
    ...(phone ? [`Phone: ${phone}`] : []),
    ...(isCall ? [`Requested call: ${callDateLabel} — ${TIME_SLOTS[callTime]} (Pacific)`] : []),
    "",
    message.trim() || (isCall ? "(no note left)" : ""),
    "",
    "Sent from the vdtsites.com contact form",
  ].join("\n");

  // Persist to KV first so the submission is captured in /admin even
  // if email delivery fails. This is the source of truth; the email is
  // a best-effort notification on top.
  const stored = await saveMessage({
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    ...(phone ? { phone } : {}),
    ...(isCall ? { callDate, callTime } : {}),
  });

  // Fire-and-forget the email send. Cloudflare's send_email binding to
  // an off-account destination (e.g. vdtsites@gmail.com) takes ~5-6s,
  // which would otherwise freeze the form's submit button. We hand the
  // delivery promise to ctx.waitUntil() so the Worker keeps the
  // connection alive long enough to finish the send AFTER the response
  // has been returned to the user. If KV save failed we fall back to a
  // synchronous await so we can still 502 cleanly.
  const cfCtx = await getCloudflareCtx();
  if (stored) {
    // Lead captured in KV. Send the notification only if email is configured.
    if (emailConfigured) {
      const deliverPromise = deliver(from!, to!, subject, text, email);
      if (cfCtx?.ctx?.waitUntil) {
        cfCtx.ctx.waitUntil(deliverPromise);
      } else {
        // Dev / no ctx — fire but don't await so the response is fast.
        void deliverPromise.catch(() => {});
      }
    }
    return succeed();
  }

  // KV save failed. If email isn't configured we have no way to capture the
  // message — fail visibly. Otherwise try email synchronously as a fallback.
  if (!emailConfigured) {
    return fail(502, "Could not send. Try again later.");
  }
  const result = await deliver(from!, to!, subject, text, email);
  if (!result.ok) {
    return fail(502, "Could not send. Try again later.");
  }
  return succeed();
}

// Helper for the fire-and-forget pattern above. Returns the whole
// Cloudflare context (env + ctx) so we can grab ctx.waitUntil.
async function getCloudflareCtx(): Promise<{
  env?: unknown;
  ctx?: { waitUntil: (p: Promise<unknown>) => void };
} | null> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    return mod.getCloudflareContext() as {
      env?: unknown;
      ctx?: { waitUntil: (p: Promise<unknown>) => void };
    };
  } catch {
    return null;
  }
}
