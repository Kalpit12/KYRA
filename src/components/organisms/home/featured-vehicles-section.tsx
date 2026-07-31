"use client";

import { SectionHeading } from "@/components/molecules/section-heading";
import { VehicleCard } from "@/components/molecules/vehicle-card";
import { Button } from "@/components/atoms/button";
import type { Vehicle } from "@/types";

export function FeaturedVehiclesSection({
  vehicles,
}: {
  vehicles: Vehicle[];
}) {
  return (
    <section className="section-padding relative bg-background" id="inventory">
      <div className="container-kyra">
        <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            label="Current Stock"
            title="Every unit comes with a full import dossier — not just a price tag."
            subtitle="Hand-selected luxury vehicles, imported with precision and delivered with white-glove service."
          />
          <Button href="/imports" variant="secondary" size="sm" className="shrink-0">
            View Full Inventory
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
