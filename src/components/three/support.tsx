"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";

/** True when the browser can create a WebGL context. */
export function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function useWebGLSupport() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => setOk(detectWebGL()), []);
  return ok;
}

/** Track whether an element is near the viewport, to pause off-screen render loops. */
export function useInView<T extends Element>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, inView };
}

/**
 * Latches true once the element comes within `rootMargin` of the viewport and stays true.
 * Gate a 3D scene on it so its WebGL setup (renderer, shaders, geometry) doesn't run at page
 * load for scenes nobody has scrolled to; that setup was blocking phones for seconds.
 */
export function useNearViewport<T extends Element>(rootMargin = "300px") {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, near]);
  return { ref, near };
}

export function useMediaQuery(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatch(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return match;
}

export const useReducedMotion = () => useMediaQuery("(prefers-reduced-motion: reduce)");
export const useIsCompact = () => useMediaQuery("(max-width: 767px), (pointer: coarse)");

/** Catches runtime errors in interactive graphics and renders the static fallback instead. */
export class SceneBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") console.warn("3D scene failed, showing fallback:", error);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
