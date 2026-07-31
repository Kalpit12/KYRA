"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Car, Palette, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";
import {
  filterWraps,
  vehicleTypes,
  windowFilms,
  wrapCategories,
  wrapFinishes,
  type VehicleTypeId,
  type WrapCategoryId,
  type WrapFinishId,
  type WrapOption,
  type WindowFilm,
} from "@/lib/data/simulator";

type SidebarTab = "wrap" | "tint" | "model";

interface WorkshopSidebarProps {
  vehicleTypeId: VehicleTypeId;
  finish: WrapFinishId;
  wrapId: string;
  tintId: string;
  wrap: WrapOption;
  tint: WindowFilm;
  quoteSummary: string;
  onFinishChange: (finish: WrapFinishId) => void;
  onWrapChange: (id: string) => void;
  onTintChange: (id: string) => void;
  onVehicleChange: (id: VehicleTypeId) => void;
}

export function WorkshopSidebar({
  vehicleTypeId,
  finish,
  wrapId,
  tintId,
  wrap,
  tint,
  quoteSummary,
  onFinishChange,
  onWrapChange,
  onTintChange,
  onVehicleChange,
}: WorkshopSidebarProps) {
  const [tab, setTab] = useState<SidebarTab>("wrap");
  const [category, setCategory] = useState<WrapCategoryId>("all");

  const filteredWraps = useMemo(
    () => filterWraps(category, finish),
    [category, finish]
  );

  const vehicleType = vehicleTypes.find((v) => v.id === vehicleTypeId)!;

  return (
    <aside className="flex min-h-0 flex-1 flex-col overflow-hidden border-t border-border bg-muted lg:h-full lg:w-[400px] lg:shrink-0 lg:border-t-0 lg:border-l xl:w-[440px]">
      <div className="border-b border-border p-4 sm:p-6">
        <Eyebrow>KYRA Studio</Eyebrow>
        <h2 className="mt-3 font-display text-2xl font-semibold italic uppercase text-foreground">
          {vehicleType.name}
        </h2>
        <p className="mt-2 font-mono text-[11px] text-kyra-steel">
          {wrap.name} · {finish} · {tint.name}
        </p>
      </div>

      <div className="flex border-b border-border">
        {(
          [
            { id: "wrap" as const, label: "Wrap", icon: Palette },
            { id: "tint" as const, label: "Tint", icon: Sun },
            { id: "model" as const, label: "Model", icon: Car },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "relative flex min-h-[44px] flex-1 items-center justify-center gap-2 py-3 font-mono text-[11px] tracking-[0.1em] uppercase transition sm:text-[10px]",
              tab === item.id ? "text-foreground" : "text-kyra-steel hover:text-foreground/70"
            )}
          >
            <item.icon size={14} />
            {item.label}
            {tab === item.id && (
              <motion.span
                layoutId="sidebarTab"
                className="absolute right-4 bottom-0 left-4 h-0.5 bg-kyra-red"
              />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {tab === "wrap" && (
          <div className="space-y-5">
            <div className="flex border border-border bg-background p-1">
              {wrapFinishes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onFinishChange(item.id)}
                  className={cn(
                    "relative flex min-h-[44px] flex-1 items-center justify-center px-1.5 py-2.5 font-mono text-[10px] tracking-[0.04em] uppercase transition sm:px-2 sm:text-[9px]",
                    finish === item.id ? "text-white" : "text-kyra-steel"
                  )}
                >
                  {finish === item.id && (
                    <motion.span
                      layoutId="finishPill"
                      className="absolute inset-0 bg-kyra-red"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {wrapCategories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={cn(
                    "min-h-[44px] border px-3 py-2 font-mono text-[11px] tracking-[0.06em] uppercase transition sm:text-[10px]",
                    category === item.id
                      ? "border-kyra-red bg-kyra-red/15 text-foreground"
                      : "border-border text-kyra-steel hover:border-kyra-red hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-5 gap-2.5 sm:grid-cols-6 lg:grid-cols-7">
              {filteredWraps.map((item) => {
                const background =
                  item.colors.length > 1
                    ? `linear-gradient(135deg, ${item.colors.join(", ")})`
                    : item.colors[0];

                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.name}
                    onClick={() => onWrapChange(item.id)}
                    className={cn(
                      "aspect-square rounded-full border-2 transition hover:scale-105",
                      wrapId === item.id
                        ? "scale-105 border-kyra-red ring-2 ring-kyra-red/30"
                        : "border-transparent"
                    )}
                    style={{ background }}
                    aria-label={item.name}
                  />
                );
              })}
            </div>

            <div className="border border-border bg-background p-4">
              <p className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
                Selected
              </p>
              <p className="mt-1 font-display text-lg font-semibold italic uppercase text-foreground">
                {wrap.name}
              </p>
              <p className="mt-1 font-mono text-xs text-kyra-steel">
                {wrap.brand} {wrap.series}
              </p>
            </div>
          </div>
        )}

        {tab === "tint" && (
          <div className="space-y-2">
            {windowFilms.map((film) => (
              <button
                key={film.id}
                type="button"
                onClick={() => onTintChange(film.id)}
                className={cn(
                  "flex min-h-[52px] w-full items-center justify-between border px-4 py-3 text-left transition",
                  tintId === film.id
                    ? "border-kyra-red/50 bg-kyra-red/10 text-foreground"
                    : "border-border text-kyra-steel hover:border-[#44444a] hover:text-foreground"
                )}
              >
                <span className="text-sm">{film.name}</span>
                <span
                  className="h-6 w-10 border border-border"
                  style={{
                    backgroundColor: film.overlayColor,
                    opacity: Math.max(0.15, film.overlayOpacity + 0.2),
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {tab === "model" && (
          <div className="grid grid-cols-2 gap-px bg-border">
            {vehicleTypes.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                onClick={() => onVehicleChange(vehicle.id)}
                className={cn(
                  "bg-muted px-4 py-4 text-left transition",
                  vehicleTypeId === vehicle.id
                    ? "ring-1 ring-inset ring-kyra-red"
                    : "hover:bg-panel"
                )}
              >
                <p className="font-display text-sm font-semibold uppercase text-foreground">
                  {vehicle.name}
                </p>
                <p className="mt-1 text-xs text-kyra-steel">{vehicle.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-border p-4 sm:p-6">
        <Button
          href={`/contact?wrap=${encodeURIComponent(quoteSummary)}`}
          variant="primary"
          size="lg"
          className="w-full"
          magnetic
        >
          Get a Quote
        </Button>
        <p className="mt-3 text-center font-mono text-[10px] tracking-[0.08em] text-kyra-steel uppercase">
          Drag to rotate · scroll to zoom
        </p>
      </div>
    </aside>
  );
}
