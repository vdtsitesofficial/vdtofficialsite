// Cookie-consent state for analytics.
//
// Deliberate choice: we do NOT load Google Analytics at all until the visitor
// accepts. The alternative (load gtag with Consent Mode defaulting to denied)
// still sends cookieless pings to Google on every visit, which would make the
// Privacy Policy's "we don't share your browsing with anyone unless you agree"
// harder to state honestly. Nothing leaves the browser until consent is given.
//
// Trade-off Sem should know about: analytics only ever counts visitors who
// accepted, so real traffic is higher than reported. Use it for TRENDS, not
// absolute numbers.

export type ConsentValue = "granted" | "denied";

export const CONSENT_KEY = "vdt-cookie-consent";
/** Fired on the window whenever the stored choice changes. */
export const CONSENT_EVENT = "vdt-consent-change";
/** Fired to re-open the banner so a visitor can change their mind. */
export const CONSENT_REOPEN_EVENT = "vdt-consent-reopen";

/** Returns the stored choice, or null if the visitor hasn't chosen yet. */
export function readConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    // localStorage can throw in private mode / when storage is blocked.
    // Treat that as "no consent recorded" rather than crashing the page.
    return null;
  }
}

export function writeConsent(value: ConsentValue): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* ignore — the in-memory event below still updates this page session */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

/** Clears the choice and re-shows the banner. Used by the "change your choice"
 *  button on the Cookie Policy page. */
export function resetConsent(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
  window.dispatchEvent(new Event(CONSENT_REOPEN_EVENT));
}
