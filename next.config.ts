import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // vdt-site-kit ships raw TS/TSX with no build step, so this site compiles it.
  transpilePackages: ["vdt-site-kit"],
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
