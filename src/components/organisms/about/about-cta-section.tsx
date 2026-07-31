"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/atoms/button";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { aboutCta } from "@/lib/data/about";

export function AboutCtaSection() {
  return (
    <section className="relative overflow-hidden border-t border-border bg-background py-24 md:py-32">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 50% 80% at 50% 100%, rgba(226,19,31,0.12), transparent 70%)",
        }}
      />
      <div className="line-accent absolute top-0 right-0 left-0" />

      <div className="container-kyra relative px-6 text-center md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Eyebrow className="justify-center">{aboutCta.eyebrow}</Eyebrow>
          <h2 className="font-hero mt-4 text-[clamp(2rem,5vw,3.5rem)] leading-[0.98] text-foreground">
            {aboutCta.title}
            <br />
            <span className="text-kyra-red">{aboutCta.highlight}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-kyra-steel md:text-base">
            {aboutCta.subtitle}
          </p>
          <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Button
              href={aboutCta.primaryHref}
              variant="primary"
              size="lg"
              magnetic
              className="w-full sm:w-auto"
            >
              {aboutCta.primaryLabel}
            </Button>
            <Button
              href={aboutCta.secondaryHref}
              variant="secondary"
              size="lg"
              magnetic
              className="w-full sm:w-auto"
            >
              {aboutCta.secondaryLabel}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
