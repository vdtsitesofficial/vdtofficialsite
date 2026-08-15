/* =============================================================
 * VDT Contact Card — scoped interactions for laptop-zoom-v2
 *
 * Adapted from C:/Websites/VDT/vdtsites-card/script.js. All
 * selectors are scoped to `.vdt-contact-card` so we never animate
 * an element from another section by accident.
 *
 * Requires GSAP (loaded via CDN <script> in index.html).
 * ============================================================= */
(function () {
  const root = document.querySelector(".vdt-contact-card");
  if (!root) return;

  const q  = (sel) => root.querySelectorAll(sel);
  const q1 = (sel) => root.querySelector(sel);

  // GSAP powers the decorative animation ONLY. Everything functional below
  // (mode toggle, form submit → /api/contact, click-to-copy) must keep
  // working when the CDN script is blocked or fails to load — a missing
  // animation library must never cost a lead. Before 2026-08-15 this whole
  // file bailed out when gsap was undefined, which left the form's submit
  // handler unbound and silently ate a real enquiry.
  const hasGsap = typeof gsap !== "undefined";

  if (hasGsap) {

  /* ENTRY — gate behind IntersectionObserver so animations don't
     fire until the user scrolls into the section. */
  function runEntry() {
    gsap.from(q(".cc-card"), {
      y: 60, opacity: 0, duration: 1.2, ease: "power4.out", stagger: 0.15,
    });
    gsap.from(q(".cc-name span"), {
      y: 40, opacity: 0, stagger: 0.12, delay: 0.35, duration: 1, ease: "power4.out",
    });
    gsap.from(q(".cc-role, .cc-divider"), {
      y: 20, opacity: 0, stagger: 0.08, delay: 0.7, duration: 0.9, ease: "power3.out",
    });
    gsap.from(q(".cc-item, .cc-field, .cc-send-btn"), {
      y: 20, opacity: 0, stagger: 0.10, delay: 0.9, duration: 0.9, ease: "power3.out",
    });
    gsap.to(q(".cc-icon"), {
      strokeDashoffset: 0, duration: 1.2, stagger: 0.18, delay: 1.0, ease: "power2.out",
    });
  }

  // Lazy-fire when scrolled into view. For reduced-motion users, skip the
  // entrance animation entirely — the elements are already in their natural
  // (visible) end-state, so they simply appear with no movement.
  const reducedMotionEntry =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotionEntry) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            runEntry();
            io.disconnect();
          }
        });
      }, { threshold: 0.15 });
      io.observe(root);
    } else {
      runEntry();
    }
  }

  /* WATERMARK DRIFT + COLOUR SPLASH FLOAT (continuous, desktop only).
     These repeat:-1 tweens keep GSAP's rAF ticker awake for the whole session.
     Skip on phones and for reduced-motion users, and pause them whenever the
     contact section is off screen so GSAP's ticker can idle (no perpetual
     rAF / per-frame cost while the user is up the page). */
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (window.innerWidth > 720 && !prefersReducedMotion) {
    const driftA = gsap.to(q(".cc-watermark"), {
      y: -20, x: 10, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut",
    });
    const driftB = gsap.to(q(".cc-color-splash"), {
      x: 20, y: 20, scale: 1.12, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut",
    });
    if ("IntersectionObserver" in window) {
      const driftIO = new IntersectionObserver((entries) => {
        const vis = entries.some((e) => e.isIntersecting);
        if (vis) { driftA.play(); driftB.play(); }
        else     { driftA.pause(); driftB.pause(); }
      }, { threshold: 0.01 });
      driftIO.observe(root);
    }
  }

  } // end if (hasGsap) — everything below runs with or without GSAP

  /* Card magnetic hover (mousemove tilt/translate) removed 2026-08-03 —
     Sem found the cards moving under the cursor annoying. */

  /* MODE TOGGLE — "Send a message" vs "Schedule a call". Only the
     /contact and landing-page cards render .cc-mode; the homepage's
     inlined card doesn't, so everything in this block is skipped there.
     Progressive enhancement: without JS the call fields stay hidden and
     the form is the plain message form. */
  const form = q1(".cc-form");
  const modeWrap = q1(".cc-mode");
  if (form && modeWrap) {
    const callFields = q1(".cc-call-fields");
    const phoneInput = form.elements.phone;
    const msgInput   = form.elements.message;
    const dateInput  = form.elements.callDate;
    const timeInput  = form.elements.callTime;
    const phoneLabel = q1('label[for="cc-phone-input"]');
    const msgLabel   = q1('label[for="cc-msg-input"]');
    const roleEl     = q1(".cc-form-card .cc-role");
    const sendLabel  = form.querySelector(".cc-send-label");

    // Bookable range: today through 60 days out, local time.
    if (dateInput) {
      const iso = (d) =>
        d.getFullYear() + "-" +
        String(d.getMonth() + 1).padStart(2, "0") + "-" +
        String(d.getDate()).padStart(2, "0");
      const today = new Date();
      const max = new Date();
      max.setDate(max.getDate() + 60);
      dateInput.min = iso(today);
      dateInput.max = iso(max);
    }

    function setMode(mode) {
      const isCall = mode === "call";
      modeWrap.querySelectorAll(".cc-mode-btn").forEach((b) => {
        const active = b.dataset.mode === mode;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-selected", active ? "true" : "false");
      });
      if (callFields) callFields.hidden = !isCall;
      // required attrs must track visibility: a hidden required field makes
      // checkValidity() fail with nothing focusable to show the user.
      if (dateInput) dateInput.required = isCall;
      if (timeInput) timeInput.required = isCall;
      if (phoneInput) phoneInput.required = isCall;
      if (msgInput)  msgInput.required = !isCall;
      if (!isCall) {
        // Leaving call mode: clear the picks so a later "send message"
        // submit isn't misread by the server as a call request.
        if (dateInput) dateInput.value = "";
        if (timeInput) timeInput.value = "";
      }
      if (phoneLabel) phoneLabel.textContent = isCall ? "Phone — we call this number" : "Phone (optional)";
      if (msgLabel)   msgLabel.textContent   = isCall ? "Anything we should know? (optional)" : "Message";
      if (roleEl)     roleEl.textContent     = isCall ? "Pick a time — we'll call you" : "Start a conversation";
      if (sendLabel)  sendLabel.textContent  = isCall ? "Schedule my call" : "Send message";
    }

    modeWrap.addEventListener("click", (e) => {
      const btn = e.target.closest(".cc-mode-btn");
      if (btn && btn.dataset.mode) setMode(btn.dataset.mode);
    });

    // ?book=1 (the Google Business Profile booking link) or #book lands
    // straight in call mode.
    try {
      if (new URLSearchParams(window.location.search).get("book") === "1" ||
          window.location.hash === "#book") {
        setMode("call");
      }
    } catch {}
  }

  /* FORM SUBMIT — posts to /api/contact (Next route handler). */
  if (form) {
    const sendBtn = form.querySelector(".cc-send-btn");
    const label   = sendBtn.querySelector(".cc-send-label");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      // Honeypot — silently drop bot submissions.
      if (form.elements.website && form.elements.website.value) { form.reset(); return; }
      if (!form.checkValidity()) { form.reportValidity(); return; }

      sendBtn.disabled  = true;
      const original    = label.textContent;
      label.textContent = "Sending…";

      const payload = {
        name:    (form.elements.name?.value     || "").trim(),
        email:   (form.elements.email?.value    || "").trim(),
        phone:   (form.elements.phone?.value    || "").trim(),
        message: (form.elements.message?.value  || "").trim(),
        // Present only in call mode (cleared on switch back to message).
        callDate: (form.elements.callDate?.value || "").trim(),
        callTime: (form.elements.callTime?.value || "").trim(),
        website: form.elements.website?.value   || "",
      };
      const isCall = Boolean(payload.callDate && payload.callTime);

      let ok = false;
      try {
        const res = await fetch("/api/contact", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        ok = res.ok && data && data.ok === true;
      } catch {
        ok = false;
      }

      if (ok) {
        sendBtn.classList.add("cc-sent");
        label.textContent = isCall ? "Call booked ✓" : "Message sent ✓";
        form.reset();
        // Conversion pings — only on confirmed delivery, never on attempt.
        // Living inside the ok branch is the point: a click that fails to
        // send is not a lead, and Google Ads must not be told it was, or it
        // optimises the campaign toward broken submissions.
        if (typeof window.gtag === "function") {
          // Google Ads "Contact" conversion. This is the one Performance Max
          // actually bids on. send_to is required — the tag in layout.tsx
          // configures AW-18345910455, and the label after the slash is what
          // maps this ping to the Contact conversion action in the Ads UI.
          window.gtag("event", "conversion", {
            send_to: "AW-18345910455/mizMCKWIot0cELfBgaxE",
          });

          // GA4 events. INERT as of 2026-08-06: GA4 was removed in July 2026
          // and deliberately did not come back with Ads, so nothing consumes
          // these today. Left in place because they cost nothing and are
          // already correct if a GA4 property is ever added. Do not "fix"
          // them by adding a G- tag without updating the legal pages.
          window.gtag("event", "generate_lead", { form_id: "contact_card" });
          if (isCall) {
            window.gtag("event", "book_call", { form_id: "contact_card" });
          }
        }
      } else {
        sendBtn.classList.add("cc-error");
        label.textContent = "Try again";
      }

      setTimeout(() => {
        sendBtn.classList.remove("cc-sent");
        sendBtn.classList.remove("cc-error");
        sendBtn.disabled = false;
        label.textContent = original;
      }, 2400);
    });
  }

  /* Click-to-copy on the info lines. Skip spans inside real links
     (tel: phone, Google-reviews map link) — those should navigate,
     not copy. */
  q(".cc-item span").forEach((el) => {
    if (el.closest("a")) return;
    el.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(el.textContent.trim());
        const original = el.textContent;
        el.textContent = "copied ✓";
        el.style.color = "#ff4d4d";
        setTimeout(() => {
          el.textContent = original;
          el.style.color = "";
        }, 1200);
      } catch {}
    });
  });
})();
