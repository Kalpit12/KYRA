"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { contactExplore } from "@/lib/data/contact";

export function ContactExploreBand() {
  return (
    <section className="border-t border-border bg-foreground text-background">
      <div className="container-kyra section-padding !py-12 md:!py-16">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-md"
          >
            <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
              {contactExplore.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-semibold italic uppercase">
              {contactExplore.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              {contactExplore.subtitle}
            </p>
          </motion.div>

          <div className="grid flex-1 gap-px bg-white/10 sm:grid-cols-3">
            {contactExplore.links.map((link, index) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.55,
                  delay: 0.06 * index,
                  ease: [0.76, 0, 0.24, 1],
                }}
              >
                <Link
                  href={link.href}
                  className="group flex h-full flex-col justify-between bg-foreground px-5 py-6 transition-colors hover:bg-white/[0.04] sm:px-6"
                >
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-steel uppercase">
                      {link.description}
                    </p>
                    <p className="mt-2 font-display text-lg font-semibold italic uppercase text-white">
                      {link.label}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.12em] text-kyra-red uppercase transition-transform group-hover:translate-x-0.5">
                    Open
                    <ArrowUpRight size={12} strokeWidth={2} />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
