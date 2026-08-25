import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin";
import { ADMIN_HINT_COOKIE } from "@/lib/editor-cookies";

export const dynamic = "force-dynamic";

/** Clear the admin session cookie, and the editor's hint cookie with it. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  // Must be cleared together with the session. Leaving the hint behind would
  // not grant anything (the probe would answer no), but it would make every
  // page load of a signed-out browser fire a pointless request forever.
  res.cookies.set(ADMIN_HINT_COOKIE, "", {
    httpOnly: false,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
