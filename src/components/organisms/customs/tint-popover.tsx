"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { windowFilms } from "@/lib/data/simulator";

interface TintPopoverProps {
  tintId: string;
  onTintChange: (id: string) => void;
  onClose: () => void;
}

export function TintPopover({ tintId, onTintChange, onClose }: TintPopoverProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      className="absolute bottom-full left-1/2 mb-4 w-[min(92vw,22rem)] -translate-x-1/2 border border-white/12 bg-[#121214]/92 p-3 text-white shadow-2xl backdrop-blur-xl sm:p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-[0.12em] text-white/55 uppercase">
          Window Tint
        </p>
        <button
          type="button"
          onClick={onClose}
          className="text-white/55 transition hover:text-white"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {windowFilms.map((film) => (
          <button
            key={film.id}
            type="button"
            onClick={() => onTintChange(film.id)}
            className={cn(
              "border px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] uppercase transition sm:text-xs",
              tintId === film.id
                ? "border-kyra-red bg-kyra-red text-white"
                : "border-white/15 text-white/60 hover:border-kyra-red hover:text-white"
            )}
          >
            {film.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
