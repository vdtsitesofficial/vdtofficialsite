// Cache-busting version for the /lab/* static assets (JS, CSS, images).
//
// Bump this whenever any file under public/lab/ changes so every browser
// and the Cloudflare edge fetch the new copy instead of serving a stale
// in-memory/disk cache. This is what keeps Safari and Chrome rendering
// the SAME build of main.js: the laptop-position divergence between the
// two browsers was a stale-cache symptom, not a code difference.
//
// Used by src/app/page.tsx (asset URLs) and src/app/layout.tsx (preload
// hints). The preload <link> URLs MUST carry the same ?v= as the
// <picture> element they preload, or the preload is wasted and the image
// downloads twice.
export const LAB_V = "20260727a";
