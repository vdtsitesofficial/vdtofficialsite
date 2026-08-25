/**
 * Admin theme tokens.
 *
 * The admin used to be a generic dark panel with a blue accent and a "VDT"
 * text square, which looked like somebody else's dashboard bolted onto the
 * site. `/admin` and `/admin/login` are noindex, but they are not private:
 * anyone can type the URL. So they get the same identity as the public site
 * (cream, ink, red, Syne) and read as a deliberate part of vdtsites.com.
 *
 * These are the public site's own values, lifted from app/page.tsx and
 * app/work/page.tsx. Both admin components import from here so they cannot
 * drift apart the way two copies of the same token block always do.
 */
export const C = {
  /** Page background. The site's cream. */
  bg: "#f4efe6",
  /** Card / panel fill, on cream. */
  panel: "rgba(255,255,255,0.55)",
  /** Slightly stronger fill for inputs and the active tab. */
  panelHi: "rgba(255,255,255,0.85)",
  /** Hairline borders. */
  line: "rgba(13,13,13,0.10)",
  /** Stronger border, for focus and hover. */
  lineHi: "rgba(13,13,13,0.22)",
  /** Body ink. */
  ink: "#0d0d0d",
  /** Secondary ink, for labels and timestamps. */
  inkMuted: "rgba(13,13,13,0.58)",
  /** VDT red. Buttons, links, the active accent. */
  accent: "#dc2626",
  /**
   * The accent, darkened, for SMALL text sitting on the 10% red tint.
   * `accent` itself only reaches ~3.9:1 there, under the 4.5:1 AA floor —
   * it was fine on the old dark panel and stopped being fine when the admin
   * moved to cream. This is 6.3:1 on the same tint. Use `accent` for solid
   * fills (white on solid #dc2626 is 4.8:1 and passes); use this for text
   * on a tint.
   */
  accentDeep: "#a4161a",
  /** Destructive actions. Deliberately not the accent, so Delete never
      looks like the primary button. */
  danger: "#b42318",
  /** Callout for a requested phone call. */
  highlight: "#8a5a00",
} as const;

/** Display face, same stack the public pages use. */
export const SYNE = "'Syne', 'Inter', sans-serif";

/** The one stylesheet both admin screens need. */
export const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap";
