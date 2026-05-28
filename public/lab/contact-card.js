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
  if (typeof gsap === "undefined") return;
  const root = document.querySelector(".vdt-contact-card");
  if (!root) return;

  const q  = (sel) => root.querySelectorAll(sel);
  const q1 = (sel) => root.querySelector(sel);

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

  // Lazy-fire when scrolled into view
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

  /* WATERMARK DRIFT (continuous) */
  gsap.to(q(".cc-watermark"), {
    y: -20, x: 10, duration: 10, repeat: -1, yoyo: true, ease: "sine.inOut",
  });

  /* COLOUR SPLASH FLOAT (continuous) */
  gsap.to(q(".cc-color-splash"), {
    x: 20, y: 20, scale: 1.12, duration: 12, repeat: -1, yoyo: true, ease: "sine.inOut",
  });

  /* CARD MAGNETIC INTERACTION (per-card) */
  q(".cc-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top  - r.height / 2;
      gsap.to(card, {
        x: x * 0.06,
        y: y * 0.06,
        rotateX: -y * 0.025,
        rotateY:  x * 0.025,
        duration: 0.6,
        ease: "power3.out",
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.8, ease: "power4.out",
      });
    });
  });

  /* FORM SUBMIT — posts to /api/contact (Next route handler). */
  const form = q1(".cc-form");
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
        name:    (form.elements.name?.value    || "").trim(),
        email:   (form.elements.email?.value   || "").trim(),
        message: (form.elements.message?.value || "").trim(),
        website: form.elements.website?.value  || "",
      };

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
        label.textContent = "Message sent ✓";
        form.reset();
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

  /* Click-to-copy on the info lines */
  q(".cc-item span").forEach((el) => {
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
