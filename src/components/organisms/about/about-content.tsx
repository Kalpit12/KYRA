"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PageHero } from "@/components/molecules/page-hero";
import { SectionHeading } from "@/components/molecules/section-heading";
import { AnimatedStat } from "@/components/molecules/animated-stat";
import { AboutCtaSection } from "@/components/organisms/about/about-cta-section";
import { AboutDivisionsSection } from "@/components/organisms/about/about-divisions-section";
import { AboutLocationSection } from "@/components/organisms/about/about-location-section";
import { AboutStandardBand } from "@/components/organisms/about/about-standard-band";
import {
  aboutIntro,
  aboutAnimatedStats,
  aboutFoundedStat,
  aboutMissionVision,
  aboutTimeline,
} from "@/lib/data/about";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as const },
};

export function AboutContent() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="About KYRA"
        subtitle="Kenya's most premium automotive lifestyle brand — headquartered in Spring Valley, Nairobi. Import, customize, and maintain under one roof."
        showChevrons
        backgroundImage="/BMW%27s.jpg"
      />

      <section className="section-padding border-b border-border bg-background">
        <div className="container-kyra grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div {...fadeUp}>
            <SectionHeading label={aboutIntro.label} title={aboutIntro.title} />
            <div className="mt-6 space-y-4">
              {aboutIntro.body.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-sm leading-relaxed text-kyra-steel md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-6 border-l-2 border-kyra-red/50 pl-4 font-display text-base italic text-foreground md:text-lg">
              {aboutIntro.pullQuote}
            </p>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none"
          >
            <div
              className="absolute -top-3 -left-3 hidden h-full w-full border border-kyra-red/25 sm:block"
              aria-hidden
            />
            <div className="relative overflow-hidden border border-border bg-muted">
              <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]">
                <Image
                  src={aboutIntro.image}
                  alt={aboutIntro.imageAlt}
                  fill
                  className="object-cover contrast-[1.04] saturate-[1.03]"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/15 to-transparent" />
              </div>
              <div className="absolute right-0 bottom-0 left-0 border-t border-border/80 bg-background/80 px-5 py-4 backdrop-blur-sm">
                <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                  Flagship Showroom
                </p>
                <p className="mt-1 font-display text-sm font-semibold italic uppercase text-foreground">
                  Spring Valley, Nairobi
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border bg-muted py-12 md:py-16">
        <div className="container-kyra">
          <div className="grid grid-cols-3 gap-px border border-border bg-border">
            {aboutAnimatedStats.map((stat, index) => (
              <AnimatedStat
                key={stat.label}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={index * 120}
              />
            ))}
            <div className="min-w-0 bg-muted/80 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
              <span className="inline-flex items-baseline whitespace-nowrap font-hero text-[clamp(1.125rem,2.8vw,1.5rem)] font-extrabold leading-none tracking-[-0.03em] text-foreground tabular-nums">
                {aboutFoundedStat.display}
              </span>
              <span className="mt-1.5 block whitespace-nowrap font-mono text-[9px] tracking-[0.1em] text-kyra-steel uppercase sm:text-[10px] sm:tracking-[0.12em]">
                {aboutFoundedStat.label}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-kyra">
          <SectionHeading
            label="What drives us"
            title="Mission & vision."
            align="center"
            showChevrons
            className="mx-auto text-center"
          />

          <div className="mt-12 grid gap-px bg-border md:grid-cols-2">
            {aboutMissionVision.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.12,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="bg-background p-8 md:p-10"
              >
                <div className="mb-4 font-mono text-[13px] text-kyra-red">
                  {String(index + 1).padStart(2, "0")} / {item.label}
                </div>
                <h3 className="font-display text-[clamp(1.5rem,3vw,2rem)] font-semibold italic uppercase text-foreground">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-kyra-steel md:text-base">
                  {item.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted">
        <div className="container-kyra section-padding !py-24">
          <SectionHeading label="Timeline" title="Our journey." />
          <div className="mt-12">
            {aboutTimeline.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.06,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="relative flex flex-col gap-2 border-l border-border py-6 pl-6 sm:flex-row sm:items-start sm:gap-8 sm:py-8 sm:pl-8"
              >
                <div className="absolute top-8 -left-1.5 h-3 w-3 bg-kyra-red sm:top-10" />
                <span className="shrink-0 font-mono text-xl text-kyra-red sm:w-20 sm:text-2xl">
                  {item.year}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="mb-2 inline-block border border-border bg-background px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
                    {item.tag}
                  </span>
                  <p className="text-sm leading-relaxed text-kyra-steel md:text-base">
                    <span className="mr-3 font-mono text-[11px] text-kyra-steel">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {item.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AboutDivisionsSection />
      <AboutLocationSection />
      <AboutStandardBand />
      <AboutCtaSection />
    </>
  );
}
