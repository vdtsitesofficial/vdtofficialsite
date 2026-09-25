// GA4 for vdtsites.com, re-added 2026-09-24. See TAGGING HISTORY in
// app/layout.tsx for why it was removed in July and why it is back.
//
// It rides on the gtag.js tag the layout already loads for Google Ads: one
// script, two `config` calls. No second tag, no next/script (see the layout
// for why next/script is wrong for tags).
export const GA4_ID = "G-NWRY7LS38E";

/**
 * Inline script: configures GA4 and reports clicks that matter.
 *
 * Runs as a plain <script> in <head>, before hydration, so it works on every
 * route including the lab homepage whose markup comes from public/lab. One
 * delegated listener classifies links by href, so a new phone button or case
 * study card is tracked automatically with no markup change. Do NOT add
 * data-* hooks per button; extend the classifier instead.
 *
 * GA4 is skipped (and every event below goes nowhere) when:
 *  - the host is not vdtsites.com (localhost, *.workers.dev previews),
 *  - the path is /admin,
 *  - the kit's admin hint cookie is present, i.e. this browser is Sem's.
 *    That is why Sem sees nothing in GA4 Realtime from his own browser;
 *    test from a private window.
 *
 * Events (the ones marked * are GA4 key events, set in the GA4 admin):
 *   phone_call_click*   any tel: link              link_text, link_location
 *   email_click*        any mailto: link           link_text, link_location
 *   portfolio_click     /work, /work/<slug>, #portfolio   project, link_location
 *   live_site_click     "Visit the live site" on a case study   project, link_url
 *   cta_click           any link to /contact or #contact      link_text, link_location
 *   map_click           Google Maps / review profile links     link_text, link_location
 *   social_click        Instagram / Facebook / LinkedIn / TikTok   social_network
 *   contact_form_start  first field focused in the contact form   form_id
 *   generate_lead*      contact form delivered   (public/lab/contact-card.js)
 *   book_call*          call booked via the form (public/lab/contact-card.js)
 *
 * page_view, scrolls, outbound clicks and file downloads come from GA4
 * Enhanced Measurement, including Next's client-side route changes (the
 * "page changes based on browser history events" option must stay on).
 *
 * Google signals and ad personalisation are off in code as well as in the
 * GA4 admin, because /privacy-policy and /cookie-policy promise no
 * advertising profile. Change those pages if you change any of this.
 */
export const GA4_SNIPPET = `(function(){
  var h = location.hostname;
  if (h !== 'vdtsites.com' && h !== 'www.vdtsites.com') return;
  if (location.pathname.indexOf('/admin') === 0) return;
  if (/(?:^|;\\s*)vdtsk_admin_hint=/.test(document.cookie)) return;

  gtag('config', '${GA4_ID}', {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  function send(name, params) {
    params.send_to = '${GA4_ID}';
    gtag('event', name, params);
  }
  function text(el) {
    return (el.textContent || el.getAttribute('aria-label') || '').replace(/\\s+/g, ' ').trim().slice(0, 100);
  }
  function where(el) {
    var region = el.closest('header, nav, footer, .vdt-drawer');
    if (region) return region.id || (region.classList.contains('vdt-drawer') ? 'mobile_drawer' : region.tagName.toLowerCase());
    var section = el.closest('section[id], [id]');
    return section ? section.id : 'body';
  }

  document.addEventListener('click', function (e) {
    var link = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!link) return;
    var raw = link.getAttribute('href') || '';
    var base = { link_text: text(link), link_location: where(link) };

    if (raw.indexOf('tel:') === 0) return send('phone_call_click', base);
    if (raw.indexOf('mailto:') === 0) return send('email_click', base);

    var url;
    try { url = new URL(link.href, location.href); } catch (err) { return; }
    var internal = url.hostname === location.hostname;
    var path = url.pathname.replace(/\\/$/, '');

    if (!internal) {
      var social = url.hostname.match(/(instagram|facebook|linkedin|tiktok)\\.com$/);
      if (social) return send('social_click', { social_network: social[1], link_location: base.link_location });
      if (/(^|\\.)maps\\.google\\.|google\\.[a-z.]+\\/maps|[?&]cid=/.test(url.hostname + url.pathname + url.search)) {
        return send('map_click', base);
      }
      var onCase = location.pathname.match(/^\\/work\\/([^/]+)/);
      if (onCase) return send('live_site_click', { project: onCase[1], link_url: url.href });
      return;
    }

    var work = path.match(/^\\/work(?:\\/([^/]+))?$/);
    if (work) return send('portfolio_click', { project: work[1] || 'all', link_text: base.link_text, link_location: base.link_location });
    if (url.hash === '#portfolio') return send('portfolio_click', { project: 'all', link_text: base.link_text, link_location: base.link_location });
    if (path === '/contact' || url.hash === '#contact') return send('cta_click', base);
  }, true);

  var started = false;
  document.addEventListener('focusin', function (e) {
    if (started || !(e.target instanceof Element)) return;
    var form = e.target.closest('form');
    if (!form || (form.getAttribute('action') || '').indexOf('/api/contact') === -1) return;
    started = true;
    send('contact_form_start', { form_id: form.id || 'contact_card', link_location: where(form) });
  });
})();`;
