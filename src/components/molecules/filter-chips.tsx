"use client";

import { cn } from "@/lib/utils";
import {
  bodyTypeFilters,
  budgetChipFilters,
  type BodyTypeFilter,
} from "@/lib/inventory-filters";

interface FilterChipsProps {
  bodyType: BodyTypeFilter;
  budget: string;
  onBodyChange: (filter: BodyTypeFilter) => void;
  onBudgetChange: (budget: string) => void;
  className?: string;
}

export function FilterChips({
  bodyType,
  budget,
  onBodyChange,
  onBudgetChange,
  className,
}: FilterChipsProps) {
  return (
    <div
      className={cn(
        "scroll-fade-x flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:pb-0",
        className
      )}
    >
      {bodyTypeFilters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => onBodyChange(filter.id)}
          className={cn(
            "min-h-[44px] shrink-0 cursor-pointer border px-4 py-2.5 font-mono text-xs tracking-[0.04em] uppercase transition-all duration-200 sm:shrink",
            bodyType === filter.id
              ? "border-kyra-red bg-kyra-red text-white"
              : "border-border text-kyra-steel hover:border-kyra-red hover:text-foreground"
          )}
        >
          {filter.label}
        </button>
      ))}

      {budgetChipFilters.map((filter) => {
        const isActive = budget === filter.value;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onBudgetChange(isActive ? "" : filter.value)}
            className={cn(
              "min-h-[44px] shrink-0 cursor-pointer border px-4 py-2.5 font-mono text-xs tracking-[0.04em] uppercase transition-all duration-200 sm:shrink",
              isActive
                ? "border-kyra-red bg-kyra-red text-white"
                : "border-border text-kyra-steel hover:border-kyra-red hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
