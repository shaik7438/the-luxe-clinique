"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.76, 0, 0.24, 1] as const;

/**
 * First-visit brand intro: the logo mark appears on ivory, then a burgundy
 * curtain lifts to reveal the page. Plays once per session, skipped for
 * reduced motion. Purely decorative — content underneath is fully rendered.
 */
export default function IntroCurtain() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("luxe-intro") === "1";
      sessionStorage.setItem("luxe-intro", "1");
    } catch {}
    if (reduced || seen) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          aria-hidden
          className="fixed inset-0 z-[200] grid place-items-center bg-ivory"
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <motion.div
            className="absolute inset-x-0 bottom-0 h-full origin-bottom bg-gradient-to-b from-[#7B1734] to-[#4D0C20]"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: [0, 0, 1] }}
            transition={{ duration: 1.7, times: [0, 0.55, 1], ease: EASE }}
          />
          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -10], filter: ["blur(8px)", "blur(0px)", "blur(0px)", "blur(6px)"] }}
            transition={{ duration: 1.6, times: [0, 0.3, 0.7, 1] }}
          >
            <Image src="/brand/luxe-clinique-logo.png" alt="" width={720} height={265} priority className="logo-blend h-16 w-auto sm:h-20" />
            <motion.span
              className="mt-5 block h-px bg-burgundy/60"
              initial={{ width: 0 }}
              animate={{ width: 180 }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
