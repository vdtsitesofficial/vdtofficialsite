"use client";

import { useEffect, useState } from "react";

/**
 * Sticky mobile call/message bar (≤720px) — the conversion bundle's
 * standard action bar, on our own site. Slides up once the visitor has
 * scrolled past the hero (so it never overlays the tap-to-enter intro)
 * and hides again while the #contact section is on screen so it doesn't
 * cover the actual form.
 *
 * Call tracking: the tel: link fires NO event of its own. This comment used
 * to claim a phone_call_click conversion was recorded "by the Analytics
 * component's delegated listener" — there is no Analytics component and that
 * string appears nowhere else in the codebase, so taps here were untracked
 * from the day the bar shipped until 2026-08-10. Calls are now measured by
 * Google Ads instead of by us: the phone snippet in app/layout.tsx swaps in a
 * forwarding number for ad visitors and reports calls over 30 seconds. That
 * counts real conversations rather than taps, so do not add a click event
 * here — it would double-count every ad visitor who taps and connects.
 *
 * messageHref: pages without an embedded form (e.g. /seo-victoria) pass
 * "/contact" so "Message us" goes to the form page instead of a dead
 * same-page anchor. Give such pages id="contact" on their closing CTA
 * section so the hide-when-visible behaviour still works.
 */
export default function MobileActionBar({
  messageHref = "#contact",
}: {
  messageHref?: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let pastHero = false;
    let contactVisible = false;
    let raf = 0;
    const update = () => setShow(pastHero && !contactVisible);

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        pastHero = window.scrollY > window.innerHeight * 1.2;
        update();
      });
    };

    let io: IntersectionObserver | undefined;
    const contact = document.getElementById("contact");
    if (contact && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          contactVisible = entries.some((e) => e.isIntersecting);
          update();
        },
        { threshold: 0.05 },
      );
      io.observe(contact);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[60] transition-transform duration-300 min-[721px]:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-hidden={!show}
    >
      <div className="flex gap-3 border-t border-black/10 bg-[#f4efe6]/95 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.10)]">
        <a
          href="tel:+12506162087"
          className="flex-1 rounded-full bg-[#dc2626] py-3 text-center text-[14px] font-bold text-white"
        >
          Call 250-616-2087
        </a>
        <a
          href={messageHref}
          className="flex-1 rounded-full border border-[#0d0d0d]/25 py-3 text-center text-[14px] font-semibold text-[#0d0d0d]"
        >
          Message us
        </a>
      </div>
    </div>
  );
}
