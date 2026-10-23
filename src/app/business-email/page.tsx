import type { Metadata } from "next";
import ServiceLanding, { InLink } from "@/components/ServiceLanding";
import { OG_IMAGE } from "@/lib/og";

/**
 * /business-email
 *
 * Added 2026-10-22. VDT became a Zoho Workplace partner (Value Added
 * Reseller) on 2026-10-16, and the agreement asks for a business-email
 * landing page plus the partner logo in the footer (ZohoPartnerBadge).
 *
 * Three options, all offered as options (Sem 2026-10-22: do not say
 * forwarding is "included with every site"):
 *   1. Forwarding (Cloudflare Email Routing) into the inbox they already
 *      use; replies from the business address only work from Gmail
 *      (Outlook.com / Hotmail cannot add an outside send-as address).
 *   2. A Zoho Mail mailbox, set up and managed by VDT in Zoho's Canadian
 *      data centre. One mailbox included with the website plans (Sem's
 *      brief). Extra-mailbox price: ask Sem before publishing one.
 *   3. Google Workspace on their domain. The client owns the Google
 *      account and Google bills them; VDT is added as an admin.
 *
 * Claims are kept to what the vault playbooks back (Shared/Zoho Email Setup
 * Playbook.md, Shared/Client Email Setup Options.md):
 * - No "zero downtime": for up to an hour after the switch some mail can
 *   still reach the old host, so the promise is "nothing lost", with a
 *   catch-up copy afterwards.
 * - No Gmail-on-the-web promise for Zoho (Google removed POP fetch in 2026);
 *   the Gmail phone app over IMAP is fine.
 * - No commission or agreement terms, no client names as case studies.
 */

export const metadata: Metadata = {
  title: "Business Email on Your Own Domain in Nanaimo",
  description:
    "Professional email on your own domain, set up and managed by a local Nanaimo team. Official Zoho Workplace partner, Canadian data centre, old email moved across.",
  keywords: [
    "business email nanaimo",
    "zoho mail partner canada",
    "email for my domain",
    "professional email address small business",
    "google workspace setup nanaimo",
    "email forwarding custom domain",
  ],
  alternates: { canonical: "/business-email" },
  openGraph: {
    images: [OG_IMAGE],
    title: "Business Email on Your Own Domain | VDT Sites",
    description:
      "Email on your own domain, set up and looked after for you. Official Zoho Workplace partner, hosted in Canada.",
    url: "/business-email",
  },
  twitter: {
    card: "summary_large_image",
    title: "Business Email on Your Own Domain | VDT Sites",
    description:
      "Email on your own domain, set up and looked after for you. Official Zoho Workplace partner, hosted in Canada.",
  },
};

const ZOHO_INCLUDED = [
  "Hosted in Zoho's Canadian data centre, so your business mail stays in Canada",
  "Your old email copied across first, so nothing is left behind",
  "Domain verification, MX, SPF, DKIM and DMARC set up so your mail reaches inboxes, not spam folders",
  "Works in the Zoho Mail app, the Gmail app, iPhone Mail and any web browser",
  "Extra addresses like info@ or quotes@ delivered to the same inbox",
  "One mailbox included with our website plans",
];

const FAQS = [
  {
    q: "What is the difference between forwarding and a mailbox?",
    a: "Forwarding sends mail addressed to your domain into an inbox you already have, such as Gmail, and nothing else changes. A mailbox is a separate inbox that belongs to your domain, with its own storage, its own login and sending that is signed as your business. Forwarding suits a business that is happy in its current inbox. A mailbox suits a business that wants its email kept apart from personal mail.",
  },
  {
    q: "Can I keep using Gmail?",
    a: "Yes, three ways. Forwarding delivers your business mail into your existing Gmail, and we can set it up so replies go out from your business address. Google Workspace gives you Gmail on your own domain. And a Zoho mailbox can be added to the Gmail app on your phone, so the app you know stays the same.",
  },
  {
    q: "Will I lose my old emails when I switch?",
    a: "No. For a Zoho mailbox or Google Workspace we copy your existing messages and folders across before anything changes, then switch your domain's mail records. Anything that lands at the old provider during the switch gets copied over too, and the old account is only closed once everything has arrived.",
  },
  {
    q: "Where is my email stored?",
    a: "Zoho mailboxes we set up live in Zoho's Canadian data centre, so the mail of a Canadian business stays in Canada. Forwarding keeps your mail wherever your current inbox already is, and Google Workspace stores it with Google.",
  },
  {
    q: "Does it work on my phone?",
    a: "Yes. A Zoho mailbox works in the Zoho Mail app, the Gmail app and the iPhone Mail app, and in any browser on a computer. We send you the exact steps for your phone and help you set it up.",
  },
  {
    q: "Is business email included with my website?",
    a: "One Zoho mailbox is included with our website plans. Forwarding, extra mailboxes and Google Workspace setup are quoted when we talk, so you only pay for what your business actually uses.",
  },
  {
    q: "Who owns my email account?",
    a: "You do. Your domain and your mail belong to your business. With Google Workspace the account is in your name and Google bills you directly, with us added as an admin so we can help. If you ever leave us, your email comes with you.",
  },
  {
    q: "Why do you use Zoho?",
    a: "Zoho Mail is a dedicated business mail service with no ads, a Canadian data centre and a price that suits a small business. We are an official Zoho Workplace partner, so we set it up and manage it for you from the start.",
  },
];

export default function BusinessEmailPage() {
  return (
    <ServiceLanding
      path="/business-email"
      eyebrow="Business Email"
      h1="Email on your own domain, set up for you."
      breadcrumbName="Business Email on Your Own Domain"
      serviceName="Business Email Setup and Management"
      serviceType="Business email on a custom domain: Zoho Mail mailboxes, Google Workspace setup, email forwarding, migration and DNS (MX, SPF, DKIM, DMARC)"
      description="Business email on your own domain from VDT Sites in Nanaimo, BC: Zoho Mail mailboxes hosted in Canada as an official Zoho Workplace partner, Google Workspace setup, or forwarding into your current inbox, with migration and DNS handled."
      intro={
        <>
          <p>
            you@yourbusiness.ca instead of a free email address, without the
            weekend of DNS settings. We set it up, move your old email across
            and look after it afterwards.
          </p>
          <p className="mt-4">
            We are an official Zoho Workplace partner, and we also set up
            Google Workspace or simple forwarding when that fits better.
          </p>
        </>
      }
      sections={[
        {
          eyebrow: "Three ways to do it",
          heading: "Pick the setup that suits how you work",
          body: (
            <p>
              Not sure which one you need? Tell us how you use email today and
              we will recommend one. All three put your business address on
              your own domain.
            </p>
          ),
          items: [
            {
              title: "Email forwarding",
              body: (
                <>
                  <p>
                    Mail sent to info@yourbusiness.ca lands in the inbox you
                    already use. No new app, no new password. If that inbox is
                    Gmail, we can also set it up so your replies go out from
                    your business address.
                  </p>
                  <p className="mt-3">
                    Worth knowing: replying as your business address only
                    works from Gmail. Outlook.com and Hotmail do not allow it.
                  </p>
                </>
              ),
            },
            {
              title: "A Zoho business mailbox (our recommendation)",
              body: (
                <p>
                  A full mailbox on your domain, hosted in Zoho&apos;s Canadian
                  data centre and managed by us as an official Zoho Workplace
                  partner. Your own inbox and storage, kept separate
                  from personal mail, and one mailbox is included with our
                  website plans.
                </p>
              ),
            },
            {
              title: "Google Workspace",
              body: (
                <p>
                  Gmail, Calendar and Drive on your own domain, for businesses
                  that want to stay with Google. We set it up, move your old
                  email in and handle the domain records. The account is yours
                  and Google bills you directly.
                </p>
              ),
            },
          ],
        },
        {
          eyebrow: "Zoho mailbox",
          heading: "What you get with a Zoho mailbox",
          ticks: ZOHO_INCLUDED,
          body: (
            <p>
              We create the mailbox under our Zoho partner account, set
              everything up and stay your first point of contact afterwards. A
              forgotten password or a phone that stopped syncing is one call
              to us.
            </p>
          ),
        },
        {
          eyebrow: "Moving your email",
          heading: "Switching over without losing a message",
          body: (
            <>
              <p>
                We copy your existing messages and folders into the new mailbox
                first, while your old email keeps working exactly as it does
                today. Only then do we switch your domain&apos;s mail records.
              </p>
              <p>
                Mail that reaches the old provider in the hour or so after the
                switch is copied across too, and we only close the old account
                once everything has arrived. You keep sending and receiving
                the whole way through.
              </p>
            </>
          ),
        },
        {
          eyebrow: "The technical side",
          heading: "Set up so your email lands in the inbox",
          body: (
            <>
              <p>
                Most business email that ends up in spam is missing one of a
                few records on the domain. We set them all up and test them
                before you rely on the new address:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Domain verification</strong>, proving to the mail
                  provider that the domain is yours
                </li>
                <li>
                  <strong>MX</strong>, telling the internet where your mail
                  should be delivered
                </li>
                <li>
                  <strong>SPF and DKIM</strong>, which prove your messages
                  came from your business
                </li>
                <li>
                  <strong>DMARC</strong>, which tells other mail servers what
                  to do with anything pretending to be you
                </li>
              </ul>
            </>
          ),
        },
        {
          eyebrow: "One local contact",
          heading: "Your website and your email, looked after by the same team",
          body: (
            <>
              <p>
                We are based in Nanaimo and work with businesses across
                Vancouver Island. When your email and your website live with
                the same people, there is no finger-pointing between a host, a
                registrar and an email company when something needs changing.
              </p>
              <p>
                Your domain and hosting are covered on our{" "}
                <InLink href="/website-hosting-nanaimo">
                  hosting and domains page
                </InLink>
                , and the monthly care plan on the{" "}
                <InLink href="/website-maintenance">
                  website maintenance page
                </InLink>
                .
              </p>
            </>
          ),
        },
      ]}
      faqs={FAQS}
      ctaHeading="Ready for an email address that matches your business?"
      ctaBody="Tell us your domain and where your email lives today. We will recommend forwarding, a Zoho mailbox or Google Workspace, and give you a fixed price for the setup. Free, and no obligation."
    />
  );
}
