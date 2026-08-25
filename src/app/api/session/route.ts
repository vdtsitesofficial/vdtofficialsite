import { createSessionRoute } from "vdt-site-kit/routes";
import { isAdmin } from "@/lib/admin-check";

export const dynamic = "force-dynamic";

/**
 * The session probe. EditorRoot calls this once, and only when the readable
 * hint cookie is present, so ordinary visitors make no request at all and
 * public pages never read a cookie at render time.
 */
export const { GET } = createSessionRoute({ isAdmin });
