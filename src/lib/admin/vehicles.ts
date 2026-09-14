import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import {
  mapVehicleRow,
  type ContactInquiryRow,
  type VehicleRow,
  type WashBookingRow,
} from "@/lib/admin/types";
import type { Vehicle } from "@/types";

const LOCAL_IMAGE_FALLBACK = "/instagram/DZCTN25CAGy.jpg";

function isUnsplashUrl(src: string) {
  return src.includes("images.unsplash.com");
}

/** Stock Unsplash URLs time out through the Next image optimizer — use local photos. */
function localizeStockPhotos(vehicle: Vehicle): Vehicle {
  const replace = (src: string) => (isUnsplashUrl(src) ? LOCAL_IMAGE_FALLBACK : src);
  const images = vehicle.images.map(replace);
  return {
    ...vehicle,
    image: replace(vehicle.image),
    images: images.length ? images : [replace(vehicle.image)],
  };
}

/** Public storefront — sold units are hidden from listings and featured rails. */
function publicVehicles(vehicles: Vehicle[]): Vehicle[] {
  return vehicles.filter((v) => v.status !== "sold").map(localizeStockPhotos);
}

export async function getVehicles(): Promise<Vehicle[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .neq("status", "sold")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return [];
    }

    return publicVehicles((data as VehicleRow[]).map(mapVehicleRow));
  } catch {
    return [];
  }
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("featured", true)
      .neq("status", "sold")
      .order("created_at", { ascending: false });

    if (error || !data?.length) {
      return [];
    }

    return publicVehicles((data as VehicleRow[]).map(mapVehicleRow));
  } catch {
    return [];
  }
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const vehicle = localizeStockPhotos(mapVehicleRow(data as VehicleRow));
    if (vehicle.status === "sold") return null;
    return vehicle;
  } catch {
    return null;
  }
}

export async function getDashboardStats() {
  const supabase = await createClient();

  const [vehiclesRes, inquiriesRes, bookingsRes] = await Promise.all([
    supabase.from("vehicles").select("status"),
    supabase
      .from("contact_inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase
      .from("wash_bookings")
      .select("id", { count: "exact", head: true })
      .in("status", ["new", "confirmed"]),
  ]);

  const vehicles = vehiclesRes.data ?? [];
  const total = vehicles.length;
  const inStock = vehicles.filter((v) => v.status === "in_stock").length;
  const onTheWay = vehicles.filter((v) => v.status === "on_the_way").length;
  const reserved = vehicles.filter((v) => v.status === "reserved").length;
  const sold = vehicles.filter((v) => v.status === "sold").length;

  return {
    total,
    inStock,
    onTheWay,
    reserved,
    sold,
    washBookings: bookingsRes.count ?? 0,
    contactInquiries: inquiriesRes.count ?? 0,
  };
}

export async function getDashboardFeed() {
  const supabase = await createClient();

  const [stats, vehiclesRes, inquiriesRes, bookingsRes, featuredRes] =
    await Promise.all([
      getDashboardStats(),
      supabase
        .from("vehicles")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(5),
      supabase
        .from("contact_inquiries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("wash_bookings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("vehicles")
        .select("id", { count: "exact", head: true })
        .eq("featured", true),
    ]);

  return {
    stats: {
      ...stats,
      featured: featuredRes.count ?? 0,
    },
    recentVehicles: ((vehiclesRes.data as VehicleRow[]) ?? []).map(mapVehicleRow),
    recentInquiries: (inquiriesRes.data as ContactInquiryRow[]) ?? [],
    recentBookings: (bookingsRes.data as WashBookingRow[]) ?? [],
  };
}
