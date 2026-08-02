import type { Metadata } from "next";

/**
 * Public Cookie Policy page.
 *
 * Server component, styled to match /terms-of-service and /privacy-policy.
 *
 * MUST describe what the Site actually does. As of 2026-07-29 that is:
 * NOTHING on a public page sets a cookie. Google Analytics and the consent
 * banner were removed; traffic is measured by Cloudflare Web Analytics,
 * which is cookieless. Cloudflare may still set essential security cookies
 * when its protection features are triggered, and signing in to /admin sets
 * one essential session cookie. Verified against production on 2026-07-29:
 * a fresh visit returns no Set-Cookie header and leaves document.cookie,
 * localStorage and sessionStorage all empty.
 *
 * If analytics or advertising is ever added back, this page and the Privacy
 * Policy change with it, in the same commit.
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
          <p className="mt-6 text-sm text-[#6e6e73]">Last Updated: July 29, 2026</p>
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
            Browsing this Site sets <strong>no cookies at all</strong>. We removed Google Analytics and the cookie banner that went with it, because we would rather not ask you for something we do not need.
          </p>
          <p>
            <strong>Essential cookies:</strong> our hosting and security provider, Cloudflare, may set a cookie when its protection features are triggered, for example if it needs to tell a person apart from an automated bot. These exist for security, cannot be switched off, and are not set on every visit.
          </p>
          <p>
            <strong>Measurement:</strong> we do count visits, using Cloudflare Web Analytics. It is <strong>cookieless</strong>: it sets nothing on your device, does not fingerprint your browser, and cannot follow you to any other site. It tells us how many people read a page and roughly where they came from, and nothing that identifies you.
          </p>
          <p>
            We use <strong>no</strong> analytics cookies, advertising cookies, social-media trackers, or anything that follows you across other websites.
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
                  <td className="py-3">Bot management: distinguishes humans from automated traffic to protect the Site.</td>
                </tr>
                <tr className="border-b border-black/[0.06]">
                  <td className="py-3 pr-4 font-mono text-[13px]">cf_clearance</td>
                  <td className="py-3 pr-4">Essential</td>
                  <td className="py-3 pr-4">Cloudflare</td>
                  <td className="py-3">Stores the result of a security challenge so you are not repeatedly re-checked.</td>
                </tr>
                <tr className="border-b border-black/[0.06]">
                  <td className="py-3 pr-4 font-mono text-[13px]">vdt_admin</td>
                  <td className="py-3 pr-4">Essential</td>
                  <td className="py-3 pr-4">VDT Sites</td>
                  <td className="py-3">Signed sign-in session for the private admin area, set only if a VDT Sites administrator logs in. Never set by browsing the public Site.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            Cloudflare sets its cookies only when its security features are triggered, so you may receive none of them on a normal visit. They contain no advertising or personal-profiling data.
          </p>
          <p>
            That is the complete list. There is no analytics cookie, because our analytics does not use one.
          </p>
        </Section>

        <Section title="4. Your Choice">
          <p>
            There is no cookie banner on this Site, and nothing to opt out of. Because browsing sets no cookies and our analytics is cookieless, there is no consent for us to ask for and no preference for us to store.
          </p>
          <p>
            If we ever add analytics or advertising that does use cookies, we will ask first, and this page will say so before it happens.
          </p>
        </Section>

        <Section title="5. Third-Party Content">
          <p>
            The Site loads fonts from Google Fonts, and a small number of code libraries from public content-delivery networks, to render its typography and animation. This causes your browser to request files from those servers, which can expose your IP address to them. None of them set cookies for this purpose.
          </p>
          <p>
            Traffic measurement is provided by <strong>Cloudflare Web Analytics</strong>, which is cookieless and collects no information that identifies you personally.
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
            Blocking the essential Cloudflare cookies may affect how the Site loads or behaves, since they exist for security and performance. Nothing else on the public Site depends on cookies, so blocking them changes nothing about how it works for you.
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
