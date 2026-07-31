"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { divisions } from "@/lib/data/home";

export function DivisionsSection() {
  return (
    <section className="section-padding relative border-t border-border bg-muted">
      <div className="container-kyra">
        <SectionHeading
          label="Our Companies"
          title="Three divisions. One standard."
          subtitle="Every KYRA division shares a commitment to excellence, craftsmanship, and uncompromising quality."
          align="center"
          className="mx-auto mb-16 text-center"
        />

        <div className="grid gap-px bg-border lg:grid-cols-3">
          {divisions.map((division, index) => (
            <motion.div
              key={division.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.15,
                ease: [0.76, 0, 0.24, 1],
              }}
            >
              <Link href={division.href} className="group block bg-muted">
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[4/5] lg:aspect-[3/4]">
                  <Image
                    src={division.image}
                    alt={division.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/80 via-black/45 to-transparent"
                    aria-hidden
                  />

                  <div className="absolute right-0 bottom-0 left-0 p-5 sm:p-8">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="font-mono text-[11px] tracking-[0.1em] text-kyra-red uppercase drop-shadow">
                          0{index + 1}
                        </p>
                        <h3 className="mt-2 font-display text-2xl font-semibold italic uppercase text-white drop-shadow-md md:text-3xl">
                          {division.name}
                        </h3>
                        <p className="mt-2 text-sm text-white/90 drop-shadow">
                          {division.tagline}
                        </p>
                      </div>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/50 bg-black/40 text-white backdrop-blur-[2px] transition-all duration-300 group-hover:border-kyra-red group-hover:bg-kyra-red">
                        <ArrowUpRight size={20} />
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
