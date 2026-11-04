// The Cloudflare Turnstile SITE key for the contact form, and the script URL.
//
// THE VALUE IS INLINED AT BUILD TIME, NOT READ AT RUNTIME. next.config.ts
// reads `vars.TURNSTILE_SITE_KEY` out of wrangler.jsonc and exposes it as
// NEXT_PUBLIC_TURNSTILE_SITE_KEY, which Next bakes into both the server and
// the client bundles. Two reasons it has to work this way:
//
//   - every page carrying the form is PRERENDERED at build, so the widget's
//     data-sitekey must already be in the HTML; a worker var read at request
//     time would never reach those pages.
//   - the API route's gate (src/lib/turnstile.ts) reads this SAME constant,
//     so the HTML a build shipped and the check that build enforces can
//     never disagree. A site key in one and not the other is how a challenge
//     either vanishes or locks every real customer out.
//
// Empty means Turnstile is OFF: no widget renders and the route accepts a
// submission without a token. That is the state until the widget exists in
// the Cloudflare dashboard. The key is public by design (it ships in HTML).
export const TURNSTILE_SITE_KEY: string =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

// Implicit mode (no `render=explicit`): api.js scans the page for
// `.cf-turnstile` elements on load and renders them by itself, with no help
// from React or from public/lab/contact-card.js. That is what keeps the
// native no-JS-handler fallback carrying a token when hydration is dead.
// TurnstileField covers the one case the scan misses (a client-side
// navigation onto a page with the form).
export const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js";
