"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Info, RotateCcw, RotateCw, Tag, Image as ImageIcon, Box, Hand } from "lucide-react";
import { useCallback, useEffect, useId, useMemo, useState, type KeyboardEvent } from "react";
import { modules, structures, type StructureId } from "@/content/education";
import type { ModuleId } from "@/content/treatments";
import { SceneBoundary, useInView, useIsCompact, useNearViewport, useReducedMotion, useWebGLSupport } from "@/components/three/support";
import SkinIllustration from "./SkinIllustration";

const SkinScene = dynamic(() => import("@/components/three/SkinScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="skeleton-shimmer h-full w-full" />
    </div>
  ),
});

const ROT_LIMIT = 0.9;

export default function Educational3DModule({ moduleId, headingLevel = 2 }: { moduleId: ModuleId; headingLevel?: 2 | 3 }) {
  const mod = modules[moduleId];
  const uid = useId();
  const webgl = useWebGLSupport();
  const compact = useIsCompact();
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const { ref: nearRef, near } = useNearViewport<HTMLElement>();

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<StructureId | null>(mod.steps[0].focus ?? null);
  const [rotation, setRotation] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [labels, setLabels] = useState(true);
  const [forceStatic, setForceStatic] = useState(false);
  // On phones and tablets the WebGL model is built only when asked for: it froze the page for seconds on load.
  const [tapped, setTapped] = useState(false);

  useEffect(() => setLabels(!compact), [compact]);

  const current = mod.steps[step];
  const offer3D = webgl === true && !forceStatic && compact && !tapped;
  const use3D = webgl === true && !forceStatic && near && (!compact || tapped);

  const step$ = useCallback(
    (delta: number) =>
      setStep((s) => {
        const next = Math.max(0, Math.min(mod.steps.length - 1, s + delta));
        const focus = mod.steps[next].focus;
        if (focus) setSelected(focus);
        return next;
      }),
    [mod.steps],
  );

  const rotate = (dir: number) => setRotation((r) => Math.max(-ROT_LIMIT, Math.min(ROT_LIMIT, r + dir * 0.3)));
  const reset = () => {
    setRotation(0);
    setResetKey((k) => k + 1);
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") (rotate(-1), e.preventDefault());
    else if (e.key === "ArrowRight") (rotate(1), e.preventDefault());
    else if (e.key.toLowerCase() === "r") reset();
  };

  const select = useCallback((id: StructureId) => setSelected(id), []);
  const H = headingLevel === 2 ? "h2" : "h3";
  const fallback = useMemo(
    () => <SkinIllustration state={current.state} highlight={selected} title={mod.textAlternative} className="h-full w-full" />,
    [current.state, selected, mod.textAlternative],
  );

  return (
    <section ref={nearRef} aria-labelledby={`${uid}-title`} className="glass glass-strong overflow-hidden p-3 sm:p-4 lg:p-5">
      <div className="grid gap-5 lg:grid-cols-12 lg:gap-8">
        {/* ── Visual ── */}
        <div className="lg:col-span-7">
          <div
            ref={ref}
            tabIndex={0}
            role="group"
            aria-roledescription="interactive 3D model"
            aria-label={`${mod.title}. Use left and right arrow keys to rotate, R to reset. Structure buttons are listed alongside.`}
            onKeyDown={onKey}
            className="relative aspect-[4/3.3] overflow-hidden rounded-[20px] bg-gradient-to-b from-[#FBF6F4] to-[#F1E6E3] outline-offset-4"
          >
            {use3D ? (
              <SceneBoundary fallback={fallback}>
                <SkinScene
                  state={current.state}
                  selected={selected}
                  onSelect={select}
                  labelIds={mod.structures}
                  showLabels={labels}
                  rotation={rotation}
                  resetKey={resetKey}
                  active={inView}
                  animate={!reduced}
                  allowDrag={!compact}
                />
              </SceneBoundary>
            ) : (
              <div className="absolute inset-0 p-3">{fallback}</div>
            )}
            {offer3D && (
              <button
                type="button"
                onClick={() => setTapped(true)}
                className="btn btn-primary absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 !min-h-11 gap-2 shadow-lg"
              >
                <Box size={16} aria-hidden /> View in 3D
              </button>
            )}

            {/* Toolbar */}
            <div className="absolute left-2 right-2 top-2 flex flex-wrap items-center justify-between gap-2">
              <div className={`glass glass-strong flex items-center gap-1 !rounded-full p-1 ${use3D || (webgl && !offer3D) ? "" : "hidden"}`} role="toolbar" aria-label="Model controls">
                {use3D && (
                  <>
                    <ToolButton label="Rotate left" onClick={() => rotate(-1)}>
                      <RotateCcw size={16} />
                    </ToolButton>
                    <ToolButton label="Rotate right" onClick={() => rotate(1)}>
                      <RotateCw size={16} />
                    </ToolButton>
                    <ToolButton label="Reset view" onClick={reset}>
                      <span className="text-[11px] font-semibold">Reset</span>
                    </ToolButton>
                    <ToolButton label={labels ? "Hide labels" : "Show labels"} pressed={labels} onClick={() => setLabels((v) => !v)}>
                      <Tag size={16} />
                    </ToolButton>
                  </>
                )}
                {webgl && !offer3D && (
                  <ToolButton label={forceStatic ? "Show interactive 3D" : "Show static illustration"} onClick={() => setForceStatic((v) => !v)}>
                    {forceStatic ? <Box size={16} /> : <ImageIcon size={16} />}
                  </ToolButton>
                )}
              </div>
            </div>
            <p className="pointer-events-none absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2 text-[11px] text-muted">
              <span className="rounded-full bg-white/75 px-2.5 py-1 backdrop-blur-md">Conceptual educational model · not to scale</span>
              {use3D && !compact && (
                <span className="hidden items-center gap-1 rounded-full bg-white/75 px-2.5 py-1 backdrop-blur-md sm:flex">
                  <Hand size={12} aria-hidden /> Drag to rotate · click a structure
                </span>
              )}
            </p>
          </div>
        </div>

        {/* ── Narrative ── */}
        <div className="flex flex-col px-1 pb-2 lg:col-span-5 lg:py-2 lg:pr-3">
          <p className="eyebrow">{mod.eyebrow}</p>
          <H id={`${uid}-title`} className="font-display mt-3 text-2xl leading-tight text-charcoal sm:text-[1.9rem]">
            {mod.title}
          </H>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{mod.intro}</p>

          {/* Step sequence */}
          <div className="mt-6 rounded-2xl border border-line bg-white/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-ink">
                Step {step + 1} of {mod.steps.length}
              </p>
              <div className="flex gap-1.5" aria-hidden>
                {mod.steps.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? "w-6 bg-burgundy" : i < step ? "w-3 bg-rose" : "w-3 bg-line"}`} />
                ))}
              </div>
            </div>
            <div aria-live="polite" className="min-h-[9.5rem]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="mt-3 font-semibold text-charcoal">{current.title}</p>
                  <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">{current.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <button type="button" onClick={() => step$(-1)} disabled={step === 0} className="btn btn-glass !min-h-10 !px-4 !py-2 text-sm disabled:opacity-40">
                <ChevronLeft size={16} aria-hidden /> Previous
              </button>
              <button type="button" onClick={() => step$(1)} disabled={step === mod.steps.length - 1} className="btn btn-primary !min-h-10 !px-4 !py-2 text-sm disabled:opacity-40">
                Next <ChevronRight size={16} aria-hidden />
              </button>
            </div>
          </div>

          {/* Structures */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Explore structures</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {mod.structures.map((id) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={selected === id}
                  onClick={() => setSelected(id)}
                  className={`rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                    selected === id ? "border-burgundy bg-burgundy text-white" : "border-line bg-white/70 text-charcoal hover:border-rose"
                  }`}
                >
                  {structures[id].label}
                </button>
              ))}
            </div>
            <div aria-live="polite" className="mt-3 min-h-[5.5rem]">
              {selected && (
                <motion.div
                  key={selected}
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 rounded-2xl bg-burgundy/[0.06] p-3.5"
                >
                  <Info size={18} className="mt-0.5 shrink-0 text-burgundy" aria-hidden />
                  <p className="text-[14px] leading-relaxed text-charcoal">
                    <strong className="font-semibold">{structures[selected].label}.</strong> {structures[selected].body}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          <details className="mt-4 text-sm text-muted">
            <summary className="cursor-pointer font-medium text-charcoal">Text description of this model</summary>
            <p className="mt-2 leading-relaxed">{mod.textAlternative}</p>
          </details>
          <p className="mt-4 text-[12px] leading-relaxed text-muted">
            Illustrative artwork for general education. It does not show how any individual will respond to treatment.
          </p>
        </div>
      </div>
    </section>
  );
}

function ToolButton({ label, onClick, pressed, children }: { label: string; onClick: () => void; pressed?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className={`grid h-9 min-w-9 place-items-center rounded-full px-2 text-charcoal transition-colors hover:bg-white ${pressed ? "bg-white text-burgundy" : ""}`}
    >
      {children}
    </button>
  );
}
