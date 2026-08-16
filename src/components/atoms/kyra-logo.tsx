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
  /** Dark pill behind mark on transparent headers */
  inverted?: boolean;
}

interface KyraWordmarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string | null;
  showTagline?: boolean;
  tagline?: string;
  /** White wordmark for dark / transparent headers */
  inverted?: boolean;
}

interface KyraBrandProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  href?: string | null;
  showTagline?: boolean;
  tagline?: string;
  priority?: boolean;
  removeBackground?: boolean;
  /** White wordmark for dark / transparent headers */
  inverted?: boolean;
}

const heights = {
  sm: 44,
  md: 56,
  lg: 100,
} as const;

const wordmarkSizes = {
  sm: "text-[1.55rem] leading-none sm:text-[1.7rem]",
  md: "text-3xl leading-none",
  lg: "text-[clamp(2.5rem,8vw,4.25rem)] leading-none",
} as const;

/** Geometric barless A from the Platinum Imports / Wash marks. */
function KyraBarlessA({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 72 80"
      className={cn(
        "inline-block h-[1cap] w-[0.9cap] shrink-0 overflow-visible align-baseline",
        className
      )}
      aria-hidden
      focusable="false"
    >
      <path fill="currentColor" d="M36 0 72 80H56.4L36 30.8 15.6 80H0Z" />
    </svg>
  );
}

function KyraLetters({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-baseline leading-none", className)}
      style={{ gap: "0.12em" }}
      aria-hidden
    >
      <span>K</span>
      <span>Y</span>
      <span>R</span>
      <KyraBarlessA />
    </span>
  );
}

export function KyraWordmark({
  size = "sm",
  className,
  href = "/",
  showTagline = false,
  tagline = "Import · Customize · Maintain",
  inverted = false,
}: KyraWordmarkProps) {
  const mark = (
    <span className={cn("inline-flex flex-col whitespace-nowrap", className)}>
      <span
        aria-label="KYRA"
        className={cn(
          "kyra-brand-wordmark-main font-wordmark whitespace-nowrap",
          inverted ? "text-white" : "text-foreground",
          wordmarkSizes[size]
        )}
      >
        <KyraLetters />
      </span>
      {showTagline && (
        <small
          className={cn(
            "kyra-brand-tagline kyra-lockup-tagline mt-1.5 text-[8px] whitespace-nowrap sm:text-[9px]",
            inverted ? "text-white/55" : "text-kyra-steel"
          )}
        >
          {tagline}
        </small>
      )}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group inline-flex shrink-0 transition-colors hover:[&_.kyra-brand-wordmark-main]:text-kyra-red"
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
  inverted = false,
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
        "kyra-brand-logo-wrap isolate inline-flex shrink-0 rounded-sm p-0.5",
        inverted ? "bg-black/70" : "bg-background",
        className
      )}
    >
      <Image
        src="/kyra-logo.jpg"
        alt="Kyra Platinum Imports"
        width={1024}
        height={1024}
        priority={priority}
        className={cn(
          "w-auto object-contain",
          inverted ? "brightness-110 contrast-110" : "mix-blend-darken"
        )}
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
  inverted = false,
}: KyraBrandProps) {
  const lockup = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <KyraLogo
        size={size}
        href={null}
        priority={priority}
        removeBackground={removeBackground}
        inverted={inverted}
      />
      <KyraWordmark
        size={size}
        href={null}
        showTagline={showTagline}
        tagline={tagline}
        inverted={inverted}
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
  sm: "text-[1.35rem] leading-none sm:text-[1.55rem]",
  md: "text-[1.75rem] leading-none",
  lg: "text-[2.15rem] leading-none",
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
            "font-customs-mark text-foreground whitespace-nowrap",
            customsWordmarkSizes[size]
          )}
        >
          KYRA <span className="text-kyra-red">CUSTOMS</span>
        </span>
        {showTagline && (
          <small className="kyra-lockup-tagline mt-1.5 text-[8px] text-kyra-steel whitespace-nowrap sm:text-[9px]">
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
  sm: "text-[1.35rem] leading-none sm:text-[1.5rem]",
  md: "text-2xl leading-none",
  lg: "text-3xl leading-none",
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
          aria-label="KYRA"
          className={cn(
            "font-wordmark text-foreground whitespace-nowrap",
            washWordmarkSizes[size]
          )}
        >
          <KyraLetters />
        </span>
        <span className="kyra-lockup-tagline mt-1 text-[7.5px] text-kyra-steel whitespace-nowrap sm:text-[8.5px]">
          Premium Wash
        </span>
        {showTagline && (
          <small className="kyra-lockup-tagline mt-1 text-[8px] text-kyra-steel whitespace-nowrap sm:text-[9px]">
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
