"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import IllustrativeTag from "@/components/media/IllustrativeTag";

/**
 * Image that reveals with a soft clip-path wipe as it enters, then drifts
 * within its frame on scroll (inner parallax) — the core editorial motion.
 */
export default function ParallaxImage({
  src,
  alt,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  amount = 10,
  illustrative = false,
  tagClassName,
  position = "50% 50%",
  cursor,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Parallax travel in % of the frame height. */
  amount?: number;
  illustrative?: boolean;
  tagClassName?: string;
  position?: string;
  cursor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount}%`, `${amount}%`]);

  return (
    <motion.div
      ref={ref}
      data-cursor={cursor}
      className={`${/\babsolute\b/.test(className) ? "" : "relative "}overflow-hidden ${className}`}
      initial={reduced || priority ? false : { clipPath: "inset(18% 12% 18% 12%)", opacity: 0.3 }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div className="absolute inset-[-12%_0]" style={reduced ? undefined : { y }}>
        <Image src={src} alt={alt} fill priority={priority} fetchPriority={priority ? "high" : undefined} sizes={sizes} className="object-cover" style={{ objectPosition: position }} />
      </motion.div>
      {illustrative && <IllustrativeTag className={tagClassName} />}
    </motion.div>
  );
}
