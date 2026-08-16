import { Eyebrow } from "@/components/atoms/eyebrow";
import { PageHeroVideo } from "@/components/molecules/page-hero-video";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  titleNode?: ReactNode;
  subtitle?: string;
  showShard?: boolean;
  showChevrons?: boolean;
  backgroundImage?: string;
  backgroundVideo?: string;
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  titleNode,
  subtitle,
  showShard = true,
  showChevrons = false,
  backgroundImage,
  backgroundVideo,
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[38vh] items-end overflow-hidden pt-24 pb-12 md:min-h-[52vh] md:pt-[110px] md:pb-16",
        backgroundVideo && "min-h-[52vh] md:min-h-[68vh]",
        className
      )}
    >
      {backgroundVideo ? (
        <>
          <PageHeroVideo src={backgroundVideo} poster={backgroundImage} />
          <div className="absolute inset-0 bg-gradient-to-t from-background from-25% via-background/75 via-45% to-background/25" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--hero-glow),transparent_55%)]" />
        </>
      ) : backgroundImage ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          />
          <div
            className={cn(
              "absolute inset-0",
              showShard
                ? "bg-gradient-to-r from-background via-background/90 to-background/35"
                : "bg-gradient-to-t from-background via-background/85 to-background/50"
            )}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 80% 20%, var(--hero-glow), transparent 60%), var(--background)",
          }}
        />
      )}

      {showShard && !backgroundVideo && (
        <div className="hero-shard" aria-hidden />
      )}

      <div className="container-kyra relative z-10 px-6 md:px-12 lg:px-20">
        <Eyebrow showChevrons={showChevrons}>{eyebrow}</Eyebrow>
        {titleNode ?? (
          <h1 className="font-hero mt-4 max-w-3xl text-[clamp(1.875rem,5vw,4rem)] leading-[0.98] text-foreground">
            {title}
          </h1>
        )}
        {subtitle && (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px]">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
