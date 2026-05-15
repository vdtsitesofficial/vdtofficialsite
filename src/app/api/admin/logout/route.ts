import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/admin";

export const dynamic = "force-dynamic";

/** Clear the admin session cookie. */
export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
