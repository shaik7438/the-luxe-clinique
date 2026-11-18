"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useId, useState } from "react";

export default function Accordion({ items, defaultOpen = -1 }: { items: { q: string; a: string }[]; defaultOpen?: number }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  const reduced = useReducedMotion();
  return (
    <div className="divide-y divide-line overflow-hidden rounded-[22px] border border-white/80 bg-white/60 backdrop-blur-xl">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button
                type="button"
                id={`${id}-h${i}`}
                aria-expanded={isOpen}
                aria-controls={`${id}-p${i}`}
                onClick={() => setOpen(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15.5px] font-semibold text-charcoal transition-colors hover:bg-white/70 sm:px-6"
              >
                {it.q}
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${isOpen ? "rotate-45 border-burgundy bg-burgundy text-white" : "border-line text-burgundy"}`}>
                  <Plus size={16} aria-hidden />
                </span>
              </button>
            </h3>
            {/* Always rendered (collapsed with height 0) so every answer is in the server HTML for search engines and FAQ rich results. */}
            <motion.div
              id={`${id}-p${i}`}
              role="region"
              aria-labelledby={`${id}-h${i}`}
              aria-hidden={!isOpen}
              inert={!isOpen}
              initial={false}
              animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
              style={isOpen ? undefined : { height: 0, opacity: 0 }}
            >
              <p className="px-5 pb-5 text-[15px] leading-relaxed text-muted sm:px-6">{it.a}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
