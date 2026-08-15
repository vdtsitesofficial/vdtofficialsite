/**
 * The VDT contact card — business card + enquiry form, side by side.
 *
 * Extracted from /contact so the landing page can reuse it verbatim rather
 * than becoming a third copy of this markup (the homepage still inlines its
 * own, since it sits inside the lab scroll experience).
 *
 * Behaviour comes from public/lab/contact-card.js: entry animation, magnetic
 * hover, form POST to /api/contact, and the GA4 `generate_lead` event on
 * confirmed delivery. Any page using this MUST load GSAP + contact-card.js
 * and contact-card.css, or it renders unstyled and the form won't submit.
 */
export default function ContactCard({
  paddingTop = 48,
  paddingBottom = 72,
}: {
  paddingTop?: number;
  paddingBottom?: number;
}) {
  return (
    <section
      id="contact"
      className="vdt-contact-card"
      style={{ minHeight: "auto", paddingTop, paddingBottom }}
    >
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="cc-accent-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
      </svg>

      <div className="cc-bg"></div>

      <div className="cards-row">
        <div className="cc-card">
          <div className="cc-color-splash"></div>
          <div className="cc-name">
            <span>VDT</span>
            <span>SITES</span>
          </div>
          <div className="cc-role">Website Designer</div>
          <div className="cc-divider"></div>

          <div className="cc-info">
            <div className="cc-item">
              <svg className="cc-icon" viewBox="0 0 24 24">
                <path d="M4 6h16v12H4z" />
                <path d="M4 6l8 7 8-7" />
              </svg>
              <span>vdtsites@gmail.com</span>
            </div>
            <a className="cc-item cc-item--link" href="tel:+12506162087">
              <svg className="cc-icon" viewBox="0 0 24 24">
                <path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
              </svg>
              <span>250-616-2087</span>
            </a>
            <div className="cc-item">
              <svg className="cc-icon" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.2" />
                <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
              </svg>
              <span>@vdtsites</span>
            </div>
            <a
              className="cc-item cc-item--link"
              href="https://maps.google.com/?cid=10419426377693999665"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="cc-icon" viewBox="0 0 24 24">
                <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.6" />
              </svg>
              <span>Read our Google reviews</span>
            </a>
          </div>

          <div className="cc-watermark cc-watermark--sites">SITES</div>
        </div>

        <div className="cc-card cc-form-card">
          <div className="cc-color-splash"></div>
          <div className="cc-name">
            <span>Contact</span>
            <span>Us</span>
          </div>
          <div className="cc-role">Start a conversation</div>
          <div className="cc-divider"></div>

          {/* Message / call switch. Progressive enhancement: with no JS the
              call fields stay hidden and this is the plain message form.
              Behaviour (mode switching, required toggling, ?book=1 preselect)
              lives in contact-card.js — the homepage's inlined card has no
              .cc-mode, so it skips all of it. */}
          <div className="cc-mode" role="tablist" aria-label="How would you like to get in touch?">
            <button type="button" className="cc-mode-btn is-active" role="tab" aria-selected="true" data-mode="message">
              Send a message
            </button>
            <button type="button" className="cc-mode-btn" role="tab" aria-selected="false" data-mode="call">
              Schedule a call
            </button>
          </div>

          {/* action/method are the no-JS safety net: if contact-card.js never
              runs (blocked CDN, dead hydration, stale HTML), the browser still
              POSTs to /api/contact, which answers native submits with a plain
              confirmation page. With JS alive, the handler preventDefaults and
              fetches as before. Without the action, a dead-JS submit did a GET
              reload that LOOKED successful and sent nothing (lost a real
              enquiry ~2026-08-01). */}
          <form className="cc-form" action="/api/contact" method="POST">
            <div className="cc-field">
              <label htmlFor="cc-name-input">Name</label>
              <input id="cc-name-input" name="name" type="text" required autoComplete="name" />
            </div>
            <div className="cc-field">
              <label htmlFor="cc-email-input">Email</label>
              <input id="cc-email-input" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="cc-field">
              <label htmlFor="cc-phone-input">Phone (optional)</label>
              <input id="cc-phone-input" name="phone" type="tel" autoComplete="tel" />
            </div>

            {/* Call-scheduling fields — hidden until "Schedule a call" is
                picked. Pacific time, matching the phone slots Sem works. */}
            <div className="cc-call-fields" hidden>
              <div className="cc-field">
                <label htmlFor="cc-date-input">Day to call</label>
                <input id="cc-date-input" name="callDate" type="date" />
              </div>
              <div className="cc-field">
                <label htmlFor="cc-time-input">Time window</label>
                <select id="cc-time-input" name="callTime" defaultValue="">
                  <option value="" disabled>
                    Pick a window
                  </option>
                  <option value="morning">Morning · 9 AM – 12 PM</option>
                  <option value="afternoon">Afternoon · 12 – 4 PM</option>
                  <option value="evening">Evening · 4 – 7 PM</option>
                  <option value="anytime">Anytime</option>
                </select>
              </div>
            </div>

            <div className="cc-field">
              <label htmlFor="cc-msg-input">Message</label>
              <textarea id="cc-msg-input" name="message" rows={3} required></textarea>
            </div>

            {/* honeypot */}
            <input
              type="text"
              name="website"
              className="cc-hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <button type="submit" className="cc-send-btn">
              <span className="cc-send-label">Send message</span>
              <svg className="cc-send-arrow" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path
                  d="M5 12 L19 12 M13 6 L19 12 L13 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          <div className="cc-watermark">VDT</div>
        </div>
      </div>
    </section>
  );
}
