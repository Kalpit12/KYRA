"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/molecules/section-heading";
import { washResults } from "@/lib/data/wash";

export function WashResultsSection() {
  return (
    <section className="section-padding border-t border-border bg-background">
      <div className="container-kyra">
        <SectionHeading
          label="Results"
          title="Before & after."
          subtitle="Real outcomes from KYRA Wash — paint, interior, and finish restored to showroom standard."
          showChevrons
        />

        <div className="mt-12 grid gap-px bg-border lg:grid-cols-3">
          {washResults.map((result, index) => (
            <motion.article
              key={result.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: index * 0.08, duration: 0.7 }}
              className="bg-muted"
            >
              <div className="grid grid-cols-2">
                <div className="relative aspect-[4/5] sm:aspect-square">
                  <Image
                    src={result.beforeImage}
                    alt={`${result.vehicle} before detail`}
                    fill
                    className="object-cover brightness-90 saturate-75"
                    sizes="(max-width: 1024px) 50vw, 200px"
                  />
                  <span className="absolute bottom-2 left-2 border-l-2 border-kyra-steel bg-background/85 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-foreground uppercase">
                    Before
                  </span>
                </div>
                <div className="relative aspect-[4/5] sm:aspect-square">
                  <Image
                    src={result.afterImage}
                    alt={`${result.vehicle} after detail`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 200px"
                  />
                  <span className="absolute bottom-2 left-2 border-l-2 border-kyra-red bg-background/85 px-2 py-1 font-mono text-[9px] tracking-[0.12em] text-kyra-red uppercase">
                    After
                  </span>
                </div>
              </div>
              <div className="border-t border-border p-5 sm:p-6">
                <span className="font-mono text-[10px] tracking-[0.12em] text-kyra-red uppercase">
                  {result.package} package
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold italic uppercase text-foreground">
                  {result.title}
                </h3>
                <p className="mt-1 text-sm text-kyra-steel">{result.vehicle}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
