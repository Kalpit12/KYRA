"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { divisions } from "@/lib/data/home";

export function AboutDivisionsSection() {
  return (
    <section className="border-t border-border bg-background">
      <div className="container-kyra section-padding !py-24">
        <SectionHeading
          label="Our Companies"
          title="Three divisions. One standard."
          subtitle="Every KYRA division shares a commitment to excellence, craftsmanship, and uncompromising quality."
          align="center"
          showChevrons
          className="mx-auto mb-16 text-center"
        />

        <div className="grid gap-px bg-border lg:grid-cols-3">
          {divisions.map((division, index) => (
            <motion.div
              key={division.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.12,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <Link href={division.href} className="group block bg-background">
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/3]">
                  <Image
                    src={division.image}
                    alt={division.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
                  <div className="absolute inset-0 bg-kyra-red/0 transition-colors duration-500 group-hover:bg-kyra-red/10" />

                  <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-6">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.1em] text-kyra-red uppercase">
                          0{index + 1}
                        </p>
                        <h3 className="mt-2 font-display text-xl font-semibold italic uppercase text-foreground md:text-2xl">
                          {division.name}
                        </h3>
                        <p className="mt-2 text-sm text-kyra-steel">{division.tagline}</p>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-border bg-background/50 text-foreground transition-all duration-300 group-hover:border-kyra-red group-hover:bg-kyra-red group-hover:text-white">
                        <ArrowUpRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
