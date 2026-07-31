"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Car, Truck, Box } from "lucide-react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "@/components/atoms/eyebrow";
import type { VehicleType, VehicleTypeId } from "@/lib/data/simulator";

const iconMap: Record<VehicleTypeId, React.ReactNode> = {
  sedan: <Car className="h-8 w-8" strokeWidth={1.2} />,
  suv: <Truck className="h-8 w-8" strokeWidth={1.2} />,
  "mini-suv": <Car className="h-7 w-7" strokeWidth={1.2} />,
  pickup: <Truck className="h-8 w-8" strokeWidth={1.2} />,
  coupe: <Car className="h-7 w-7" strokeWidth={1.2} />,
  hatchback: <Box className="h-7 w-7" strokeWidth={1.2} />,
};

interface VehicleTypeGridProps {
  vehicles: VehicleType[];
  onSelect: (id: VehicleTypeId) => void;
  onBack?: () => void;
}

export function VehicleTypeGrid({ vehicles, onSelect, onBack }: VehicleTypeGridProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="container-kyra px-6 pb-16 pt-24 md:pt-28 lg:px-20"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mb-8 flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-kyra-steel uppercase transition hover:text-foreground"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Step 1 of 2</Eyebrow>
          <h2 className="mt-3 font-display text-3xl font-semibold italic uppercase text-foreground md:text-4xl">
            Choose your vehicle
          </h2>
        </div>
        <p className="max-w-sm text-sm text-kyra-steel">
          Select a body type to load into the KYRA 3D workshop.
        </p>
      </div>

      <div className="mt-8 md:mt-10">
        <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-kyra-steel uppercase md:hidden">
          Swipe to choose a body type →
        </p>
        <div className="scroll-fade-x flex snap-x snap-mandatory gap-px overflow-x-auto bg-border pb-4 [-ms-overflow-style:none] [scrollbar-width:none] md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden">
        {vehicles.map((vehicle, index) => (
          <motion.button
            key={vehicle.id}
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            whileHover={{ y: -4 }}
            onClick={() => onSelect(vehicle.id)}
            className={cn(
              "group min-w-[85vw] snap-start border border-border bg-muted p-6 text-left transition sm:min-w-[280px] md:min-w-0",
              "hover:border-[#44444a] hover:bg-panel"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="text-kyra-steel transition group-hover:text-kyra-red">
                {iconMap[vehicle.id]}
              </span>
              <span className="border border-border px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] text-kyra-steel uppercase">
                3D
              </span>
            </div>

            <h3 className="mt-6 font-display text-xl font-semibold italic uppercase text-foreground">
              {vehicle.name}
            </h3>
            <p className="mt-2 text-sm text-kyra-steel">{vehicle.description}</p>

            <ul className="mt-4 space-y-1.5">
              {vehicle.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-xs text-kyra-steel"
                >
                  <span className="text-kyra-red">›</span>
                  {feature}
                </li>
              ))}
            </ul>

            <span className="mt-6 inline-block font-mono text-[10px] tracking-[0.1em] text-kyra-red uppercase opacity-0 transition group-hover:opacity-100">
              Enter workshop →
            </span>
          </motion.button>
        ))}
        </div>
      </div>
    </motion.div>
  );
}
