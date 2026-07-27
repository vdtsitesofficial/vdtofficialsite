"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import { CONSENT_EVENT, readConsent } from "@/lib/consent";

/**
 * GA4 tag + site-wide conversion events.
 *
 * CONSENT-GATED: nothing here renders — no gtag script, no network request to
 * Google — until the visitor accepts in the cookie banner. See lib/consent.ts
 * for why we gate the whole tag rather than loading it with Consent Mode set
 * to denied. The Cookie Policy describes this behaviour; if you change the
 * gating, change the policy too.
 *
 * Conversion events (marked as key events in GA4, imported by Google Ads):
 *  - phone_call_click — any click on an <a href="tel:..."> anywhere on the
 *    site, captured with one delegated listener so new call buttons are
 *    tracked automatically.
 *  - generate_lead — fired by the contact form on confirmed delivery
 *    (see public/lab/contact-card.js), not from here.
 */
export default function Analytics() {
  const pathname = usePathname();
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    setConsented(readConsent() === "granted");
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setConsented(detail === "granted");
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Never track the admin area — it's Sem, not a visitor.
  const disabled = !GA_MEASUREMENT_ID || !consented || pathname.startsWith("/admin");

  useEffect(() => {
    if (disabled) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target instanceof Element ? e.target : null;
      const link = target?.closest('a[href^="tel:"]');
      if (!link) return;
      window.gtag?.("event", "phone_call_click", {
        link_text: (link.textContent || "").trim().slice(0, 80),
        page_location: window.location.href,
      });
    };
    // Capture phase so the event still fires if the tel: navigation begins.
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [disabled]);

  if (disabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
// Belt and braces: the tag only loads after consent, but declare it anyway so
// Google's own consent checks see an explicit grant rather than a default.
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted'
});
gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
