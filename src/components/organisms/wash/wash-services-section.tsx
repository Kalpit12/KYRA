"use client";

import { motion } from "framer-motion";
import { Car, Sparkles, Shield, Circle, Armchair } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { washServices, washTagline } from "@/lib/data/wash";

const serviceIcons = {
  "exterior-wash": Car,
  "interior-detailing": Armchair,
  "wax-protection": Sparkles,
  "paint-protection": Shield,
  "wheel-tire-care": Circle,
} as const;

export function WashServicesSection() {
  return (
    <section className="border-b border-border bg-muted py-16 md:py-24">
      <div className="container-kyra">
        <SectionHeading
          label="What we offer"
          title="Premium care for every drive."
          subtitle={washTagline.motto}
          align="center"
          showChevrons
          className="mx-auto text-center"
        />

        <div className="mt-12 grid gap-px bg-border md:grid-cols-2 xl:grid-cols-5">
          {washServices.map((service, index) => {
            const Icon = serviceIcons[service.id as keyof typeof serviceIcons];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.08,
                  ease: [0.76, 0, 0.24, 1],
                }}
                className="bg-muted p-6 sm:p-8"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-kyra-red/35 bg-kyra-red/5 text-kyra-red">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold italic uppercase text-foreground">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-kyra-steel">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
