"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import IllustrativeTag from "@/components/media/IllustrativeTag";
import { steps } from "./ConsultationProcess";
import type { HeroImg } from "./HomeHero";

/**
 * "Your journey" told in four chapters: the image on the left stays pinned and
 * crossfades (with a slow zoom) as each chapter scrolls into focus.
 */
export default function ExperienceStory({ images }: { images: (HeroImg | null)[] }) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const img = images[active] ?? images.find(Boolean) ?? null;

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[36px] bg-blush shadow-[0_40px_90px_rgba(123,23,52,0.18)]">
            <AnimatePresence mode="sync">
              {img && (
                <motion.div
                  key={img.src}
                  className="absolute inset-0"
                  initial={reduced ? false : { opacity: 0, scale: 1.12 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image src={img.src} alt={img.alt} fill sizes="560px" className="object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
            {img?.illustrative && <IllustrativeTag className="absolute bottom-4 left-1/2 -translate-x-1/2" />}
            <div className="absolute left-6 top-[18%] font-display text-[6rem] leading-none text-white/80 mix-blend-soft-light">{String(active + 1).padStart(2, "0")}</div>
          </div>
        </div>
      </div>

      <ol className="lg:col-span-6">
        {steps.map(({ icon: Icon, title, body }, i) => (
          <li
            key={title}
            data-index={i}
            ref={(el) => void (refs.current[i] = el)}
            className="flex min-h-[46vh] flex-col justify-center border-b border-line py-10 last:border-0"
          >
            <motion.div
              animate={{ opacity: active === i || reduced ? 1 : 0.38, x: active === i && !reduced ? 0 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-4">
                <span className={`grid h-14 w-14 place-items-center rounded-full transition-colors duration-500 ${active === i ? "bg-burgundy text-white" : "bg-white text-burgundy"} shadow-[0_10px_30px_rgba(123,23,52,0.14)]`}>
                  <Icon size={22} strokeWidth={1.6} aria-hidden />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-rose-ink">Step {i + 1}</span>
              </div>
              <h3 className="display-xl mt-5 text-[2.2rem] text-charcoal sm:text-[2.7rem]">{title}</h3>
              <p className="mt-3 max-w-md text-[16px] leading-relaxed text-muted">{body}</p>
              {images[i] && (
                <div className="relative mt-6 aspect-[4/3] overflow-hidden rounded-[24px] lg:hidden">
                  <Image src={images[i]!.src} alt={images[i]!.alt} fill sizes="90vw" className="object-cover" />
                  {images[i]!.illustrative && <IllustrativeTag />}
                </div>
              )}
            </motion.div>
          </li>
        ))}
      </ol>
    </div>
  );
}
