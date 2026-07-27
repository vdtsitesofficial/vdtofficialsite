// GA4 measurement ID for vdtsites.com. Empty string disables all analytics
// (the <Analytics /> component and event helpers become no-ops), so dev and
// preview builds don't pollute production data unless this is set.
export const GA_MEASUREMENT_ID = "G-NWRY7LS38E";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
