"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Car, Maximize2, Minimize2, Palette, Sun } from "lucide-react";
import { KyraLoader } from "@/components/atoms/kyra-loader";
import { Button } from "@/components/atoms/button";
import { QuoteInquiryModal } from "@/components/organisms/customs/quote-inquiry-modal";
import { TintPopover } from "@/components/organisms/customs/tint-popover";
import { VehicleSwitcher } from "@/components/organisms/customs/vehicle-switcher";
import { WrapPopover } from "@/components/organisms/customs/wrap-popover";
import {
  WorkshopErrorBoundary,
  WorkshopModelFallback,
} from "@/components/organisms/customs/three/workshop-error-boundary";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";
import { useGlbStatus, resolveSimulatorModelUrl } from "@/lib/simulator/assert-glb";
import { cn } from "@/lib/utils";
import {
  defaultWindowFilmId,
  defaultWrapId,
  getVehicleType,
  getWindowFilmById,
  getWrapById,
  vehicleTypes,
  type VehicleTypeId,
  type WrapFinishId,
} from "@/lib/data/simulator";

const WorkshopCanvas = dynamic(
  () =>
    import("@/components/organisms/customs/three/workshop-canvas").then(
      (mod) => mod.WorkshopCanvas
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-[#ececee]">
        <KyraLoader size="lg" label="Preparing studio" />
      </div>
    ),
  }
);

type StudioPanel = "model" | "wrap" | "tint";

interface WorkshopViewerProps {
  vehicleTypeId: VehicleTypeId;
  onExit: () => void;
  onSwitchVehicle: (id: VehicleTypeId) => void;
}

export function WorkshopViewer({
  vehicleTypeId,
  onExit,
  onSwitchVehicle,
}: WorkshopViewerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [finish, setFinish] = useState<WrapFinishId>("gloss");
  const [wrapId, setWrapId] = useState(defaultWrapId);
  const [tintId, setTintId] = useState(defaultWindowFilmId);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePanel, setActivePanel] = useState<StudioPanel | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useScrollLock(true);

  const vehicleType = getVehicleType(vehicleTypeId);
  const wrap = getWrapById(wrapId);
  const tint = getWindowFilmById(tintId);
  const modelUrl = resolveSimulatorModelUrl(vehicleType.modelPath);
  const modelStatus = useGlbStatus(vehicleType.modelPath);

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void import("@react-three/drei").then(({ useGLTF }) => {
      if (cancelled) return;
      useGLTF.preload(modelUrl, true);
    });
    return () => {
      cancelled = true;
    };
  }, [modelUrl]);

  useEffect(() => {
    const defaultPath = vehicleTypes[0]?.modelPath;
    if (!defaultPath || defaultPath === vehicleType.modelPath) return;
    const defaultUrl = resolveSimulatorModelUrl(defaultPath);

    const idle =
      "requestIdleCallback" in window
        ? window.requestIdleCallback.bind(window)
        : (cb: () => void) => window.setTimeout(cb, 1800);

    const id = idle(() => {
      void import("@react-three/drei").then(({ useGLTF }) => {
        useGLTF.preload(defaultUrl, true);
      });
    });

    return () => {
      if ("cancelIdleCallback" in window) {
        window.cancelIdleCallback(id as number);
      } else {
        clearTimeout(id as number);
      }
    };
  }, [modelUrl, vehicleType.modelPath]);

  const handleFinishChange = (next: WrapFinishId) => {
    setFinish(next);
    if (next === "carbon") {
      const current = getWrapById(wrapId);
      if (current.category !== "carbon") {
        setWrapId("carbon-exposed");
      }
    }
  };

  const handleWrapChange = (id: string) => {
    setWrapId(id);
    const next = getWrapById(id);
    if (next.category === "carbon" && finish !== "carbon") {
      setFinish("carbon");
    }
  };

  const toggleFullscreen = async () => {
    const node = rootRef.current;
    if (!node) return;
    if (!document.fullscreenElement) {
      await node.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  const togglePanel = (panel: StudioPanel) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  return (
    <motion.div
      ref={rootRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#ececee]"
    >
      <div className="absolute inset-0">
        {modelStatus === "checking" ? (
          <div className="flex h-full items-center justify-center bg-[#ececee]">
            <KyraLoader size="lg" label="Preparing studio" />
          </div>
        ) : modelStatus === "invalid" ? (
          <WorkshopModelFallback message="This vehicle model did not deploy as a valid 3D file. Please try another body style or contact KYRA Customs." />
        ) : (
          <WorkshopErrorBoundary
            key={vehicleTypeId}
            fallback={
              <WorkshopModelFallback message="The wrap simulator hit a WebGL error. Try another browser or disable hardware acceleration blockers." />
            }
          >
            <WorkshopCanvas
              modelPath={modelUrl}
              modelScale={vehicleType.modelScale}
              wrap={wrap}
              finish={finish}
              tint={tint}
            />
          </WorkshopErrorBoundary>
        )}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="pointer-events-auto absolute top-4 left-4 sm:top-6 sm:left-6">
          <button
            type="button"
            onClick={onExit}
            className="flex min-h-[44px] items-center gap-2 border border-white/15 bg-black/55 px-4 py-2.5 font-mono text-xs tracking-[0.08em] text-white uppercase backdrop-blur-md transition hover:border-kyra-red"
          >
            <ArrowLeft size={16} />
            Exit
          </button>
        </div>

        <div className="pointer-events-auto absolute top-4 right-4 flex items-center gap-2 sm:top-6 sm:right-6">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => setQuoteOpen(true)}
          >
            Get a Quote
          </Button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border border-white/15 bg-black/55 text-white backdrop-blur-md transition hover:border-kyra-red"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        <div className="pointer-events-auto absolute bottom-5 left-1/2 w-[min(96vw,40rem)] -translate-x-1/2 sm:bottom-8">
          <AnimatePresence>
            {activePanel === "model" && (
              <VehicleSwitcher
                key="model"
                currentId={vehicleTypeId}
                onSelect={(id) => {
                  onSwitchVehicle(id);
                  setActivePanel(null);
                }}
                onClose={() => setActivePanel(null)}
              />
            )}
            {activePanel === "wrap" && (
              <WrapPopover
                key="wrap"
                finish={finish}
                wrapId={wrapId}
                onFinishChange={handleFinishChange}
                onWrapChange={handleWrapChange}
                onClose={() => setActivePanel(null)}
              />
            )}
            {activePanel === "tint" && (
              <TintPopover
                key="tint"
                tintId={tintId}
                onTintChange={setTintId}
                onClose={() => setActivePanel(null)}
              />
            )}
          </AnimatePresence>

          <div className="grid grid-cols-3 gap-2">
            {(
              [
                {
                  id: "model" as const,
                  label: "Vehicle",
                  detail: vehicleType.name,
                  icon: Car,
                },
                {
                  id: "wrap" as const,
                  label: "Wrap",
                  detail: wrap.name,
                  icon: Palette,
                },
                {
                  id: "tint" as const,
                  label: "Tint",
                  detail: tint.name,
                  icon: Sun,
                },
              ] as const
            ).map((item) => {
              const active = activePanel === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => togglePanel(item.id)}
                  className={cn(
                    "flex min-h-[72px] flex-col items-center justify-center gap-1 border px-2 py-3 text-white backdrop-blur-md transition sm:min-h-[80px] sm:px-3",
                    active
                      ? "border-kyra-red bg-black/75"
                      : "border-white/12 bg-black/55 hover:border-white/30"
                  )}
                >
                  <item.icon size={18} className={active ? "text-kyra-red" : "text-white/80"} />
                  <span className="font-mono text-[10px] tracking-[0.14em] uppercase">
                    {item.label}
                  </span>
                  <span className="max-w-full truncate font-mono text-[9px] tracking-[0.06em] text-white/55 uppercase">
                    {item.detail}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <QuoteInquiryModal
        open={quoteOpen}
        onClose={() => setQuoteOpen(false)}
        vehicleType={vehicleType}
        finish={finish}
        wrap={wrap}
        tint={tint}
      />
    </motion.div>
  );
}
