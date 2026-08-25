import { Editable } from "vdt-site-kit";
import { PAGE_COPY } from "@/lib/page-copy";

/**
 * One editable string on a page.
 *
 * Wraps the kit's `Editable` so a call site needs only a page name and a key
 * rather than repeating the full `pages.<page>.<key>` path and the fallback
 * chain every time. With ~25 pages to convert, that repetition is where
 * typos in storage paths would come from, and a mistyped path fails silently:
 * the field just never shows the client's edit.
 *
 * `live` is the loaded copy for this page (`content.pages[page]`), passed down
 * from the page's server component. It already has the code defaults merged
 * under it by the store, so the `PAGE_COPY` fallback below is only a belt for
 * the case where a page forgets to pass `live` at all. Empty renders nothing
 * rather than a key name, so a missing default shows as a gap instead of
 * leaking `pages.about.clientsHeading` onto the live site.
 *
 * NOTE: `Editable` saves plain text. If a client needs to bold a phrase
 * inside a string, that field has to be an `EditableBlock` instead, or the
 * formatting is discarded on save with nothing to blame.
 */
export default function PageText({
  page,
  k,
  as = "span",
  className,
  multiline = false,
  live,
}: {
  page: string;
  k: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  multiline?: boolean;
  /** The stored copy for this page, i.e. `content.pages[page]`. */
  live?: Record<string, string>;
}) {
  return (
    <Editable
      as={as}
      className={className}
      multiline={multiline}
      path={`pages.${page}.${k}`}
      value={live?.[k] ?? PAGE_COPY[page]?.[k] ?? ""}
    />
  );
}
