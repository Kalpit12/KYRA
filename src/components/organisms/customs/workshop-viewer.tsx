"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import { KyraLoader } from "@/components/atoms/kyra-loader";
import { WorkshopSidebar } from "@/components/organisms/customs/workshop-sidebar";
import {
  buildQuoteSummary,
  defaultWindowFilmId,
  defaultWrapId,
  getVehicleType,
  getWindowFilmById,
  getWrapById,
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
      <div className="flex h-full items-center justify-center bg-background">
        <KyraLoader size="lg" label="Preparing studio" />
      </div>
    ),
  }
);

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
  const [finish, setFinish] = useState<WrapFinishId>("gloss");
  const [wrapId, setWrapId] = useState(defaultWrapId);
  const [tintId, setTintId] = useState(defaultWindowFilmId);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const vehicleType = getVehicleType(vehicleTypeId);
  const wrap = getWrapById(wrapId);
  const tint = getWindowFilmById(tintId);

  const handleFinishChange = (next: WrapFinishId) => {
    setFinish(next);
    if (next === "carbon") {
      const current = getWrapById(wrapId);
      if (current.category !== "carbon") {
        setWrapId("carbon-exposed");
      }
    }
  };

  const quoteSummary = useMemo(
    () => buildQuoteSummary(vehicleType, finish, wrap, tint),
    [vehicleType, finish, wrap, tint]
  );

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex h-[100dvh] flex-col bg-background lg:flex-row"
    >
      <div className="relative flex h-[42dvh] shrink-0 flex-col lg:h-auto lg:min-h-0 lg:flex-1">
        <div className="absolute top-4 left-4 z-20 flex items-center gap-3 sm:top-6 sm:left-6">
          <button
            type="button"
            onClick={onExit}
            className="flex min-h-[44px] items-center gap-2 border border-border bg-background/80 px-4 py-2.5 font-mono text-xs tracking-[0.06em] text-foreground uppercase backdrop-blur-md transition hover:border-kyra-red"
          >
            <ArrowLeft size={16} />
            Exit
          </button>
          <span className="hidden border border-kyra-red/30 bg-kyra-red/10 px-3 py-1 font-mono text-[10px] tracking-[0.12em] text-kyra-red uppercase sm:inline">
            3D Live Preview
          </span>
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-20 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center border border-border bg-background/80 text-foreground backdrop-blur-md transition hover:border-kyra-red sm:top-6 sm:right-6"
          aria-label="Toggle fullscreen"
        >
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>

        <div className="relative h-full w-full">
          <WorkshopCanvas
            key={vehicleTypeId}
            modelPath={vehicleType.modelPath}
            modelScale={vehicleType.modelScale}
            wrap={wrap}
            finish={finish}
            tint={tint}
          />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent lg:hidden" />
      </div>

      <WorkshopSidebar
        vehicleTypeId={vehicleTypeId}
        finish={finish}
        wrapId={wrapId}
        tintId={tintId}
        wrap={wrap}
        tint={tint}
        quoteSummary={quoteSummary}
        onFinishChange={handleFinishChange}
        onWrapChange={setWrapId}
        onTintChange={setTintId}
        onVehicleChange={onSwitchVehicle}
      />
    </motion.div>
  );
}
