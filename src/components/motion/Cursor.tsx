"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Soft follower ring for fine pointers. The native cursor stays visible
 * (accessibility); the ring grows over links and shows a label over elements
 * marked data-cursor="View" etc.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as Element | null;
      const tagged = t?.closest?.("[data-cursor]") as HTMLElement | null;
      setLabel(tagged?.dataset.cursor ?? null);
      setHover(!!t?.closest?.("a, button, [role='button'], input, select, textarea, label"));
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  if (!enabled) return null;
  const size = label ? 84 : hover ? 44 : 18;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[150] hidden md:block" style={{ x: sx, y: sy }}>
      <motion.div
        className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-[2px] ${
          label ? "border-transparent bg-burgundy/90 text-white" : "border-burgundy/50 bg-burgundy/[0.04]"
        }`}
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {label}
      </motion.div>
    </motion.div>
  );
}
