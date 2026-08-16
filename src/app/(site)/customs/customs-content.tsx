import dynamic from "next/dynamic";
import { WrapSimulator } from "@/components/organisms/customs/wrap-simulator";
import { TradeBand } from "@/components/molecules/trade-band";
import { SectionHeading } from "@/components/molecules/section-heading";
import { WashFaqAccordion } from "@/components/molecules/wash-faq-accordion";
import { WhatsAppFloat } from "@/components/molecules/whatsapp-float";
import { customsFaqs } from "@/lib/data/wraps";

function SectionPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex min-h-[280px] items-center justify-center border-t border-border bg-muted/40"
      aria-busy="true"
      aria-label={`Loading ${label}`}
    >
      <p className="font-mono text-[10px] tracking-[0.16em] text-kyra-steel uppercase">
        Loading {label}
      </p>
    </div>
  );
}

const CustomsStudioGallery = dynamic(
  () =>
    import("@/components/organisms/customs/customs-studio-gallery").then(
      (mod) => mod.CustomsStudioGallery
    ),
  { loading: () => <SectionPlaceholder label="customer projects" /> }
);

const CustomsHighlightsSection = dynamic(
  () =>
    import("@/components/organisms/customs/customs-highlights-section").then(
      (mod) => mod.CustomsHighlightsSection
    ),
  { loading: () => <SectionPlaceholder label="behind the scenes" /> }
);

const CustomsInstagramSection = dynamic(
  () =>
    import("@/components/organisms/customs/instagram-section").then(
      (mod) => mod.CustomsInstagramSection
    ),
  { loading: () => <SectionPlaceholder label="instagram" /> }
);

export function CustomsContent() {
  return (
    <div data-customs-theme>
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

      <TradeBand className="border-t border-kyra-red/35 !bg-black" />
      <WhatsAppFloat />
    </div>
  );
}
