"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ArtPlate from "@/components/media/ArtPlate";
import IllustrativeTag from "@/components/media/IllustrativeTag";
import type { TreatmentCardData } from "@/components/ui/GlassTreatmentCard";
import { Accented } from "@/components/ui/blocks";

/**
 * Signature treatments: on desktop the section pins and the cards travel
 * sideways as you scroll down; on touch/small screens it's a swipeable row.
 */
export default function HorizontalTreatments({ cards }: { cards: TreatmentCardData[] }) {
  const reduced = useReducedMotion();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const dist = useMotionValue(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const measure = () => {
      const wide = window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches && !reduced;
      setPinned(wide);
      if (track.current) {
        const d = Math.max(0, track.current.scrollWidth - window.innerWidth + 64);
        setDistance(d);
        dist.set(d);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reduced, cards.length, dist]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform([scrollYProgress, dist], ([p, d]: number[]) => -d * Math.min(1, Math.max(0, (p - 0.05) / 0.9)));
  const bar = useTransform(scrollYProgress, [0.05, 0.95], ["0%", "100%"]);

  const header = (
    <div className="container-luxe flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-8 bg-burgundy/50" /> The LUXE menu
        </p>
        <h2 id="feat-title" className="display-xl mt-5 text-[2.5rem] text-charcoal sm:text-[3.4rem]">
          <Accented text="Signature *treatments*" />
        </h2>
      </div>
      <Link href="/treatments" className="btn btn-glass">
        View the full menu <ArrowUpRight size={16} aria-hidden />
      </Link>
    </div>
  );

  const list = (
    <div ref={track} className={`flex gap-6 px-4 sm:px-8 ${pinned ? "" : "snap-x snap-mandatory overflow-x-auto pb-6 [scrollbar-width:none]"}`}>
      {cards.map((c, i) => (
        <Link
          key={c.slug}
          href={`/treatments/${c.slug}`}
          data-cursor="Discover"
          className="group relative block w-[78vw] shrink-0 snap-start overflow-hidden rounded-[32px] sm:w-[360px] lg:w-[400px]"
        >
          <div className={`relative aspect-[3/4] overflow-hidden ${i % 2 ? "rounded-t-full" : ""}`}>
            {c.image ? (
              <Image src={c.image} alt={c.imageAlt} fill sizes="400px" className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.08]" />
            ) : (
              <ArtPlate motif={c.motif} className="h-full w-full" />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_45%,rgba(60,10,26,0.72)_100%)]" />
            {c.image && c.illustrative && <IllustrativeTag className="absolute right-4 top-4" />}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <p className="font-display text-[3.2rem] leading-none text-white/25">{String(i + 1).padStart(2, "0")}</p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">{c.categoryLabel}</p>
            <h3 className="font-display mt-1 text-[1.9rem] leading-tight">{c.name.split(" (")[0]}</h3>
            <span className="mt-3 flex items-center gap-2 text-[13.5px] font-semibold text-[#F6C9D2]">
              Discover
              <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <section
      ref={section}
      className={`blush-wash relative ${pinned ? "" : "section"}`}
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
      aria-labelledby="feat-title"
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-16" : ""}>
        {header}
        <motion.div className="mt-10" style={pinned ? { x } : undefined}>
          {list}
        </motion.div>
        {pinned && (
          <div className="container-luxe mt-8">
            <div className="h-px w-full bg-line">
              <motion.div className="h-px bg-burgundy" style={{ width: bar }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
