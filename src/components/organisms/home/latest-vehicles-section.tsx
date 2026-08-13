"use client";

import { SectionHeading } from "@/components/molecules/section-heading";
import { VehicleCard } from "@/components/molecules/vehicle-card";
import type { Vehicle } from "@/types";

export function LatestVehiclesSection({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section className="home-section-cv section-padding border-t border-border bg-muted">
      <div className="container-kyra">
        <SectionHeading
          label="New Arrivals"
          title="Latest vehicles."
          subtitle="Fresh imports arriving weekly. Each vehicle inspected, certified, and ready for delivery."
          className="mb-16"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.slice(0, 6).map((vehicle, index) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
