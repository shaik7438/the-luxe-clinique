"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Inertial smooth scrolling (Lenis). Native scroll position is preserved, so
 * Framer Motion's useScroll, sticky positioning and anchors keep working.
 * Disabled for prefers-reduced-motion and on touch devices (native is better there).
 */
export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || coarse) return;
    const l = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: { offset: -96 }, autoRaf: true });
    lenis.current = l;
    document.documentElement.classList.add("lenis");
    return () => {
      l.destroy();
      lenis.current = null;
      document.documentElement.classList.remove("lenis");
    };
  }, []);

  // Start each new page at the top (unless navigating to a hash).
  useEffect(() => {
    if (!window.location.hash) lenis.current?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
