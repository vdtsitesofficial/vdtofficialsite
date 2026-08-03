import { NextResponse } from "next/server";

/**
 * /book — the clean booking URL handed to Google Business Profile (and
 * anywhere else a "schedule a call" link is wanted: outreach DMs, email
 * signatures). Lands on the contact page with the form pre-switched to
 * "Schedule a call" mode (contact-card.js reads ?book=1).
 */
export function GET(req: Request) {
  return NextResponse.redirect(new URL("/contact?book=1", req.url), 308);
}
