import { cookies, headers } from "next/headers";

/**
 * Minimal KV namespace shape. Avoids pulling in @cloudflare/workers-types
 * just for one binding — only the methods we actually use are declared.
 */
export type AdminKV = {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    opts?: { expirationTtl?: number },
  ): Promise<void>;
  delete(key: string): Promise<void>;
  list(opts?: {
    prefix?: string;
    limit?: number;
    cursor?: string;
  }): Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
};

type SendEmailBinding = { send(message: unknown): Promise<void> };

type Env = {
  ADMIN_KV?: AdminKV;
  SEND_EMAIL?: SendEmailBinding;
  /** Comma-separated allowlist of admin email addresses. */
  ADMIN_EMAILS?: string;
  /** HMAC key for signing session cookies (Cloudflare secret). */
  ADMIN_SESSION_SECRET?: string;
  /**
   * Resend API key (Cloudflare secret, optional). When set, sign-in PINs go
   * out via the Resend API (fastest to the inbox); without it they fall back
   * to the Workers send_email binding, which requires the destination to be
   * a verified Email Routing address.
   */
  RESEND_API_KEY?: string;
  CONTACT_FROM_EMAIL?: string;
};

/** The Worker env, or null when running outside the Workers runtime. */
async function getCfEnv(): Promise<Env | null> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const ctx = mod.getCloudflareContext();
    return (ctx?.env as Env | undefined) ?? null;
  } catch {
    return null;
  }
}

/** The ADMIN_KV binding, or null when running outside the Workers runtime. */
export async function getAdminKV(): Promise<AdminKV | null> {
  return (await getCfEnv())?.ADMIN_KV ?? null;
}

/* -------------------------------------------------------------------------- */
/*  Contact messages                                                          */
/* -------------------------------------------------------------------------- */

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  phone?: string; // optional callback number (added 2026-07-26)
  callDate?: string; // "Schedule a call" day, YYYY-MM-DD (added 2026-08-03)
  callTime?: string; // "Schedule a call" slot key (morning/afternoon/evening/anytime)
  at: string; // ISO timestamp
};

const MSG_PREFIX = "msg:";
const messageKey = (id: string) => MSG_PREFIX + id;

/**
 * Persist a contact submission to KV. Returns false if KV is unavailable
 * (e.g. local dev without the binding) so the caller can decide what to do.
 */
export async function saveMessage(
  m: Pick<
    ContactMessage,
    "name" | "email" | "message" | "phone" | "callDate" | "callTime"
  >,
): Promise<boolean> {
  const kv = await getAdminKV();
  if (!kv) return false;
  // Date.now() is a fixed-width prefix, so key order == chronological order.
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record: ContactMessage = { id, at: new Date().toISOString(), ...m };
  // MUST return false rather than throw. The contact route treats `false` as
  // "KV did not capture it" and falls back to sending the email
  // SYNCHRONOUSLY so the lead still reaches the inbox. An uncaught throw here
  // escapes before that fallback runs, and the enquiry is then neither stored
  // nor emailed - lost with only a stack trace in the Worker log. That exact
  // shape of silent loss already cost a real lead on this form (~2026-08-01).
  try {
    await kv.put(messageKey(id), JSON.stringify(record));
    return true;
  } catch (e) {
    console.error(
      "[VDT contact] KV put failed, falling back to synchronous email:",
      e instanceof Error ? e.message : String(e),
    );
    return false;
  }
}

/** Every stored contact message, newest first. */
export async function listMessages(): Promise<ContactMessage[]> {
  const kv = await getAdminKV();
  if (!kv) return [];
  const { keys } = await kv.list({ prefix: MSG_PREFIX, limit: 1000 });
  const records = await Promise.all(
    keys.map(async (k) => {
      const raw = await kv.get(k.name);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as ContactMessage;
      } catch {
        return null;
      }
    }),
  );
  return records
    .filter((r): r is ContactMessage => r !== null)
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

export async function deleteMessage(id: string): Promise<void> {
  const kv = await getAdminKV();
  if (!kv) return;
  await kv.delete(messageKey(id));
}

/* -------------------------------------------------------------------------- */
/*  Auth: email + password + emailed PIN                                      */
/* -------------------------------------------------------------------------- */

export const SESSION_COOKIE = "vdt_admin";
/** How long a signed-in session lasts. */
export const SESSION_SECONDS = 8 * 60 * 60; // 8 hours
const PIN_TTL_SECONDS = 10 * 60; // 10 minutes
const MAX_PIN_ATTEMPTS = 5;
const PIN_PREFIX = "pin:";
// PIN-request throttle: with no password step (removed 2026-08-15), the only
// cost of a request is an email — so cap how many codes any one address can
// trigger inside the rolling window, or the form becomes an email-bombing
// tool aimed at the admin inbox. Counts EVERY request (known address or
// not), auto-expires after the TTL.
const MAX_PIN_REQUESTS = 5;
const PINREQ_TTL_SECONDS = 15 * 60; // 15 minutes
const PINREQ_PREFIX = "pinreq:";

const enc = new TextEncoder();

/* ---- small crypto helpers ------------------------------------------------ */

function b64urlFromBytes(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlEncode(str: string): string {
  return b64urlFromBytes(enc.encode(str));
}

function b64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  return atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
}

async function hmac(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return b64urlFromBytes(new Uint8Array(sig));
}

/** Length-aware constant-time string comparison. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/* ---- allowlist + password ------------------------------------------------ */

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isAllowedEmail(env: Env, email: string): boolean {
  const list = (env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => normalizeEmail(e))
    .filter(Boolean);
  return list.includes(normalizeEmail(email));
}

/* ---- PIN-request throttle (fail-open) ------------------------------------ */

async function isThrottled(kv: AdminKV, email: string): Promise<boolean> {
  try {
    const raw = await kv.get(PINREQ_PREFIX + normalizeEmail(email));
    return raw != null && Number(raw) >= MAX_PIN_REQUESTS;
  } catch {
    return false; // never lock out the real admin on a storage hiccup
  }
}

async function recordPinRequest(kv: AdminKV, email: string): Promise<void> {
  try {
    const key = PINREQ_PREFIX + normalizeEmail(email);
    const raw = await kv.get(key);
    const n = (raw != null ? Number(raw) : 0) + 1;
    await kv.put(key, String(n), { expirationTtl: PINREQ_TTL_SECONDS });
  } catch {
    /* ignore — throttling is best-effort */
  }
}

/* ---- PIN ----------------------------------------------------------------- */

function randomPin(): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(arr[0] % 1_000_000).padStart(6, "0");
}

type PinRecord = { pin: string; attempts: number; issuedAt?: number };

async function issuePin(kv: AdminKV, email: string): Promise<string> {
  const pin = randomPin();
  const record: PinRecord = { pin, attempts: 0, issuedAt: Date.now() };
  await kv.put(PIN_PREFIX + normalizeEmail(email), JSON.stringify(record), {
    expirationTtl: PIN_TTL_SECONDS,
  });
  return pin;
}

/**
 * True if a PIN for this address was issued within the last minute. Used as
 * a resend cooldown: KV has no atomic increment, so the request counter can
 * be raced by parallel bursts — this second gate caps the blast radius at
 * roughly one email per minute regardless. Fail-open (a storage hiccup must
 * not lock the admin out).
 */
async function pinRecentlyIssued(kv: AdminKV, email: string): Promise<boolean> {
  try {
    const raw = await kv.get(PIN_PREFIX + normalizeEmail(email));
    if (!raw) return false;
    const record = JSON.parse(raw) as PinRecord;
    return (
      typeof record.issuedAt === "number" &&
      Date.now() - record.issuedAt < 60_000
    );
  } catch {
    return false;
  }
}

async function checkPin(
  kv: AdminKV,
  email: string,
  pin: string,
): Promise<boolean> {
  const key = PIN_PREFIX + normalizeEmail(email);
  const raw = await kv.get(key);
  if (!raw) return false;
  let record: PinRecord;
  try {
    record = JSON.parse(raw) as PinRecord;
  } catch {
    await kv.delete(key);
    return false;
  }
  if (record.attempts >= MAX_PIN_ATTEMPTS) {
    await kv.delete(key);
    return false;
  }
  if (constantTimeEqual(record.pin, pin.trim())) {
    await kv.delete(key); // single use
    return true;
  }
  await kv.put(
    key,
    JSON.stringify({ ...record, attempts: record.attempts + 1 }),
    { expirationTtl: PIN_TTL_SECONDS },
  );
  return false;
}

/* ---- PIN email ----------------------------------------------------------- */

function stripDisplayName(addr: string): string {
  const m = /<([^>]+)>/.exec(addr);
  return m ? m[1] : addr.trim();
}

async function sendPinEmail(
  env: Env,
  to: string,
  pin: string,
): Promise<boolean> {
  // `||` not `??`: an empty-string var is "set" as far as ?? is concerned,
  // and would be handed to Resend/the binding as an invalid sender.
  const from = env.CONTACT_FROM_EMAIL || "VDT Sites <contact@vdtsites.com>";
  const subject = "Your VDT Sites admin sign-in code";
  const text = [
    `Your admin sign-in code is: ${pin}`,
    "",
    "It expires in 10 minutes and can only be used once.",
    "If you didn't try to sign in, you can ignore this email.",
  ].join("\n");

  // Resend first (when the secret is set): direct API delivery, no Email
  // Routing hop, and no verified-destination requirement. A failed Resend
  // call falls through to the send_email binding below rather than losing
  // the sign-in.
  if (env.RESEND_API_KEY) {
    try {
      const resp = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.RESEND_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          // Was onboarding@resend.dev, Resend's shared sender, which only
          // reaches the Resend account owner's own address. vdtsites.com is
          // now a verified sending domain, so this uses it: same sender
          // domain as every other VDT site, and it would still deliver if
          // an admin address were ever added that is not the account owner.
          from,
          to,
          subject,
          text,
        }),
      });
      if (resp.ok) return true;
      console.error(
        "[VDT admin] Resend PIN send failed:",
        resp.status,
        await resp.text().catch(() => ""),
      );
    } catch (e) {
      console.error(
        "[VDT admin] Resend PIN send threw:",
        e instanceof Error ? e.message : e,
      );
    }
    // fall through to the binding
  }

  if (!env.SEND_EMAIL) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[VDT admin] PIN for ${to}: ${pin}`);
      return true;
    }
    return false;
  }

  try {
    const raw = [
      `From: ${from}`,
      `To: ${to}`,
      `Subject: ${subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: text/plain; charset="utf-8"`,
      `Content-Transfer-Encoding: 7bit`,
      ``,
      text,
    ].join("\r\n");

    const spec = ["cloudflare", "email"].join(":");
    const mod = (await import(/* @vite-ignore */ /* webpackIgnore: true */ spec)) as {
      EmailMessage: new (from: string, to: string, raw: string) => unknown;
    };
    const msg = new mod.EmailMessage(stripDisplayName(from), stripDisplayName(to), raw);
    await env.SEND_EMAIL.send(msg);
    return true;
  } catch (e) {
    console.error("[VDT admin] PIN send failed:", e instanceof Error ? e.message : e);
    return false;
  }
}

/* ---- session token ------------------------------------------------------- */

async function createSessionToken(env: Env, email: string): Promise<string | null> {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  const payload = `${normalizeEmail(email)}.${Date.now() + SESSION_SECONDS * 1000}`;
  const sig = await hmac(payload, secret);
  return `${b64urlEncode(payload)}.${sig}`;
}

async function verifySessionToken(
  env: Env,
  token: string,
): Promise<string | null> {
  const secret = env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  let payload: string;
  try {
    payload = b64urlDecode(payloadB64);
  } catch {
    return null;
  }
  const expected = await hmac(payload, secret);
  if (!constantTimeEqual(sig, expected)) return null;
  const idx = payload.lastIndexOf(".");
  if (idx < 0) return null;
  const email = payload.slice(0, idx);
  const exp = Number(payload.slice(idx + 1));
  if (!Number.isFinite(exp) || Date.now() > exp) return null;
  if (!isAllowedEmail(env, email)) return null;
  return email;
}

/* ---- public auth API ----------------------------------------------------- */

/**
 * Step 1 of login: email a one-time PIN to an allowlisted address.
 * (Password step removed 2026-08-15 — possession of the admin inbox is the
 * credential; the emailed single-use PIN plus the session HMAC carry auth.)
 *
 * Anti-enumeration: unknown addresses get the SAME success response as real
 * ones — they just never receive a code. The only visible failures are the
 * throttle and a genuine send error for a real admin.
 */
export async function requestPin(
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const env = await getCfEnv();
  if (!env?.ADMIN_KV) {
    return { ok: false, error: "Admin storage is unavailable." };
  }
  if (!email?.trim()) {
    return { ok: false, error: "Enter your email." };
  }
  // Rate-limit code requests per address (fail-open on storage hiccups).
  if (await isThrottled(env.ADMIN_KV, email)) {
    return { ok: false, error: "Too many codes requested. Try again in a few minutes." };
  }
  await recordPinRequest(env.ADMIN_KV, email);
  if (!isAllowedEmail(env, email)) {
    return { ok: true }; // same shape as success — reveal nothing
  }
  // Resend cooldown: a code sent in the last minute is still on its way —
  // treat the request as satisfied instead of emailing another. Absorbs
  // double-clicks and blunts counter races (see pinRecentlyIssued).
  if (await pinRecentlyIssued(env.ADMIN_KV, email)) {
    return { ok: true };
  }
  const pin = await issuePin(env.ADMIN_KV, email);
  const sent = await sendPinEmail(env, normalizeEmail(email), pin);
  if (!sent) {
    return { ok: false, error: "Could not send the sign-in code. Try again." };
  }
  return { ok: true };
}

/**
 * Step 2 of login: verify the emailed PIN and mint a session token.
 */
export async function confirmPin(
  email: string,
  pin: string,
): Promise<{ ok: boolean; token?: string; error?: string }> {
  const env = await getCfEnv();
  if (!env?.ADMIN_KV) {
    return { ok: false, error: "Admin storage is unavailable." };
  }
  if (!email?.trim() || !pin?.trim() || !isAllowedEmail(env, email)) {
    return { ok: false, error: "That code is wrong or has expired." };
  }
  const ok = await checkPin(env.ADMIN_KV, email, pin);
  if (!ok) {
    return { ok: false, error: "That code is wrong or has expired." };
  }
  const token = await createSessionToken(env, email);
  if (!token) {
    return { ok: false, error: "Admin sessions are not configured." };
  }
  return { ok: true, token };
}

/**
 * Admin auth gate. Production reads the signed session cookie set after a
 * successful email + password + PIN login; it fails CLOSED if the cookie is
 * absent, tampered with, or expired.
 *
 * In dev (no Workers runtime) we allow through so /admin is previewable
 * with `npm run dev`.
 */
export async function adminGate(): Promise<
  { ok: true; email: string } | { ok: false }
> {
  const env = await getCfEnv();
  // Dev-preview bypass is gated on the ABSENCE of the Workers runtime, not on
  // NODE_ENV alone. The deployed Worker always has `env`, so it can never take
  // this branch even if NODE_ENV were somehow misconfigured — fail closed.
  if (!env) {
    if (process.env.NODE_ENV !== "production") {
      return { ok: true, email: "dev@localhost" };
    }
    return { ok: false };
  }
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { ok: false };
  const email = await verifySessionToken(env, token);
  if (!email) return { ok: false };
  // Touch headers() so this stays a dynamic, per-request evaluation.
  void (await headers());
  return { ok: true, email };
}
