import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";
import ts from "typescript";

// The contact form's Turnstile SITE key, read from wrangler.jsonc at BUILD
// time and inlined as NEXT_PUBLIC_TURNSTILE_SITE_KEY (see
// src/lib/turnstile-site-key.ts for why it cannot be read at request time).
// wrangler.jsonc stays the single place the key is set.
//
// A shell TURNSTILE_SITE_KEY overrides the file, for local testing with
// Cloudflare's published test keys only. It never comes from .dev.vars, so a
// test key cannot leak into a build that is later deployed.
//
// A wrangler.jsonc that cannot be parsed FAILS THE BUILD. Falling back to ""
// would ship pages with no widget while the worker still holds the secret,
// and every real enquiry would then be dropped silently.
function turnstileSiteKey(): string {
  const override = process.env.TURNSTILE_SITE_KEY;
  if (override !== undefined) return override.trim();
  const file = join(process.cwd(), "wrangler.jsonc");
  const parsed = ts.parseConfigFileTextToJson(file, readFileSync(file, "utf8"));
  if (parsed.error) {
    throw new Error("next.config.ts: could not parse wrangler.jsonc for TURNSTILE_SITE_KEY");
  }
  const value = parsed.config?.vars?.TURNSTILE_SITE_KEY;
  return typeof value === "string" ? value.trim() : "";
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: turnstileSiteKey(),
  },
  // vdt-site-kit ships raw TS/TSX with no build step, so this site compiles it.
  transpilePackages: ["vdt-site-kit"],
  // VDT stopped offering business email (Phil, 2026-11-09) and the
  // /business-email page was removed. It was indexed and linked from every
  // footer, so it 301s to /services rather than 404ing.
  async redirects() {
    return [
      {
        source: "/business-email",
        destination: "/services",
        statusCode: 301,
      },
    ];
  },
  // Security headers flagged by the 2026-08-16 Screaming Frog crawl (all
  // HTML routes are worker-rendered, so next.config headers() reaches them;
  // static assets under public/ are served by the assets binding and get
  // theirs from public/_headers instead). CSP is deliberately absent: the
  // homepage lab runs inline module scripts and a blanket policy would
  // break hydration - it needs its own audited pass.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
