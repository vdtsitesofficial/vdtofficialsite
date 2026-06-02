import { NextResponse } from "next/server";
import { saveMessage } from "@/lib/admin";

type Payload = {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot
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

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > 10_000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 413 });
  }

  let body: Payload;
  try {
    body = JSON.parse(raw) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot - silently accept for naive bots.
  if (body.website && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
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
  const subject = `New inquiry from ${safeName} — VDT Sites contact form`;
  const text = [
    `From: ${name} <${email}>`,
    "",
    message,
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
    return NextResponse.json({ ok: true });
  }

  // KV save failed. If email isn't configured we have no way to capture the
  // message — fail visibly. Otherwise try email synchronously as a fallback.
  if (!emailConfigured) {
    return NextResponse.json(
      { error: "Could not send. Try again later." },
      { status: 502 },
    );
  }
  const result = await deliver(from!, to!, subject, text, email);
  if (!result.ok) {
    return NextResponse.json(
      { error: "Could not send. Try again later." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
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
