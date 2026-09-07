import type { Metadata } from "next";
import { Suspense } from "react";
import { ImportsContent } from "./imports-content";
import { getVehicles } from "@/lib/admin/vehicles";

export const metadata: Metadata = {
  title: "Platinum Imports",
  description:
    "Browse KYRA Platinum Imports in Nairobi — curated luxury vehicles with verified history, full import dossiers, and white-glove delivery from Spring Valley.",
  alternates: { canonical: "/imports" },
};

export const revalidate = 60;

export default async function ImportsPage() {
  const vehicles = await getVehicles();

  return (
    <Suspense
      fallback={
        <div className="section-padding bg-background">
          <div className="container-kyra py-24 text-center font-mono text-xs tracking-[0.12em] text-kyra-steel uppercase">
            Loading inventory…
          </div>
        </div>
      }
    >
      <ImportsContent vehicles={vehicles} />
    </Suspense>
  );
}
