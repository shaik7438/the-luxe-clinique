"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Droplets, Flower2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import FaceLineArt from "@/components/art/FaceLineArt";
import { SceneBoundary, useInView, useIsCompact, useNearViewport, useReducedMotion, useWebGLSupport } from "./support";

const BeautyHeroScene = dynamic(() => import("./BeautyHeroScene"), { ssr: false, loading: () => null });

const notes = [
  { icon: Sparkles, title: "Personalised plans", body: "Designed around your skin and goals", className: "-left-3 top-[18%] sm:-left-10", delay: 1.0 },
  { icon: Droplets, title: "Skin · Hair · Laser", body: "Facials, injectables, peels and more", className: "-right-2 top-[46%] hidden sm:block sm:-right-10", delay: 1.2 },
  { icon: Flower2, title: "Consultation first", body: "Every journey begins with a conversation", className: "-left-2 bottom-[9%] hidden md:block md:-left-12", delay: 1.4 },
];

/** Arch-framed hero visual: instant line-art poster, upgraded to the 3D sculpture when WebGL is ready. */
export default function BeautyHero3D() {
  const webgl = useWebGLSupport();
  const compact = useIsCompact();
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>("0px");
  const { ref: nearRef, near } = useNearViewport<HTMLDivElement>();
  const show3D = !!webgl && near;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!show3D) return;
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, [show3D]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[560px]">
      <div ref={nearRef} aria-hidden className="pointer-events-none absolute inset-0" />
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 30, clipPath: "inset(30% 10% 0% 10% round 999px 999px 32px 32px)" }}
        animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0% 0% 0% round 999px 999px 32px 32px)" }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-[32px] border border-white/80 bg-gradient-to-b from-[#F8ECEA] via-[#F3E1DF] to-[#EEDCD2] shadow-[0_40px_100px_rgba(123,23,52,0.18)]"
      >
        {/* Line-art poster: instant paint and the no-WebGL fallback */}
        <div className={`absolute inset-0 grid place-items-center transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}>
          <div className="absolute left-1/2 top-[30%] h-[62%] w-[78%] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(circle,#FFF8F4_0%,#F6DCDE_60%,transparent_72%)]" />
          <FaceLineArt className="relative h-[78%] w-auto" title="Line illustration of a woman's profile with flowing hair and leaves" />
        </div>
        {show3D && (
          <SceneBoundary fallback={null}>
            <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? "opacity-100" : "opacity-0"}`}>
              <BeautyHeroScene compact={compact} animate={!reduced} active={inView} />
            </div>
          </SceneBoundary>
        )}
        <div className="pointer-events-none absolute inset-0 rounded-t-full rounded-b-[32px] ring-1 ring-inset ring-white/60" />
      </motion.div>

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
