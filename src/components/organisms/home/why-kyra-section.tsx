"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/molecules/section-heading";
import { whyChooseKyra } from "@/lib/data/home";

export function WhyKyraSection() {
  return (
    <section className="home-section-cv border-y border-border bg-muted">
      <div className="container-kyra px-6 py-16 md:px-12 md:py-24 lg:px-20 lg:py-28">
        <SectionHeading
          label="Brand Equity"
          title="Trusted, aspirational, and built for buyers who do their homework."
          subtitle="We don't sell cars. We curate automotive experiences for those who demand the extraordinary."
          align="center"
          className="mx-auto mb-16 max-w-2xl text-center"
        />

        <div className="grid gap-px bg-border md:grid-cols-3">
          {whyChooseKyra.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.76, 0, 0.24, 1],
              }}
              className="bg-muted p-6 sm:p-10 md:p-11"
            >
              <div className="mb-4 font-mono text-[13px] text-kyra-red">
                {String(index + 1).padStart(2, "0")} / {item.title.split(" ")[0]}
              </div>
              <h4 className="font-display text-[19px] font-semibold italic uppercase text-foreground">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-kyra-steel">
                {item.description}
              </p>
              <p className="mt-6 font-mono text-2xl text-foreground">{item.stat}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-kyra-steel">
                {item.statLabel}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
