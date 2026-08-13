"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { Button } from "@/components/atoms/button";
import { HeroSearchCard } from "@/components/molecules/hero-search-card";
import { AnimatedStat } from "@/components/molecules/animated-stat";
import { HeroBackground } from "@/components/molecules/hero-background";
import { LazyVideo } from "@/components/molecules/lazy-video";
import { useMounted } from "@/lib/hooks/use-mounted";

const HERO_VIDEO = "/video/m340i-b-roll.mp4";
const HERO_VIDEO_POSTER = "/video/posters/m340i-b-roll.jpg";
const HERO_VIDEO_FALLBACK =
  "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80";

const divisions = ["Import", "Customize", "Maintain"];

const stats: {
  value: number;
  suffix: string;
  label: string;
  pad?: number;
}[] = [
  { value: 120, suffix: "+", label: "In Stock" },
  { value: 6, suffix: " mo", label: "Warranty", pad: 2 },
  { value: 24, suffix: " hr", label: "Viewings" },
];

const heroLine1 = ["Find", "your"];
const heroLine2 = ["next", "drive"];

const heroTextContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

const heroWord = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function HeroHeadline({ animate }: { animate: boolean }) {
  return (
    <motion.h1
      className="font-hero mt-5 text-[clamp(2.25rem,8vw,5rem)] leading-[0.95]"
      variants={heroTextContainer}
      initial={animate ? "hidden" : false}
      animate="visible"
      aria-label="Find your next drive"
    >
      <span className="block whitespace-nowrap text-white">
        {heroLine1.map((word, index) => (
          <motion.span
            key={word}
            variants={heroWord}
            className="inline-block"
            style={{ marginRight: index < heroLine1.length - 1 ? "0.22em" : 0 }}
          >
            {word}
          </motion.span>
        ))}
      </span>

      <span className="relative mt-1 block whitespace-nowrap sm:mt-0">
        <span className="text-flow-red inline-block">
          {heroLine2.map((word, index) => (
            <motion.span
              key={word}
              variants={heroWord}
              className="inline-block"
              style={{ marginRight: index < heroLine2.length - 1 ? "0.22em" : 0 }}
            >
              {word}
            </motion.span>
          ))}
        </span>
        <motion.span
          className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-kyra-red-dark via-kyra-red to-kyra-red-dark"
          initial={animate ? { width: 0 } : false}
          animate={{ width: "100%" }}
          transition={{ delay: animate ? 0.85 : 0, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
    </motion.h1>
  );
}

function HeroVideo() {
  const [useFallback, setUseFallback] = useState(false);

  if (useFallback) {
    return (
      <Image
        src={HERO_VIDEO_FALLBACK}
        alt="BMW M340i showcase"
        width={640}
        height={800}
        className="aspect-[4/5] h-auto w-full object-cover contrast-[1.06] saturate-[1.04]"
        priority
      />
    );
  }

  return (
    <LazyVideo
      src={HERO_VIDEO}
      poster={HERO_VIDEO_POSTER}
      rootMargin="600px 0px"
      onError={() => setUseFallback(true)}
      className="aspect-[4/5] h-auto w-full object-cover contrast-[1.06] saturate-[1.04]"
      aria-label="BMW M340i showcase video"
    />
  );
}

export function HeroSection() {
  const mounted = useMounted();

  return (
    <section className="relative flex min-h-0 items-center overflow-hidden bg-black pt-24 pb-12 md:min-h-screen md:pt-[110px] md:pb-20">
      <HeroBackground enableBeams={false} />
      <div className="hero-accent-bar hidden lg:block" aria-hidden />

      <div className="container-kyra relative z-10 px-6 md:px-12 lg:px-20">
        <div className="grid items-center gap-10 md:gap-12 xl:grid-cols-[1.05fr_0.95fr] xl:gap-16">
          <motion.div
            initial={mounted ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: mounted ? 0.35 : 0, ease: [0.76, 0, 0.24, 1] }}
          >
            <Eyebrow showChevrons>
              Nairobi&apos;s Home of Performance Imports
            </Eyebrow>

            <HeroHeadline animate={mounted} />

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {divisions.map((item, index) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-white/55 uppercase">
                    {item}
                  </span>
                  {index < divisions.length - 1 && (
                    <span className="text-kyra-red/70">/</span>
                  )}
                </span>
              ))}
            </div>

            <p className="mt-5 max-w-[480px] border-l-2 border-kyra-red/60 pl-4 text-[15px] leading-relaxed text-white/70">
              Import the exceptional. Customize without compromise. Maintain it
              flawlessly — one team for your entire automotive journey.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <Button href="/imports" variant="primary" size="lg" magnetic>
                Explore Inventory
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                magnetic
                showArrow={false}
                className="border-white/25 bg-white/10 text-white hover:bg-white/15"
              >
                Book Consultation
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-px border border-white/15 bg-white/15">
              {stats.map((stat, index) => (
                <AnimatedStat
                  key={stat.label}
                  value={stat.value}
                  suffix={stat.suffix}
                  pad={stat.pad}
                  label={stat.label}
                  delay={mounted ? 700 + index * 140 : 0}
                />
              ))}
            </div>

            <div className="mt-8">
              <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-white/50 uppercase">
                Quick search
              </p>
              <HeroSearchCard />
            </div>
          </motion.div>

          <motion.div
            initial={mounted ? { opacity: 0, x: 40 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: mounted ? 0.5 : 0, ease: [0.76, 0, 0.24, 1] }}
            className="relative mx-auto w-full max-w-[520px] xl:max-w-none xl:order-none"
          >
            <div
              className="absolute -top-3 -left-3 hidden h-full w-full border-2 border-kyra-red/45 sm:block"
              aria-hidden
            />

            <div className="relative overflow-hidden border border-border bg-muted">
              <HeroVideo />

              <div className="absolute top-4 left-4 border border-white/40 bg-black/55 px-3 py-2">
                <p className="font-mono text-[9px] tracking-[0.16em] text-kyra-red uppercase">
                  Featured
                </p>
                <p className="mt-0.5 font-display text-sm font-semibold italic uppercase text-white">
                  BMW M340i
                </p>
              </div>

              <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-3 border-t border-white/15 bg-black/70 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.12em] text-white/70 uppercase">
                    Flagship Showroom — Nairobi
                  </p>
                  <p className="mt-1 font-mono text-base text-white sm:text-lg">
                    Performance imports
                  </p>
                </div>
                <Link
                  href="/imports"
                  className="btn-cut-tr w-full shrink-0 bg-white px-4 py-3 text-center font-display text-[11px] font-semibold tracking-[0.08em] text-foreground uppercase transition hover:bg-kyra-red hover:text-white sm:w-auto sm:py-2.5"
                >
                  View Stock
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
