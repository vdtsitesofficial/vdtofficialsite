/**
 * Submits every URL in the live sitemap to IndexNow (Bing + partner engines)
 * after a deploy. The key is intentionally public: IndexNow verifies ownership
 * by fetching the matching .txt file from the site root.
 *
 * Run: node scripts/indexnow-ping.mjs
 */

const HOST = "vdtsites.com";
const KEY = "2e278b21242e470a8e58fdd7fe351789";
const SITEMAP = `https://${HOST}/sitemap.xml`;

const res = await fetch(SITEMAP);
if (!res.ok) {
  console.error(`Failed to fetch ${SITEMAP}: HTTP ${res.status}`);
  process.exit(1);
}

const xml = await res.text();
const urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) {
  console.error("Sitemap parsed to zero URLs; not submitting.");
  process.exit(1);
}

const ping = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted pending key validation (normal on first call)
console.log(`IndexNow: submitted ${urlList.length} URLs, HTTP ${ping.status}`);
if (![200, 202].includes(ping.status)) {
  console.error(await ping.text());
  process.exit(1);
}
