import type { WorkItem } from "@/components/WorkCarousel";

/**
 * The WorkCarousel card list, shared by /web-design-nanaimo (ads landing)
 * and /web-design-victoria (organic city page).
 *
 * Ordered strongest-first: the first two load eagerly and are what most
 * visitors see before scrolling the track.
 *
 * Cards link to the /work case studies (2026-07-28): keeps visitors on-site
 * and in the funnel instead of handing them to a client's site. Internal
 * links open in the same tab; WorkCarousel only new-tabs external hrefs.
 */
export const WORK_ITEMS: WorkItem[] = [
  { img: "/work/mocoffee.webp", name: "MO Coffee", line: "Online coffee store · Nanaimo", href: "/work/mo-coffee" },
  { img: "/work/horizonhues.webp", name: "Horizon Hues", line: "Electrical contractor · Nanaimo", href: "/work/horizon-hues" },
  { img: "/work/morky.webp", name: "Morky Auto Imports", line: "Japanese imports · Parksville", href: "/work/morky-auto-imports" },
  { img: "/work/therapeutic.webp", name: "Therapeutic Value", line: "Counselling · Nanaimo", href: "/work/therapeutic-value" },
  { img: "/work/sherri.webp", name: "Sherri Kozubal", line: "Clinical hypnotherapy · Nanaimo", href: "/work/sherri-kozubal" },
  { img: "/work/isleair.webp", name: "Isle Air Chicken", line: "Air-fried chicken · Vancouver Island", href: "/work/isle-air-chicken" },
  { img: "/work/ceva.webp", name: "CEVA Volleyball", line: "Tournament platform · live scoreboards", href: "/work/ceva-volleyball" },
  { img: "/work/paulvanryssel.webp", name: "Paul Van Ryssel", line: "Campaign website · Nanaimo", href: "/work/paul-van-ryssel" },
];
