"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { washTestimonials } from "@/lib/data/wash";

export function WashTestimonialsSection() {
  return (
    <section className="border-t border-border bg-muted py-16 md:py-24">
      <div className="container-kyra">
        <SectionHeading
          label="Clients"
          title="Trusted by owners who notice the difference."
          align="center"
          showChevrons
          className="mx-auto text-center"
        />

        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {washTestimonials.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.65 }}
              className="bg-muted p-6 sm:p-8"
            >
              <Quote size={28} className="text-kyra-red/35" aria-hidden />
              <div className="mt-3 flex gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <Star key={i} size={13} className="fill-kyra-red text-kyra-red" />
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-kyra-steel">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-dashed border-border pt-5">
                <p className="font-display text-sm font-semibold uppercase text-foreground">
                  {item.name}
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.08em] text-kyra-steel uppercase">
                  {item.role}
                </p>
                <p className="mt-2 font-mono text-[10px] text-kyra-red">{item.vehicle}</p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
