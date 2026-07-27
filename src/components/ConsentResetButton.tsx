"use client";

import { useState } from "react";
import { resetConsent } from "@/lib/consent";

/**
 * "Change your cookie choice" button for the Cookie Policy page.
 *
 * The policy page itself is a server component (it exports metadata), so this
 * lives in its own client component rather than making the whole page client.
 */
export default function ConsentResetButton() {
  const [done, setDone] = useState(false);

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => {
          resetConsent();
          setDone(true);
        }}
        className="rounded-lg border border-black/15 bg-white px-4 py-2.5 text-[15px] font-medium text-[#1d1d1f] transition-colors hover:border-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626]"
      >
        Change your cookie choice
      </button>
      {done && (
        <p className="mt-3 text-[14px] text-[#6e6e73]" role="status">
          Cleared. The consent banner will appear again &mdash; scroll down if you don&rsquo;t see it.
        </p>
      )}
    </div>
  );
}
