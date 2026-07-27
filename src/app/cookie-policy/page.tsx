import type { Metadata } from "next";
import ConsentResetButton from "@/components/ConsentResetButton";

/**
 * Public Cookie Policy page.
 *
 * Server component, styled to match /terms-of-service and /privacy-policy.
 *
 * MUST describe what the Site actually does. As of 2026-07-26 that is:
 * Cloudflare's essential security cookies always, plus Google Analytics
 * ONLY after the visitor accepts in the consent banner. The GA tag is not
 * loaded at all until consent (see components/CookieConsent.tsx and
 * lib/consent.ts), so declining means nothing reaches Google. If that
 * gating ever changes, this page and the Privacy Policy change with it.
 */

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "VDT Sites Cookie Policy. What cookies vdtsites.com uses and how to manage them. The Site uses only essential security cookies and no tracking cookies.",
  alternates: { canonical: "/cookie-policy" },
  openGraph: {
    title: "Cookie Policy - VDT Sites",
    description: "What cookies vdtsites.com uses and how to manage them.",
    url: "/cookie-policy",
  },
  twitter: {
    title: "Cookie Policy - VDT Sites",
    description: "What cookies vdtsites.com uses and how to manage them.",
  },
};

export default function CookiePolicyPage() {
  return (
    <article className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24 text-[#1d1d1f]">
        <header className="mb-12 pb-10 border-b border-black/[0.08]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#999] font-medium mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            VDT Sites Cookie Policy
          </h1>
          <p className="mt-6 text-sm text-[#6e6e73]">Last Updated: July 26, 2026</p>
        </header>

        <div className="space-y-6 text-[16px] leading-[1.75] text-[#3a3a3c]">
          <p>
            This Cookie Policy explains how{" "}
            <a
              href="https://vdtsites.com"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              vdtsites.com
            </a>{" "}
            (the &ldquo;Site&rdquo;) uses cookies. It should be read together with our{" "}
            <a
              href="/privacy-policy"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <Section title="1. What Are Cookies">
          <p>
            Cookies are small text files placed on your device when you visit a website. They are widely used to make sites work, keep them secure, and remember basic preferences.
          </p>
        </Section>

        <Section title="2. How We Use Cookies">
          <p>
            We keep our use of cookies to a minimum. This Site uses two kinds:
          </p>
          <p>
            <strong>Essential cookies</strong> — required for the Site to load, perform, and stay protected against abuse. These are set by our hosting and security provider, Cloudflare, and cannot be switched off.
          </p>
          <p>
            <strong>Analytics cookies</strong> — set by Google Analytics so we can see how many people visit, which pages they read, and how they found us. These are used only if you <strong>accept</strong> them.
          </p>
          <p>
            If you decline, or simply ignore the banner, <strong>Google Analytics is never loaded at all</strong> — no analytics cookies are set and no data about your visit is sent to Google. The Site works exactly the same either way.
          </p>
          <p>
            We do <strong>not</strong> use advertising cookies, social-media trackers, or any cookies that follow you across other websites.
          </p>
        </Section>

        <Section title="3. Cookies We Use">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[15px]">
              <thead>
                <tr className="border-b border-black/[0.12]">
                  <th className="py-3 pr-4 font-semibold">Cookie</th>
                  <th className="py-3 pr-4 font-semibold">Type</th>
                  <th className="py-3 pr-4 font-semibold">Provider</th>
                  <th className="py-3 font-semibold">Purpose</th>
                </tr>
              </thead>
              <tbody className="align-top">
                <tr className="border-b border-black/[0.06]">
                  <td className="py-3 pr-4 font-mono text-[13px]">__cf_bm</td>
                  <td className="py-3 pr-4">Essential</td>
                  <td className="py-3 pr-4">Cloudflare</td>
                  <td className="py-3">Bot management — distinguishes humans from automated traffic to protect the Site.</td>
                </tr>
                <tr className="border-b border-black/[0.06]">
                  <td className="py-3 pr-4 font-mono text-[13px]">cf_clearance</td>
                  <td className="py-3 pr-4">Essential</td>
                  <td className="py-3 pr-4">Cloudflare</td>
                  <td className="py-3">Stores the result of a security challenge so you are not repeatedly re-checked.</td>
                </tr>
                <tr className="border-b border-black/[0.06]">
                  <td className="py-3 pr-4 font-mono text-[13px]">_ga</td>
                  <td className="py-3 pr-4">Analytics <span className="text-[#6e6e73]">(only if accepted)</span></td>
                  <td className="py-3 pr-4">Google Analytics</td>
                  <td className="py-3">Distinguishes one visitor from another so visits can be counted. Expires after 2 years.</td>
                </tr>
                <tr className="border-b border-black/[0.06]">
                  <td className="py-3 pr-4 font-mono text-[13px]">_ga_&lt;ID&gt;</td>
                  <td className="py-3 pr-4">Analytics <span className="text-[#6e6e73]">(only if accepted)</span></td>
                  <td className="py-3 pr-4">Google Analytics</td>
                  <td className="py-3">Keeps track of a single browsing session on this Site. Expires after 2 years.</td>
                </tr>
                <tr className="border-b border-black/[0.06]">
                  <td className="py-3 pr-4 font-mono text-[13px]">vdt-cookie-consent</td>
                  <td className="py-3 pr-4">Essential</td>
                  <td className="py-3 pr-4">VDT Sites</td>
                  <td className="py-3">Not a cookie — a value stored in your browser remembering whether you accepted or declined analytics, so we stop asking. Never leaves your device.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Cloudflare may set its cookies only when its security features are triggered, so you may not receive all of them on every visit. They contain no advertising or personal-profiling data.
          </p>
          <p>
            The Google Analytics cookies appear <strong>only</strong> after you accept. We also ask Google to anonymise IP addresses, and we do not enable Google&rsquo;s advertising or personalisation features.
          </p>
        </Section>

        <Section title="4. Your Choice, and Changing It">
          <p>
            The first time you visit, a banner asks whether we can count your visit. Accepting and declining are offered equally — declining costs you nothing and hides no functionality.
          </p>
          <p>
            You can change your mind at any time using the button below. This clears your saved choice and shows the banner again. If you switch from accept to decline, also clear the <span className="font-mono text-[13px]">_ga</span> cookies through your browser settings (see the section below) to remove ones already set.
          </p>
          <ConsentResetButton />
        </Section>

        <Section title="5. Third-Party Content">
          <p>
            The Site loads fonts from Google Fonts to render its typography. This causes your browser to request files from Google&rsquo;s servers, but Google Fonts does not set cookies for this.
          </p>
          <p>
            If you accept analytics, the Site loads Google Analytics from Google&rsquo;s servers and shares usage data &mdash; pages viewed, approximate location, device and browser type, and how you arrived &mdash; with Google, who process it on our behalf. Google&rsquo;s handling of that data is governed by the{" "}
            <a href="https://policies.google.com/privacy" className="text-[#1d1d1f] underline underline-offset-2 hover:text-black" target="_blank" rel="noreferrer">Google Privacy Policy</a>.
          </p>
          <p>
            We do not embed advertising networks, social-media widgets, or third-party trackers that would set their own cookies.
          </p>
        </Section>

        <Section title="6. Managing and Disabling Cookies">
          <p>
            Most browsers let you view, block, or delete cookies through their settings:
          </p>
          <ul className="list-disc pl-6 space-y-2 marker:text-[#999]">
            <li>
              <a href="https://support.google.com/chrome/answer/95647" className="text-[#1d1d1f] underline underline-offset-2 hover:text-black" target="_blank" rel="noreferrer">Google Chrome</a>
            </li>
            <li>
              <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" className="text-[#1d1d1f] underline underline-offset-2 hover:text-black" target="_blank" rel="noreferrer">Mozilla Firefox</a>
            </li>
            <li>
              <a href="https://support.apple.com/en-ca/guide/safari/sfri11471/mac" className="text-[#1d1d1f] underline underline-offset-2 hover:text-black" target="_blank" rel="noreferrer">Safari</a>
            </li>
            <li>
              <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-[#1d1d1f] underline underline-offset-2 hover:text-black" target="_blank" rel="noreferrer">Microsoft Edge</a>
            </li>
          </ul>
          <p>
            Blocking the essential Cloudflare cookies may affect how the Site loads or behaves, since they exist for security and performance. Blocking or clearing the Google Analytics cookies has no effect on the Site at all.
          </p>
        </Section>

        <Section title="7. Changes to This Policy">
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, law, or our use of cookies. The &ldquo;Last Updated&rdquo; date above reflects the most recent change.
          </p>
        </Section>

        <Section title="8. Contact">
          <p>
            For questions about our use of cookies, email us at{" "}
            <a
              href="mailto:vdtsites@gmail.com"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              vdtsites@gmail.com
            </a>
            .
          </p>
        </Section>
      </div>
    </article>
  );
}

/**
 * Section wrapper with consistent typography for each h2 + body block.
 */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="text-2xl md:text-[28px] font-semibold text-[#1d1d1f] tracking-tight mb-5 scroll-mt-24">
        {title}
      </h2>
      <div className="space-y-4 text-[16px] leading-[1.75] text-[#3a3a3c]">
        {children}
      </div>
    </section>
  );
}
