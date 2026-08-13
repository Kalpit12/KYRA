"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import type { Vehicle } from "@/types";

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

const statusLabels: Record<Vehicle["status"], string> = {
  available: "Import Ready",
  reserved: "Reserved",
  sold: "Sold",
};

const statusStyles: Record<Vehicle["status"], string> = {
  available:
    "border-kyra-red/30 bg-kyra-red text-white shadow-[0_4px_14px_rgba(226,19,31,0.35)]",
  reserved:
    "border-foreground/20 bg-foreground text-background shadow-[0_4px_14px_rgba(0,0,0,0.25)]",
  sold: "border-border bg-muted text-muted-foreground",
};

function formatBodyType(bodyType?: Vehicle["bodyType"]) {
  if (!bodyType) return null;
  return bodyType.replace(/^\w/, (c) => c.toUpperCase());
}

export function VehicleCard({ vehicle, index = 0 }: VehicleCardProps) {
  const bodyLabel = formatBodyType(vehicle.bodyType);
  const specs = [
    { label: "Year", value: String(vehicle.year) },
    { label: "Transmission", value: vehicle.transmission },
    { label: "Fuel", value: vehicle.fuel },
    { label: "Mileage", value: `${vehicle.mileage.toLocaleString()} km` },
    bodyLabel ? { label: "Body", value: bodyLabel } : null,
    vehicle.exteriorColor
      ? { label: "Color", value: vehicle.exteriorColor }
      : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <motion.article
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.76, 0, 0.24, 1],
      }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link href={`/imports/${vehicle.slug}`} className="block">
        <div className="border border-border bg-muted transition-all duration-250 group-hover:border-[#44444a]">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={vehicle.image}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading={index < 3 ? "eager" : "lazy"}
              priority={index === 0}
            />
            <div
              className={cn(
                "absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] uppercase",
                statusStyles[vehicle.status]
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 shrink-0 rounded-full",
                  vehicle.status === "available" && "bg-white",
                  vehicle.status === "reserved" && "bg-kyra-red",
                  vehicle.status === "sold" && "bg-kyra-steel"
                )}
                aria-hidden
              />
              {statusLabels[vehicle.status]}
            </div>
            {vehicle.stockNumber && (
              <span className="absolute top-3 right-3 z-10 border border-white/30 bg-black/55 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-white uppercase">
                {vehicle.stockNumber}
              </span>
            )}
          </div>

          <div className="p-5">
            <span className="mb-2 block font-mono text-[10.5px] tracking-[0.1em] text-kyra-red uppercase">
              {vehicle.brand}
            </span>
            <h3 className="font-display text-lg font-semibold italic uppercase text-foreground">
              {vehicle.model}
              {vehicle.trim ? (
                <span className="mt-0.5 block text-sm font-medium normal-case not-italic text-kyra-steel">
                  {vehicle.trim}
                </span>
              ) : null}
            </h3>

            <div className="mt-4 space-y-2">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex justify-between border-b border-dashed border-border pb-1 font-mono text-[11px] text-muted-foreground"
                >
                  <span>{spec.label}</span>
                  <b className="font-normal text-foreground">{spec.value}</b>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
              <div>
                <p className="font-mono text-lg font-bold text-foreground">
                  {formatPrice(vehicle.price)}
                </p>
                <span className="font-mono text-[10px] text-kyra-steel">
                  Incl. import dossier
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold tracking-[0.08em] text-foreground uppercase">
                View
                <span className="text-kyra-red">→</span>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
