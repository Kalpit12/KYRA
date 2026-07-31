"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/atoms/button";
import { createClient } from "@/lib/supabase/client";
import { buildSpecifications, slugify } from "@/lib/admin/types";
import type { Vehicle, VehicleStatus } from "@/types";
import { z } from "zod";

/** Strip currency symbols / commas so "KES 12,500,000" → 12500000 */
function parseIntegerInput(value: unknown, field: string): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.trunc(value);
  }
  const raw = String(value ?? "").trim();
  if (!raw) {
    throw new Error(`${field} is required`);
  }
  const cleaned = raw.replace(/[^\d.-]/g, "");
  if (!cleaned || cleaned === "-" || cleaned === "." || cleaned === "-.") {
    throw new Error(`${field} must be a valid number`);
  }
  const num = Number(cleaned);
  if (!Number.isFinite(num)) {
    throw new Error(`${field} must be a valid number`);
  }
  return Math.trunc(num);
}

const vehicleSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int("Year must be a whole number").min(1990).max(2100),
  price: z.number().int("Price must be a whole number").min(0, "Price must be at least 0"),
  transmission: z.enum(["Automatic", "Manual"], {
    error: "Transmission is required",
  }),
  fuel: z.enum(["Petrol", "Diesel", "Hybrid", "Electric"], {
    error: "Fuel type is required",
  }),
  mileage: z.number().int("Mileage must be a whole number").min(0, "Mileage must be at least 0"),
  status: z.enum(["available", "reserved", "sold"], {
    error: "Status is required",
  }),
  featured: z.boolean(),
  bodyType: z.union([
    z.enum([
      "suv",
      "sedan",
      "coupe",
      "hatchback",
      "convertible",
      "pickup",
      "wagon",
      "van",
    ]),
    z.literal(""),
  ]),
  description: z.string().optional(),
  featuresText: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  vin: z.string().optional(),
  stockNumber: z.string().optional(),
  trim: z.string().optional(),
  condition: z.union([z.enum(["new", "used"]), z.literal("")]),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  drivetrain: z.string().optional(),
  engine: z.string().optional(),
  horsepower: z.string().optional(),
  torque: z.string().optional(),
  seats: z.string().optional(),
  doors: z.string().optional(),
  warranty: z.string().optional(),
});

type VehicleFormProps = {
  initial?: Vehicle;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-t border-border pt-6 first:border-t-0 first:pt-0">
      <div>
        <h2 className="font-display text-lg font-semibold italic uppercase text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function VehicleForm({ initial }: VehicleFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(
    initial?.images?.length
      ? initial.images
      : initial?.image
        ? [initial.image]
        : []
  );

  const [form, setForm] = useState({
    brand: initial?.brand ?? "",
    model: initial?.model ?? "",
    year: String(initial?.year ?? new Date().getFullYear()),
    price: String(initial?.price ?? ""),
    transmission: initial?.transmission ?? "Automatic",
    fuel: initial?.fuel ?? "Petrol",
    mileage: String(initial?.mileage ?? 0),
    status: (initial?.status ?? "available") as VehicleStatus,
    featured: Boolean(initial?.featured),
    bodyType: initial?.bodyType ?? "",
    description: initial?.description ?? "",
    featuresText: (initial?.features ?? []).join(", "),
    slug: initial?.slug ?? "",
    vin: initial?.vin ?? "",
    stockNumber: initial?.stockNumber ?? "",
    trim: initial?.trim ?? "",
    condition: initial?.condition ?? "used",
    exteriorColor: initial?.exteriorColor ?? "",
    interiorColor: initial?.interiorColor ?? "",
    drivetrain: initial?.drivetrain ?? "",
    engine: initial?.engine ?? initial?.specifications?.Engine ?? "",
    horsepower:
      initial?.horsepower ?? initial?.specifications?.Power ?? "",
    torque: initial?.torque ?? initial?.specifications?.Torque ?? "",
    seats: initial?.seats != null ? String(initial.seats) : "",
    doors: initial?.doors != null ? String(initial.doors) : "",
    warranty: initial?.warranty ?? "",
  });

  const autoSlug = useMemo(
    () => slugify(`${form.brand} ${form.model}`),
    [form.brand, form.model]
  );

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if ((key === "brand" || key === "model") && !initial) {
        next.slug = slugify(`${next.brand} ${next.model}`);
      }
      return next;
    });
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const uploaded: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("vehicle-images")
          .upload(path, file, { upsert: false });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage
          .from("vehicle-images")
          .getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const year = parseIntegerInput(form.year, "Year");
      const price = parseIntegerInput(form.price, "Price");
      const mileage = parseIntegerInput(form.mileage, "Mileage");

      const parsed = vehicleSchema.parse({
        ...form,
        year,
        price,
        mileage,
        slug: form.slug || autoSlug,
        featured: form.featured,
      });

      if (!images.length) {
        throw new Error("Upload at least one image");
      }

      const seats = form.seats.trim()
        ? parseIntegerInput(form.seats, "Seats")
        : null;
      const doors = form.doors.trim()
        ? parseIntegerInput(form.doors, "Doors")
        : null;

      const specifications = buildSpecifications({
        engine: parsed.engine,
        horsepower: parsed.horsepower,
        torque: parsed.torque,
        drivetrain: parsed.drivetrain,
        seats: seats ?? undefined,
        doors: doors ?? undefined,
        warranty: parsed.warranty,
        specifications: initial?.specifications,
      });

      const payload = {
        slug: parsed.slug,
        brand: parsed.brand,
        model: parsed.model,
        year: parsed.year,
        price: parsed.price,
        transmission: parsed.transmission,
        fuel: parsed.fuel,
        mileage: parsed.mileage,
        status: parsed.status,
        featured: parsed.featured,
        body_type: parsed.bodyType || null,
        description: parsed.description || null,
        features: parsed.featuresText
          ? parsed.featuresText
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        image: images[0],
        images,
        specifications,
        vin: parsed.vin || null,
        stock_number: parsed.stockNumber || null,
        trim: parsed.trim || null,
        condition: parsed.condition || null,
        exterior_color: parsed.exteriorColor || null,
        interior_color: parsed.interiorColor || null,
        drivetrain: parsed.drivetrain || null,
        engine: parsed.engine || null,
        horsepower: parsed.horsepower || null,
        torque: parsed.torque || null,
        seats,
        doors,
        warranty: parsed.warranty || null,
      };

      const supabase = createClient();
      if (initial) {
        const { error: updateError } = await supabase
          .from("vehicles")
          .update(payload)
          .eq("id", initial.id);
        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("vehicles")
          .insert(payload);
        if (insertError) throw insertError;
      }

      router.push("/admin/vehicles");
      router.refresh();
    } catch (err) {
      if (err instanceof z.ZodError) {
        const issue = err.issues[0];
        const field = issue?.path?.length ? String(issue.path[0]) : "";
        const label =
          {
            brand: "Brand",
            model: "Model",
            year: "Year",
            price: "Price",
            mileage: "Mileage",
            transmission: "Transmission",
            fuel: "Fuel",
            status: "Status",
            slug: "Slug",
            bodyType: "Body type",
            condition: "Condition",
          }[field] ?? field;
        const message = issue?.message ?? "Invalid form";
        setError(
          label && !message.toLowerCase().includes(label.toLowerCase())
            ? `${label}: ${message}`
            : message
        );
      } else if (err && typeof err === "object" && "message" in err) {
        setError(String((err as { message: string }).message));
      } else {
        setError(err instanceof Error ? err.message : "Save failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2 border border-border bg-background p-5 sm:p-8"
    >
      <Section
        title="Identity"
        subtitle="Core listing details buyers see first — aligned with dealer VDP standards."
      >
        <Field label="Brand">
          <input
            className="form-input"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            required
          />
        </Field>
        <Field label="Model">
          <input
            className="form-input"
            value={form.model}
            onChange={(e) => update("model", e.target.value)}
            required
          />
        </Field>
        <Field label="Trim">
          <input
            className="form-input"
            value={form.trim}
            onChange={(e) => update("trim", e.target.value)}
            placeholder="e.g. AMG, XLE, Autobiography"
          />
        </Field>
        <Field label="Year">
          <input
            className="form-input"
            value={form.year}
            onChange={(e) => update("year", e.target.value)}
            required
          />
        </Field>
        <Field label="VIN">
          <input
            className="form-input"
            value={form.vin}
            onChange={(e) => update("vin", e.target.value)}
            placeholder="17-character VIN"
          />
        </Field>
        <Field label="Stock number">
          <input
            className="form-input"
            value={form.stockNumber}
            onChange={(e) => update("stockNumber", e.target.value)}
            placeholder="Internal stock ID"
          />
        </Field>
        <Field label="Condition">
          <select
            className="form-input"
            value={form.condition}
            onChange={(e) => update("condition", e.target.value)}
          >
            <option value="used">Used</option>
            <option value="new">New</option>
          </select>
        </Field>
        <Field label="Status">
          <select
            className="form-input"
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
          </select>
        </Field>
        <Field label="Price (KES)">
          <input
            className="form-input"
            value={form.price}
            onChange={(e) => update("price", e.target.value)}
            required
          />
        </Field>
        <Field label="Slug">
          <input
            className="form-input"
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder={autoSlug}
          />
        </Field>
      </Section>

      <Section
        title="Overview"
        subtitle="Mileage, body style, and powertrain — standard filter fields on Cars.com / AutoTrader."
      >
        <Field label="Mileage (km)">
          <input
            className="form-input"
            value={form.mileage}
            onChange={(e) => update("mileage", e.target.value)}
            required
          />
        </Field>
        <Field label="Body type">
          <select
            className="form-input"
            value={form.bodyType}
            onChange={(e) => update("bodyType", e.target.value)}
          >
            <option value="">—</option>
            <option value="suv">SUV</option>
            <option value="sedan">Sedan</option>
            <option value="coupe">Coupé</option>
            <option value="hatchback">Hatchback</option>
            <option value="convertible">Convertible</option>
            <option value="pickup">Pickup</option>
            <option value="wagon">Wagon</option>
            <option value="van">Van</option>
          </select>
        </Field>
        <Field label="Transmission">
          <select
            className="form-input"
            value={form.transmission}
            onChange={(e) => update("transmission", e.target.value)}
          >
            <option>Automatic</option>
            <option>Manual</option>
          </select>
        </Field>
        <Field label="Fuel">
          <select
            className="form-input"
            value={form.fuel}
            onChange={(e) => update("fuel", e.target.value)}
          >
            <option>Petrol</option>
            <option>Diesel</option>
            <option>Hybrid</option>
            <option>Electric</option>
          </select>
        </Field>
        <Field label="Drivetrain">
          <select
            className="form-input"
            value={form.drivetrain}
            onChange={(e) => update("drivetrain", e.target.value)}
          >
            <option value="">—</option>
            <option value="AWD">AWD</option>
            <option value="4WD">4WD</option>
            <option value="RWD">RWD</option>
            <option value="FWD">FWD</option>
          </select>
        </Field>
        <Field label="Doors">
          <input
            className="form-input"
            value={form.doors}
            onChange={(e) => update("doors", e.target.value)}
            placeholder="e.g. 4"
            inputMode="numeric"
          />
        </Field>
        <Field label="Seats">
          <input
            className="form-input"
            value={form.seats}
            onChange={(e) => update("seats", e.target.value)}
            placeholder="e.g. 5"
            inputMode="numeric"
          />
        </Field>
      </Section>

      <Section
        title="Appearance"
        subtitle="Exterior and interior colors shown on Google Vehicle Listings and dealer sites."
      >
        <Field label="Exterior color">
          <input
            className="form-input"
            value={form.exteriorColor}
            onChange={(e) => update("exteriorColor", e.target.value)}
            placeholder="e.g. Obsidian Black"
          />
        </Field>
        <Field label="Interior color">
          <input
            className="form-input"
            value={form.interiorColor}
            onChange={(e) => update("interiorColor", e.target.value)}
            placeholder="e.g. Black Leather"
          />
        </Field>
      </Section>

      <Section
        title="Performance"
        subtitle="Engine and output — displayed in the technical specifications grid."
      >
        <Field label="Engine">
          <input
            className="form-input"
            value={form.engine}
            onChange={(e) => update("engine", e.target.value)}
            placeholder="e.g. 4.0L V8 Biturbo"
          />
        </Field>
        <Field label="Horsepower">
          <input
            className="form-input"
            value={form.horsepower}
            onChange={(e) => update("horsepower", e.target.value)}
            placeholder="e.g. 577 HP"
          />
        </Field>
        <Field label="Torque">
          <input
            className="form-input"
            value={form.torque}
            onChange={(e) => update("torque", e.target.value)}
            placeholder="e.g. 850 Nm"
          />
        </Field>
        <Field label="Warranty">
          <input
            className="form-input"
            value={form.warranty}
            onChange={(e) => update("warranty", e.target.value)}
            placeholder="e.g. 6 months KYRA warranty"
          />
        </Field>
      </Section>

      <section className="space-y-4 border-t border-border pt-6">
        <div>
          <h2 className="font-display text-lg font-semibold italic uppercase text-foreground">
            Description & features
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Long-form story plus equipment list (comma-separated).
          </p>
        </div>
        <Field label="Description">
          <textarea
            className="form-input min-h-[120px] resize-y"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
          />
        </Field>
        <Field label="Features (comma-separated)">
          <textarea
            className="form-input min-h-[80px] resize-y"
            value={form.featuresText}
            onChange={(e) => update("featuresText", e.target.value)}
            placeholder="Panoramic roof, Adaptive cruise, Heated seats…"
          />
        </Field>
        <label className="flex items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => update("featured", e.target.checked)}
            className="h-4 w-4 accent-kyra-red"
          />
          Featured on homepage
        </label>
      </section>

      <section className="space-y-4 border-t border-border pt-6">
        <div>
          <h2 className="font-display text-lg font-semibold italic uppercase text-foreground">
            Gallery
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            First image is the primary listing photo.
          </p>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => void uploadFiles(e.target.files)}
          className="block w-full text-sm text-muted-foreground file:mr-4 file:border-0 file:bg-kyra-red file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
        {uploading && (
          <p className="text-sm text-kyra-steel">Uploading…</p>
        )}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.map((src, index) => (
              <div
                key={src}
                className="relative aspect-[4/3] border border-border bg-muted"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="160px"
                />
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-kyra-red px-1.5 py-0.5 font-mono text-[9px] text-white uppercase">
                    Primary
                  </span>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setImages((prev) => prev.filter((i) => i !== src))
                  }
                  className="absolute top-1 right-1 bg-black/70 px-2 py-0.5 text-[10px] text-white uppercase"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {error && (
        <p className="border border-kyra-red/30 bg-kyra-red/5 px-3 py-2 text-sm text-kyra-red">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-border pt-6">
        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={loading || uploading}
        >
          {loading ? "Saving…" : initial ? "Update vehicle" : "Add vehicle"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="md"
          showArrow={false}
          onClick={() => router.push("/admin/vehicles")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
