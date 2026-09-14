import type { Vehicle, VehicleStatus } from "@/types";
import {
  parseVehicleStatus,
  PUBLIC_VEHICLE_STATUSES,
  vehicleStatusLabels,
} from "@/lib/vehicle-status";

/** Body-type chips (mutually exclusive). */
export type BodyTypeFilter = "all" | "suv" | "sedan" | "coupe";

/**
 * Legacy chip ids kept for old shared URLs.
 */
export type InventoryFilter =
  | BodyTypeFilter
  | "under8"
  | "over10"
  | "over12";

export const bodyTypeFilters: { id: BodyTypeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "suv", label: "SUV" },
  { id: "sedan", label: "Sedan" },
  { id: "coupe", label: "Coupé" },
];

export const availabilityFilters: {
  id: VehicleStatus;
  label: string;
}[] = PUBLIC_VEHICLE_STATUSES.map((id) => ({
  id,
  label: vehicleStatusLabels[id],
}));

/** @deprecated Legacy chip ids kept for old shared URLs */
export const inventoryFilters: { id: InventoryFilter; label: string }[] = [
  ...bodyTypeFilters,
  { id: "under8", label: "Under 8M" },
  { id: "over12", label: "Over 12M" },
];

export const UNDER_8M = 8_000_000;
export const OVER_12M = 12_000_000;
/** @deprecated Alias — prefer OVER_12M */
export const OVER_10M = OVER_12M;
export const MID_BUDGET_MAX = 12_000_000;

export const BUDGET_UNDER_8M = "Under KES 8M";
export const BUDGET_MID = "KES 8M – 12M";
export const BUDGET_OVER_12M = "Over KES 12M";
/** Legacy URL value from older chips */
export const BUDGET_OVER_10M_LEGACY = "Over KES 10M";

export type InventorySort = "newest" | "year-desc" | "mileage-asc";

export interface InventoryQuery {
  search?: string;
  /** Active body-type chip */
  chip?: BodyTypeFilter;
  /** @deprecated Prefer chip + availability */
  bodyType?: BodyTypeFilter;
  brand?: string;
  transmission?: string;
  fuel?: string;
  /** Public availability: in_stock | on_the_way | reserved */
  availability?: VehicleStatus | "";
  /** Sort key for inventory results */
  sort?: InventorySort;
}

export const inventorySortOptions: { value: InventorySort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "year-desc", label: "Year ↓" },
  { value: "mileage-asc", label: "Mileage ↑" },
];

export function normalizeSort(sort?: string | null): InventorySort {
  if (sort === "year-desc" || sort === "mileage-asc") {
    return sort;
  }
  return "newest";
}

export function sortVehicles(
  vehicles: Vehicle[],
  sort: InventorySort = "newest"
): Vehicle[] {
  const list = [...vehicles];
  switch (sort) {
    case "year-desc":
      return list.sort((a, b) => b.year - a.year || a.mileage - b.mileage);
    case "mileage-asc":
      return list.sort((a, b) => a.mileage - b.mileage);
    case "newest":
    default:
      return list;
  }
}

/** Makes shown in hero search + makes strip. */
export const INVENTORY_MAKES = [
  "BMW",
  "Mercedes-Benz",
  "Land Rover",
  "Audi",
  "Toyota",
  "Porsche",
  "Nissan",
] as const;

/** Normalize display brands (e.g. Range Rover → Land Rover). */
export function normalizeBrand(brand: string): string {
  const value = brand.trim();
  if (!value || value === "All Makes" || value === "All Brands") return "";

  const lower = value.toLowerCase();
  if (lower === "range rover") return "Land Rover";
  if (lower === "mercedes" || lower === "benz" || lower === "mercedes benz") {
    return "Mercedes-Benz";
  }
  if (lower === "landrover" || lower === "land rover") return "Land Rover";
  if (lower === "bmw") return "BMW";
  if (lower === "audi") return "Audi";
  if (lower === "toyota") return "Toyota";
  if (lower === "porsche") return "Porsche";
  if (lower === "nissan") return "Nissan";

  // Preserve canonical casing when we already know the brand
  const known = INVENTORY_MAKES.find((m) => m.toLowerCase() === lower);
  if (known) return known;

  return value;
}

function brandsMatch(vehicleBrand: string, filterBrand: string): boolean {
  return (
    normalizeBrand(vehicleBrand).toLowerCase() ===
    normalizeBrand(filterBrand).toLowerCase()
  );
}

export function parseBodyTypeParam(type: string): BodyTypeFilter {
  if (type === "SUV") return "suv";
  if (type === "Sedan") return "sedan";
  if (
    type === "Coupé" ||
    type === "Coupe" ||
    type === "Sports" ||
    type === "Sport"
  ) {
    return "coupe";
  }
  return "all";
}

/** Normalize any budget URL/label to a canonical value (or ""). */
export function normalizeBudget(budget: string): string {
  const value = budget.trim();
  if (!value || value === "Any Budget") return "";
  if (value === BUDGET_UNDER_8M || value === "Under 8M") return BUDGET_UNDER_8M;
  if (value === BUDGET_MID || value === "8M – 12M" || value === "8M-12M") {
    return BUDGET_MID;
  }
  if (
    value === BUDGET_OVER_12M ||
    value === BUDGET_OVER_10M_LEGACY ||
    value === "Over 12M" ||
    value === "Over 10M"
  ) {
    return BUDGET_OVER_12M;
  }
  return value;
}

export function parseInventoryParams(
  params: URLSearchParams
): Required<Pick<InventoryQuery, "brand" | "chip" | "availability">> {
  const make = normalizeBrand(params.get("make") ?? "");
  const type = params.get("type") ?? "";
  const availability = parseVehicleStatus(params.get("availability")) ?? "";

  return {
    brand: make,
    chip: parseBodyTypeParam(type),
    availability: availability === "sold" ? "" : availability,
  };
}

function matchesBodyType(vehicle: Vehicle, chip: BodyTypeFilter): boolean {
  if (chip === "all") return true;
  return vehicle.bodyType === chip;
}

function matchesSearch(vehicle: Vehicle, search?: string): boolean {
  if (!search?.trim()) return true;
  const q = search.trim().toLowerCase();
  const haystack = [
    vehicle.brand,
    vehicle.model,
    String(vehicle.year),
    vehicle.bodyType ?? "",
    vehicle.fuel,
    vehicle.transmission,
    vehicle.status,
    vehicleStatusLabels[vehicle.status],
  ]
    .join(" ")
    .toLowerCase();

  return q.split(/\s+/).every((term) => haystack.includes(term));
}

export function filterVehicles(
  vehicles: Vehicle[],
  query: InventoryQuery
): Vehicle[] {
  const chip: BodyTypeFilter =
    query.chip ?? query.bodyType ?? "all";
  const brand = normalizeBrand(query.brand ?? "");
  const availability = query.availability || "";

  return vehicles.filter((vehicle) => {
    if (!matchesSearch(vehicle, query.search)) return false;

    if (brand && !brandsMatch(vehicle.brand, brand)) return false;

    if (query.transmission && vehicle.transmission !== query.transmission) {
      return false;
    }
    if (query.fuel && vehicle.fuel !== query.fuel) return false;

    if (availability && vehicle.status !== availability) return false;

    if (!matchesBodyType(vehicle, chip)) return false;

    return true;
  });
}

export function buildInventoryQueryString(query: {
  search?: string;
  chip?: BodyTypeFilter | InventoryFilter;
  brand?: string;
  transmission?: string;
  fuel?: string;
  availability?: VehicleStatus | "";
  sort?: InventorySort | string;
}): string {
  const params = new URLSearchParams();
  const brand = normalizeBrand(query.brand ?? "");
  const sort = normalizeSort(query.sort);
  const availability = parseVehicleStatus(query.availability ?? "") ?? "";

  if (brand) params.set("make", brand);

  const chip = query.chip ?? "all";
  if (chip === "suv") params.set("type", "SUV");
  else if (chip === "sedan") params.set("type", "Sedan");
  else if (chip === "coupe") params.set("type", "Coupé");

  if (availability && availability !== "sold") {
    params.set("availability", availability);
  }

  if (query.search?.trim()) params.set("q", query.search.trim());
  if (query.transmission) params.set("transmission", query.transmission);
  if (query.fuel) params.set("fuel", query.fuel);
  if (sort !== "newest") params.set("sort", sort);

  return params.toString();
}
