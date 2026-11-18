"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import GlassTreatmentCard, { type TreatmentCardData } from "@/components/ui/GlassTreatmentCard";
import type { CategoryId, ConcernId } from "@/content/treatments";

export interface DirectoryItem extends TreatmentCardData {
  category: CategoryId;
  concerns: ConcernId[];
  keywords: string;
}

export default function TreatmentDirectory({
  items,
  categories,
  concerns,
}: {
  items: DirectoryItem[];
  categories: { id: CategoryId; label: string }[];
  concerns: { id: ConcernId; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const reduced = useReducedMotion();
  const [, startTransition] = useTransition();

  const category = (params.get("category") as CategoryId | null) ?? null;
  const concern = (params.get("concern") as ConcernId | null) ?? null;
  const [query, setQuery] = useState(params.get("q") ?? "");

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    startTransition(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false }));
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (t) =>
        (!category || t.category === category) &&
        (!concern || t.concerns.includes(concern)) &&
        (!q || t.name.toLowerCase().includes(q) || t.keywords.includes(q)),
    );
  }, [items, category, concern, query]);

  const clear = () => {
    setQuery("");
    startTransition(() => router.replace(pathname, { scroll: false }));
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="glass glass-strong sticky top-24 z-30 p-3 sm:p-4" role="search">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Search treatments</span>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search treatments or concerns…"
              className="h-12 w-full rounded-full border border-line bg-white/80 pl-11 pr-4 text-[15px] outline-none transition focus:border-burgundy focus:ring-2 focus:ring-burgundy/15"
            />
          </label>
          <label className="block lg:w-64">
            <span className="sr-only">Filter by concern</span>
            <select
              value={concern ?? ""}
              onChange={(e) => setParam("concern", e.target.value || null)}
              className="h-12 w-full appearance-none rounded-full border border-line bg-white/80 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%237B1734%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[right_1rem_center] bg-no-repeat px-4 pr-10 text-[15px] outline-none focus:border-burgundy focus:ring-2 focus:ring-burgundy/15"
            >
              <option value="">All concerns</option>
              {concerns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]" role="group" aria-label="Filter by category">
          <Chip active={!category} onClick={() => setParam("category", null)}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setParam("category", category === c.id ? null : c.id)}>
              {c.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-[14px] text-muted" aria-live="polite">
          {results.length} {results.length === 1 ? "treatment" : "treatments"}
        </p>
        {(category || concern || query) && (
          <button type="button" onClick={clear} className="flex items-center gap-1 text-[14px] font-semibold text-burgundy hover:underline">
            <X size={14} aria-hidden /> Clear filters
          </button>
        )}
      </div>

      <motion.ul layout={!reduced} className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((t) => (
            <motion.li
              key={t.slug}
              layout={!reduced}
              initial={reduced ? false : { opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <GlassTreatmentCard t={t} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {results.length === 0 && (
        <div className="glass mt-6 p-8 text-center">
          <p className="font-display text-xl">No treatments match those filters.</p>
          <p className="mt-2 text-muted">Try a different search, or ask the clinic — a consultation can help identify suitable options.</p>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[13.5px] font-medium transition-colors ${
        active ? "border-burgundy bg-burgundy text-white shadow-[0_6px_16px_rgba(123,23,52,0.25)]" : "border-line bg-white/70 text-charcoal hover:border-rose"
      }`}
    >
      {children}
    </button>
  );
}
