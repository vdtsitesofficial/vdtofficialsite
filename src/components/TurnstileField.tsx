"use client";

import { useEffect, useRef } from "react";
import { TURNSTILE_SCRIPT_SRC, TURNSTILE_SITE_KEY } from "@/lib/turnstile-site-key";

type TurnstileApi = {
  render: (el: HTMLElement) => string | undefined;
  remove: (id: string) => void;
};

/**
 * The Turnstile challenge inside the contact card's <form>. Renders nothing
 * while TURNSTILE_SITE_KEY is empty, which is how the form looks until the
 * widget is created in the Cloudflare dashboard.
 *
 * THREE WAYS THE WIDGET GETS DRAWN, and each covers a case the others miss:
 *
 *   1. First page load: the <script async> below is server-rendered (React
 *      hoists it into <head>) and api.js's own implicit scan renders every
 *      `.cf-turnstile` element. Needs no hydration and no contact-card.js, so
 *      the native form POST still carries a token on the dead-JS path this
 *      form already lost a lead to once (2026-08-01).
 *   2. Client-side navigation onto a page with the form (next/link): the
 *      script is already loaded and does not scan again, so the effect below
 *      renders the new, empty container explicitly.
 *   3. Navigation from a page WITHOUT the form: React inserts the script on
 *      demand and its first scan finds the container.
 *
 * In every case api.js writes a hidden `cf-turnstile-response` input into
 * the container, which sits inside the <form>, so the native submit sends it
 * and public/lab/contact-card.js reads it for the JSON body.
 *
 * `dangerouslySetInnerHTML` with an empty string is load-bearing: it tells
 * React not to hydrate this element's children. api.js may have drawn the
 * iframe and the hidden input BEFORE hydration runs, and React 19 treats
 * unexpected child nodes as a hydration mismatch and re-renders client-side.
 */
export default function TurnstileField() {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let widgetId: string | undefined;
    // A tick later, so a scan api.js is about to run on first load gets its
    // turn and this only fires for the client-navigation case.
    const timer = window.setTimeout(() => {
      const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile;
      const host = hostRef.current;
      if (!api || !host || host.childElementCount > 0) return;
      try {
        widgetId = api.render(host) ?? undefined;
      } catch (err) {
        // Never take the form down over the challenge failing to draw. The
        // server still refuses (silently) a submission with no token.
        console.error("[turnstile] render failed", err);
      }
    }, 0);
    return () => {
      window.clearTimeout(timer);
      if (widgetId) {
        try {
          (window as unknown as { turnstile?: TurnstileApi }).turnstile?.remove(widgetId);
        } catch {}
      }
    };
  }, []);

  if (!TURNSTILE_SITE_KEY) return null;
  return (
    <>
      <script src={TURNSTILE_SCRIPT_SRC} async />
      <div
        ref={hostRef}
        className="cf-turnstile cc-turnstile"
        data-sitekey={TURNSTILE_SITE_KEY}
        data-theme="light"
        data-size="flexible"
        dangerouslySetInnerHTML={{ __html: "" }}
      />
    </>
  );
}
