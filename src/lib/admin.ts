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
  /** Shared admin password (Cloudflare secret). */
  ADMIN_PASSWORD?: string;
  /** HMAC key for signing session cookies (Cloudflare secret). */
  ADMIN_SESSION_SECRET?: string;
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
  at: string; // ISO timestamp
};

const MSG_PREFIX = "msg:";
const messageKey = (id: string) => MSG_PREFIX + id;

/**
 * Persist a contact submission to KV. Returns false if KV is unavailable
 * (e.g. local dev without the binding) so the caller can decide what to do.
 */
export async function saveMessage(
  m: Pick<ContactMessage, "name" | "email" | "message" | "phone">,
): Promise<boolean> {
  const kv = await getAdminKV();
  if (!kv) return false;
  // Date.now() is a fixed-width prefix, so key order == chronological order.
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const record: ContactMessage = { id, at: new Date().toISOString(), ...m };
  await kv.put(messageKey(id), JSON.stringify(record));
  return true;
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
// Password-step brute-force throttle: at most MAX_PW_ATTEMPTS failed
// email+password attempts per address within the rolling window before the
// password step is refused. Auto-clears on success or after the TTL.
const MAX_PW_ATTEMPTS = 10;
const PWFAIL_TTL_SECONDS = 15 * 60; // 15 minutes
const PWFAIL_PREFIX = "pwfail:";

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

function passwordOk(env: Env, password: string): boolean {
  const expected = env.ADMIN_PASSWORD ?? "";
  if (!expected) return false;
  return constantTimeEqual(password, expected);
}

/* ---- password-step throttle (fail-open) ---------------------------------- */

async function isThrottled(kv: AdminKV, email: string): Promise<boolean> {
  try {
    const raw = await kv.get(PWFAIL_PREFIX + normalizeEmail(email));
    return raw != null && Number(raw) >= MAX_PW_ATTEMPTS;
  } catch {
    return false; // never lock out the real admin on a storage hiccup
  }
}

async function recordPwFailure(kv: AdminKV, email: string): Promise<void> {
  try {
    const key = PWFAIL_PREFIX + normalizeEmail(email);
    const raw = await kv.get(key);
    const n = (raw != null ? Number(raw) : 0) + 1;
    await kv.put(key, String(n), { expirationTtl: PWFAIL_TTL_SECONDS });
  } catch {
    /* ignore — throttling is best-effort */
  }
}

async function clearPwFailures(kv: AdminKV, email: string): Promise<void> {
  try {
    await kv.delete(PWFAIL_PREFIX + normalizeEmail(email));
  } catch {
    /* ignore */
  }
}

/* ---- PIN ----------------------------------------------------------------- */

function randomPin(): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return String(arr[0] % 1_000_000).padStart(6, "0");
}

type PinRecord = { pin: string; attempts: number };

async function issuePin(kv: AdminKV, email: string): Promise<string> {
  const pin = randomPin();
  const record: PinRecord = { pin, attempts: 0 };
  await kv.put(PIN_PREFIX + normalizeEmail(email), JSON.stringify(record), {
    expirationTtl: PIN_TTL_SECONDS,
  });
  return pin;
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
  const from = env.CONTACT_FROM_EMAIL ?? "VDT Sites <noreply@vdtsites.ca>";
  const subject = "Your VDT Sites admin sign-in code";
  const text = [
    `Your admin sign-in code is: ${pin}`,
    "",
    "It expires in 10 minutes and can only be used once.",
    "If you didn't try to sign in, you can ignore this email.",
  ].join("\n");

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
 * Step 1 of login: verify email + password, then email a one-time PIN.
 * Returns a generic error on any failure so valid emails aren't revealed.
 */
export async function requestPin(
  email: string,
  password: string,
): Promise<{ ok: boolean; error?: string }> {
  const env = await getCfEnv();
  if (!env?.ADMIN_KV) {
    return { ok: false, error: "Admin storage is unavailable." };
  }
  // Brute-force throttle (fail-open): refuse the password step after too many
  // recent failures for this address. Generic message so we don't reveal
  // whether the email is valid.
  if (await isThrottled(env.ADMIN_KV, email)) {
    return { ok: false, error: "Too many attempts. Please try again later." };
  }
  if (
    !email?.trim() ||
    !password ||
    !isAllowedEmail(env, email) ||
    !passwordOk(env, password)
  ) {
    await recordPwFailure(env.ADMIN_KV, email);
    return { ok: false, error: "Invalid email or password." };
  }
  await clearPwFailures(env.ADMIN_KV, email);
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
