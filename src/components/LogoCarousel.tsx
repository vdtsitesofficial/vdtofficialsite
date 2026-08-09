/**
 * Logo proof strip for /logo-design-nanaimo: a slow CSS-only marquee of
 * client logos VDT has designed. Pure server component, no JS, renders
 * visible in SSR (crawlers and reduced-motion users get a static row).
 *
 * Assets live in public/logos/, copied from the client repos 2026-08-09
 * (sources noted per item below). Heights are normalised per logo rather
 * than shared, because the lockups have wildly different aspect ratios.
 *
 * Paul Van Ryssel has NO logo file anywhere: his lockup is composed at
 * runtime in his repo (src/components/Logo.tsx), so it is recreated here
 * inline with his real brand values (navy #072e57, gold #a87c28,
 * Montserrat). The page's font link must include Montserrat:600 + italic.
 *
 * The track is duplicated for the seamless loop; the second copy is
 * aria-hidden so screen readers hear each client once.
 */

const RULE_GOLD = "rgba(201, 131, 22, 0.85)";

function PaulLockup() {
  return (
    <span className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logos/paul-van-ryssel-mark.png"
        alt=""
        className="h-10 w-10 object-contain"
        loading="lazy"
      />
      <span className="flex flex-col leading-tight">
        <span
          className="text-[15px] font-semibold tracking-wide"
          style={{ fontFamily: "'Montserrat', sans-serif", color: "#072e57" }}
        >
          PAUL VAN RYSSEL
        </span>
        <span className="mt-0.5 flex items-center gap-2">
          <span
            aria-hidden="true"
            className="block h-px w-3"
            style={{ background: RULE_GOLD }}
          />
          <span
            className="text-[10px] font-medium italic tracking-wide"
            style={{ fontFamily: "'Montserrat', sans-serif", color: "#a87c28" }}
          >
            For Nanaimo City Council
          </span>
          <span
            aria-hidden="true"
            className="block h-px w-3"
            style={{ background: RULE_GOLD }}
          />
        </span>
      </span>
    </span>
  );
}

/* One entry per client. `h` tunes each logo's visual weight so the row
   reads balanced despite the mixed aspect ratios. */
const LOGOS: Array<
  { name: string; src: string; h: string } | { name: string; inline: true }
> = [
  // C:\Websites\MO Coffee\Images\MO Coffee Logo long.png (745x335)
  { name: "MO Coffee", src: "/logos/mo-coffee.png", h: "h-14" },
  // C:\Websites\Horizon Hues\logo\lockup-horizontal.svg (vector)
  { name: "Horizon Hues", src: "/logos/horizon-hues.svg", h: "h-11" },
  // C:\Websites\Sherri Kozubal\public\assets\logo-blue.png (512x480)
  { name: "Sherri Kozubal", src: "/logos/sherri-kozubal.png", h: "h-16" },
  // C:\Websites\westro-clone\public\img\westro-mark.png (1400x845)
  { name: "Westro", src: "/logos/westro.png", h: "h-16" },
  // Recreated inline; see PaulLockup above.
  { name: "Paul Van Ryssel", inline: true },
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <div className="vdt-logos__row" aria-hidden={hidden || undefined}>
      {LOGOS.map((l) => (
        <span key={l.name} className="vdt-logos__item">
          {"inline" in l ? (
            <PaulLockup />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={l.src}
              alt={hidden ? "" : `${l.name} logo, designed by VDT Sites`}
              className={`${l.h} w-auto object-contain`}
              loading="lazy"
            />
          )}
        </span>
      ))}
    </div>
  );
}

export default function LogoCarousel() {
  return (
    <>
      <style>{`
        .vdt-logos {
          overflow: hidden;
          /* Soft fade at both edges so logos enter and leave gently. */
          -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
        }
        .vdt-logos__track {
          display: flex;
          width: max-content;
          animation: vdt-logos-scroll 36s linear infinite;
        }
        .vdt-logos:hover .vdt-logos__track { animation-play-state: paused; }
        .vdt-logos__row {
          display: flex;
          align-items: center;
          gap: 72px;
          padding-right: 72px;
        }
        @keyframes vdt-logos-scroll {
          to { transform: translateX(-50%); }
        }
        /* Reduced motion: no marquee, show the single row wrapped instead
           (the duplicate row is display:none so nothing repeats). */
        @media (prefers-reduced-motion: reduce) {
          .vdt-logos { mask-image: none; -webkit-mask-image: none; }
          .vdt-logos__track { animation: none; width: auto; flex-wrap: wrap; }
          .vdt-logos__row { flex-wrap: wrap; gap: 40px; padding-right: 0; }
          .vdt-logos__row[aria-hidden] { display: none; }
        }
      `}</style>
      <div className="vdt-logos">
        <div className="vdt-logos__track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </>
  );
}
