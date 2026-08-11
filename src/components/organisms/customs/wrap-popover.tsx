"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  filterWraps,
  wrapCategories,
  wrapFinishes,
  type WrapCategoryId,
  type WrapFinishId,
} from "@/lib/data/simulator";
import { carbonSwatchBackground } from "@/lib/simulator/carbon-texture";

interface WrapPopoverProps {
  finish: WrapFinishId;
  wrapId: string;
  onFinishChange: (finish: WrapFinishId) => void;
  onWrapChange: (id: string) => void;
  onClose: () => void;
}

export function WrapPopover({
  finish,
  wrapId,
  onFinishChange,
  onWrapChange,
  onClose,
}: WrapPopoverProps) {
  const [category, setCategory] = useState<WrapCategoryId>("all");

  const filteredWraps = useMemo(
    () => filterWraps(category, finish),
    [category, finish]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      className="absolute bottom-full left-1/2 mb-4 w-[min(92vw,34rem)] -translate-x-1/2 border border-border bg-muted/95 p-3 shadow-2xl backdrop-blur-xl sm:p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
          Wrap Colour
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-kyra-steel transition hover:text-foreground"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="relative flex max-w-sm border border-border bg-background p-1">
        {wrapFinishes.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onFinishChange(item.id)}
            className={cn(
              "relative z-10 flex-1 px-3 py-1.5 font-mono text-[10px] tracking-[0.06em] uppercase transition-colors",
              finish === item.id ? "text-white" : "text-kyra-steel"
            )}
          >
            {finish === item.id && (
              <motion.span
                layoutId="wrapFinishTab"
                className="absolute inset-0 bg-kyra-red"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {wrapCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.id)}
            className={cn(
              "shrink-0 border px-3 py-1 font-mono text-[10px] tracking-[0.06em] uppercase transition sm:text-xs",
              category === item.id
                ? "border-kyra-red bg-kyra-red text-white"
                : "border-border text-kyra-steel hover:border-kyra-red hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-3 h-[86px] overflow-y-auto sm:h-[96px]">
        <div className="grid grid-cols-7 gap-2 sm:grid-cols-8">
          {filteredWraps.map((wrap) => {
            const isCarbon = wrap.category === "carbon" || finish === "carbon";
            const isGradient = !isCarbon && wrap.colors.length > 1;
            const background = isCarbon
              ? carbonSwatchBackground(
                  wrap.colors[0],
                  wrap.id.includes("forged")
                )
              : isGradient
                ? `linear-gradient(135deg, ${wrap.colors.join(", ")})`
                : wrap.colors[0];

            return (
              <button
                key={wrap.id}
                type="button"
                title={`${wrap.brand ?? "KYRA"} ${wrap.series ?? ""} - ${wrap.name}`}
                onClick={() => onWrapChange(wrap.id)}
                className={cn(
                  "h-9 w-9 rounded-full border-2 transition hover:scale-110",
                  wrapId === wrap.id
                    ? "scale-105 border-kyra-red ring-2 ring-kyra-red/30"
                    : "border-transparent"
                )}
                style={
                  isCarbon
                    ? {
                        backgroundColor: "#1a1a1a",
                        backgroundImage: background,
                        backgroundSize: "12px 12px",
                      }
                    : isGradient
                      ? { backgroundImage: background }
                      : { backgroundColor: background }
                }
                aria-label={wrap.name}
              />
            );
          })}
        </div>
      </div>

      <p className="mt-3 text-center font-mono text-[10px] text-kyra-steel">
        {filteredWraps.find((w) => w.id === wrapId)?.name ?? "Select a colour"}
      </p>
    </motion.div>
  );
}
