"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { WashBookingRow } from "@/lib/admin/types";
import { washPackages } from "@/lib/data/wash";
import { formatPrice } from "@/lib/utils";

const statuses: WashBookingRow["status"][] = [
  "new",
  "confirmed",
  "completed",
  "cancelled",
];

function packageLabel(packageId: string) {
  const pkg = washPackages.find((p) => p.id === packageId);
  if (!pkg) return packageId;
  return `${pkg.name} — ${formatPrice(pkg.price)}`;
}

export default function AdminBookingsPage() {
  const [items, setItems] = useState<WashBookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("wash_bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (fetchError) setError(fetchError.message);
    else setItems((data as WashBookingRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const setStatus = async (id: string, status: WashBookingRow["status"]) => {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("wash_bookings")
      .update({ status })
      .eq("id", id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    void load();
  };

  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
        KYRA Wash
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold italic uppercase text-foreground">
        Wash bookings
      </h1>

      {error && (
        <p className="mt-4 border border-kyra-red/30 bg-kyra-red/5 px-3 py-2 text-sm text-kyra-red">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 font-mono text-xs tracking-[0.12em] text-kyra-steel uppercase">
          Loading bookings…
        </p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="border border-border bg-background p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-medium text-foreground">{item.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <a href={`tel:${item.phone}`} className="hover:text-kyra-red">
                      {item.phone}
                    </a>
                    {" · "}
                    {item.vehicle}
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    Package: {packageLabel(item.package_id)}
                    {" · "}
                    {item.booking_date} at {item.booking_time}
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-kyra-steel uppercase">
                    {new Date(item.created_at).toLocaleString()} · {item.status}
                  </p>
                </div>
                <select
                  className="form-input max-w-[180px]"
                  value={item.status}
                  onChange={(e) =>
                    void setStatus(
                      item.id,
                      e.target.value as WashBookingRow["status"]
                    )
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              {item.notes && (
                <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
                  {item.notes}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
