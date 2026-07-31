"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { WrapColorSwatch } from "@/components/molecules/wrap-color-swatch";
import { SvgWrapPreview } from "@/components/organisms/customs/svg-wrap-preview";
import {
  showcaseVehicles,
  getVehicleImages,
  configuratorSteps,
} from "@/lib/data/wraps";
import type { WrapColor, WrapFinish } from "@/lib/data/wraps";

const VIEW_TRANSFORMS = [
  { scale: 1, x: 0, label: "Front 3/4" },
  { scale: 0.92, x: -12, label: "Side Profile" },
  { scale: 0.88, x: 8, label: "Rear 3/4" },
];

function WrapCarImage({
  src,
  alt,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-sm text-neutral-500">Preview unavailable</p>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={cn("object-contain object-center", className)}
      sizes="(max-width: 1024px) 100vw, 70vw"
      onError={() => setError(true)}
    />
  );
}

export function WrapConfigurator() {
  const [vehicleIndex, setVehicleIndex] = useState(0);
  const [finishIndex, setFinishIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [hoveredColor, setHoveredColor] = useState<WrapColor | null>(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const vehicle = showcaseVehicles[vehicleIndex];
  const finish: WrapFinish = vehicle.finishes[finishIndex];
  const activeColor = hoveredColor ?? finish.colors[colorIndex];
  const viewTransform = VIEW_TRANSFORMS[viewIndex];
  const isSvgMode = vehicle.renderMode === "svg" && vehicle.svgPath;

  useEffect(() => {
    if (vehicle.renderMode === "image") {
      getVehicleImages(vehicle.id).forEach((src) => {
        const img = new window.Image();
        img.src = src;
      });
    }
  }, [vehicle.id, vehicle.renderMode]);

  const handleVehicleChange = useCallback((index: number) => {
    setVehicleIndex(index);
    setFinishIndex(0);
    setColorIndex(0);
    setHoveredColor(null);
    setViewIndex(0);
    setActiveStep(1);
  }, []);

  const handleFinishChange = useCallback((index: number) => {
    setFinishIndex(index);
    setColorIndex(0);
    setHoveredColor(null);
    setActiveStep(2);
  }, []);

  const imageKey = useMemo(
    () => `${vehicle.id}-${activeColor.id}-view-${viewIndex}`,
    [vehicle.id, activeColor.id, viewIndex]
  );

  const previewContent = isSvgMode ? (
    <SvgWrapPreview
      svgPath={vehicle.svgPath!}
      vehicleId={vehicle.id}
      color={activeColor.hex}
      finish={finish}
      finishId={finish.id}
      viewIndex={viewIndex}
      vehicleName={vehicle.name}
      colorName={activeColor.name}
    />
  ) : (
    <div className="relative h-full w-full">
      <AnimatePresence mode="sync">
        <motion.div
          key={imageKey}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            scale: viewTransform.scale,
            x: `${viewTransform.x}%`,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <WrapCarImage
            src={activeColor.image}
            alt={`${vehicle.name} — ${activeColor.name}`}
            priority={vehicleIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );

  const thumbnailPreview = isSvgMode ? (
    <SvgWrapPreview
      svgPath={vehicle.svgPath!}
      vehicleId={vehicle.id}
      color={activeColor.hex}
      finish={finish}
      finishId={finish.id}
      viewIndex={0}
      vehicleName={vehicle.name}
      colorName={activeColor.name}
      className="scale-90"
    />
  ) : (
    <WrapCarImage
      src={vehicle.baseImage}
      alt={vehicle.name}
      className="object-cover"
    />
  );

  return (
    <>
      <section className="relative flex min-h-screen flex-col bg-background pt-20">
        <nav
          aria-label="Configurator steps"
          className="border-b border-border bg-background"
        >
          <div className="flex items-center gap-0 overflow-x-auto px-4 md:px-8">
            {configuratorSteps.map((step, i) => (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  if (step.id === "vehicle") setActiveStep(0);
                  if (step.id === "finish") setActiveStep(1);
                  if (step.id === "colour") setActiveStep(2);
                }}
                className={cn(
                  "relative shrink-0 px-4 py-4 text-[11px] font-medium uppercase tracking-[0.2em] transition-colors md:px-6 md:text-xs",
                  activeStep === i
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {step.label}
                {activeStep === i && (
                  <span className="absolute bottom-0 left-4 right-4 h-px bg-kyra-red md:left-6 md:right-6" />
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex gap-2 border-b border-border px-4 py-3 md:px-8">
          {showcaseVehicles.map((v, i) => (
            <button
              key={v.id}
              type="button"
              onClick={() => handleVehicleChange(i)}
              className={cn(
                "rounded-sm px-4 py-2 text-xs uppercase tracking-wider transition-all",
                vehicleIndex === i
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v.name}
              {v.renderMode === "svg" && (
                <span className="ml-1.5 text-[9px] text-kyra-red">3D</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col lg:flex-row lg:min-h-[calc(100vh-140px)]">
          <div className="relative flex min-h-[50vh] flex-1 flex-col bg-[#E8E8E8] lg:min-h-0">
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-neutral-700 shadow-sm transition hover:bg-white"
              aria-label="Expand preview"
            >
              <Maximize2 size={18} />
            </button>

            <div className="relative flex-1 px-4 py-8 md:px-12 md:py-12">
              <div className="relative mx-auto h-full min-h-[320px] max-w-5xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${vehicle.id}-${isSvgMode ? "svg" : activeColor.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    {previewContent}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 border-t border-neutral-300/50 bg-[#E8E8E8] py-4">
              <button
                type="button"
                onClick={() =>
                  setViewIndex(
                    (v) => (v - 1 + VIEW_TRANSFORMS.length) % VIEW_TRANSFORMS.length
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-400/60 text-neutral-600 transition hover:border-neutral-600 hover:bg-white/50"
                aria-label="Previous view"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="min-w-[120px] text-center text-xs uppercase tracking-widest text-neutral-600">
                {VIEW_TRANSFORMS[viewIndex].label} · drag to rotate
              </span>
              <button
                type="button"
                onClick={() =>
                  setViewIndex((v) => (v + 1) % VIEW_TRANSFORMS.length)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-400/60 text-neutral-600 transition hover:border-neutral-600 hover:bg-white/50"
                aria-label="Next view"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <aside className="flex w-full flex-col border-t border-border bg-muted lg:w-[380px] lg:shrink-0 lg:border-l lg:border-t-0 xl:w-[420px]">
            <div className="border-b border-border p-6">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-[#E8E8E8]">
                {thumbnailPreview}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                Exterior Wrap
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSvgMode
                  ? "Drag the car to rotate · body panels update instantly"
                  : "Select finish type and colour"}
              </p>

              <div className="mt-6 border-b border-border pb-6">
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  {finish.name}
                </p>
                <motion.p
                  key={activeColor.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 font-display text-lg text-foreground"
                >
                  {activeColor.name}
                </motion.p>
                <p
                  className="mt-2 inline-block rounded px-2 py-0.5 text-[10px] uppercase tracking-wider"
                  style={{
                    backgroundColor: `${activeColor.hex}22`,
                    color: activeColor.hex,
                  }}
                >
                  {activeColor.hex}
                </p>
              </div>

              <div className="mt-6 space-y-8">
                {vehicle.finishes.map((f, i) => (
                  <div key={`${vehicle.id}-${f.id}`}>
                    <button
                      type="button"
                      onClick={() => handleFinishChange(i)}
                      className={cn(
                        "mb-4 text-left text-xs font-medium uppercase tracking-[0.2em] transition-colors",
                        finishIndex === i
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {f.name}
                    </button>

                    {finishIndex === i && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-5 gap-2 sm:grid-cols-6"
                      >
                        {f.colors.map((color, ci) => (
                          <WrapColorSwatch
                            key={color.id}
                            hex={color.hex}
                            name={color.name}
                            selected={!hoveredColor && colorIndex === ci}
                            previewing={hoveredColor?.id === color.id}
                            onClick={() => {
                              setColorIndex(ci);
                              setHoveredColor(null);
                              setActiveStep(2);
                            }}
                            onMouseEnter={() => setHoveredColor(color)}
                            onMouseLeave={() => setHoveredColor(null)}
                          />
                        ))}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border p-6">
              <Button
                href={`/contact?wrap=${encodeURIComponent(`${vehicle.name} — ${finish.name} ${activeColor.name}`)}`}
                variant="primary"
                size="lg"
                className="w-full"
                magnetic
              >
                Get a Quote
              </Button>
              <p className="mt-3 text-center text-[10px] text-muted-foreground">
                Final colour may vary slightly from screen preview
              </p>
            </div>
          </aside>
        </div>
      </section>

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-[#E8E8E8]"
          >
            <div className="flex items-center justify-between border-b border-neutral-300/50 px-6 py-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500">
                  {vehicle.name} · {finish.name}
                </p>
                <p className="font-display text-xl text-neutral-900">
                  {activeColor.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-700 shadow"
                aria-label="Close fullscreen"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative flex-1 p-8">{previewContent}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
