import { VehicleForm } from "@/components/organisms/admin/vehicle-form";

export default function NewVehiclePage() {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
        Inventory
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold italic uppercase text-foreground">
        Add vehicle
      </h1>
      <div className="mt-8">
        <VehicleForm />
      </div>
    </div>
  );
}
