import type {
  Vehicle,
  VehicleBodyType,
  VehicleCondition,
  VehicleStatus,
} from "@/types";

export type VehicleRow = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  transmission: "Automatic" | "Manual";
  fuel: "Petrol" | "Diesel" | "Hybrid" | "Electric";
  mileage: number;
  image: string;
  images: string[] | null;
  status: VehicleStatus;
  featured: boolean;
  body_type: VehicleBodyType | null;
  description: string | null;
  features: string[] | null;
  specifications: Record<string, string> | null;
  vin: string | null;
  stock_number: string | null;
  trim: string | null;
  condition: VehicleCondition | null;
  exterior_color: string | null;
  interior_color: string | null;
  drivetrain: string | null;
  engine: string | null;
  horsepower: string | null;
  torque: string | null;
  seats: number | null;
  doors: number | null;
  warranty: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ContactInquiryRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: "new" | "completed";
  created_at: string;
};

export type WashBookingRow = {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  package_id: string;
  booking_date: string;
  booking_time: string;
  notes: string | null;
  status: "new" | "confirmed" | "completed" | "cancelled";
  created_at: string;
};

export function mapVehicleRow(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: row.year,
    price: row.price,
    transmission: row.transmission,
    fuel: row.fuel,
    mileage: row.mileage,
    image: row.image,
    images: row.images?.length ? row.images : [row.image],
    status: row.status,
    featured: row.featured,
    bodyType: row.body_type ?? undefined,
    description: row.description ?? undefined,
    features: row.features ?? undefined,
    specifications: row.specifications ?? undefined,
    vin: row.vin ?? undefined,
    stockNumber: row.stock_number ?? undefined,
    trim: row.trim ?? undefined,
    condition: row.condition ?? undefined,
    exteriorColor: row.exterior_color ?? undefined,
    interiorColor: row.interior_color ?? undefined,
    drivetrain: row.drivetrain ?? undefined,
    engine: row.engine ?? undefined,
    horsepower: row.horsepower ?? undefined,
    torque: row.torque ?? undefined,
    seats: row.seats ?? undefined,
    doors: row.doors ?? undefined,
    warranty: row.warranty ?? undefined,
  };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Build a clean specifications object from structured fields for display fallbacks */
export function buildSpecifications(vehicle: {
  engine?: string;
  horsepower?: string;
  torque?: string;
  drivetrain?: string;
  seats?: number | string;
  doors?: number | string;
  warranty?: string;
  specifications?: Record<string, string>;
}): Record<string, string> {
  const specs: Record<string, string> = { ...(vehicle.specifications ?? {}) };
  if (vehicle.engine) specs.Engine = vehicle.engine;
  if (vehicle.horsepower) specs.Power = vehicle.horsepower;
  if (vehicle.torque) specs.Torque = vehicle.torque;
  if (vehicle.drivetrain) specs.Drivetrain = vehicle.drivetrain;
  if (vehicle.seats) specs.Seats = String(vehicle.seats);
  if (vehicle.doors) specs.Doors = String(vehicle.doors);
  if (vehicle.warranty) specs.Warranty = vehicle.warranty;
  return specs;
}
