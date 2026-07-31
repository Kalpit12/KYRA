"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { PageHero } from "@/components/molecules/page-hero";
import { SectionHeading } from "@/components/molecules/section-heading";
import { TradeBand } from "@/components/molecules/trade-band";
import { WashFaqAccordion } from "@/components/molecules/wash-faq-accordion";
import { WhatsAppFloat } from "@/components/molecules/whatsapp-float";
import { WashResultsSection } from "@/components/organisms/wash/wash-results-section";
import { WashServicesSection } from "@/components/organisms/wash/wash-services-section";
import { WashHeroTitle } from "@/components/organisms/wash/wash-hero-title";
import { WashTestimonialsSection } from "@/components/organisms/wash/wash-testimonials-section";
import { WashTrustSection } from "@/components/organisms/wash/wash-trust-section";
import {
  getWashPackage,
  washFaqs,
  washPackages,
  washProcessSteps,
  washTagline,
  type WashPackageId,
} from "@/lib/data/wash";
import { cn, formatPrice, formatWhatsAppLink } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const WASH_WHATSAPP = "254758999888";
const washWhatsAppHref = formatWhatsAppLink(
  WASH_WHATSAPP,
  "Hi, thank you for contacting KYRA Wash. Someone from the team will get back to you soon."
);

const bookingSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  vehicle: z.string().min(1),
  date: z.string().min(1),
  time: z.string().min(1),
  notes: z.string().optional(),
});

const tierCardStyles: Record<
  WashPackageId,
  { base: string; selected: string; badge?: string }
> = {
  essential: {
    base: "border-t-2 border-t-border",
    selected: "ring-1 ring-inset ring-border border-t-foreground/30",
  },
  premium: {
    base: "border-t-2 border-t-kyra-red/70",
    selected: "ring-1 ring-inset ring-kyra-red border-t-kyra-red shadow-[0_0_40px_rgba(226,19,31,0.08)]",
    badge: "bg-kyra-red text-white",
  },
  platinum: {
    base: "border-t-2 border-t-kyra-platinum/50",
    selected:
      "ring-1 ring-inset ring-kyra-platinum/40 border-t-kyra-platinum shadow-[0_0_40px_rgba(229,228,226,0.06)]",
    badge: "border border-kyra-platinum/40 bg-kyra-platinum/10 text-kyra-platinum",
  },
};

export function WashContent() {
  const bookRef = useRef<HTMLElement>(null);
  const [selectedPackage, setSelectedPackage] = useState<WashPackageId>("premium");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    vehicle: "",
    date: "",
    time: "",
    notes: "",
  });

  const activePackage = getWashPackage(selectedPackage);

  const selectPackage = (id: WashPackageId) => {
    setSelectedPackage(id);
    requestAnimationFrame(() => {
      bookRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const parsed = bookingSchema.parse(form);
      const supabase = createClient();
      const { error: insertError } = await supabase.from("wash_bookings").insert({
        name: parsed.name,
        phone: parsed.phone,
        vehicle: parsed.vehicle,
        package_id: selectedPackage,
        booking_date: parsed.date,
        booking_time: parsed.time,
        notes: parsed.notes || null,
      });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message ?? "Please check the form");
      } else {
        setError(err instanceof Error ? err.message : "Could not book");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="KYRA Premium Carwash"
        title="Clean. Shine. Elevate."
        titleNode={<WashHeroTitle />}
        subtitle={washTagline.subtitle}
        backgroundVideo="/Car%20wash%20hero.mp4"
        backgroundImage="https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=1920&q=80"
        showChevrons
        showShard={false}
      />

      <WashServicesSection />

      <section className="section-padding bg-background" id="packages">
        <div className="container-kyra">
          <SectionHeading
            label="Packages"
            title="Choose your level of care."
            subtitle="Every package draws from our core services — hand-finished by KYRA-trained technicians."
            align="center"
            showChevrons
            className="mx-auto text-center"
          />

          <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
            {washPackages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              const styles = tierCardStyles[pkg.id];

              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => selectPackage(pkg.id)}
                  className={cn(
                    "relative bg-muted p-6 text-left transition-all duration-300 sm:p-8",
                    styles.base,
                    isSelected ? styles.selected : "hover:bg-panel"
                  )}
                >
                  {pkg.popular && (
                    <span
                      className={cn(
                        "absolute top-4 right-4 px-2.5 py-1 font-mono text-[9px] tracking-[0.1em] uppercase",
                        styles.badge
                      )}
                    >
                      Most Booked
                    </span>
                  )}

                  {pkg.tier === "platinum" && !pkg.popular && (
                    <span
                      className={cn(
                        "absolute top-4 right-4 px-2.5 py-1 font-mono text-[9px] tracking-[0.1em] uppercase",
                        styles.badge
                      )}
                    >
                      Flagship
                    </span>
                  )}

                  {isSelected && (
                    <span className="absolute top-4 left-4 flex h-6 w-6 items-center justify-center bg-kyra-red">
                      <Check size={14} className="text-white" />
                    </span>
                  )}

                  <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-steel uppercase">
                    {pkg.tagline}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold italic uppercase text-foreground">
                    {pkg.name}
                  </h3>
                  <p className="mt-2 font-hero text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-none tracking-[-0.03em] text-foreground">
                    {formatPrice(pkg.price)}
                  </p>

                  <div className="mt-3 space-y-1.5">
                    <div className="spec-row">
                      <span>Duration</span>
                      <b className="font-normal text-foreground">{pkg.duration}</b>
                    </div>
                    <div className="spec-row">
                      <span>Best for</span>
                      <b className="font-normal text-foreground">{pkg.bestFor}</b>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-2.5">
                    {pkg.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-kyra-steel"
                      >
                        <Check size={14} className="mt-0.5 shrink-0 text-kyra-red" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-6 inline-block font-mono text-[10px] tracking-[0.1em] text-kyra-red uppercase">
                    {isSelected ? "Selected" : "Select & book →"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted py-16 md:py-20">
        <div className="container-kyra">
          <SectionHeading
            label="Process"
            title="What to expect."
            align="center"
            showChevrons
            className="mx-auto text-center"
          />
          <div className="mt-10 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {washProcessSteps.map((step) => (
              <div key={step.step} className="bg-muted p-6 sm:p-8">
                <p className="font-mono text-2xl text-kyra-red">{step.step}</p>
                <h3 className="mt-3 font-display text-lg font-semibold italic uppercase text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-kyra-steel">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WashResultsSection />
      <WashTrustSection />

      <section
        ref={bookRef}
        id="book"
        className="scroll-mt-28 border-t border-border bg-background pb-24 md:pb-0"
      >
        <div className="container-kyra section-padding !py-24">
          <div className="grid gap-16 lg:grid-cols-2">
            <div className="border border-border bg-muted p-6 md:p-10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <div className="flex h-20 w-20 items-center justify-center bg-kyra-red">
                      <Check size={36} className="text-white" />
                    </div>
                    <h3 className="mt-6 font-display text-2xl font-semibold italic uppercase text-foreground">
                      Booking Confirmed
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-kyra-steel">
                      We&apos;ll confirm your {activePackage.name} appointment via
                      WhatsApp shortly.
                    </p>
                    <Button
                      href={washWhatsAppHref}
                      variant="primary"
                      size="md"
                      className="mt-8"
                      magnetic
                    >
                      <MessageCircle size={18} />
                      Open WhatsApp
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                    <SectionHeading
                      label="Reserve"
                      title="Book your detail."
                      subtitle={washTagline.cta}
                      showChevrons
                    />

                    <div className="border border-border bg-background p-4">
                      <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-steel uppercase">
                        Selected package
                      </p>
                      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                        <div>
                          <p className="font-display text-lg font-semibold italic uppercase text-foreground">
                            {activePackage.name}
                          </p>
                          <p className="mt-1 font-mono text-[11px] text-kyra-steel">
                            {activePackage.duration} · {activePackage.tagline}
                          </p>
                        </div>
                        <p className="font-hero text-xl font-extrabold tracking-[-0.03em] text-foreground">
                          {formatPrice(activePackage.price)}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {washPackages.map((pkg) => (
                          <button
                            key={pkg.id}
                            type="button"
                            onClick={() => setSelectedPackage(pkg.id)}
                            className={cn(
                              "border px-3 py-1.5 font-mono text-[10px] tracking-[0.08em] uppercase transition",
                              selectedPackage === pkg.id
                                ? "border-kyra-red bg-kyra-red/10 text-foreground"
                                : "border-border text-kyra-steel hover:border-kyra-red hover:text-foreground"
                            )}
                          >
                            {pkg.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <input type="hidden" name="package" value={selectedPackage} />

                    <div className="grid gap-5 sm:grid-cols-2">
                      {[
                        { name: "name", label: "Full Name", type: "text", span: false },
                        { name: "phone", label: "Phone", type: "tel", span: false },
                        { name: "vehicle", label: "Vehicle", type: "text", span: true },
                        { name: "date", label: "Preferred Date", type: "date", span: false },
                        { name: "time", label: "Preferred Time", type: "time", span: false },
                      ].map((field) => (
                        <div
                          key={field.name}
                          className={field.span ? "sm:col-span-2" : undefined}
                        >
                          <label className="form-label">{field.label}</label>
                          <input
                            type={field.type}
                            required
                            value={form[field.name as keyof typeof form]}
                            onChange={(e) =>
                              setForm({ ...form, [field.name]: e.target.value })
                            }
                            className="form-input"
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="form-label">Additional Notes</label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="form-input resize-none"
                        placeholder="Paint type, interior material, special requests..."
                      />
                    </div>

                    {error && (
                      <p className="border border-kyra-red/30 bg-kyra-red/5 px-3 py-2 text-sm text-kyra-red">
                        {error}
                      </p>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      showArrow={false}
                      disabled={submitting}
                    >
                      {submitting
                        ? "Booking…"
                        : `Book ${activePackage.name} — ${formatPrice(activePackage.price)}`}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div>
              <SectionHeading label="FAQ" title="Common questions." showChevrons />
              <div className="mt-8">
                <WashFaqAccordion items={washFaqs} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <WashTestimonialsSection />

      {!submitted && (
        <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-border bg-background/95 p-4 backdrop-blur-md md:hidden">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
            showArrow={false}
            onClick={() => bookRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            Book {activePackage.name} — {formatPrice(activePackage.price)}
          </Button>
        </div>
      )}

      <TradeBand />
      <WhatsAppFloat phone={WASH_WHATSAPP} className="bottom-24 md:bottom-8" />
    </>
  );
}
