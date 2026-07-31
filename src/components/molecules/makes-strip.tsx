"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { BrandLogo } from "@/components/atoms/brand-logo";
import { INVENTORY_MAKES, normalizeBrand } from "@/lib/inventory-filters";

const makes = [...INVENTORY_MAKES] as const;

interface MakesStripProps {
  centered?: boolean;
  className?: string;
  activeMake?: string;
  onSelect?: (make: string) => void;
}

function makeHref(make: string) {
  const brand = normalizeBrand(make);
  return brand
    ? `/imports?make=${encodeURIComponent(brand)}#inventory`
    : "/imports#inventory";
}

function MakeLogo({
  make,
  active,
  className,
}: {
  make: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <BrandLogo
      brand={make}
      className={cn(
        "transition-opacity duration-300",
        active ? "opacity-100" : "opacity-100 hover:opacity-80",
        className
      )}
    />
  );
}

function MakesMarquee() {
  const track = [...makes, ...makes, ...makes];

  return (
    <div className="makes-marquee relative overflow-hidden py-2">
      <div className="makes-marquee__fade makes-marquee__fade--left" aria-hidden />
      <div className="makes-marquee__fade makes-marquee__fade--right" aria-hidden />

      <div
        className="makes-marquee__track"
        role="list"
        aria-label="Vehicle makes we specialize in"
      >
        {track.map((make, index) => (
          <Link
            key={`${make}-${index}`}
            href={makeHref(make)}
            className="makes-marquee__item group flex shrink-0 items-center border-r border-border px-8 py-3 sm:px-12"
          >
            <MakeLogo make={make} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function MakesStrip({
  centered = false,
  className,
  activeMake = "",
  onSelect,
}: MakesStripProps) {
  const active = normalizeBrand(activeMake);

  if (centered && !onSelect) {
    return (
      <section
        className={cn(
          "border-y border-border bg-background py-8 sm:py-10",
          className
        )}
        aria-label="Featured makes"
      >
        <MakesMarquee />
      </section>
    );
  }

  // Imports / filter strip: single row, scroll horizontally if needed
  return (
    <section className={cn("border-y border-border py-6", className)}>
      {onSelect && (
        <p className="container-kyra mb-3 px-6 font-mono text-[10px] tracking-[0.14em] text-kyra-steel uppercase md:hidden">
          Tap a make to filter →
        </p>
      )}

      <div className="container-kyra scroll-fade-x overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:px-8 md:px-12 lg:px-20">
        <div className="flex min-w-max items-center justify-center">
          {makes.map((make, index) => {
            const normalized = normalizeBrand(make);
            const isActive = active === normalized;
            const classNames = cn(
              "group flex shrink-0 items-center px-3 py-2.5 transition-colors duration-300 sm:px-4 lg:px-5",
              index < makes.length - 1 && "border-r border-border",
              "cursor-pointer"
            );

            if (onSelect) {
              return (
                <button
                  key={make}
                  type="button"
                  onClick={() => onSelect(make)}
                  className={classNames}
                  aria-pressed={isActive}
                  aria-label={`Filter by ${make}`}
                >
                  <MakeLogo make={make} active={isActive} />
                </button>
              );
            }

            return (
              <Link
                key={make}
                href={makeHref(make)}
                className={classNames}
                aria-label={`View ${make} inventory`}
              >
                <MakeLogo make={make} active={isActive} />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
