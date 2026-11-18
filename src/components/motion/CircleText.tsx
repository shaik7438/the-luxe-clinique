"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Slowly rotating circular text badge — a signature beauty-brand detail. */
export default function CircleText({ text, size = 132, className = "", children }: { text: string; size?: number; className?: string; children?: ReactNode }) {
  const reduced = useReducedMotion();
  const id = `ct-${text.length}-${size}`;
  return (
    <div className={`relative grid place-items-center ${className}`} style={{ width: size, height: size }} aria-hidden>
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        animate={reduced ? undefined : { rotate: 360 }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text fill="currentColor" fontSize="15.5" letterSpacing="5" style={{ textTransform: "uppercase", fontFamily: "var(--font-inter)" }}>
          <textPath href={`#${id}`} textLength={488} lengthAdjust="spacing">{text}</textPath>
        </text>
      </motion.svg>
      {children}
    </div>
  );
}
