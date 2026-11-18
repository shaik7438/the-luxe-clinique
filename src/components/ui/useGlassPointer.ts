"use client";

import { useCallback, type PointerEvent } from "react";

/** Moves the glass specular highlight (CSS vars --mx/--my) with the pointer. */
export function useGlassPointer() {
  return useCallback((e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);
}
