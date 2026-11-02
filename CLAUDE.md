# VDTTest — PRODUCTION vdtsites.com

Started as a sandbox, now the live production codebase for vdtsites.com (Cloudflare worker `vdtsites`). `npm run deploy` ships to production — the homepage mounts the laptop-zoom-v2 lab (mirrored into `public/lab/`; lab source lives in `C:\Websites\VDT\laptop-zoom-v2`, keep both in sync).

**Vault notes:** `C:\Websites\.claude\Obsidian\Sem's\Projects\VDT Sites\Overview.md` (vault folder renamed from VDTTest 2026-07-31; this disk folder keeps its historic name)

## Stack

Next.js 16 + React 19 + TypeScript + Tailwind v4 + OpenNext + Cloudflare Workers. Contact form posts to `/api/contact`, which delivers via the Workers `send_email` binding. Dev mode logs to console instead of sending.

## Local

- `npm install` once
- `npm run dev` for local dev (form will console.log)
- `npm run preview` to run the OpenNext build locally with Workers runtime
- `npm run deploy` to push to Cloudflare

## Before first deploy

In `wrangler.jsonc`, replace the placeholders:
- `send_email[0].destination_address` - must be a verified destination in Cloudflare Email Routing for the account
- `vars.CONTACT_FROM_EMAIL` - must live on a domain with Email Routing enabled
- `vars.CONTACT_TO_EMAIL`

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
