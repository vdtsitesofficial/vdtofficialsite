import { createContentRoute } from "vdt-site-kit/routes";
import { defaultContent } from "@/lib/content";
import { isAdmin } from "@/lib/admin-check";

// force-dynamic is correct on an API route file. The rule against it (and
// against reading cookies) applies to public layouts and pages, which is what
// keeps them cacheable.
export const dynamic = "force-dynamic";

/**
 * GET    admin-only read of the whole content document (no-store)
 * GET ?history=1  the save-history list
 * PUT    save
 * PATCH  restore a history entry
 *
 * `isAdmin` is this site's emailed-code session, not the kit's password gate.
 * PATCH must stay exported or History/Restore in the AdminBar silently 405s.
 */
export const { GET, PUT, PATCH } = createContentRoute({ defaultContent, isAdmin });
