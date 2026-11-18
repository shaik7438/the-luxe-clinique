"use client";

import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";

const items = [
  ["Hydra Facial", "hydrafacial"],
  ["Skin Boosters", "skin-boosters"],
  ["Lip Enhancement", "lip-fillers"],
  ["Laser Hair Reduction", "laser-hair-reduction"],
  ["Chemical Peels", "chemical-peels"],
  ["Anti-Wrinkle", "anti-wrinkle-injections"],
  ["Profhilo®", "profhilo"],
  ["Laser Toning", "laser-toning"],
  ["PRP for Hair", "prp-hair-therapy"],
  ["Jawline Contouring", "jawline-contouring"],
] as const;

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/**
 * Treatment ribbon whose speed and direction respond to scroll velocity —
 * it glides on its own, then surges and reverses as you scroll.
 */
export default function TreatmentMarquee() {
  const reduced = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1500, 0, 1500], [-4, 0, 4], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const skew = useTransform(smooth, [-2000, 0, 2000], [6, 0, -6]);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let move = dir.current * -1.6 * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * -1.6 * (delta / 1000) * Math.abs(f);
    base.set(base.get() + move);
  });

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-10 pr-10" aria-hidden={hidden || undefined}>
      {items.map(([label, slug]) => (
        <li key={slug} className="flex items-center gap-10">
          <Link href={`/treatments/${slug}`} tabIndex={hidden ? -1 : undefined} className="font-display whitespace-nowrap text-[1.8rem] italic text-white/95 transition-colors hover:text-[#F6C9D2] sm:text-[2.4rem]">
            {label}
          </Link>
          <span className="text-[#E9A8B7]" aria-hidden>
            ✦
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Signature treatments" className="relative overflow-clip bg-[#6B1330] bg-gradient-to-r from-[#5C0F26] via-[#7B1734] to-[#5C0F26] py-7">
      <motion.div className="flex w-max" style={reduced ? undefined : { x, skewX: skew }}>
        {row(false)}
        {row(true)}
      </motion.div>
    </section>
  );
}
