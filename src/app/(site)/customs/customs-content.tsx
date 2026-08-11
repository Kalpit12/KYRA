"use client";

import { WrapSimulator } from "@/components/organisms/customs/wrap-simulator";
import { CustomsStudioGallery } from "@/components/organisms/customs/customs-studio-gallery";
import { CustomsHighlightsSection } from "@/components/organisms/customs/customs-highlights-section";
import { CustomsInstagramSection } from "@/components/organisms/customs/instagram-section";
import { TradeBand } from "@/components/molecules/trade-band";
import { SectionHeading } from "@/components/molecules/section-heading";
import { WashFaqAccordion } from "@/components/molecules/wash-faq-accordion";
import { WhatsAppFloat } from "@/components/molecules/whatsapp-float";
import { customsFaqs } from "@/lib/data/wraps";

export function CustomsContent() {
  return (
    <>
      <WrapSimulator />

      <CustomsStudioGallery />

      <CustomsHighlightsSection />

      <CustomsInstagramSection />

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
