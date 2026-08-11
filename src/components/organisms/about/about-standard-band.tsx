"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/atoms/button";
import { aboutStandard } from "@/lib/data/about";

export function AboutStandardBand() {
  return (
    <section className="border-t border-border bg-foreground text-background">
      <div className="container-kyra section-padding !py-16 md:!py-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-xl"
          >
            <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
              {aboutStandard.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold italic uppercase">
              {aboutStandard.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70 md:text-base">
              {aboutStandard.subtitle}
            </p>
            <div className="mt-6">
              <Button
                href={aboutStandard.ctaHref}
                variant="primary"
                size="md"
                magnetic
                className="w-full sm:w-auto"
              >
                {aboutStandard.ctaLabel}
              </Button>
            </div>
          </motion.div>

          <div className="grid flex-1 gap-px bg-white/10 sm:grid-cols-3">
            {aboutStandard.pillars.map((pillar, index) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  delay: 0.08 * index,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="bg-foreground px-5 py-6 sm:px-6"
              >
                <span className="font-mono text-[11px] tracking-[0.14em] text-kyra-red uppercase">
                  {pillar.id}
                </span>
                <h3 className="mt-3 font-display text-lg font-semibold italic uppercase text-white">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">
                  {pillar.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
