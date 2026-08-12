"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { vehicleTypes, type VehicleTypeId } from "@/lib/data/simulator";

interface VehicleSwitcherProps {
  currentId: VehicleTypeId;
  onSelect: (id: VehicleTypeId) => void;
  onClose: () => void;
}

export function VehicleSwitcher({
  currentId,
  onSelect,
  onClose,
}: VehicleSwitcherProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      className="absolute bottom-full left-1/2 mb-4 w-[min(92vw,28rem)] -translate-x-1/2 border border-white/12 bg-[#121214]/92 p-3 text-white shadow-2xl backdrop-blur-xl sm:p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-[10px] tracking-[0.12em] text-white/55 uppercase">
          Switch Vehicle
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

      <div className="grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-3">
        {vehicleTypes.map((vehicle) => (
          <button
            key={vehicle.id}
            type="button"
            onClick={() => onSelect(vehicle.id)}
            className={cn(
              "bg-[#121214] px-3 py-3 text-left text-sm transition",
              currentId === vehicle.id
                ? "ring-1 ring-inset ring-kyra-red text-white"
                : "text-white/55 hover:bg-white/5 hover:text-white"
            )}
          >
            <span className="font-display font-semibold uppercase">{vehicle.name}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
