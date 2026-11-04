// Senders we refuse to hear from on the vdtsites.com contact form.
//
// A blocked submission gets the same silent success /api/contact gives a bot
// that trips the honeypot: nothing is stored in /admin and nothing is emailed.
// To ban someone, add their address here and push (main auto-deploys).
const BLOCKED_SENDERS = [
  "gregoryj8tl2@gmail.com",
  "joshuaguerrero2v7t40d@gmail.com",
];

// Names we refuse to hear from, whatever address they arrive on. Matched
// after stripping everything but letters and lowercasing, so "Robert Rocky",
// "robert.rocky" and "RobertRocky" all hit "robertrocky".
//
// TAKE THE SPELLING FROM THE STORED SUBMISSIONS, NOT FROM MEMORY. The first
// name ban here was "roberttrocky" (two t's, 2026-10-03) while every one of
// the bot's 21 submissions since 2026-08-24 was signed "Robertrocky" (one t),
// so it never matched and ten more got through. /admin shows the exact name,
// and so does `wrangler kv bulk get` on ADMIN_KV.
//
// Spellings below are copied from the stored submissions on the day each ban
// went in: Robertrocky (2026-11-04), then Carlosplern (15 submissions on 15
// addresses, 2026-08-28 to 2026-10-04) and Samuelutecy (8 on 8, 2026-10-10 to
// 2026-10-31), both banned 2026-11-04 on Phil's word.
const BLOCKED_NAMES = [
  "robertrocky",
  "carlosplern",
  "samuelutecy",
];

// Gmail ignores dots and anything after a "+" in the local part, and treats
// googlemail.com as gmail.com, so "Gregory.J8tl2+x@googlemail.com" lands in the
// same inbox as the address above. Comparing normalized addresses stops a ban
// being dodged by retyping the same mailbox. Other providers are only
// lowercased and trimmed: for them a dot or "+" can be a different mailbox.
export function normalizeEmail(raw: string): string {
  const email = raw.trim().toLowerCase();
  const at = email.lastIndexOf("@");
  if (at < 1) return email;
  let local = email.slice(0, at);
  let domain = email.slice(at + 1);
  if (domain === "googlemail.com") domain = "gmail.com";
  if (domain === "gmail.com") {
    local = local.split("+")[0].replace(/\./g, "");
  }
  return `${local}@${domain}`;
}

const BLOCKED = new Set(BLOCKED_SENDERS.map(normalizeEmail));

function normalizeName(raw: string): string {
  return raw.toLowerCase().replace(/[^\p{L}]/gu, "");
}

const BLOCKED_NAME_KEYS = BLOCKED_NAMES.map(normalizeName);

export function isBlockedSender(email: unknown, name?: unknown): boolean {
  if (typeof name === "string" && name.trim()) {
    const key = normalizeName(name);
    if (BLOCKED_NAME_KEYS.some((blocked) => key.includes(blocked))) return true;
  }
  if (typeof email !== "string" || !email.trim()) return false;
  return BLOCKED.has(normalizeEmail(email));
}
