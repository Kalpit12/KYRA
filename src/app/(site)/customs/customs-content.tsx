"use client";

import { WrapSimulator } from "@/components/organisms/customs/wrap-simulator";
import { TradeBand } from "@/components/molecules/trade-band";
import { SectionHeading } from "@/components/molecules/section-heading";
import { WashFaqAccordion } from "@/components/molecules/wash-faq-accordion";
import { WhatsAppFloat } from "@/components/molecules/whatsapp-float";
import { wrapProjects } from "@/lib/data/home";
import { customsFaqs } from "@/lib/data/wraps";
import Image from "next/image";

export function CustomsContent() {
  return (
    <>
      <WrapSimulator />

      <section className="border-t border-border bg-muted">
        <div className="container-kyra section-padding !py-24">
          <SectionHeading
            label="Portfolio"
            title="Customer projects."
            subtitle="Real transformations from the KYRA Customs studio."
          />

          <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
            {wrapProjects.map((project) => (
              <div key={project.id} className="bg-muted">
                <div className="grid grid-cols-2">
                  <div className="relative aspect-square">
                    <Image
                      src={project.beforeImage}
                      alt="Before"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <span className="absolute bottom-2 left-2 border-l-2 border-kyra-steel bg-background/80 px-2 py-1 font-mono text-[9px] tracking-[0.1em] text-foreground uppercase">
                      Before
                    </span>
                  </div>
                  <div className="relative aspect-square">
                    <Image
                      src={project.afterImage}
                      alt="After"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <span className="absolute bottom-2 left-2 border-l-2 border-kyra-red bg-background/80 px-2 py-1 font-mono text-[9px] tracking-[0.1em] text-kyra-red uppercase">
                      After
                    </span>
                  </div>
                </div>
                <div className="border-t border-border p-5">
                  <span className="font-mono text-[10px] tracking-[0.1em] text-kyra-red uppercase">
                    {project.finish} · {project.color}
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold italic uppercase text-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm text-kyra-steel">{project.vehicle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-background">
        <div className="container-kyra section-padding !py-24">
          <div className="mx-auto max-w-3xl">
            <SectionHeading label="FAQ" title="Common questions." showChevrons />
            <div className="mt-8">
              <WashFaqAccordion items={customsFaqs} />
            </div>
          </div>
        </div>
      </section>

      <TradeBand />
      <WhatsAppFloat />
    </>
  );
}
