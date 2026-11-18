"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { CalendarHeart, Flower2, HeartHandshake, Sparkles } from "lucide-react";
import { useRef } from "react";

export const steps = [
  {
    icon: Flower2,
    title: "Meet & listen",
    body: "A relaxed conversation about your skin, goals, history and lifestyle — the start of every journey.",
  },
  {
    icon: Sparkles,
    title: "Your personalised plan",
    body: "Suitable options explained clearly: how they work, what's realistic, possible risks and alternatives.",
  },
  {
    icon: CalendarHeart,
    title: "At your own pace",
    body: "Take the time you need. Questions are always welcome, and there's never an obligation to proceed.",
  },
  {
    icon: HeartHandshake,
    title: "Aftercare & follow-up",
    body: "Clear aftercare guidance and a point of contact, with follow-up where appropriate.",
  },
];

export default function ConsultationProcess() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <ol ref={ref} className="relative mt-12 grid gap-5 md:grid-cols-4 md:gap-6">
      {/* Progress rail */}
      <div className="absolute left-[27px] top-0 h-full w-px bg-line md:left-0 md:top-[27px] md:h-px md:w-full" aria-hidden>
        <motion.div style={reduced ? undefined : { scaleY: progress }} className="h-full w-full origin-top bg-burgundy md:hidden" />
        <motion.div style={reduced ? undefined : { scaleX: progress }} className="hidden h-full w-full origin-left bg-burgundy md:block" />
      </div>
      {steps.map(({ icon: Icon, title, body }, i) => (
        <motion.li
          key={title}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 0.8, delay: i * 0.12 }}
          className="relative flex gap-4 md:block"
        >
          <span className="relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full border border-white bg-white text-burgundy shadow-[0_8px_24px_rgba(123,23,52,0.12)]">
            <Icon size={22} strokeWidth={1.6} aria-hidden />
          </span>
          <div className="glass flex-1 p-5 md:mt-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-rose-ink">Step {i + 1}</p>
            <h3 className="font-display mt-1.5 text-xl text-charcoal">{title}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{body}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
