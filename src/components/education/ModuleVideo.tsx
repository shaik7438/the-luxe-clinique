"use client";

import { useEffect, useRef, useState } from "react";

/** Muted looping treatment clip that only plays while on screen; poster only for reduced motion. */
export default function ModuleVideo({ id, label, className = "" }: { id: string; label: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <video
      ref={ref}
      className={`h-full w-full object-cover ${className}`}
      poster={`/videos/learn-${id}.jpg`}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
    >
      {!reduced && <source src={`/videos/learn-${id}.mp4`} type="video/mp4" />}
    </video>
  );
}
