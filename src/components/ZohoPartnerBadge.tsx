/**
 * Zoho partner mark for every footer, linking to /business-email.
 *
 * Added 2026-10-22. VDT signed Zoho's Workplace partner agreement (Value
 * Added Reseller) on 2026-10-16; it asks for the partner logo on the site
 * within 60 days (by ~2026-12-15), and Zoho confirmed the footer plus a
 * business-email landing page satisfies it.
 *
 * Rules:
 * - Zoho's own badge artwork only, never a recreated or edited Zoho logo.
 *   Drop the file Zoho supplies into public/partners/ and set BADGE below.
 *   Until then this renders a plain text link, so nothing fake ships.
 * - The claim matches the wording on Zoho's badge. Never "certified":
 *   VDT holds no Zoho certification.
 * - Nothing from the partner agreement (commission, terms) goes on the site.
 */

const BADGE: { src: string; width: number; height: number; alt: string } | null =
  null;

export const ZOHO_PARTNER_LABEL = "Official Zoho Workplace Partner";

export default function ZohoPartnerBadge({
  className = "",
}: {
  className?: string;
}) {
  return (
    <a
      href="/business-email"
      className={`inline-flex items-center gap-2 transition-opacity hover:opacity-75 ${className}`}
      title="Business email for your domain"
    >
      {BADGE ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={BADGE.src}
          width={BADGE.width}
          height={BADGE.height}
          alt={BADGE.alt}
          className="h-7 w-auto"
          loading="lazy"
        />
      ) : (
        <span>{ZOHO_PARTNER_LABEL}</span>
      )}
    </a>
  );
}
