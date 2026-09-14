import type { VehicleStatus } from "@/types";

export const VEHICLE_STATUSES = [
  "in_stock",
  "on_the_way",
  "reserved",
  "sold",
] as const satisfies readonly VehicleStatus[];

export const PUBLIC_VEHICLE_STATUSES = [
  "in_stock",
  "on_the_way",
  "reserved",
] as const satisfies readonly VehicleStatus[];

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  in_stock: "In stock",
  on_the_way: "On the way",
  reserved: "Reserved",
  sold: "Sold",
};

export const vehicleStatusOptions = VEHICLE_STATUSES.map((value) => ({
  value,
  label: vehicleStatusLabels[value],
}));

export function parseVehicleStatus(
  value: string | null | undefined
): VehicleStatus | null {
  if (value === "available") return "in_stock";
  if (
    value === "in_stock" ||
    value === "on_the_way" ||
    value === "reserved" ||
    value === "sold"
  ) {
    return value;
  }
  return null;
}

export function schemaAvailability(status: VehicleStatus): string {
  switch (status) {
    case "in_stock":
      return "https://schema.org/InStock";
    case "on_the_way":
      return "https://schema.org/PreOrder";
    case "reserved":
      return "https://schema.org/LimitedAvailability";
    case "sold":
      return "https://schema.org/SoldOut";
  }
}
