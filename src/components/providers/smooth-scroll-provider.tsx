"use client";

import { useEffect } from "react";
import { registerLenis } from "@/lib/scroll-lock";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    let destroyed = false;
    let rafId = 0;
    let lenis: {
      raf: (time: number) => void;
      destroy: () => void;
      stop: () => void;
      start: () => void;
    } | null = null;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;

      const isCoarse =
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768;

      lenis = new Lenis({
        duration: isCoarse ? 0.85 : 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: !isCoarse,
      });

      registerLenis(lenis);

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      registerLenis(null);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
