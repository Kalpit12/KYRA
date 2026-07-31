"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Pencil, Trash2, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { mapVehicleRow, type VehicleRow } from "@/lib/admin/types";
import type { Vehicle, VehicleStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/atoms/button";

export default function AdminVehiclesClient() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status") as VehicleStatus | null;
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    let query = supabase.from("vehicles").select("*").order("created_at", {
      ascending: false,
    });
    if (statusFilter) query = query.eq("status", statusFilter);
    const { data, error: fetchError } = await query;
    if (fetchError) {
      setError(fetchError.message);
      setVehicles([]);
    } else {
      setVehicles((data as VehicleRow[]).map(mapVehicleRow));
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const toggleFeatured = async (vehicle: Vehicle) => {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("vehicles")
      .update({ featured: !vehicle.featured })
      .eq("id", vehicle.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    void load();
  };

  const remove = async (vehicle: Vehicle) => {
    if (!confirm(`Delete ${vehicle.brand} ${vehicle.model}?`)) return;
    const supabase = createClient();
    const { error: deleteError } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", vehicle.id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    void load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
            Inventory
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold italic uppercase text-foreground">
            Vehicles
          </h1>
        </div>
        <Button href="/admin/vehicles/new" variant="primary" size="md">
          Add vehicle
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {([null, "available", "reserved", "sold"] as const).map((status) => {
          const href = status
            ? `/admin/vehicles?status=${status}`
            : "/admin/vehicles";
          const active = statusFilter === status || (!statusFilter && !status);
          return (
            <Link
              key={String(status)}
              href={href}
              className={`px-3 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase transition ${
                active
                  ? "bg-kyra-red text-white"
                  : "border border-border bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {status ?? "All"}
            </Link>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 border border-kyra-red/30 bg-kyra-red/5 px-3 py-2 text-sm text-kyra-red">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 font-mono text-xs tracking-[0.12em] text-kyra-steel uppercase">
          Loading vehicles…
        </p>
      ) : vehicles.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No vehicles found.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-border bg-background">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-muted font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
              <tr>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-16 shrink-0 overflow-hidden bg-muted">
                        <Image
                          src={vehicle.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {vehicle.brand} {vehicle.model}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {vehicle.year} · {vehicle.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {vehicle.status}
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {formatPrice(vehicle.price)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => void toggleFeatured(vehicle)}
                      className={`inline-flex items-center gap-1 text-xs ${
                        vehicle.featured ? "text-kyra-red" : "text-kyra-steel"
                      }`}
                      aria-label="Toggle featured"
                    >
                      <Star
                        size={16}
                        fill={vehicle.featured ? "currentColor" : "none"}
                      />
                      {vehicle.featured ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/vehicles/${vehicle.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground hover:border-kyra-red hover:text-kyra-red"
                        aria-label="Edit"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => void remove(vehicle)}
                        className="inline-flex h-9 w-9 items-center justify-center border border-border text-foreground hover:border-kyra-red hover:text-kyra-red"
                        aria-label="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
