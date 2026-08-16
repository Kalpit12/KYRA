"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/molecules/section-heading";
import { AnimatedStat } from "@/components/molecules/animated-stat";
import { washProductBrands, washStudioShots, washTrustStats } from "@/lib/data/wash";

export function WashTrustSection() {
  return (
    <>
      <section className="border-y border-border bg-muted py-16 md:py-20">
        <div className="container-kyra">
          <SectionHeading
            label="Studio"
            title="Inside KYRA Wash."
            subtitle="A controlled environment built for luxury paintwork — not a drive-through lane."
            align="center"
            showChevrons
            className="mx-auto text-center"
          />

          <div className="mt-10 grid gap-px bg-border md:grid-cols-3">
            {washStudioShots.map((shot, index) => (
              <motion.div
                key={shot.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group relative aspect-[4/3] overflow-hidden bg-muted"
              >
                <Image
                  src={shot.src}
                  alt={shot.caption}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                <p className="absolute right-0 bottom-0 left-0 p-5 font-mono text-[10px] tracking-[0.14em] text-foreground uppercase">
                  {shot.caption}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-14 md:py-16">
        <div className="container-kyra">
          <p className="text-center font-mono text-[10px] tracking-[0.18em] text-kyra-steel uppercase">
            Products we trust
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
            {washProductBrands.map((brand) => (
              <span
                key={brand}
                className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-kyra-steel transition hover:text-foreground sm:text-base"
              >
                {brand}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-px border border-border bg-border">
            {washTrustStats.map((stat, index) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={200 + index * 150}
                duration={1800}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
