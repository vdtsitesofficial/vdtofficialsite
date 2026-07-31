"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered reveal. One signature motion, used on below-the-fold
 * sections only.
 *
 * Server-renders VISIBLE and only arms itself once mounted on the client.
 * That ordering is load-bearing: if the initial HTML carried the hidden
 * state, a crawler or a JS failure would leave the page blank. Above-fold
 * content is deliberately not wrapped, so the one-frame arm/reveal never
 * shows as a flicker.
 *
 * Honours prefers-reduced-motion by never arming at all.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    setArmed(true);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const hidden = armed && !shown;

  return (
    <div
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-[700ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
        hidden ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
