import { NextResponse } from "next/server";
import { confirmPin, requestPin, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/admin";

// Auth must never be cached.
export const dynamic = "force-dynamic";

type Body = {
  step?: "email" | "password" | "pin";
  email?: string;
  password?: string; // legacy field from the old two-step UI; ignored
  pin?: string;
};

/**
 * Email-only admin login (password step removed 2026-08-15).
 *  - step "email": email a one-time PIN to an allowlisted address.
 *    ("password" is accepted as an alias so a stale cached copy of the old
 *    login page still works — its password value is simply ignored.)
 *  - step "pin": verify the PIN, set the signed session cookie.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;

  if (body.step === "email" || body.step === "password") {
    const r = await requestPin(body.email ?? "");
    return NextResponse.json(r, { status: r.ok ? 200 : 401 });
  }

  if (body.step === "pin") {
    const r = await confirmPin(body.email ?? "", body.pin ?? "");
    if (!r.ok || !r.token) {
      return NextResponse.json(
        { ok: false, error: r.error ?? "Sign-in failed." },
        { status: 401 },
      );
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, r.token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_SECONDS,
    });
    return res;
  }

  return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
}
