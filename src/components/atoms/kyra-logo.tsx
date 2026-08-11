import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface KyraLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string | null;
  priority?: boolean;
  /** Blends out the light JPG background on dark surfaces */
  removeBackground?: boolean;
}

interface KyraWordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string | null;
  showTagline?: boolean;
  tagline?: string;
}

interface KyraBrandProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string | null;
  showTagline?: boolean;
  tagline?: string;
  priority?: boolean;
  removeBackground?: boolean;
}

const heights = {
  sm: 44,
  md: 56,
  lg: 100,
} as const;

const wordmarkSizes = {
  sm: "text-[1.75rem] leading-none",
  md: "text-3xl leading-none",
  lg: "text-[clamp(2.5rem,8vw,4.25rem)] leading-none",
} as const;

export function KyraWordmark({
  size = "sm",
  className,
  href = "/",
  showTagline = false,
  tagline = "Import · Customize · Maintain",
}: KyraWordmarkProps) {
  const mark = (
    <span className={cn("inline-flex flex-col whitespace-nowrap", className)}>
      <span
        className={cn(
          "font-hero font-extrabold tracking-[-0.045em] text-foreground whitespace-nowrap",
          wordmarkSizes[size]
        )}
      >
        KYR<span className="text-kyra-red">Λ</span>
      </span>
      {showTagline && (
        <small className="mt-1 font-mono text-[9px] tracking-[0.22em] text-kyra-steel uppercase whitespace-nowrap">
          {tagline}
        </small>
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex shrink-0 transition-colors hover:[&>span>span:first-child]:text-kyra-red"
      >
        {mark}
      </Link>
    );
  }

  return mark;
}

export function KyraLogo({
  size = "sm",
  className,
  href = "/",
  priority = false,
  removeBackground = false,
}: KyraLogoProps) {
  const height = heights[size];

  const image = (
    <Image
      src="/kyra-logo.jpg"
      alt="Kyra Platinum Imports"
      width={1024}
      height={1024}
      priority={priority}
      className={cn("w-auto object-contain", !removeBackground && className)}
      style={{ width: "auto", height: `${height}px` }}
    />
  );

  const logo = removeBackground ? (
    <span
      className={cn(
        "isolate inline-flex shrink-0 rounded-sm bg-background p-0.5",
        className
      )}
    >
      <Image
        src="/kyra-logo.jpg"
        alt="Kyra Platinum Imports"
        width={1024}
        height={1024}
        priority={priority}
        className="w-auto mix-blend-darken object-contain"
        style={{ width: "auto", height: `${height}px` }}
      />
    </span>
  ) : (
    image
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex shrink-0 items-center">
        {logo}
      </Link>
    );
  }

  return logo;
}

export function KyraBrand({
  size = "sm",
  className,
  href = "/",
  showTagline = false,
  tagline,
  priority = false,
  removeBackground = true,
}: KyraBrandProps) {
  const lockup = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <KyraLogo
        size={size}
        href={null}
        priority={priority}
        removeBackground={removeBackground}
      />
      <KyraWordmark
        size={size}
        href={null}
        showTagline={showTagline}
        tagline={tagline}
      />
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex shrink-0 items-center">
        {lockup}
      </Link>
    );
  }

  return lockup;
}

interface KyraCustomsBrandProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string | null;
  showTagline?: boolean;
  tagline?: string;
  priority?: boolean;
}

const customsWordmarkSizes = {
  sm: "text-[1.05rem] leading-none sm:text-[1.2rem]",
  md: "text-xl leading-none",
  lg: "text-2xl leading-none",
} as const;

/** Header lockup for /customs — mark + KYRA CUSTOMS + tagline */
export function KyraCustomsBrand({
  size = "sm",
  className,
  href = "/customs",
  showTagline = true,
  tagline = "Divine Elegance",
  priority = false,
}: KyraCustomsBrandProps) {
  const height = heights[size];

  const lockup = (
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3", className)}>
      <span className="inline-flex shrink-0 items-center rounded-sm bg-black px-1 py-0.5">
        <Image
          src="/kyra-customs-logo.jpg"
          alt=""
          width={640}
          height={360}
          priority={priority}
          aria-hidden
          className="w-auto object-contain"
          style={{ width: "auto", height: `${height}px` }}
        />
      </span>
      <span className="inline-flex shrink-0 flex-col whitespace-nowrap">
        <span
          className={cn(
            "font-hero font-extrabold tracking-[-0.03em] text-foreground uppercase whitespace-nowrap",
            customsWordmarkSizes[size]
          )}
        >
          Kyra <span className="text-kyra-red">Customs</span>
        </span>
        {showTagline && (
          <small className="mt-1 font-mono text-[9px] tracking-[0.22em] text-kyra-steel uppercase whitespace-nowrap">
            {tagline}
          </small>
        )}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex shrink-0 items-center">
        {lockup}
      </Link>
    );
  }

  return lockup;
}

interface KyraWashBrandProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string | null;
  showTagline?: boolean;
  tagline?: string;
  priority?: boolean;
}

const washWordmarkSizes = {
  sm: "text-[0.95rem] leading-none sm:text-[1.1rem]",
  md: "text-xl leading-none",
  lg: "text-2xl leading-none",
} as const;

/** Header lockup for /wash — mark + Kyra Premium Wash + tagline */
export function KyraWashBrand({
  size = "sm",
  className,
  href = "/wash",
  showTagline = true,
  tagline = "Clean · Shine · Elevate",
  priority = false,
}: KyraWashBrandProps) {
  const height = heights[size];

  const lockup = (
    <span className={cn("inline-flex items-center gap-2.5 sm:gap-3", className)}>
      <span className="inline-flex shrink-0 items-center rounded-sm bg-black px-1 py-0.5">
        <Image
          src="/kyra-wash-logo.jpg"
          alt=""
          width={640}
          height={360}
          priority={priority}
          aria-hidden
          className="w-auto object-contain"
          style={{ width: "auto", height: `${height}px` }}
        />
      </span>
      <span className="inline-flex shrink-0 flex-col whitespace-nowrap">
        <span
          className={cn(
            "font-hero font-extrabold tracking-[-0.03em] text-foreground uppercase whitespace-nowrap",
            washWordmarkSizes[size]
          )}
        >
          Kyra <span className="text-kyra-red">Premium Wash</span>
        </span>
        {showTagline && (
          <small className="mt-1 font-mono text-[9px] tracking-[0.22em] text-kyra-steel uppercase whitespace-nowrap">
            {tagline}
          </small>
        )}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="group inline-flex shrink-0 items-center">
        {lockup}
      </Link>
    );
  }

  return lockup;
}
