"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Select } from "@/components/atoms/select";
import {
  BUDGET_MID,
  BUDGET_OVER_12M,
  BUDGET_UNDER_8M,
  INVENTORY_MAKES,
} from "@/lib/inventory-filters";

const makes = ["All Makes", ...INVENTORY_MAKES];
const types = ["All Types", "SUV", "Sedan", "Coupé", "Sports"];
const budgets = [
  "Any Budget",
  BUDGET_UNDER_8M,
  BUDGET_MID,
  BUDGET_OVER_12M,
];

export function HeroSearchCard() {
  const router = useRouter();
  const [make, setMake] = useState(makes[0]);
  const [type, setType] = useState(types[0]);
  const [budget, setBudget] = useState(budgets[0]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make !== "All Makes") params.set("make", make);
    if (type !== "All Types") params.set("type", type);
    if (budget !== "Any Budget") params.set("budget", budget);
    const query = params.toString();
    router.push(query ? `/imports?${query}#inventory` : "/imports#inventory");
  };

  return (
    <div className="grid grid-cols-1 gap-3.5 border border-border bg-panel/80 p-4 backdrop-blur-sm sm:p-5 md:grid-cols-2">
      <Field label="Make">
        <Select
          size="sm"
          value={make}
          options={makes}
          onChange={setMake}
          aria-label="Make"
        />
      </Field>
      <Field label="Type">
        <Select
          size="sm"
          value={type}
          options={types}
          onChange={setType}
          aria-label="Type"
        />
      </Field>
      <Field label="Budget" className="md:col-span-2 md:max-w-[calc(50%-7px)]">
        <Select
          size="sm"
          value={budget}
          options={budgets}
          onChange={setBudget}
          aria-label="Budget"
        />
      </Field>
      <Button
        type="button"
        onClick={handleSearch}
        variant="primary"
        size="md"
        showArrow={false}
        className="col-span-full mt-1 w-full justify-center"
      >
        Search Inventory
      </Button>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-kyra-steel">
        {label}
      </span>
      {children}
    </div>
  );
}
