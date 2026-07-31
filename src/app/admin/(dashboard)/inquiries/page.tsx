"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { ContactInquiryRow } from "@/lib/admin/types";

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<ContactInquiryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("contact_inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (fetchError) setError(fetchError.message);
    else setItems((data as ContactInquiryRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const setStatus = async (id: string, status: "new" | "completed") => {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("contact_inquiries")
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
        Contact
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold italic uppercase text-foreground">
        Inquiries
      </h1>

      {error && (
        <p className="mt-4 border border-kyra-red/30 bg-kyra-red/5 px-3 py-2 text-sm text-kyra-red">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-10 font-mono text-xs tracking-[0.12em] text-kyra-steel uppercase">
          Loading inquiries…
        </p>
      ) : items.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No inquiries yet.</p>
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
                    <a
                      href={`mailto:${item.email}`}
                      className="hover:text-kyra-red"
                    >
                      {item.email}
                    </a>
                    {item.phone ? ` · ${item.phone}` : ""}
                  </p>
                  <p className="mt-1 font-mono text-[10px] tracking-[0.1em] text-kyra-steel uppercase">
                    {new Date(item.created_at).toLocaleString()} · {item.status}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    void setStatus(
                      item.id,
                      item.status === "completed" ? "new" : "completed"
                    )
                  }
                  className="border border-border px-3 py-2 text-xs font-semibold tracking-[0.08em] uppercase transition hover:border-kyra-red"
                >
                  {item.status === "completed"
                    ? "Reopen"
                    : "Mark completed"}
                </button>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {item.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
