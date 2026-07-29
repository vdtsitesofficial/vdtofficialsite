import type { Metadata } from "next";

/**
 * Public Privacy Policy page.
 *
 * Server component on purpose: static legal copy, no interactivity, lets
 * Next prerender at build time so crawlers get a fast 200. Styling mirrors
 * /terms-of-service so the three legal pages read as one set.
 *
 * Content is written to reflect what vdtsites.com actually does: a contact
 * form (name/email/message stored + emailed via Cloudflare), Cloudflare
 * hosting, and Google Fonts.
 *
 * Google Analytics and the cookie banner were REMOVED on 2026-07-29.
 * Measurement is now Cloudflare Web Analytics, which is cookieless, so
 * there is no consent to collect and no banner. Nothing on a public page
 * sets a cookie. No advertising pixels or cross-site trackers, and none
 * before this either. Keep this page and /cookie-policy describing the
 * same reality, in the same commit.
 */

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "VDT Sites Privacy Policy. How VDT Sites collects, uses, and protects personal information on vdtsites.com, in compliance with BC PIPA and Canada's PIPEDA.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy - VDT Sites",
    description: "How VDT Sites collects, uses, and protects personal information.",
    url: "/privacy-policy",
  },
  twitter: {
    title: "Privacy Policy - VDT Sites",
    description: "How VDT Sites collects, uses, and protects personal information.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <article className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24 text-[#1d1d1f]">
        <header className="mb-12 pb-10 border-b border-black/[0.08]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#999] font-medium mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            VDT Sites Privacy Policy
          </h1>
          <p className="mt-6 text-sm text-[#6e6e73]">Last Updated: July 29, 2026</p>
        </header>

        <div className="space-y-6 text-[16px] leading-[1.75] text-[#3a3a3c]">
          <p>
            VDT Sites (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a web design studio operating in British Columbia, Canada. This Privacy Policy explains how we collect, use, and protect personal information when you visit{" "}
            <a
              href="https://vdtsites.com"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              vdtsites.com
            </a>{" "}
            (the &ldquo;Site&rdquo;) or contact us through it.
          </p>
          <p>
            We handle personal information in accordance with British Columbia&rsquo;s <em>Personal Information Protection Act</em> (PIPA) and Canada&rsquo;s <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA).
          </p>
          <p>
            This policy covers our own marketing website. It does not govern the individual client websites and apps we build and host — those are covered by our{" "}
            <a
              href="/terms-of-service"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              Terms of Service
            </a>{" "}
            and by each client&rsquo;s own policies.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p>
            <strong>Information you give us directly.</strong> When you fill out the contact form on the Site, we collect your name, email address, and the contents of your message. If you email us directly, we receive whatever information you choose to include.
          </p>
          <p>
            <strong>Information collected automatically.</strong> Like most websites, our hosting provider records basic technical data needed to serve and secure the Site — such as IP address, browser type, device type, and the pages requested. This is used for security, performance, and troubleshooting, not for advertising or profiling.
          </p>
          <p>
            <strong>Analytics — cookieless, and no consent needed.</strong> We use Cloudflare Web Analytics to see how many people read a page and roughly how they arrived. It sets <strong>no cookies</strong>, does not fingerprint your browser, and cannot follow you to any other website. It gives us counts and trends, and nothing that identifies you.
          </p>
          <p>
            We previously used Google Analytics behind a consent banner. We removed both in July 2026, so there is no longer any analytics request to Google, no analytics cookie, and no banner to click. Details are in our{" "}
            <a
              href="/cookie-policy"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              Cookie Policy
            </a>
            .
          </p>
          <p>
            We do <strong>not</strong> run advertising pixels, social-media trackers, or any behavioural-tracking or ad-profiling tools on this Site.
          </p>
        </Section>

        <Section title="2. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-[#999]">
            <li>Respond to your inquiry and provide the services you ask about.</li>
            <li>Follow up with you regarding your request or project.</li>
            <li>Operate, secure, and maintain the Site.</li>
            <li>Meet legal or regulatory obligations.</li>
          </ul>
          <p>
            By submitting the contact form, you consent to us contacting you about your inquiry. We will not add you to a marketing or mailing list without your consent, and we do not sell, rent, or trade your personal information to anyone.
          </p>
        </Section>

        <Section title="3. How Your Contact Information Is Stored">
          <p>
            Contact form submissions are stored securely in our hosting infrastructure (Cloudflare) so we can review and respond to them, and a copy is emailed to us as a notification. Access is limited to VDT Sites.
          </p>
        </Section>

        <Section title="4. Third-Party Services">
          <p>The Site relies on a small number of third-party services:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-[#999]">
            <li>
              <strong>Cloudflare</strong> — hosting, security, and content delivery. Cloudflare processes technical data such as IP addresses and request metadata, and may set essential security cookies, in accordance with its own privacy policy.
            </li>
            <li>
              <strong>Google Fonts</strong> — the Site loads fonts from Google&rsquo;s servers to render its typography. This means your browser makes a request to Google, which can expose your IP address to Google. Google Fonts does not set cookies for this purpose.
            </li>
            <li>
              <strong>Cloudflare Web Analytics</strong> — cookieless traffic measurement, so we can see how many people read a page. It stores nothing on your device and collects no information that identifies you.
            </li>
          </ul>
          <p>
            These services handle data under their own privacy policies, which we encourage you to review.
          </p>
        </Section>

        <Section title="5. Cookies">
          <p>
            Browsing this Site sets <strong>no cookies</strong>. Our analytics is cookieless, and there are no advertising or cross-site tracking cookies, so there is no banner and nothing to opt out of. Our hosting and security provider (Cloudflare) may set an essential security cookie when its protection features are triggered, and signing in to the private admin area sets one session cookie. For the full list, see our{" "}
            <a
              href="/cookie-policy"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              Cookie Policy
            </a>
            .
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We keep contact form submissions and related correspondence only as long as needed to respond to your inquiry and manage any resulting business relationship, or as required by law. You can ask us to delete your information at any time (see Section 7).
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>Under PIPA and PIPEDA, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-[#999]">
            <li><strong>Access</strong> the personal information we hold about you.</li>
            <li><strong>Correct</strong> inaccurate information.</li>
            <li><strong>Request deletion</strong> of your information, subject to legal retention requirements.</li>
            <li><strong>Withdraw consent</strong> for non-essential uses at any time.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a
              href="mailto:vdtsites@gmail.com"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              vdtsites@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="8. Security">
          <p>
            We take reasonable technical and organizational measures to protect your information from unauthorized access, loss, or misuse. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            The Site is not directed at children under 13, and we do not knowingly collect personal information from children.
          </p>
        </Section>

        <Section title="10. International Visitors">
          <p>
            The Site is operated from Canada. If you access it from outside Canada, your information may be transferred to and processed in Canada, where privacy laws may differ from those in your jurisdiction. By using the Site, you consent to that transfer and processing.
          </p>
        </Section>

        <Section title="11. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. The &ldquo;Last Updated&rdquo; date above reflects the most recent change. Continued use of the Site after an update is posted means you accept the updated policy.
          </p>
        </Section>

        <Section title="12. Contact">
          <p>For privacy questions or requests, contact:</p>
          <address className="not-italic">
            VDT Sites
            <br />
            British Columbia, Canada
            <br />
            Email:{" "}
            <a
              href="mailto:vdtsites@gmail.com"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              vdtsites@gmail.com
            </a>
          </address>
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
