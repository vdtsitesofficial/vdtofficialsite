"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_REOPEN_EVENT,
  readConsent,
  writeConsent,
  type ConsentValue,
} from "@/lib/consent";

/**
 * Cookie consent banner for analytics.
 *
 * Shown only until the visitor makes a choice; the choice persists in
 * localStorage and can be changed from the Cookie Policy page.
 *
 * Accept and Decline are given EQUAL visual weight on purpose. Styling the
 * decline option to be harder to find is a dark pattern and undermines the
 * validity of the consent it collects, which defeats the point of asking.
 *
 * Not a modal: it doesn't trap focus or block the page. Under BC PIPA /
 * PIPEDA an analytics cookie doesn't warrant holding the site hostage, and a
 * blocking overlay on a homepage whose whole pitch is a cinematic intro
 * would be its own problem.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only decide after mount — localStorage isn't available during SSR, and
    // rendering the banner on the server would flash it for people who
    // already chose.
    if (readConsent() === null) setVisible(true);

    const reopen = () => setVisible(true);
    window.addEventListener(CONSENT_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN_EVENT, reopen);
  }, []);

  const choose = useCallback((value: ConsentValue) => {
    writeConsent(value);
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-[520px] rounded-2xl border border-black/10 bg-white/95 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.18)] backdrop-blur-sm sm:right-auto"
    >
      <p className="text-[15px] font-semibold tracking-tight text-[#1d1d1f]">
        Can we count your visit?
      </p>
      <p className="mt-2 text-[14px] leading-[1.6] text-[#3a3a3c]">
        We&rsquo;d like to use Google Analytics to see how people find this site, so we
        know what&rsquo;s working. It sets cookies and shares usage data with Google.
        Decline and nothing is loaded. The site works exactly the same either way.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="flex-1 rounded-lg bg-[#1d1d1f] px-4 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="flex-1 rounded-lg border border-black/15 bg-white px-4 py-2.5 text-[14px] font-medium text-[#1d1d1f] transition-colors hover:border-black/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
        >
          Decline
        </button>
      </div>

      <p className="mt-3 text-[12.5px] text-[#6e6e73]">
        <a
          href="/cookie-policy"
          className="underline underline-offset-2 hover:text-[#1d1d1f]"
        >
          Cookie Policy
        </a>
        {" · "}
        <a
          href="/privacy-policy"
          className="underline underline-offset-2 hover:text-[#1d1d1f]"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
