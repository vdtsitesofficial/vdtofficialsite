import "server-only";
import { TURNSTILE_SITE_KEY } from "@/lib/turnstile-site-key";

// Server-side Cloudflare Turnstile verification for /api/contact.
// Adapted from the ClubHub helper (mariners-vc src/lib/turnstile.ts).
//
// Keys:
//   - TURNSTILE_SITE_KEY: plain var in wrangler.jsonc, inlined at build (see
//     src/lib/turnstile-site-key.ts). Set it THERE, not in the dashboard:
//     a deploy overwrites dashboard vars, and the build reads the file.
//   - TURNSTILE_SECRET_KEY: worker secret,
//       npx wrangler secret put TURNSTILE_SECRET_KEY
//
// ENFORCED ONLY WHEN BOTH ARE SET. With either one missing this is a no-op
// that passes everything, so the change is safe to ship before the keys
// exist. Requiring both (not just the secret) is deliberate: a secret with no
// site key means no widget on the page, so every real enquiry would arrive
// without a token and be silently dropped.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export type TurnstileResult =
  | { ok: true; enforced: boolean }
  | { ok: false; reason: string };

export async function verifyTurnstile(
  token: string,
  secret: string | null | undefined,
  remoteIp: string | null,
): Promise<TurnstileResult> {
  const siteKey = TURNSTILE_SITE_KEY;
  if (!siteKey || !secret) {
    if (siteKey || secret) {
      console.warn(
        "[VDT contact form] Turnstile is half configured (" +
          (siteKey ? "no TURNSTILE_SECRET_KEY secret" : "no TURNSTILE_SITE_KEY in wrangler.jsonc") +
          "), so the check is OFF",
      );
    }
    return { ok: true, enforced: false };
  }
  if (!token) return { ok: false, reason: "missing-token" };
  // Real tokens are well under this; anything longer is not one.
  if (token.length > 2048) return { ok: false, reason: "oversized-token" };
  try {
    const body = new URLSearchParams();
    body.set("secret", secret);
    body.set("response", token);
    if (remoteIp) body.set("remoteip", remoteIp);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      headers: { "content-type": "application/x-www-form-urlencoded" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return { ok: false, reason: `verify-http-${res.status}` };
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success === true) return { ok: true, enforced: true };
    return {
      ok: false,
      reason: (data["error-codes"] || []).join(",") || "verify-failed",
    };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : "verify-exception" };
  }
}
