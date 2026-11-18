"use client";

import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { PointerEvent } from "react";
import ArtPlate from "@/components/media/ArtPlate";
import IllustrativeTag from "@/components/media/IllustrativeTag";
import type { AssetSlot } from "@/content/assets";

export interface TreatmentCardData {
  slug: string;
  name: string;
  summary: string;
  categoryLabel: string;
  hasModule: boolean;
  image: string | null;
  imageAlt: string;
  motif: AssetSlot["motif"];
  illustrative?: boolean;
}

export default function GlassTreatmentCard({ t, priority = false }: { t: TreatmentCardData; priority?: boolean }) {
  const reduced = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [3, -3]), { stiffness: 160, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-4, 4]), { stiffness: 160, damping: 18 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    mx.set(x);
    my.set(y);
    e.currentTarget.style.setProperty("--mx", `${x * 100}%`);
    e.currentTarget.style.setProperty("--my", `${y * 100}%`);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 22 }}
      className="glass glass-sheen group relative flex h-full flex-col overflow-hidden !rounded-[28px]"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[27px]">
        {t.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.image} alt={t.imageAlt} loading={priority ? "eager" : "lazy"} className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
        ) : (
          <ArtPlate motif={t.motif} className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
        )}
        <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-charcoal backdrop-blur-md">
          {t.categoryLabel}
        </span>
        {t.image && t.illustrative && <IllustrativeTag />}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-[1.45rem] leading-snug text-charcoal">
          <Link href={`/treatments/${t.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {t.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-muted">{t.summary}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-4 text-[13.5px] font-semibold text-burgundy">
          Discover
          <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-[24px] ring-2 ring-transparent transition group-has-[:focus-visible]:ring-burgundy" />
    </motion.article>
  );
}
