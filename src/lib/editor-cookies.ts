/**
 * The inline editor's client-readable hint cookie.
 *
 * This name is a CONTRACT WITH vdt-site-kit, which declares it in
 * `src/shared/cookies.ts` as `ADMIN_HINT_COOKIE`. It cannot be imported:
 * the package's `exports` map publishes only ".", "./server" and "./routes",
 * so the deep path does not resolve, and the constant is not re-exported from
 * any of the three. Every kit site therefore hardcodes the literal — Junk
 * Matters does it in two components.
 *
 * Defined once here so this site hardcodes it in exactly one place. If the
 * kit ever renames it, the symptom is silent and specific: sign-in still
 * works, saves still work, but the editor never turns on, because EditorRoot
 * looks for a cookie nobody sets any more.
 */
export const ADMIN_HINT_COOKIE = "vdtsk_admin_hint";
