import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapVehicleRow, type VehicleRow } from "@/lib/admin/types";
import { VehicleForm } from "@/components/organisms/admin/vehicle-form";

export const dynamic = "force-dynamic";

export default async function EditVehiclePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const vehicle = mapVehicleRow(data as VehicleRow);

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
        Inventory
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold italic uppercase text-foreground">
        Edit vehicle
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {vehicle.brand} {vehicle.model}
      </p>
      <div className="mt-8">
        <VehicleForm initial={vehicle} />
      </div>
    </div>
  );
}
