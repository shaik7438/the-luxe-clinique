"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const EASE = [0.22, 1, 0.36, 1] as const;

const item: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/** Section-level reveal with staggered children. Children wrapped in <Reveal> participate in the stagger. */
export function AnimatedSection({
  children,
  className,
  as = "section",
  id,
  stagger = 0.09,
  ...aria
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "ul";
  id?: string;
  stagger?: number;
  "aria-labelledby"?: string;
  "aria-label"?: string;
}) {
  const reduced = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      id={id}
      className={className}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
      {...aria}
    >
      {children}
    </Comp>
  );
}

export function Reveal({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" | "p" | "span" }) {
  const Comp = motion[as];
  return (
    <Comp className={className} variants={item}>
      {children}
    </Comp>
  );
}

/** Image/visual mask reveal — a soft inset clip that opens on view. */
export function MaskReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { clipPath: "inset(12% 8% 12% 8% round 28px)", opacity: 0.4 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 28px)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/** Headline split into words that rise in sequence. Text remains a single accessible string. */
export function StaggerHeadline({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
          <motion.span
            className="inline-block"
            initial={reduced ? false : { y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: delay + i * 0.07, ease: EASE }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
