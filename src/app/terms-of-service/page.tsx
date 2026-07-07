import type { Metadata } from "next";

/**
 * Public Terms of Service page.
 *
 * URL is locked to /terms-of-service because Stripe invoice footers and
 * Checkout consent links are hard-wired to this exact path. Do NOT rename,
 * redirect, gate, or move this route.
 *
 * Server component on purpose: static legal copy, no interactivity, lets
 * Next prerender at build time so Stripe and crawlers get a fast 200.
 */

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "VDT Sites Terms of Service. The terms that govern web design, hosting, and related services provided by VDT Sites in British Columbia, Canada.",
  alternates: { canonical: "/terms-of-service" },
  openGraph: {
    title: "Terms of Service - Van Duist & Treitel",
    description:
      "The terms that govern services provided by VDT Sites.",
    url: "/terms-of-service",
  },
  twitter: {
    title: "Terms of Service - Van Duist & Treitel",
    description:
      "The terms that govern services provided by VDT Sites.",
  },
};

export default function TermsOfServicePage() {
  return (
    <article className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-6 pt-36 pb-24 text-[#1d1d1f]">
        <header className="mb-12 pb-10 border-b border-black/[0.08]">
          <p className="text-xs uppercase tracking-[0.22em] text-[#999] font-medium mb-4">
            Legal
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-tight">
            VDT Sites Terms of Service
          </h1>
          <p className="mt-6 text-sm text-[#6e6e73]">
            Last Updated: May 13, 2026
          </p>
        </header>

        <div className="space-y-6 text-[16px] leading-[1.75] text-[#3a3a3c]">
          <p>
            These Terms of Service govern the services provided by VDT Sites, a partnership operating in British Columbia, Canada. By requesting services, accepting a proposal, paying an invoice, using a website, app, hosting service, or other deliverable provided by VDT Sites, the client agrees to these Terms unless a separate written agreement signed or accepted by VDT Sites states otherwise.
          </p>
          <p>
            These Terms are intended to apply broadly to all services offered by VDT Sites, including websites, web applications, mobile applications, hosting, maintenance, integrations, email-related tools, payment setup, design, development, and related services. Not every section will apply to every client or project.
          </p>
          <p>
            For questions or notices, contact VDT Sites at{" "}
            <a
              href="mailto:vdtsites@gmail.com"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              vdtsites@gmail.com
            </a>
            .
          </p>
        </div>

        <Section title="1. Definitions">
          <p>In these Terms:</p>
          <p>
            &ldquo;VDT Sites,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo; means VDT Sites and its partners, operators, contractors, and representatives.
          </p>
          <p>
            &ldquo;Client,&rdquo; &ldquo;you,&rdquo; or &ldquo;your&rdquo; means the person, business, organization, or representative who requests, purchases, uses, or pays for services from VDT Sites.
          </p>
          <p>
            &ldquo;Services&rdquo; means any services provided by VDT Sites, including but not limited to website design, website development, web applications, iOS applications, Android applications, hybrid applications, hosting, maintenance, support, backups, recovery support, search engine optimization services, domain setup, email setup, payment setup, forms, booking systems, ecommerce setup, integrations, updates, consulting, and related digital services.
          </p>
          <p>
            &ldquo;Deliverables&rdquo; means websites, apps, code, designs, pages, files, assets, configurations, documentation, or other materials created or provided by VDT Sites for a client.
          </p>
          <p>
            &ldquo;Third-Party Services&rdquo; means services, software, platforms, plugins, APIs, hosting providers, app stores, payment processors, domain registrars, email providers, analytics tools, AI tools, content delivery networks, and other external products or providers used in connection with the Services.
          </p>
        </Section>

        <Section title="2. Scope of Services">
          <p>
            VDT Sites provides custom digital services that may include website design, website development, hosting, maintenance, web applications, mobile applications, payment setup, domain setup, email setup, forms, booking systems, ecommerce functionality, SEO-related work, third-party integrations, and other related services.
          </p>
          <p>
            Each project is individually discussed with the client. The exact scope, pricing, timeline, features, and included services may vary by client and will generally be described in a proposal, invoice, written message, project discussion, or other written communication.
          </p>
          <p>
            VDT Sites may create websites and web applications from scratch. Mobile applications may be built as hybrid applications using web technology, including Capacitor or similar tools, where the website or web application is packaged into an iOS or Android app experience.
          </p>
          <p>
            Unless specifically agreed in writing, VDT Sites is not responsible for services outside the agreed project scope.
          </p>
        </Section>

        <Section title="3. Acceptance of Terms">
          <p>You accept these Terms when you do any of the following:</p>
          <ul className="list-disc pl-6 space-y-2 marker:text-[#999]">
            <li>Request work from VDT Sites.</li>
            <li>Approve a proposal, estimate, invoice, design, feature, website, app, or project plan.</li>
            <li>Pay an invoice or subscription fee.</li>
            <li>Use, access, or continue using a website, app, hosting service, or other deliverable provided by VDT Sites.</li>
            <li>Ask VDT Sites to publish, launch, update, maintain, or host a website, app, or digital service.</li>
          </ul>
          <p>
            If a separate written agreement exists between the client and VDT Sites, that agreement will control where it directly conflicts with these Terms.
          </p>
        </Section>

        <Section title="4. Client Authority">
          <p>
            The client confirms that they have authority to act on behalf of the business, organization, or person requesting the Services. The client is responsible for ensuring that any representative communicating with VDT Sites has authority to approve work, provide content, request changes, and make decisions.
          </p>
          <p>
            VDT Sites may rely on instructions, approvals, and materials provided by the client or the client&rsquo;s representatives.
          </p>
        </Section>

        <Section title="5. Proposals, Pricing, and Changes">
          <p>
            Pricing is discussed individually with each client and may include one-time fees, monthly fees, annual fees, subscription fees, project fees, hourly fees, or a combination of these.
          </p>
          <p>
            VDT Sites may offer different pricing structures depending on the project, client needs, services included, hosting requirements, integrations, complexity, timeline, and ongoing support needs.
          </p>
          <p>
            Unless stated otherwise, proposals, estimates, and quotes are based on the scope discussed at the time they are prepared. If the client requests new features, new pages, major design changes, new integrations, emergency fixes, additional SEO writing, copywriting, expanded functionality, or other work outside the agreed scope, VDT Sites may charge additional fees.
          </p>
          <p>
            Major changes in scope may require a new quote, updated invoice, or separate written agreement.
          </p>
        </Section>

        <Section title="6. Payment Terms">
          <p>
            VDT Sites accepts payment through Stripe invoicing or Stripe checkout. For one-time fees, VDT Sites may also accept Interac e-Transfer. VDT Sites does not accept cash unless expressly agreed otherwise in writing.
          </p>
          <p>
            Payment terms, due dates, amounts, and billing frequency will be stated on the invoice, subscription, proposal, or other written communication.
          </p>
          <p>
            Monthly subscriptions are billed on the subscription start date and then on the same recurring billing date each month, unless otherwise agreed. Annual subscriptions are billed on the subscription start date and then on the annual renewal date each year, unless otherwise agreed.
          </p>
          <p>
            The client is responsible for ensuring that payment information is accurate and that payments are made on time.
          </p>
        </Section>

        <Section title="7. Deposits">
          <p>
            VDT Sites generally does not require deposits before starting work unless otherwise discussed and agreed with the client.
          </p>
          <p>
            If a deposit is agreed, the deposit is non-refundable unless VDT Sites states otherwise in writing. Deposits compensate VDT Sites for reserving time, planning, initial work, administrative effort, and opportunity cost.
          </p>
        </Section>

        <Section title="8. Late Payments, Suspension, and Non-Payment">
          <p>
            If a client does not pay an invoice or subscription fee when due, VDT Sites may contact the client to resolve the issue.
          </p>
          <p>
            VDT Sites will generally provide a warning and a grace period of approximately seven days before suspending hosting services, unless the situation involves fraud, abuse, security risk, chargebacks, repeated non-payment, violation of these Terms, or another urgent issue.
          </p>
          <p>
            If payment remains unpaid after the grace period, VDT Sites may suspend hosting, maintenance, support, app services, integrations, forms, email tools, access, updates, or other services until payment is received.
          </p>
          <p>
            VDT Sites has the right to take a website or app offline, disable hosting, pause support, or stop ongoing services if hosting fees, subscription fees, project fees, renewal fees, third-party fees, or other amounts owed are not paid.
          </p>
          <p>
            Suspension for non-payment does not cancel amounts already owed. The client remains responsible for unpaid invoices, subscription fees, third-party fees, taxes, chargebacks, and other amounts due.
          </p>
        </Section>

        <Section title="9. Price Changes">
          <p>
            VDT Sites may change pricing for hosting, subscriptions, maintenance, support, or other ongoing services if costs increase or if service requirements change. Reasons may include increased hosting costs, software costs, platform costs, domain costs, app store costs, security costs, third-party provider changes, exchange rates, infrastructure needs, or increased support requirements.
          </p>
          <p>
            VDT Sites will provide at least 14 days&rsquo; notice before changing ongoing pricing, unless the change is caused by an urgent third-party provider change, legal requirement, security issue, or other circumstance outside VDT Sites&rsquo; reasonable control.
          </p>
          <p>
            If the client does not agree to the new price, the client may cancel the affected ongoing service before the new price takes effect. Cancellation does not remove responsibility for fees already owed.
          </p>
        </Section>

        <Section title="10. Cancellation of Ongoing Services">
          <p>
            Clients may cancel monthly or annual subscriptions unless a separate written agreement states otherwise.
          </p>
          <p>
            If a client cancels a subscription, the service will generally remain active until the end of the current paid billing period. No refund is provided for unused time in a billing period unless VDT Sites agrees otherwise in writing.
          </p>
          <p>
            After cancellation, VDT Sites may stop hosting, maintaining, supporting, updating, backing up, monitoring, or operating the client&rsquo;s website, app, or related services.
          </p>
          <p>
            The client remains responsible for any unpaid fees, third-party costs, overages, chargebacks, renewal fees, or work completed before cancellation.
          </p>
        </Section>

        <Section title="11. Refunds">
          <p>
            Unless VDT Sites agrees otherwise in writing, payments are non-refundable once work has started, services have been provided, third-party costs have been incurred, a subscription period has begun, or a deliverable has been made available to the client.
          </p>
          <p>
            VDT Sites does not guarantee that a website, app, SEO work, email campaign, advertisement, integration, or digital service will produce a specific financial result, number of leads, search ranking, sales volume, traffic level, customer response, or business outcome. Lack of expected business results is not grounds for a refund.
          </p>
        </Section>

        <Section title="12. Client Delays and Abandoned Projects">
          <p>
            The client is responsible for providing required content, images, logos, brand assets, business information, approvals, feedback, account access, and other materials needed to complete the project.
          </p>
          <p>
            If the client delays providing materials, feedback, approvals, or access, VDT Sites may extend timelines, pause the project, revise pricing, or reschedule work.
          </p>
          <p>
            If the client becomes unresponsive for a significant period, VDT Sites may treat the project as paused or abandoned. Amounts already paid are not refundable, and VDT Sites may require additional payment to restart the project, update outdated work, or complete remaining tasks.
          </p>
        </Section>

        <Section title="13. Revisions, Bug Fixes, and Extra Work">
          <p>
            VDT Sites will make reasonable efforts to get the client&rsquo;s website, app, or deliverable up and running and to fix bugs related to the agreed scope.
          </p>
          <p>
            Unless otherwise agreed in writing, included revisions and fixes do not include full new features, major redesigns, new pages, substantial layout changes, new integrations, SEO writing, copywriting, emergency fixes, platform migrations, large content changes, or work outside the original scope.
          </p>
          <p>
            Extra work may be billed hourly, by fixed quote, or through an updated subscription or maintenance plan. The rate and scope may be discussed with the client before additional work begins, unless urgent action is required to protect the website, app, data, hosting environment, account security, or service availability.
          </p>
        </Section>

        <Section title="14. Maintenance and Hosting Plans">
          <p>
            Ongoing plans may include hosting, backups, recovery support, and basic hosting-related services. The exact maintenance services included depend on what was agreed with the client.
          </p>
          <p>
            Unless specifically included in the client&rsquo;s plan, maintenance does not include full redesigns, new features, new pages, SEO campaigns, SEO writing, major copywriting, new integrations, ecommerce setup, emergency after-hours support, app store submissions, app store policy updates, major troubleshooting, custom development, or work outside the agreed plan.
          </p>
          <p>
            Monthly update requests, support limits, turnaround times, and included maintenance work are discussed individually with each client.
          </p>
        </Section>

        <Section title="15. Website and App Ownership">
          <p>
            Unless otherwise agreed in writing, after the client has paid all amounts owed for the relevant project, the client owns the completed website or app deliverable created specifically for that client.
          </p>
          <p>
            Upon request and after all amounts owed are paid, VDT Sites may provide the client with a website folder or code files for the completed website so the client can host the website elsewhere. VDT Sites may charge a reasonable fee for migration assistance, technical support, custom export work, documentation, troubleshooting, or work beyond providing standard available files.
          </p>
          <p>
            Ownership terms may be discussed and adjusted for each client or project. Some projects may involve licensing, subscriptions, templates, shared systems, third-party platforms, or hosted functionality that cannot be fully transferred in the same way as static code files.
          </p>
          <p>
            VDT Sites retains ownership of its pre-existing materials, reusable code, templates, components, systems, workflows, design methods, development methods, business processes, know-how, internal tools, and general concepts used across projects.
          </p>
          <p>
            The client does not receive ownership of VDT Sites&rsquo; general business methods, reusable systems, internal tools, templates, or materials not created exclusively for the client.
          </p>
        </Section>

        <Section title="16. Website Credit">
          <p>
            VDT Sites may include a reasonable footer credit, badge, or attribution such as &ldquo;Website by VDT Sites&rdquo; on websites or apps it creates.
          </p>
          <p>
            Removal of the VDT Sites credit requires a special request and written approval from VDT Sites. VDT Sites may decline the request or charge an additional fee for removal.
          </p>
          <p>
            The client must not falsely claim that another person or provider created work performed by VDT Sites.
          </p>
        </Section>

        <Section title="17. Portfolio and Marketing Use">
          <p>
            VDT Sites may ask the client for permission before showcasing the client&rsquo;s website, app, logo, screenshots, project description, or related work in the VDT Sites portfolio, website, social media, or marketing materials.
          </p>
          <p>
            VDT Sites will not intentionally present private or confidential client information in portfolio materials without permission.
          </p>
        </Section>

        <Section title="18. Third-Party Assets, Tools, and Services">
          <p>
            VDT Sites may use third-party assets, tools, platforms, services, plugins, APIs, libraries, icons, fonts, stock assets, AI tools, hosting services, domain registrars, analytics services, payment processors, email providers, app stores, development tools, and other external resources when providing Services.
          </p>
          <p>
            The client understands that third-party services may be subject to their own terms, pricing, limitations, downtime, account requirements, data practices, licensing conditions, policy changes, and technical restrictions.
          </p>
          <p>
            VDT Sites is not responsible for outages, price changes, policy changes, errors, limitations, account suspensions, rejected app submissions, downtime, data loss, billing issues, or failures caused by third-party services.
          </p>
          <p>
            If a third-party service changes its pricing, policies, technical requirements, API, availability, or terms, VDT Sites may need to modify, replace, suspend, or discontinue affected functionality. Additional fees may apply.
          </p>
        </Section>

        <Section title="19. Hosting">
          <p>
            VDT Sites primarily hosts websites and related services using Cloudflare and may use other hosting platforms or infrastructure when appropriate.
          </p>
          <p>
            Hosting availability, performance, security, speed, uptime, and reliability may depend on third-party providers, internet infrastructure, domain settings, DNS, client accounts, integrations, traffic, browser behavior, user devices, and other factors outside VDT Sites&rsquo; control.
          </p>
          <p>
            VDT Sites does not guarantee uninterrupted uptime, error-free operation, uninterrupted access, perfect performance, or permanent availability of any website, app, hosting environment, or third-party service.
          </p>
          <p>
            VDT Sites is not responsible for business losses, missed leads, lost revenue, lost profits, reputational harm, customer complaints, search ranking changes, or other damages caused by hosting issues, downtime, outages, DNS issues, third-party failures, maintenance, cyberattacks, or events outside VDT Sites&rsquo; reasonable control.
          </p>
        </Section>

        <Section title="20. Domains">
          <p>
            Clients may provide their own domain or ask VDT Sites to assist with domain registration, setup, DNS configuration, or domain management.
          </p>
          <p>
            If the client provides their own domain, the client remains responsible for domain ownership, renewal, payment, account access, registrar settings, DNS settings, and related issues unless otherwise agreed.
          </p>
          <p>
            If VDT Sites registers a domain on behalf of the client, VDT Sites may add the client&rsquo;s information to the domain purchase or registration where appropriate. Unless otherwise agreed in writing, the client is intended to be the beneficial owner of the domain after the client has paid all related fees.
          </p>
          <p>
            The client is responsible for domain renewal fees, registrar fees, privacy fees, transfer fees, and any third-party costs related to the domain.
          </p>
          <p>
            If domain-related invoices are unpaid, VDT Sites may suspend domain-related services, decline to renew the domain, or stop managing the domain. VDT Sites is not responsible for loss of a domain caused by client non-payment, expired payment information, registrar policies, inaccurate contact information, failure to respond, or third-party registrar issues.
          </p>
        </Section>

        <Section title="21. Mobile Applications">
          <p>
            VDT Sites may create iOS and Android applications, including hybrid applications using Capacitor or similar technologies. These apps may display or connect to a website or web application inside a native app shell.
          </p>
          <p>
            The client understands that app functionality may depend on third-party services, app stores, Apple, Google, device operating systems, browsers, push notification services, permissions, user settings, app review processes, and changing technical requirements.
          </p>
          <p>
            VDT Sites does not guarantee that Apple, Google, or any app store will approve, publish, maintain, rank, feature, or continue allowing an app. App submissions, approvals, review timelines, rejections, policy changes, account requirements, and store availability are outside VDT Sites&rsquo; control.
          </p>
          <p>
            Changes to Apple, Google, app store rules, operating systems, device permissions, notification systems, payment rules, privacy requirements, or technical standards may require updates or additional work. Unless included in an ongoing plan, this work may be billed separately.
          </p>
          <p>
            The client is responsible for the content, business practices, products, services, privacy disclosures, legal policies, customer communications, and compliance obligations related to the app.
          </p>
        </Section>

        <Section title="22. Email, Messaging, and Notifications">
          <p>
            VDT Sites may assist with email setup, contact forms, mass email tools, transactional emails, direct messaging, push notifications, or similar communication features.
          </p>
          <p>
            The client is responsible for ensuring that any emails, text messages, direct messages, push notifications, newsletters, marketing messages, announcements, or other communications comply with applicable laws, platform rules, consent requirements, unsubscribe requirements, privacy obligations, and industry standards.
          </p>
          <p>
            The client must not use any website, app, email tool, messaging feature, or communication system provided by VDT Sites to send spam, misleading messages, unlawful messages, abusive messages, fraudulent messages, or communications without proper consent.
          </p>
          <p>
            VDT Sites may suspend, limit, or disable email, messaging, notification, or communication features if the client&rsquo;s use creates legal risk, deliverability issues, abuse complaints, spam complaints, security risk, provider suspension risk, or reputational harm.
          </p>
          <p>
            VDT Sites does not guarantee email deliverability, inbox placement, open rates, click rates, message delivery, notification delivery, user engagement, or customer response.
          </p>
        </Section>

        <Section title="23. Payments, Stripe, Ecommerce, and Client Revenue">
          <p>
            VDT Sites may assist with Stripe checkout, Stripe invoicing, payment links, ecommerce setup, subscriptions, online payments, or other payment-related functionality.
          </p>
          <p>
            Stripe and other payment processors manage payment processing, funds, chargebacks, payment disputes, payout timing, payment security, customer payment data, and processor rules. VDT Sites does not process, hold, control, guarantee, or insure client revenue or customer funds.
          </p>
          <p>
            The client is responsible for taxes, refunds, chargebacks, payment disputes, product pricing, subscription terms, customer service, receipts, consumer law compliance, tax reporting, accounting, financial reporting, and any legal obligations related to selling products or services.
          </p>
          <p>
            VDT Sites is not responsible for payment processor outages, account holds, chargebacks, failed payments, frozen accounts, payout delays, tax issues, customer disputes, refund disputes, or loss of revenue related to payment processing.
          </p>
        </Section>

        <Section title="24. Client Content and Legal Responsibility">
          <p>
            The client is responsible for all content on the client&rsquo;s website, app, forms, emails, messages, products, services, advertisements, policies, descriptions, images, videos, logos, claims, pricing, business information, and other materials.
          </p>
          <p>
            VDT Sites may assist with design, development, layout, formatting, technical setup, AI-assisted content, or general content placement, but the client remains responsible for reviewing, approving, and verifying all content before and after launch.
          </p>
          <p>
            The client confirms that any content, logos, images, videos, text, product information, business information, trademarks, service marks, customer information, and other materials provided to VDT Sites are accurate and legally usable.
          </p>
          <p>
            The client confirms that they have the necessary rights, licences, permissions, and authority to use any materials they provide to VDT Sites.
          </p>
          <p>
            VDT Sites is not responsible for incorrect information provided by the client, misleading claims, unlawful claims, unauthorized content, intellectual property infringement, privacy violations, regulatory issues, product/service misrepresentations, pricing errors, or other legal issues arising from client content.
          </p>
        </Section>

        <Section title="25. Privacy and Data">
          <p>
            Some websites, apps, forms, booking systems, contact forms, payment tools, analytics tools, email tools, or integrations may collect or process personal information.
          </p>
          <p>
            The client is responsible for determining what personal information they collect, why they collect it, how they use it, how they store it, how they disclose it, and what legal policies or privacy notices are required.
          </p>
          <p>
            Unless otherwise agreed in writing, VDT Sites is not responsible for creating legally complete privacy policies, terms and conditions, cookie notices, consent flows, data protection procedures, or compliance programs for the client.
          </p>
          <p>
            The client is responsible for compliance with applicable privacy laws, consumer protection laws, email marketing laws, industry rules, platform rules, and any legal obligations that apply to the client&rsquo;s business.
          </p>
          <p>
            VDT Sites may access, process, store, or transmit client data only as reasonably needed to provide the Services, troubleshoot issues, maintain hosting, configure systems, support integrations, or perform agreed work.
          </p>
          <p>
            The client must not provide VDT Sites with sensitive, unnecessary, excessive, or unlawful personal information unless it is required for the Services and appropriate safeguards have been discussed.
          </p>
        </Section>

        <Section title="26. Security">
          <p>
            VDT Sites will make reasonable efforts to provide secure and reliable services within the agreed scope. However, no website, app, hosting system, account, plugin, integration, or online service can be guaranteed to be completely secure.
          </p>
          <p>
            The client is responsible for maintaining secure passwords, protecting account access, enabling appropriate security settings, limiting access to authorized users, monitoring suspicious activity, and following security recommendations.
          </p>
          <p>
            VDT Sites is not responsible for hacks, unauthorized access, data loss, malware, account compromise, phishing, credential theft, weak passwords, client misuse, third-party vulnerabilities, plugin vulnerabilities, platform vulnerabilities, or security incidents outside VDT Sites&rsquo; reasonable control.
          </p>
          <p>
            If urgent security work is required, VDT Sites may take reasonable action to protect the website, app, hosting environment, systems, users, or third-party services. Additional fees may apply unless the work is included in the client&rsquo;s plan.
          </p>
        </Section>

        <Section title="27. Backups and Recovery">
          <p>
            Basic hosting services may include backups and recovery support where agreed. Backup availability, frequency, retention, and restoration options may depend on the hosting setup, third-party platforms, technical configuration, and the client&rsquo;s plan.
          </p>
          <p>
            VDT Sites does not guarantee that every version, file, database entry, message, form submission, order, customer record, or change can be recovered.
          </p>
          <p>
            The client is encouraged to keep independent copies of important content, records, customer information, media, business data, and files.
          </p>
          <p>
            VDT Sites is not responsible for data loss, lost form submissions, lost customer records, lost sales, lost content, lost files, or inability to restore data unless caused directly by VDT Sites&rsquo; proven gross negligence or intentional misconduct.
          </p>
        </Section>

        <Section title="28. SEO, Performance, and Results">
          <p>
            VDT Sites may provide SEO-related services, basic search optimization, technical optimization, page structure, meta information, content suggestions, speed improvements, analytics setup, or related services.
          </p>
          <p>
            VDT Sites does not guarantee search rankings, traffic levels, sales, leads, conversions, revenue, customer growth, social media engagement, ad performance, Google indexing, map rankings, or business results.
          </p>
          <p>
            Search engines, social platforms, ad platforms, browsers, algorithms, competitors, market conditions, reviews, customer behaviour, and third-party systems are outside VDT Sites&rsquo; control.
          </p>
        </Section>

        <Section title="29. Prohibited Uses and Refusal of Service">
          <p>
            VDT Sites may refuse, suspend, or terminate services if the client&rsquo;s website, app, business, content, conduct, or requested work involves or promotes illegal content, scams, fraud, misleading medical claims, misleading financial claims, hate, harassment, abusive content, intellectual property infringement, malware, spam, deceptive practices, unlawful products or services, reputational harm, or content VDT Sites reasonably considers unethical, unsafe, unlawful, or harmful.
          </p>
          <p>
            VDT Sites may also refuse, suspend, or terminate service if continuing the relationship may harm VDT Sites&rsquo; reputation, create legal risk, violate third-party platform rules, create security risk, or conflict with VDT Sites&rsquo; values or business interests.
          </p>
        </Section>

        <Section title="30. Confidentiality">
          <p>
            VDT Sites will make reasonable efforts to keep confidential client information private and use it only for providing Services, managing the client relationship, fulfilling legal obligations, or protecting VDT Sites&rsquo; rights.
          </p>
          <p>
            The client must not disclose VDT Sites&rsquo; private business processes, pricing methods, internal documents, non-public systems, credentials, code not owned by the client, or confidential communications without written permission.
          </p>
          <p>
            Confidentiality does not apply to information that is publicly available, independently developed, lawfully received from another source, already known without restriction, or required to be disclosed by law.
          </p>
        </Section>

        <Section title="31. Approvals and Launch">
          <p>
            The client is responsible for reviewing and approving websites, apps, designs, content, functionality, pricing, policies, forms, links, integrations, and other deliverables before launch.
          </p>
          <p>
            Once the client approves launch, requests publication, uses the deliverable, or allows the deliverable to remain live, the client is deemed to have accepted the deliverable, subject to reasonable bug fixes within the agreed scope.
          </p>
          <p>
            VDT Sites is not responsible for errors, omissions, incorrect content, broken links, missing information, or other issues that the client approved, provided, failed to review, or failed to identify before or after launch.
          </p>
        </Section>

        <Section title="32. Communications and Notices">
          <p>
            VDT Sites may communicate with clients by email, phone, text message, social media, direct message, video call, project tools, or other practical communication methods.
          </p>
          <p>
            For official notices, legal notices, cancellation notices, payment notices, dispute notices, or other important notices, email is the preferred and official method of communication unless otherwise agreed in writing.
          </p>
          <p>
            Notices to VDT Sites should be sent to{" "}
            <a
              href="mailto:vdtsites@gmail.com"
              className="text-[#1d1d1f] underline underline-offset-2 hover:text-black"
            >
              vdtsites@gmail.com
            </a>
            .
          </p>
          <p>
            The client is responsible for keeping contact information current and monitoring communications from VDT Sites.
          </p>
        </Section>

        <Section title="33. Timelines">
          <p>
            Project timelines, launch dates, delivery estimates, review periods, and completion dates are estimates unless VDT Sites expressly agrees to a fixed deadline in writing.
          </p>
          <p>
            Timelines may change due to client delays, late content, late feedback, scope changes, third-party issues, technical issues, app store review, payment delays, illness, emergencies, provider outages, legal requirements, or other circumstances outside VDT Sites&rsquo; reasonable control.
          </p>
          <p>
            VDT Sites is not responsible for losses caused by delayed timelines unless VDT Sites has expressly agreed to a fixed deadline in writing and the delay was caused solely by VDT Sites&rsquo; proven gross negligence or intentional misconduct.
          </p>
        </Section>

        <Section title="34. Artificial Intelligence and Automation">
          <p>
            VDT Sites may use AI-assisted tools, automation, code assistants, design tools, image tools, writing tools, development tools, or similar technologies to help provide Services.
          </p>
          <p>
            The client is responsible for reviewing, approving, verifying, and accepting all content, text, images, code, design, claims, policies, product descriptions, service descriptions, and other materials before use or publication.
          </p>
          <p>
            VDT Sites does not guarantee that AI-assisted materials are error-free, original, legally compliant, non-infringing, suitable for every use, or free from inaccuracies.
          </p>
          <p>
            The client remains responsible for all final website and app content, even if VDT Sites helped create, format, or place that content.
          </p>
        </Section>

        <Section title="35. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, VDT Sites is not liable for indirect, incidental, special, consequential, exemplary, punitive, or economic damages, including lost profits, lost revenue, lost sales, lost leads, lost customers, lost data, business interruption, downtime, reputational harm, search ranking changes, missed opportunities, payment issues, third-party failures, or customer disputes.
          </p>
          <p>
            To the fullest extent permitted by law, VDT Sites&rsquo; total liability for any claim related to the Services is limited to the amount the client paid to VDT Sites for the affected service during the one month immediately before the event giving rise to the claim.
          </p>
          <p>
            This limitation applies whether the claim is based in contract, tort, negligence, strict liability, statute, equity, or any other legal theory, even if VDT Sites was advised of the possibility of damages.
          </p>
          <p>
            Nothing in these Terms limits liability that cannot legally be limited under applicable law.
          </p>
        </Section>

        <Section title="36. Indemnification">
          <p>
            The client agrees to defend, indemnify, and hold harmless VDT Sites and its partners, operators, contractors, and representatives from any claims, losses, damages, liabilities, costs, fees, expenses, or demands arising from or related to:
          </p>
          <ul className="list-disc pl-6 space-y-2 marker:text-[#999]">
            <li>Client content, materials, claims, products, services, pricing, or business practices.</li>
            <li>The client&rsquo;s use of the website, app, hosting, email tools, payment tools, integrations, or Services.</li>
            <li>The client&rsquo;s violation of laws, regulations, platform rules, third-party terms, privacy obligations, email marketing rules, consumer protection obligations, or these Terms.</li>
            <li>Intellectual property claims involving materials supplied or approved by the client.</li>
            <li>Privacy, data, customer, refund, tax, chargeback, payment, or consumer disputes involving the client&rsquo;s business.</li>
            <li>Spam, misleading messages, unauthorized communications, or improper use of email, SMS, direct messaging, or push notification systems.</li>
            <li>Security incidents caused by client accounts, passwords, users, systems, or third-party services outside VDT Sites&rsquo; reasonable control.</li>
          </ul>
        </Section>

        <Section title="37. No Legal, Tax, Financial, or Professional Advice">
          <p>
            VDT Sites provides design, development, hosting, app, and digital services. VDT Sites does not provide legal, tax, accounting, financial, medical, regulatory, insurance, or professional compliance advice.
          </p>
          <p>
            Any policies, notices, website text, business descriptions, disclaimers, terms, privacy language, or other materials prepared or suggested by VDT Sites are provided for general drafting or website purposes only and must be reviewed by the client and, where appropriate, a qualified professional.
          </p>
          <p>
            The client is responsible for obtaining legal, tax, accounting, regulatory, or professional advice for their own business.
          </p>
        </Section>

        <Section title="38. Force Majeure">
          <p>
            VDT Sites is not responsible for delays, failures, downtime, data loss, or inability to perform caused by events outside its reasonable control, including internet outages, third-party provider outages, Cloudflare issues, Stripe issues, app store issues, domain registrar issues, cyberattacks, malware, natural disasters, illness, emergencies, labour disruptions, power outages, government actions, legal changes, war, civil unrest, supply issues, or other events beyond VDT Sites&rsquo; reasonable control.
          </p>
        </Section>

        <Section title="39. Termination">
          <p>
            VDT Sites may terminate or suspend Services if the client fails to pay, breaches these Terms, creates legal risk, creates security risk, misuses the Services, harms VDT Sites&rsquo; reputation, violates third-party rules, requests unlawful work, becomes abusive, or otherwise makes the relationship impractical or unsafe to continue.
          </p>
          <p>
            Upon termination, VDT Sites may stop providing hosting, support, maintenance, updates, app services, integrations, email tools, payment tools, domain management, or other ongoing services.
          </p>
          <p>
            Termination does not remove the client&rsquo;s responsibility to pay amounts owed or comply with ownership, confidentiality, limitation of liability, indemnification, and other provisions that should reasonably survive termination.
          </p>
        </Section>

        <Section title="40. Governing Law and Disputes">
          <p>
            These Terms are governed by the laws of British Columbia and the applicable laws of Canada.
          </p>
          <p>
            The parties agree to first try to resolve disputes in good faith through direct communication.
          </p>
          <p>
            If a dispute cannot be resolved informally, the dispute will be handled through the courts or tribunals with jurisdiction in British Columbia, unless applicable law requires otherwise.
          </p>
        </Section>

        <Section title="41. Changes to These Terms">
          <p>
            VDT Sites may update these Terms from time to time. Updated Terms may be posted on the VDT Sites website, sent by email, included with invoices, or otherwise made available to clients.
          </p>
          <p>
            Continued use of VDT Sites&rsquo; Services after updated Terms are provided or posted means the client accepts the updated Terms, unless a separate written agreement states otherwise.
          </p>
          <p>
            Material changes to ongoing subscriptions or hosting terms will generally be communicated with reasonable notice where practical.
          </p>
        </Section>

        <Section title="42. Entire Agreement">
          <p>
            These Terms, together with any applicable proposal, invoice, written scope, subscription terms, or written agreement between the client and VDT Sites, form the agreement between the parties.
          </p>
          <p>
            If any part of these Terms is found unenforceable, the remaining parts will continue to apply.
          </p>
          <p>
            Failure by VDT Sites to enforce any part of these Terms does not waive VDT Sites&rsquo; right to enforce that part later.
          </p>
        </Section>

        <Section title="43. Contact">
          <p>
            For questions, notices, cancellations, support requests, or legal communications, contact:
          </p>
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
