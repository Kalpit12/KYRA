"use client";

import { useEffect } from "react";
import { registerLenis } from "@/lib/scroll-lock";

function shouldUseNativeScroll() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (window.matchMedia("(pointer: coarse)").matches) return true;
  if (window.innerWidth < 768) return true;
  // Low-power / constrained connections struggle with virtualized smooth scroll
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (nav.connection?.saveData) return true;
  if (nav.connection?.effectiveType === "2g" || nav.connection?.effectiveType === "3g") {
    return true;
  }
  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4) {
    return true;
  }
  return false;
}

/**
 * Desktop-only light Lenis. Production pages (videos, image slideshows) feel
 * laggy under a perpetual RAF smooth-scroll loop — fall back to native scroll
 * on touch, mobile, and constrained devices.
 */
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

    if (shouldUseNativeScroll()) return;

    import("lenis").then(({ default: Lenis }) => {
      if (destroyed) return;

      lenis = new Lenis({
        // Shorter than before — long lerp + heavy paint = scroll lag on Vercel
        duration: 0.75,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
      });

      registerLenis(lenis);

      const raf = (time: number) => {
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      };

      const startRaf = () => {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(raf);
      };

      const stopRaf = () => {
        cancelAnimationFrame(rafId);
        rafId = 0;
      };

      const onVisibility = () => {
        if (document.hidden) {
          lenis?.stop();
          stopRaf();
        } else {
          lenis?.start();
          startRaf();
        }
      };

      document.addEventListener("visibilitychange", onVisibility);
      startRaf();

      // Stash cleanup on the instance for the effect teardown
      (lenis as { __cleanup?: () => void }).__cleanup = () => {
        document.removeEventListener("visibilitychange", onVisibility);
      };
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      const cleanup = (lenis as { __cleanup?: () => void } | null)?.__cleanup;
      cleanup?.();
      registerLenis(null);
      lenis?.destroy();
    };
  }, []);

  return <>{children}</>;
}
