const SYNE = "'Syne', 'Inter', sans-serif";

/**
 * The "Who you'd actually be working with" trust card: both headshots,
 * one honest sentence, and a link to /about. Extracted from /work
 * (2026-08-09) so the money pages can carry it too; markup is identical
 * to what shipped there.
 *
 * `blurb` exists because the /work original says "Every project above",
 * which only makes sense under the case-study grid. Pages without a
 * project list pass their own sentence.
 *
 * Avatars are the dedicated 168px face crops, NOT the 800x1000
 * portraits; see the sizing note in /work's git history before swapping.
 */
export default function TeamCard({
  blurb = "Every site we ship is designed and built by the two of us, no subcontractors and no account managers in between.",
}: {
  blurb?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-black/10 bg-white/55 px-6 py-9 text-center">
      <div className="flex items-center justify-center -space-x-3">
        {[
          { src: "/team/sem-avatar.webp", alt: "Sem van Duist" },
          { src: "/team/phillip-avatar.webp", alt: "Phillip Treitel" },
        ].map((p) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            width={168}
            height={168}
            className="size-14 rounded-full border-2 border-[#f4efe6] object-cover"
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
      <h2
        className="mt-4 text-[22px] font-bold md:text-[26px]"
        style={{ fontFamily: SYNE }}
      >
        Who you&rsquo;d actually be working with
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#0d0d0d]/70">
        {blurb}
      </p>
      <a
        href="/about"
        className="mt-5 inline-block text-[14px] font-semibold text-[#dc2626] hover:underline"
      >
        Meet Sem and Phillip &rarr;
      </a>
    </div>
  );
}
