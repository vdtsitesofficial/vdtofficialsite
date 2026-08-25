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
  // OpenNext / Cloudflare provides `cloudflare:email` as a built-in module of
  // the Workers runtime. Webpack can't resolve `cloudflare:` URIs at build
  // time, so we externalize them and let the runtime do the import.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : []),
        {
          "cloudflare:email": "commonjs cloudflare:email",
          "cloudflare:workers": "commonjs cloudflare:workers",
        },
        // Same problem, different scheme. vdt-site-kit's content store reaches
        // for `node:fs/promises` and `node:path` in its local-JSON dev
        // fallback, and webpack refuses a `node:` URI outright
        // ("UnhandledSchemeError ... Unhandled scheme"). They are real modules
        // at runtime (the Worker sets nodejs_compat), so externalize the whole
        // scheme rather than naming modules the kit might add to later.
        ({ request }: { request?: string }, cb: (e?: null, r?: string) => void) =>
          request?.startsWith("node:")
            ? cb(null, `commonjs ${request}`)
            : cb(),
      ];
    }
    return config;
  },
};

export default nextConfig;
