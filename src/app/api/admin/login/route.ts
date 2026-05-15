import { NextResponse } from "next/server";
import { confirmPin, requestPin, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/admin";

// Auth must never be cached.
export const dynamic = "force-dynamic";

type Body = {
  step?: "password" | "pin";
  email?: string;
  password?: string;
  pin?: string;
};

/**
 * Two-step admin login.
 *  - step "password": verify email + password, email a one-time PIN.
 *  - step "pin": verify the PIN, set the signed session cookie.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as Body;

  if (body.step === "password") {
    const r = await requestPin(body.email ?? "", body.password ?? "");
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
