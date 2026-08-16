"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { VehicleCard } from "@/components/molecules/vehicle-card";
import { FilterChips } from "@/components/molecules/filter-chips";
import { PageHero } from "@/components/molecules/page-hero";
import { MakesStrip } from "@/components/molecules/makes-strip";
import { TradeBand } from "@/components/molecules/trade-band";
import { SectionHeading } from "@/components/molecules/section-heading";
import { WashFaqAccordion } from "@/components/molecules/wash-faq-accordion";
import { WhatsAppFloat } from "@/components/molecules/whatsapp-float";
import { Select } from "@/components/atoms/select";
import { InstagramSection } from "@/components/organisms/imports/instagram-section";
import { importsFaqs } from "@/lib/data/home";
import type { Vehicle } from "@/types";
import {
  BUDGET_MID,
  buildInventoryQueryString,
  filterVehicles,
  inventorySortOptions,
  normalizeBrand,
  normalizeBudget,
  normalizeSort,
  parseInventoryParams,
  sortVehicles,
  type BodyTypeFilter,
  type InventorySort,
} from "@/lib/inventory-filters";

interface ImportsContentProps {
  vehicles: Vehicle[];
}

const transmissions = ["Automatic", "Manual"] as const;
const fuels = ["Petrol", "Diesel", "Hybrid", "Electric"] as const;

function stateFromParams(params: URLSearchParams) {
  const parsed = parseInventoryParams(params);
  return {
    search: params.get("q") ?? "",
    chip: parsed.chip,
    brand: parsed.brand,
    budget: parsed.budget,
    transmission: params.get("transmission") ?? "",
    fuel: params.get("fuel") ?? "",
    maxPrice: params.get("maxPrice") ?? "",
    sort: normalizeSort(params.get("sort")),
  };
}

export function ImportsContent({ vehicles }: ImportsContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inventoryRef = useRef<HTMLElement>(null);
  const lastWrittenQuery = useRef<string | null>(null);
  const didScrollForParams = useRef(false);
  const brands = useMemo(
    () => [...new Set(vehicles.map((v) => v.brand))].sort(),
    [vehicles]
  );

  const [filters, setFilters] = useState(() => stateFromParams(searchParams));
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(
      searchParams.get("transmission") ||
        searchParams.get("fuel") ||
        searchParams.get("maxPrice")
    )
  );

  // Apply external URL changes (hero search, shared links, back/forward)
  useEffect(() => {
    const incoming = searchParams.toString();
    if (incoming === lastWrittenQuery.current) return;

    lastWrittenQuery.current = incoming;
    setFilters(stateFromParams(searchParams));

    if (
      !didScrollForParams.current &&
      (searchParams.get("make") ||
        searchParams.get("type") ||
        searchParams.get("budget") ||
        searchParams.get("q"))
    ) {
      didScrollForParams.current = true;
      requestAnimationFrame(() => {
        inventoryRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [searchParams]);

  // Mirror local filters into the URL
  useEffect(() => {
    const query = buildInventoryQueryString(filters);
    if (query === lastWrittenQuery.current) return;

    lastWrittenQuery.current = query;
    const next = query ? `${pathname}?${query}` : pathname;
    router.replace(next, { scroll: false });
  }, [filters, pathname, router]);

  const filtered = useMemo(
    () => sortVehicles(filterVehicles(vehicles, filters), filters.sort),
    [filters, vehicles]
  );

  const hasActiveFilters =
    Boolean(filters.search.trim()) ||
    filters.chip !== "all" ||
    Boolean(filters.brand) ||
    Boolean(filters.transmission) ||
    Boolean(filters.fuel) ||
    Boolean(filters.maxPrice) ||
    Boolean(filters.budget) ||
    filters.sort !== "newest";

  const clearFilters = useCallback(() => {
    lastWrittenQuery.current = "";
    setFilters({
      search: "",
      chip: "all",
      brand: "",
      budget: "",
      transmission: "",
      fuel: "",
      maxPrice: "",
      sort: "newest" as InventorySort,
    });
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const handleBodyChange = (chip: BodyTypeFilter) => {
    setFilters((prev) => ({ ...prev, chip }));
  };

  const handleBudgetChange = (budget: string) => {
    setFilters((prev) => ({
      ...prev,
      budget: normalizeBudget(budget),
    }));
  };

  const handleMakeSelect = (make: string) => {
    const normalized = normalizeBrand(make);
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand === normalized ? "" : normalized,
    }));
    inventoryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <PageHero
        eyebrow="KYRA Platinum Imports"
        title="Find your next drive."
        subtitle="Curated luxury vehicles, hand-selected and imported with full documentation and a complete import dossier."
        showChevrons
        showShard={false}
        backgroundVideo="/video/urus-imports-hero.mp4"
        backgroundImage="/video/posters/urus-imports-hero.jpg"
      />

      <MakesStrip activeMake={filters.brand} onSelect={handleMakeSelect} />

      <section
        ref={inventoryRef}
        className="section-padding scroll-mt-28 bg-background"
        id="inventory"
      >
        <div className="container-kyra">
          <SectionHeading
            label="Current Stock"
            title="Every unit comes with a full import dossier — not just a price tag."
          />

          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <FilterChips
                bodyType={filters.chip}
                budget={filters.budget}
                onBodyChange={handleBodyChange}
                onBudgetChange={handleBudgetChange}
              />
            </div>
            <div className="relative w-full lg:max-w-sm">
              <div className="group relative flex items-center overflow-hidden rounded-sm border border-border bg-background shadow-[inset_3px_0_0_0_var(--kyra-red)] transition-all focus-within:border-kyra-red/50 focus-within:shadow-[inset_3px_0_0_0_var(--kyra-red),0_0_0_3px_rgba(226,19,31,0.08)]">
                <span className="pointer-events-none flex shrink-0 items-center justify-center pl-3.5 text-kyra-red">
                  <Search size={16} strokeWidth={2.25} aria-hidden />
                </span>
                <input
                  type="search"
                  placeholder="Search brand, model, year…"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="min-h-[46px] w-full border-0 bg-transparent py-3 pr-3.5 pl-2.5 font-sans text-base text-foreground outline-none placeholder:text-kyra-steel/70 sm:text-sm"
                  aria-label="Search vehicles"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="min-h-[44px] font-mono text-[11px] tracking-[0.08em] text-kyra-steel uppercase transition-colors hover:text-foreground"
            >
              {showAdvanced ? "− Hide" : "+ Show"} advanced filters
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex min-h-[44px] items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-kyra-red uppercase transition-colors hover:text-foreground"
              >
                <X size={14} aria-hidden />
                Clear filters
              </button>
            )}

            {filters.budget === BUDGET_MID && (
              <span className="inline-flex min-h-[44px] items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                Budget: {filters.budget}
                <button
                  type="button"
                  onClick={() => handleBudgetChange("")}
                  className="text-kyra-red hover:text-foreground"
                  aria-label="Clear mid-range budget"
                >
                  <X size={12} aria-hidden />
                </button>
              </span>
            )}
          </div>

          {showAdvanced && (
            <div className="mt-4 grid gap-3 border border-border bg-muted p-5 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="form-label">Brand</span>
                <Select
                  id="filter-brand"
                  value={filters.brand}
                  options={[
                    { value: "", label: "All Brands" },
                    ...brands.map((b) => ({ value: b, label: b })),
                  ]}
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      brand: normalizeBrand(value),
                    }))
                  }
                  aria-label="Brand"
                />
              </div>
              <div>
                <span className="form-label">Transmission</span>
                <Select
                  id="filter-transmission"
                  value={filters.transmission}
                  options={[
                    { value: "", label: "All" },
                    ...transmissions.map((t) => ({ value: t, label: t })),
                  ]}
                  onChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      transmission: value,
                    }))
                  }
                  aria-label="Transmission"
                />
              </div>
              <div>
                <span className="form-label">Fuel</span>
                <Select
                  id="filter-fuel"
                  value={filters.fuel}
                  options={[
                    { value: "", label: "All" },
                    ...fuels.map((f) => ({ value: f, label: f })),
                  ]}
                  onChange={(value) =>
                    setFilters((prev) => ({ ...prev, fuel: value }))
                  }
                  aria-label="Fuel"
                />
              </div>
              <div>
                <label htmlFor="filter-max-price" className="form-label">
                  Max Price (KES)
                </label>
                <input
                  id="filter-max-price"
                  type="number"
                  min={0}
                  step={100000}
                  placeholder="e.g. 20000000"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                  className="form-input"
                />
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs tracking-[0.06em] text-kyra-steel uppercase">
              {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} found
            </p>
            <div className="flex items-center gap-3">
              <span className="form-label !mb-0 shrink-0">Sort</span>
              <Select
                id="filter-sort"
                value={filters.sort}
                options={inventorySortOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    sort: normalizeSort(value),
                  }))
                }
                aria-label="Sort vehicles"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((vehicle, index) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} index={index} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-kyra-steel">No vehicles match your filters.</p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 font-mono text-xs tracking-[0.08em] text-kyra-red uppercase hover:text-foreground"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <InstagramSection />

      <section className="border-t border-border bg-background">
        <div className="container-kyra section-padding !py-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading label="FAQ" title="Common questions." showChevrons />
            <div className="mt-8">
              <WashFaqAccordion items={importsFaqs} />
            </div>
          </div>
        </div>
      </section>

      <TradeBand />
      <WhatsAppFloat />
    </>
  );
}
