"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Droplets, Flower2, Sparkles } from "lucide-react";

const notes = [
  { icon: Sparkles, title: "Personalised plans", body: "Designed around your skin and goals", className: "-left-3 top-[16%] sm:-left-10", delay: 1.0 },
  { icon: Droplets, title: "Skin · Hair · Laser", body: "Facials, injectables, peels and more", className: "-right-2 top-[50%] hidden sm:block sm:-right-10", delay: 1.2 },
  { icon: Flower2, title: "Consultation first", body: "Every journey begins with a conversation", className: "-left-2 bottom-[8%] hidden md:block md:-left-12", delay: 1.4 },
];

/**
 * Photo-led hero: a genuine moment from a skin-lifting facial at the clinic,
 * in the signature arch frame with a slow cinematic push-in.
 */
export default function HeroPhoto({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <motion.figure
        initial={reduced ? false : { opacity: 0, y: 30, clipPath: "inset(30% 10% 0% 10% round 999px 999px 32px 32px)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 999px 999px 32px 32px)" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-[32px] border border-white/80 bg-[#EEDCD2] shadow-[0_40px_100px_rgba(123,23,52,0.20)]"
      >
        <motion.div
          className="absolute inset-0"
          initial={reduced ? false : { scale: 1.06 }}
          animate={reduced ? undefined : { scale: [1.06, 1.0, 1.04] }}
          transition={{ duration: 22, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" }}
        >
          <Image src={src} alt={alt} fill priority sizes="(min-width: 1024px) 540px, 92vw" className="object-cover object-[50%_35%]" />
        </motion.div>
        {/* Warm blush wash and soft light sweep for a cohesive, editorial grade */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,232,230,0.18)_0%,rgba(248,232,230,0)_40%,rgba(92,15,38,0.28)_100%)] mix-blend-soft-light" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_30%,rgba(255,240,236,0.22),transparent_70%)]" />
        {!reduced && (
          <motion.div
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.18),transparent)]"
            animate={{ x: ["0%", "320%"] }}
            transition={{ duration: 5.5, repeat: Infinity, repeatDelay: 6, ease: "easeInOut", delay: 2 }}
          />
        )}
        <div className="pointer-events-none absolute inset-0 rounded-t-full rounded-b-[32px] ring-1 ring-inset ring-white/50" />
        <figcaption className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/75 px-3 py-1 text-[11px] font-medium text-muted backdrop-blur-md">
          {caption}
        </figcaption>
      </motion.figure>

      {notes.map(({ icon: Icon, title, body, className, delay }, i) => (
        <motion.div
          key={title}
          initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute z-10 w-[210px] ${className}`}
        >
          <div className={`glass glass-sheen glass-strong px-4 py-3 ${reduced ? "" : "animate-float"}`} style={{ animationDelay: `${i * 1.4}s` }}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#F6D5DB] to-[#EBC5CD] text-burgundy">
                <Icon size={15} aria-hidden />
              </span>
              <div>
                <p className="font-display text-[15px] leading-tight text-charcoal">{title}</p>
                <p className="mt-1 text-[12px] leading-snug text-muted">{body}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
