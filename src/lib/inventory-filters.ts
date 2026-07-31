import type { Vehicle } from "@/types";

/** Body-type chips (mutually exclusive). */
export type BodyTypeFilter = "all" | "suv" | "sedan" | "coupe";

/**
 * Legacy chip id used by older FilterChips / URLs.
 * Prefer bodyType + budget going forward; kept for compatibility.
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

export const budgetChipFilters: {
  id: "under8" | "over12";
  label: string;
  value: string;
}[] = [
  { id: "under8", label: "Under 8M", value: "Under KES 8M" },
  { id: "over12", label: "Over 12M", value: "Over KES 12M" },
];

/** @deprecated Use bodyTypeFilters + budgetChipFilters */
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

export interface InventoryQuery {
  search?: string;
  /** Active body-type chip */
  chip?: BodyTypeFilter;
  /** @deprecated Prefer chip + budget */
  bodyType?: BodyTypeFilter;
  brand?: string;
  transmission?: string;
  fuel?: string;
  maxPrice?: string;
  /**
   * Budget from hero or chips:
   * "Under KES 8M" | "KES 8M – 12M" | "Over KES 12M"
   */
  budget?: string;
}

/** Makes shown in hero search + makes strip. */
export const INVENTORY_MAKES = [
  "BMW",
  "Mercedes-Benz",
  "Land Rover",
  "Audi",
  "Toyota",
  "Porsche",
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
): Required<Pick<InventoryQuery, "brand" | "chip" | "budget">> {
  const make = normalizeBrand(params.get("make") ?? "");
  const type = params.get("type") ?? "";
  const budget = normalizeBudget(params.get("budget") ?? "");

  return {
    brand: make,
    chip: parseBodyTypeParam(type),
    budget,
  };
}

function matchesBodyType(vehicle: Vehicle, chip: BodyTypeFilter): boolean {
  if (chip === "all") return true;
  return vehicle.bodyType === chip;
}

function matchesBudgetRange(vehicle: Vehicle, budget?: string): boolean {
  const normalized = normalizeBudget(budget ?? "");
  if (!normalized) return true;
  if (normalized === BUDGET_UNDER_8M) return vehicle.price < UNDER_8M;
  if (normalized === BUDGET_MID) {
    return vehicle.price >= UNDER_8M && vehicle.price <= MID_BUDGET_MAX;
  }
  if (normalized === BUDGET_OVER_12M) return vehicle.price > OVER_12M;
  return true;
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
  const budget = normalizeBudget(query.budget ?? "");

  return vehicles.filter((vehicle) => {
    if (!matchesSearch(vehicle, query.search)) return false;

    if (brand && !brandsMatch(vehicle.brand, brand)) return false;

    if (query.transmission && vehicle.transmission !== query.transmission) {
      return false;
    }
    if (query.fuel && vehicle.fuel !== query.fuel) return false;

    if (query.maxPrice) {
      const max = Number(query.maxPrice);
      if (!Number.isNaN(max) && max > 0 && vehicle.price > max) return false;
    }

    if (!matchesBodyType(vehicle, chip)) return false;
    if (!matchesBudgetRange(vehicle, budget)) return false;

    return true;
  });
}

export function buildInventoryQueryString(query: {
  search?: string;
  chip?: BodyTypeFilter | InventoryFilter;
  brand?: string;
  transmission?: string;
  fuel?: string;
  maxPrice?: string;
  budget?: string;
}): string {
  const params = new URLSearchParams();
  const brand = normalizeBrand(query.brand ?? "");
  const budget = normalizeBudget(query.budget ?? "");

  if (brand) params.set("make", brand);

  const chip = query.chip ?? "all";
  if (chip === "suv") params.set("type", "SUV");
  else if (chip === "sedan") params.set("type", "Sedan");
  else if (chip === "coupe") params.set("type", "Coupé");

  // Price chips used to live in `chip`; map legacy ids into budget
  let resolvedBudget = budget;
  if (chip === "under8") resolvedBudget = BUDGET_UNDER_8M;
  else if (chip === "over10" || chip === "over12") {
    resolvedBudget = BUDGET_OVER_12M;
  }

  if (resolvedBudget) params.set("budget", resolvedBudget);

  if (query.search?.trim()) params.set("q", query.search.trim());
  if (query.transmission) params.set("transmission", query.transmission);
  if (query.fuel) params.set("fuel", query.fuel);
  if (query.maxPrice) params.set("maxPrice", query.maxPrice);

  return params.toString();
}

/** Active budget chip id for UI highlighting, if any. */
export function budgetToChipId(
  budget?: string
): "under8" | "over12" | null {
  const normalized = normalizeBudget(budget ?? "");
  if (normalized === BUDGET_UNDER_8M) return "under8";
  if (normalized === BUDGET_OVER_12M) return "over12";
  return null;
}
