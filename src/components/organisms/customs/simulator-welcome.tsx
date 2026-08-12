"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { PageHeroVideo } from "@/components/molecules/page-hero-video";
import { wrapCatalog, wrapFinishes, type WrapFinishId } from "@/lib/data/simulator";
import { warmDefaultSimulatorAssets } from "@/lib/simulator/preload";

const CUSTOMS_HERO_VIDEO = "/video/custom-hero.mp4";
const CUSTOMS_HERO_POSTER = "/video/posters/custom-hero.jpg";

interface SimulatorWelcomeProps {
  onStart: () => void;
}

const highlights = [
  { value: "100+", label: "Wrap colours" },
  { value: "4", label: "Finish types" },
  { value: "6", label: "Window films" },
];

const previewWraps = wrapCatalog.filter((w) => w.category === "solid").slice(0, 8);

export function SimulatorWelcome({ onStart }: SimulatorWelcomeProps) {
  const [activeWrapId, setActiveWrapId] = useState(previewWraps[0]?.id ?? "midnight-blue");
  const [activeFinish, setActiveFinish] = useState<WrapFinishId>("gloss");
  const activeWrap = previewWraps.find((w) => w.id === activeWrapId) ?? previewWraps[0];
  const primary = activeWrap?.colors[0] ?? "#0F2C59";
  const secondary = activeWrap?.colors[1] ?? primary;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[52vh] overflow-hidden py-16 md:min-h-[calc(100vh-5rem)] md:py-0"
    >
      <PageHeroVideo src={CUSTOMS_HERO_VIDEO} poster={CUSTOMS_HERO_POSTER} />
      <div className="absolute inset-0 bg-gradient-to-r from-background/55 via-background/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />

      <div className="container-kyra relative z-10 flex min-h-[52vh] flex-col items-center justify-center px-6 md:min-h-[calc(100vh-5rem)] lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-20">
        <div className="max-w-xl text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Eyebrow showChevrons className="justify-center lg:justify-start">
              KYRA Customs Studio
            </Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-hero mt-5 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.98] text-foreground"
          >
            Visualize your
            <span className="text-kyra-red"> perfect wrap.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 text-base leading-relaxed text-foreground/85"
          >
            Full 3D preview with real-time wrap colours, PPF finishes, and window
            tint — built for KYRA clients in Nairobi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row lg:justify-start"
          >
            <Button
              size="lg"
              onClick={() => {
                warmDefaultSimulatorAssets();
                onStart();
              }}
              onMouseEnter={warmDefaultSimulatorAssets}
              onFocus={warmDefaultSimulatorAssets}
              className="px-10"
            >
              Launch Simulator
            </Button>
            <Button href="/contact" variant="secondary" size="lg">
              Book Consultation
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-10 w-full max-w-md lg:mt-0"
        >
          <div className="border border-border bg-background/95 p-4 sm:p-5">
            <div className="relative overflow-hidden border border-border">
              <div
                className="absolute top-0 right-0 z-10 h-10 w-10 bg-kyra-red"
                style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
                aria-hidden
              />
              <div className="absolute top-3 left-3 z-10 border border-border bg-background/90 px-2 py-1 font-mono text-[9px] tracking-[0.14em] text-kyra-red uppercase">
                Colour Lab
              </div>

              <button
                type="button"
                onClick={() => {
                  warmDefaultSimulatorAssets();
                  onStart();
                }}
                onMouseEnter={warmDefaultSimulatorAssets}
                onFocus={warmDefaultSimulatorAssets}
                className="group relative block aspect-[4/3] w-full overflow-hidden text-left"
                aria-label="Open wrap simulator"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeWrapId}-${activeFinish}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0"
                    style={{
                      background:
                        activeFinish === "carbon"
                          ? `
                            linear-gradient(135deg, ${primary} 25%, transparent 25%) -6px 0 / 12px 12px,
                            linear-gradient(225deg, ${primary} 25%, transparent 25%) -6px 0 / 12px 12px,
                            linear-gradient(315deg, ${secondary} 25%, transparent 25%) 0 0 / 12px 12px,
                            linear-gradient(45deg, ${secondary} 25%, ${primary} 25%) 0 0 / 12px 12px
                          `
                          : activeFinish === "matte"
                            ? primary
                            : activeFinish === "satin"
                              ? `linear-gradient(145deg, ${primary} 0%, ${secondary} 55%, ${primary} 100%)`
                              : `linear-gradient(135deg, ${lighten(primary, 0.22)} 0%, ${primary} 42%, ${secondary} 100%)`,
                    }}
                  />
                </AnimatePresence>

                {/* Gloss / satin sheen */}
                {activeFinish !== "matte" && activeFinish !== "carbon" && (
                  <div
                    className="pointer-events-none absolute inset-0 opacity-70"
                    style={{
                      background:
                        "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.28) 48%, transparent 62%)",
                    }}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.18),transparent_50%)]" />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4 pb-4 pt-10">
                  <p className="font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase">
                    {activeFinish} finish
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold italic uppercase text-white">
                    {activeWrap?.name}
                  </p>
                  <p className="mt-2 font-mono text-[10px] tracking-[0.12em] text-white/80 uppercase transition group-hover:text-kyra-red">
                    Open 3D workshop →
                  </p>
                </div>
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              {wrapFinishes.map((finish) => (
                <button
                  key={finish.id}
                  type="button"
                  onClick={() => setActiveFinish(finish.id)}
                  className={`flex-1 border px-2 py-2 font-mono text-[10px] tracking-[0.1em] uppercase transition ${
                    activeFinish === finish.id
                      ? "border-kyra-red bg-kyra-red/10 text-kyra-red"
                      : "border-border text-kyra-steel hover:border-foreground/40 hover:text-foreground"
                  }`}
                >
                  {finish.label}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {previewWraps.map((wrap) => {
                const selected = wrap.id === activeWrapId;
                return (
                  <button
                    key={wrap.id}
                    type="button"
                    title={wrap.name}
                    onClick={() => setActiveWrapId(wrap.id)}
                    className={`h-8 w-8 border transition ${
                      selected
                        ? "border-kyra-red ring-1 ring-kyra-red"
                        : "border-border hover:border-foreground/50"
                    }`}
                    style={{ backgroundColor: wrap.colors[0] }}
                    aria-label={wrap.name}
                    aria-pressed={selected}
                  />
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-dashed border-border pt-5">
              {highlights.map((item) => (
                <div key={item.label} className="text-center">
                  <p className="font-mono text-2xl text-foreground">{item.value}</p>
                  <p className="mt-1 font-mono text-[9px] tracking-[0.1em] text-kyra-steel uppercase">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function lighten(hex: string, amount: number) {
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const to = (c: number) =>
    Math.min(255, Math.round(c + (255 - c) * amount))
      .toString(16)
      .padStart(2, "0");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `#${to(r)}${to(g)}${to(b)}`;
}
