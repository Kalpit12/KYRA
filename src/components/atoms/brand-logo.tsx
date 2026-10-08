import { cn } from "@/lib/utils";
import { normalizeBrand } from "@/lib/inventory-filters";

export type BrandLogoId =
  | "BMW"
  | "Mercedes-Benz"
  | "Land Rover"
  | "Audi"
  | "Toyota"
  | "Porsche"
  | "Nissan";

const BRAND_ASSETS: Record<
  BrandLogoId,
  { src: string; lightSrc?: string; width: number; height: number }
> = {
  "Mercedes-Benz": {
    src: "/brands/mercedes.png?v=6",
    width: 205,
    height: 150,
  },
  Audi: { src: "/brands/audi.png?v=6", width: 216, height: 140 },
  Toyota: { src: "/brands/toyota.png?v=6", width: 207, height: 150 },
  Porsche: { src: "/brands/porsche.png?v=6", width: 289, height: 160 },
  BMW: { src: "/brands/bmw.png?v=6", width: 150, height: 150 },
  "Land Rover": {
    src: "/brands/land-rover.png?v=6",
    width: 220,
    height: 100,
  },
  Nissan: {
    src: "/brands/nissan.png?v=1",
    lightSrc: "/brands/nissan-light.png?v=1",
    width: 240,
    height: 140,
  },
};

interface BrandLogoProps {
  brand: string;
  className?: string;
  title?: string;
  /** Dark showroom surfaces (Home / Imports). */
  variant?: "default" | "platinum";
}

/** Brand marks from `/public/brands` — sized for the logo wall. */
export function BrandLogo({
  brand,
  className,
  title,
  variant = "default",
}: BrandLogoProps) {
  const id = (normalizeBrand(brand.trim()) || brand.trim()) as BrandLogoId;
  const label = title ?? brand;
  const asset = BRAND_ASSETS[id];
  const onPlatinum = variant === "platinum";
  const useNativeLight = onPlatinum && Boolean(asset?.lightSrc);

  return (
    <span
      className={cn(
        "inline-flex h-11 w-[6.5rem] shrink-0 items-center justify-center text-current sm:h-12 sm:w-[7.5rem] lg:w-32",
        className
      )}
      role="img"
      aria-label={label}
    >
      {asset ? (
        <img
          src={useNativeLight ? asset.lightSrc! : asset.src}
          alt=""
          title={label}
          width={asset.width}
          height={asset.height}
          draggable={false}
          className={cn(
            "brand-logo-mark h-[90%] w-auto max-w-full object-contain",
            useNativeLight && "brand-logo-mark--native-light"
          )}
          aria-hidden
        />
      ) : (
        <span className="font-display text-[13px] font-semibold uppercase tracking-[0.08em]">
          {label}
        </span>
      )}
    </span>
  );
}
