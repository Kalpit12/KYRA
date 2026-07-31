"use client";

import { cn } from "@/lib/utils";

interface WrapColorSwatchProps {
  hex: string;
  name: string;
  selected: boolean;
  previewing?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function WrapColorSwatch({
  hex,
  name,
  selected,
  previewing,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: WrapColorSwatchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={name}
      title={name}
      className={cn(
        "group relative aspect-square w-full overflow-hidden transition-transform duration-200 hover:scale-105",
        (selected || previewing) && "scale-105"
      )}
    >
      <span
        className={cn(
          "absolute inset-0 block",
          selected && "ring-2 ring-kyra-red ring-offset-2 ring-offset-muted"
        )}
        style={{ backgroundColor: hex }}
      />
      {selected && (
        <span className="absolute inset-0 ring-1 ring-black/40 ring-inset" />
      )}
      <span className="sr-only">{name}</span>
    </button>
  );
}
