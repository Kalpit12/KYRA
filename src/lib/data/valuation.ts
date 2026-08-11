export type ValuationCondition =
  | "excellent"
  | "good"
  | "fair"
  | "needs-work";

export const valuationConditions: {
  id: ValuationCondition;
  label: string;
}[] = [
  { id: "excellent", label: "Excellent" },
  { id: "good", label: "Good" },
  { id: "fair", label: "Fair" },
  { id: "needs-work", label: "Needs work" },
];

export function buildValuationMessage(input: {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
  transmission?: string;
  notes?: string;
}) {
  const lines = [
    "Vehicle valuation request",
    "",
    `Brand: ${input.brand.trim()}`,
    `Model: ${input.model.trim()}`,
    `Year: ${input.year.trim()}`,
    `Mileage: ${input.mileage.trim()} km`,
    `Condition: ${input.condition}`,
  ];
  if (input.transmission?.trim()) {
    lines.push(`Transmission: ${input.transmission.trim()}`);
  }
  if (input.notes?.trim()) {
    lines.push("", "Customer notes:", input.notes.trim());
  }
  return lines.join("\n");
}
