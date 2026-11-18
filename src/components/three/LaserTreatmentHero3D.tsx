"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ShieldCheck, Snowflake, CalendarClock } from "lucide-react";
import { useState, useEffect } from "react";
import HeroPoster from "./HeroPoster";
import { SceneBoundary, useInView, useIsCompact, useNearViewport, useReducedMotion, useWebGLSupport } from "./support";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });

const panels = [
  {
    icon: ShieldCheck,
    title: "Eye protection",
    body: "Patient eye shields and clinician safety glasses",
    className: "left-2 top-4 sm:left-4 sm:top-8",
    delay: 0.9,
  },
  {
    icon: Snowflake,
    title: "Contact cooling",
    body: "The handpiece rests on the skin; cooling protects the surface",
    className: "right-3 bottom-12 hidden sm:block lg:-right-4",
    delay: 1.1,
  },
  {
    icon: CalendarClock,
    title: "A course, not a single visit",
    body: "Sessions are spaced around hair growth cycles",
    className: "bottom-4 left-4 hidden md:block lg:-left-6",
    delay: 1.3,
  },
];

export default function LaserTreatmentHero3D() {
  const webgl = useWebGLSupport();
  const compact = useIsCompact();
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>("0px");
  const { ref: nearRef, near } = useNearViewport<HTMLDivElement>();
  const show3D = !!webgl && near;
  const [ready, setReady] = useState(false);

  // Fade the canvas in once the scene module has mounted and rendered a few frames.
  useEffect(() => {
    if (!show3D) return;
    const t = setTimeout(() => setReady(true), 650);
    return () => clearTimeout(t);
  }, [show3D]);

  return (
    <div ref={ref} className="relative">
      <div ref={nearRef} aria-hidden className="pointer-events-none absolute inset-0" />
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative aspect-[4/3.4] w-full overflow-hidden rounded-[28px] border border-white/80 bg-[#F6EFEC] shadow-[0_30px_80px_rgba(92,15,38,0.14)] sm:aspect-[5/4]"
      >
        {/* Poster is always present underneath — instant paint, and the fallback if WebGL is unavailable */}
        <HeroPoster className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`} />
        {show3D && (
          <SceneBoundary fallback={null}>
            <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
              <HeroScene compact={compact} animate={!reduced} active={inView} />
            </div>
          </SceneBoundary>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F6EFEC]/70 to-transparent" />
        <span className="absolute bottom-3 right-4 rounded-full bg-white/70 px-3 py-1 text-[11px] font-medium text-muted backdrop-blur-md">
          Stylised 3D illustration · not a real patient or clinician
        </span>
      </motion.div>

      {panels.map(({ icon: Icon, title, body, className, delay }, i) => (
        <motion.div
          key={title}
          initial={reduced ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute z-10 max-w-[220px] ${className}`}
        >
          <div className={`glass glass-sheen glass-strong px-4 py-3 ${reduced ? "" : "animate-float"}`} style={{ animationDelay: `${i * 1.3}s` }}>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-burgundy/10 text-burgundy">
                <Icon size={16} aria-hidden />
              </span>
              <div>
                <p className="text-[13px] font-semibold leading-tight text-charcoal">{title}</p>
                <p className="mt-1 text-[12px] leading-snug text-muted">{body}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
