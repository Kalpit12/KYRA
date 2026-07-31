export type VehicleStatus = "available" | "reserved" | "sold";

export type VehicleCondition = "new" | "used";

export type VehicleBodyType =
  | "suv"
  | "sedan"
  | "coupe"
  | "hatchback"
  | "convertible"
  | "pickup"
  | "wagon"
  | "van";

export type VehicleDrivetrain = "AWD" | "RWD" | "FWD" | "4WD";

export interface Vehicle {
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
  images: string[];
  status: VehicleStatus;
  featured?: boolean;
  bodyType?: VehicleBodyType;
  description?: string;
  features?: string[];
  specifications?: Record<string, string>;
  /** Dealer / Google Vehicle Listing style fields */
  vin?: string;
  stockNumber?: string;
  trim?: string;
  condition?: VehicleCondition;
  exteriorColor?: string;
  interiorColor?: string;
  drivetrain?: VehicleDrivetrain | string;
  engine?: string;
  horsepower?: string;
  torque?: string;
  seats?: number;
  doors?: number;
  warranty?: string;
}

export interface WrapProject {
  id: string;
  title: string;
  vehicle: string;
  finish: string;
  color: string;
  beforeImage: string;
  afterImage: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image?: string;
}

export interface WashPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export interface NavLink {
  label: string;
  href: string;
}
