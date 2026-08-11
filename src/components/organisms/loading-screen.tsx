"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/lib/hooks/use-mounted";
import { KyraWordmark } from "@/components/atoms/kyra-logo";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";

const TAGLINES = ["Import", "Customize", "Maintain"];
const LOADER_SEEN_KEY = "kyra-loader-seen";
const MIN_DURATION_MS = 1000;
const SAFETY_MS = 3200;

function hasSeenLoader(): boolean {
  try {
    return sessionStorage.getItem(LOADER_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markLoaderSeen() {
  try {
    sessionStorage.setItem(LOADER_SEEN_KEY, "1");
  } catch {
    // ignore
  }
}

export function LoadingScreen() {
  const mounted = useMounted();
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useScrollLock(isLoading);

  const finishLoading = useCallback(() => {
    setProgress(100);
    setIsExiting(true);
    markLoaderSeen();
    setTimeout(() => setIsLoading(false), 700);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (hasSeenLoader()) {
      setIsLoading(false);
      return;
    }

    const start = Date.now();
    let frame: number;
    let ready = document.readyState !== "loading";

    const onReady = () => {
      ready = true;
    };

    if (!ready) {
      document.addEventListener("DOMContentLoaded", onReady);
    }

    // Fonts + DOM only — do not wait on window.load (huge media).
    void document.fonts?.ready?.then(onReady);

    const tick = () => {
      const elapsed = Date.now() - start;
      const loadFactor = ready ? 1 : 0.75;
      const timeFactor = Math.min(elapsed / MIN_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - timeFactor, 2.2);
      const next = Math.min(98, eased * 100 * loadFactor);

      setProgress((prev) => Math.max(prev, next));

      if (ready && elapsed >= MIN_DURATION_MS) {
        finishLoading();
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    const taglineTimer = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length);
    }, 900);

    const safety = setTimeout(finishLoading, SAFETY_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(taglineTimer);
      clearTimeout(safety);
      document.removeEventListener("DOMContentLoaded", onReady);
    };
  }, [mounted, finishLoading]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="kyra-loader"
          className="fixed inset-0 z-[9999] overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 noise-overlay" />
          <motion.div
            className="absolute -left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-kyra-red/20 blur-[120px]"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-1/4 bottom-1/4 h-[400px] w-[400px] rounded-full bg-white/[0.04] blur-[100px]"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute left-8 top-8 h-12 w-12 border-l border-t border-border" />
          <div className="absolute right-8 top-8 h-12 w-12 border-r border-t border-border" />
          <div className="absolute bottom-8 left-8 h-12 w-12 border-b border-l border-border" />
          <div className="absolute bottom-8 right-8 h-12 w-12 border-b border-r border-border" />

          <motion.div
            className="pointer-events-none absolute inset-0 z-10 bg-background"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: isExiting ? 1 : 0 }}
            style={{ transformOrigin: "top" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          />

          <div className="relative flex h-full flex-col items-center justify-center px-6">
            <div className="relative mb-12">
              <svg
                width={120}
                height={120}
                className="-rotate-90"
                aria-hidden
              >
                <circle
                  cx={60}
                  cy={60}
                  r={54}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                />
                <motion.circle
                  cx={60}
                  cy={60}
                  r={54}
                  fill="none"
                  stroke="url(#kyraProgressGradient)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 54}
                  initial={{ strokeDashoffset: 2 * Math.PI * 54 }}
                  animate={{
                    strokeDashoffset:
                      2 * Math.PI * 54 * (1 - progress / 100),
                  }}
                  transition={{ ease: "easeOut", duration: 0.3 }}
                />
                <defs>
                  <linearGradient
                    id="kyraProgressGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#e2131f" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#e2131f" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display text-sm tabular-nums tracking-wider text-muted-foreground"
                  suppressHydrationWarning
                >
                  {mounted ? Math.round(progress) : 0}
                </span>
              </div>

              <motion.div
                className="absolute inset-2 rounded-full border border-kyra-red/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center"
            >
              <KyraWordmark size="lg" href={null} />
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="mt-4 h-px w-32 bg-gradient-to-r from-transparent via-kyra-red to-transparent md:w-48"
            />

            <div className="mt-6 h-6 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                  className="text-center text-xs uppercase tracking-[0.45em] text-muted-foreground"
                >
                  {TAGLINES[taglineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70"
            >
              Premium Automotive · Nairobi
            </motion.p>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-kyra-red/60 to-transparent"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
