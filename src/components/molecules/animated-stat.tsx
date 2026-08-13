"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { useMounted } from "@/lib/hooks/use-mounted";

interface AnimatedStatProps {
  value: number;
  suffix?: string;
  pad?: number;
  label: string;
  delay?: number;
  duration?: number;
}

export function AnimatedStat({
  value,
  suffix = "",
  pad,
  label,
  delay = 0,
  duration = 2200,
}: AnimatedStatProps) {
  const mounted = useMounted();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!mounted || !isInView || hasAnimated) return;

    let raf = 0;
    const startAt = performance.now() + delay;

    const tick = (now: number) => {
      if (now < startAt) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const progress = Math.min((now - startAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3.5);
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setHasAnimated(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mounted, isInView, value, delay, duration, hasAnimated]);

  const formatted =
    pad && mounted ? String(display).padStart(pad, "0") : String(display);

  return (
    <div
      ref={ref}
      className="min-w-0 bg-muted/80 px-3 py-3 sm:px-5 sm:py-4"
    >
      <span
        className="inline-flex items-baseline whitespace-nowrap font-hero text-[clamp(1.125rem,2.8vw,1.5rem)] font-extrabold leading-none tracking-[-0.03em] text-foreground tabular-nums"
        suppressHydrationWarning
      >
        {mounted ? formatted : pad ? "0".padStart(pad, "0") : "0"}
        {suffix && (
          <span className="ml-0.5 shrink-0 text-[0.7em] text-kyra-red">{suffix}</span>
        )}
      </span>
      <span className="mt-1.5 block whitespace-nowrap font-mono text-[9px] tracking-[0.1em] text-kyra-steel uppercase sm:text-[10px] sm:tracking-[0.12em]">
        {label}
      </span>
    </div>
  );
}
