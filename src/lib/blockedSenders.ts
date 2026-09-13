// Senders we refuse to hear from on the vdtsites.com contact form.
//
// A blocked submission gets the same silent success /api/contact gives a bot
// that trips the honeypot: nothing is stored in /admin and nothing is emailed.
// To ban someone, add their address here and push (main auto-deploys).
const BLOCKED_SENDERS = [
  "gregoryj8tl2@gmail.com",
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

export function isBlockedSender(email: unknown): boolean {
  if (typeof email !== "string" || !email.trim()) return false;
  return BLOCKED.has(normalizeEmail(email));
}
