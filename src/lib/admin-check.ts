import { adminGate } from "./admin";

/**
 * The admin predicate handed to every vdt-site-kit route factory.
 *
 * The kit ships its own gate: one shared `ADMIN_PASSWORD` hashed into a
 * cookie. This site already had something better before the editor existed —
 * a one-time code emailed to an allowlisted address, exchanged for an
 * HMAC-signed session — so the kit's own header comment points at exactly
 * this escape hatch ("for per-user accounts / OTP, inject your own isAdmin
 * into the route factories").
 *
 * The practical consequence: **ADMIN_PASSWORD is never set on this Worker.**
 * There is no shared password to leak, and `vdt-site-kit/server`'s `isAdmin`
 * is never called. Sign-in stays the one flow in `lib/admin.ts`, and every
 * content read, save, restore and upload is checked against that session.
 *
 * `adminGate()` fails closed in production when the Workers runtime is absent
 * and returns a dev identity only under `next dev`, so this inherits both
 * behaviours rather than reimplementing them.
 */
export async function isAdmin(): Promise<boolean> {
  return (await adminGate()).ok;
}
