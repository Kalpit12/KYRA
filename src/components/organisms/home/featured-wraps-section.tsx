"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/molecules/section-heading";
import { Button } from "@/components/atoms/button";
import { wrapProjects } from "@/lib/data/home";

export function FeaturedWrapsSection() {
  return (
    <section className="section-padding border-t border-border bg-background">
      <div className="container-kyra">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            label="KYRA Customs"
            title="Featured wraps."
            subtitle="Precision vinyl wraps and PPF installations that transform vehicles into rolling art."
          />
          <Button href="/customs" variant="primary" size="sm">
            Configure Your Wrap
          </Button>
        </div>

        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {wrapProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.7 }}
            >
              <Link href="/customs" className="group block bg-background">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={project.afterImage}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
                  <div className="absolute right-0 bottom-0 left-0 p-6">
                    <span className="font-mono text-[10px] tracking-[0.1em] text-kyra-red uppercase">
                      {project.finish} · {project.color}
                    </span>
                    <h3 className="mt-2 font-display text-xl font-semibold italic uppercase text-foreground">
                      {project.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{project.vehicle}</p>
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
