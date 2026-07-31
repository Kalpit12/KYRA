import { Suspense } from "react";
import AdminVehiclesClient from "./vehicles-client";

export default function AdminVehiclesPage() {
  return (
    <Suspense
      fallback={
        <p className="font-mono text-xs tracking-[0.12em] text-kyra-steel uppercase">
          Loading vehicles…
        </p>
      }
    >
      <AdminVehiclesClient />
    </Suspense>
  );
}
