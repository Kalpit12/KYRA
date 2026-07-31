"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { testimonials } from "@/lib/data/home";

export function TestimonialsSection() {
  return (
    <section className="section-padding border-t border-border bg-background">
      <div className="container-kyra">
        <SectionHeading
          label="Testimonials"
          title="What our clients say."
          align="center"
          className="mx-auto mb-16 text-center"
        />

        <div className="grid gap-px bg-border md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
              className="relative bg-background p-8"
            >
              <Quote size={32} className="text-kyra-red/55" aria-hidden />
              <div className="mt-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={14} className="fill-kyra-red text-kyra-red" />
                ))}
              </div>
              <p className="mt-6 text-sm leading-relaxed text-kyra-steel">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="mt-8 border-t border-dashed border-border pt-6">
                <p className="font-display text-sm font-semibold uppercase text-foreground">
                  {testimonial.name}
                </p>
                <p className="mt-1 font-mono text-[10px] tracking-[0.08em] text-kyra-steel uppercase">
                  {testimonial.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
