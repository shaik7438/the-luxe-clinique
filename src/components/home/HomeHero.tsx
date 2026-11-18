"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { useRef, type PointerEvent } from "react";
import BeautyHero3D from "@/components/three/BeautyHero3D";
import IllustrativeTag from "@/components/media/IllustrativeTag";
import CircleText from "@/components/motion/CircleText";
import Magnetic from "@/components/motion/Magnetic";

export interface HeroImg {
  src: string;
  alt: string;
  illustrative: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Character-by-character rise for the headline; the full string stays accessible. */
function Chars({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <span className={`block ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
        {text.split("").map((c, i) => (
          <motion.span
            key={i}
            className="inline-block"
            initial={reduced ? false : { y: "110%", rotate: 6 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 1, delay: delay + i * 0.035, ease: EASE }}
          >
            {c === " " ? " " : c}
          </motion.span>
        ))}
      </span>
    </span>
  );
}

function useDepth(mx: MotionValue<number>, my: MotionValue<number>, depth: number) {
  const x = useSpring(useTransform(mx, (v) => v * depth), { stiffness: 80, damping: 18 });
  const y = useSpring(useTransform(my, (v) => v * depth), { stiffness: 80, damping: 18 });
  return { x, y };
}

export default function HomeHero({ hero, accentA, accentB }: { hero: HeroImg | null; accentA: HeroImg | null; accentB: HeroImg | null }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);
  const collageY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);
  const wordX = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-18%"]);
  const mainScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.12]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const d1 = useDepth(mx, my, -14);
  const d2 = useDepth(mx, my, 26);
  const d3 = useDepth(mx, my, -34);
  const d4 = useDepth(mx, my, 44);

  const enter = (delay: number) => ({
    initial: reduced ? false : ({ opacity: 0, y: 22 } as const),
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EASE },
  });

  return (
    <section ref={ref} onPointerMove={onMove} className="luxe-canvas grain relative overflow-clip pb-20 pt-28 sm:pt-32 lg:min-h-[100svh] lg:pb-24 lg:pt-32">
      {/* Giant outlined wordmark drifting behind */}
      <motion.div style={{ x: wordX }} aria-hidden className="pointer-events-none absolute -bottom-8 left-0 whitespace-nowrap font-display text-[22vw] leading-none text-outline lg:text-[16vw]">
        The LUXE Clinique
      </motion.div>
      <div className="pointer-events-none absolute -right-24 top-10 h-[40rem] w-[40rem] rounded-full bg-[radial-gradient(circle,rgba(242,190,201,0.5),transparent_65%)] blur-2xl" />

      <div className="container-luxe relative grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <motion.div style={{ y: textY }} className="relative z-10 lg:col-span-6">
          {/* The eyebrow sits inside the h1 so the heading reads as one descriptive line for search engines. */}
          <h1>
            <motion.span {...enter(0.1)} className="eyebrow flex items-center gap-3 leading-normal">
              <span className="h-px w-10 bg-burgundy/50" aria-hidden /> Skin, Hair &amp; Laser Clinic · Preet Vihar, East Delhi
            </motion.span>
            <span className="sr-only"> — </span>
            <span className="display-xl mt-6 block text-[3.4rem] text-charcoal sm:text-[4.8rem] lg:text-[5.8rem]">
              <Chars text="The Art of" delay={0.2} />{" "}
              <Chars text="Aesthetic Care" delay={0.55} className="accent" />
            </span>
          </h1>
          <motion.p {...enter(1.05)} className="mt-7 max-w-[31rem] text-[17px] leading-relaxed text-muted">
            Personalised skin, hair and aesthetic treatments in Preet Vihar, New Delhi — designed around you, and always guided by a thoughtful consultation.
          </motion.p>
          <motion.div {...enter(1.2)} className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <Link href="/contact#enquiry" className="btn btn-primary">
                Book a Consultation <ArrowRight size={16} aria-hidden />
              </Link>
            </Magnetic>
            <Magnetic strength={0.2}>
              <Link href="/treatments" className="btn btn-glass">
                Discover Treatments
              </Link>
            </Magnetic>
          </motion.div>
          <motion.div {...enter(1.35)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13.5px] text-muted">
            <span className="flex items-center gap-2">
              <MapPin size={15} className="text-burgundy" aria-hidden /> Preet Vihar, New Delhi
            </span>
            <span className="hidden h-4 w-px bg-line sm:block" />
            <span className="font-display text-[15px] italic text-rose-ink">Facials · Injectables · Laser · Peels</span>
          </motion.div>
        </motion.div>

        <motion.div style={{ y: collageY }} className="relative lg:col-span-6">
          {hero ? (
            <div className="relative mx-auto w-full max-w-[520px] pb-10 pl-6 pr-4 sm:pl-12">
              {/* Main arch portrait */}
              <motion.figure
                style={reduced ? undefined : d1}
                // No opacity fade: the portrait is the page's largest image (LCP) and must paint before the JS loads.
                initial={reduced ? false : { clipPath: "inset(40% 20% 0% 20% round 999px 999px 32px 32px)" }}
                animate={{ clipPath: "inset(0% 0% 0% 0% round 999px 999px 32px 32px)" }}
                transition={{ duration: 1.7, ease: EASE, delay: 0.15 }}
                data-cursor="LUXE"
                className="relative aspect-[4/5] w-full overflow-hidden rounded-t-full rounded-b-[32px] shadow-[0_50px_110px_rgba(123,23,52,0.25)]"
              >
                <motion.div className="absolute inset-0" style={reduced ? undefined : { scale: mainScale }}>
                  <motion.div className="absolute inset-0" initial={reduced ? false : { scale: 1.25 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: EASE }}>
                    <Image src={hero.src} alt={hero.alt} fill priority fetchPriority="high" sizes="(min-width: 1024px) 520px, 90vw" className="object-cover object-[60%_30%]" />
                  </motion.div>
                </motion.div>
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(248,232,230,0)_55%,rgba(92,15,38,0.35)_100%)]" />
                {hero.illustrative && <IllustrativeTag className="absolute bottom-4 left-1/2 -translate-x-1/2" />}
              </motion.figure>

              {/* Floating serum card */}
              {accentA && (
                <motion.div style={reduced ? undefined : d2} className="absolute -left-2 top-[34%] w-[36%] sm:-left-6">
                  {/* Entry animation lives on an inner element so its `y` doesn't hijack the shared depth motion values */}
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 40, rotate: -10 }}
                    animate={{ opacity: 1, y: 0, rotate: -6 }}
                    transition={{ duration: 1.3, delay: 0.9, ease: EASE }}
                    className="relative aspect-[3/4] overflow-hidden rounded-[22px] border-4 border-white/90 shadow-[0_30px_60px_rgba(123,23,52,0.22)]"
                  >
                    <Image src={accentA.src} alt={accentA.alt} fill sizes="200px" className="object-cover" />
                  </motion.div>
                </motion.div>
              )}

              {/* Floating circle detail */}
              {accentB && (
                <motion.div
                  style={reduced ? undefined : d3}
                  initial={reduced ? false : { opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, delay: 1.15, ease: EASE }}
                  className="absolute -right-2 bottom-2 w-[30%] sm:-right-6"
                >
                  <div className="relative aspect-square overflow-hidden rounded-full border-4 border-white/90 shadow-[0_24px_50px_rgba(123,23,52,0.22)]">
                    <Image src={accentB.src} alt={accentB.alt} fill sizes="170px" className="object-cover" />
                  </div>
                </motion.div>
              )}

              {/* Rotating badge */}
              <motion.div
                style={reduced ? undefined : d4}
                initial={reduced ? false : { opacity: 0, rotate: -40 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 1.4, delay: 1.3, ease: EASE }}
                className="absolute -top-2 right-2 text-burgundy sm:right-0"
              >
                <CircleText text="Skin · Hair · Laser · Wellness · " size={128} className="rounded-full bg-white/70 shadow-[0_16px_40px_rgba(123,23,52,0.15)] backdrop-blur-md">
                  <Image src="/brand/luxe-mark.png" alt="The LUXE Clinique monogram" width={44} height={44} className="rounded-md" />
                </CircleText>
              </motion.div>

              {/* Pearls */}
              {[
                { c: "left-[18%] -top-2 h-7 w-7", d: d4, delay: 1.5 },
                { c: "right-[30%] bottom-[-6px] h-5 w-5", d: d2, delay: 1.6 },
                { c: "left-[4%] bottom-[18%] h-4 w-4", d: d3, delay: 1.7 },
              ].map((p, i) => (
                <motion.span
                  key={i}
                  style={reduced ? undefined : p.d}
                  initial={reduced ? false : { opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.9, delay: p.delay, ease: EASE }}
                  className={`pearl absolute ${p.c}`}
                  aria-hidden
                />
              ))}
            </div>
          ) : (
            <BeautyHero3D />
          )}
        </motion.div>
      </div>
    </section>
  );
}
