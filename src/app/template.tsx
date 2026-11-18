"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// The first page of a visit renders straight away: starting it invisible and blurred
// delayed its largest image (LCP) on phones. Later navigations keep the transition.
let firstPage = true;

/**
 * Route transition: every navigation re-mounts this template, so each page
 * rises in softly while a thin burgundy line sweeps across the top.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  const [initial] = useState(() => firstPage);
  useEffect(() => {
    firstPage = false;
  }, []);
  if (reduced || initial) return <>{children}</>;
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[120] h-[3px] origin-left bg-gradient-to-r from-[#B87A89] via-[#7B1734] to-[#B87A89]"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ scaleX: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.4, delay: 0.6 } }}
      />
      <motion.div initial={{ opacity: 0, y: 18, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </>
  );
}
