"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { WhatsAppIcon } from "@/components/atoms/whatsapp-icon";
import { PageHero } from "@/components/molecules/page-hero";
import { SectionHeading } from "@/components/molecules/section-heading";
import { ContactExploreBand } from "@/components/organisms/contact/contact-explore-band";
import { kyraContact, kyraShowroomLocation } from "@/lib/data/contact";
import { createClient } from "@/lib/supabase/client";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(1),
});

const contactDetails = [
  {
    icon: MapPin,
    label: "Address",
    value: kyraContact.addressLines.join("\n"),
    href: kyraContact.mapsHref,
    external: true,
    multiline: true as const,
  },
  ...kyraContact.phones.map((phone, index) => ({
    icon: Phone,
    label: index === 0 ? "Phone" : "Phone (alt)",
    value: phone.label,
    href: phone.href,
    external: false,
  })),
  {
    icon: Mail,
    label: "Email",
    value: kyraContact.email,
    href: kyraContact.gmailHref,
    external: true,
  },
  {
    icon: Clock,
    label: "Hours",
    value: kyraContact.hours,
    multiline: true as const,
  },
] as const;

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="section-padding bg-background">
          <div className="container-kyra py-24 text-center font-mono text-xs tracking-[0.12em] text-kyra-steel uppercase">
            Loading…
          </div>
        </div>
      }
    >
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const searchParams = useSearchParams();
  const vehiclePrefill = searchParams.get("vehicle")?.trim() ?? "";
  const interest = searchParams.get("interest")?.trim() ?? "";

  const defaultMessage = useMemo(() => {
    if (interest === "viewing" && vehiclePrefill) {
      return `I'd like to book a private viewing for the ${vehiclePrefill}.`;
    }
    if (vehiclePrefill) {
      return `I'm interested in the ${vehiclePrefill}.`;
    }
    return "";
  }, [interest, vehiclePrefill]);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: defaultMessage,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const parsed = inquirySchema.parse(form);
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("contact_inquiries")
        .insert({
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone || null,
          message: parsed.message,
        });
      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message ?? "Please check the form");
      } else {
        setError(err instanceof Error ? err.message : "Could not send message");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Contact KYRA"
        subtitle="Private viewings, import inquiries, and wrap consultations — by appointment."
        backgroundImage="/instagram/DZ7UoDaNWHm.jpg"
        showChevrons
        showShard
      />

      <section className="section-padding bg-background">
        <div className="container-kyra grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading label="Showroom" title="Visit KYRA Platinum Imports." />

            <div className="mt-8 space-y-6">
              {contactDetails.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-muted">
                    <item.icon size={18} className="text-kyra-red" />
                  </div>
                  <div>
                    <p className="form-label !mb-1">{item.label}</p>
                    {"href" in item && item.href ? (
                      <a
                        href={item.href}
                        {...("external" in item && item.external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className={
                          "multiline" in item && item.multiline
                            ? "whitespace-pre-line text-foreground transition-colors hover:text-kyra-red"
                            : "text-foreground transition-colors hover:text-kyra-red"
                        }
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p
                        className={
                          "multiline" in item && item.multiline
                            ? "whitespace-pre-line text-foreground"
                            : "text-foreground"
                        }
                      >
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button
                href={kyraContact.whatsappHref}
                variant="primary"
                size="md"
                magnetic
                showArrow={false}
                className="w-full sm:w-auto"
              >
                <span className="inline-flex items-center gap-2.5">
                  <WhatsAppIcon size={20} />
                  WhatsApp
                </span>
              </Button>
              <Button
                href={kyraContact.phoneHref}
                variant="secondary"
                size="md"
                showArrow={false}
                className="w-full sm:w-auto"
              >
                <span className="inline-flex items-center gap-2.5">
                  <Phone size={18} className="shrink-0" />
                  Call Now
                </span>
              </Button>
            </div>

            <div className="mt-12">
              <p className="mb-3 font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                {kyraShowroomLocation.label}
              </p>
              <div className="group aspect-video overflow-hidden border border-border bg-muted">
                <iframe
                  title="KYRA Platinum Imports showroom location"
                  src={kyraShowroomLocation.embedUrl}
                  className="h-full w-full border-0 opacity-85 grayscale transition-all duration-500 ease-out group-hover:opacity-100 group-hover:grayscale-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>

          <div className="contact-form-glow h-fit self-start bg-muted p-5 md:p-6">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex min-h-[280px] flex-col items-center justify-center text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center border-2 border-kyra-red font-mono text-xl text-kyra-red">
                    ✓
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold italic uppercase text-foreground">
                    Message Sent
                  </h3>
                  <p className="mt-2 text-sm text-kyra-steel">
                    We&apos;ll be in touch within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-3.5"
                >
                  <SectionHeading label="Inquiry" title="Send a message." />
                  {[
                    { name: "name", label: "Full Name", type: "text", required: true },
                    { name: "email", label: "Email", type: "email", required: true },
                    { name: "phone", label: "Phone", type: "tel", required: false },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className="form-label !mb-1">{field.label}</label>
                      <input
                        type={field.type}
                        required={field.required}
                        value={form[field.name as keyof typeof form]}
                        onChange={(e) =>
                          setForm({ ...form, [field.name]: e.target.value })
                        }
                        className="form-input !min-h-[38px] !py-2"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="form-label !mb-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="form-input !min-h-[88px] resize-none !py-2"
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
                    size="md"
                    className="mt-1 w-full"
                    disabled={submitting}
                  >
                    {submitting ? "Sending…" : "Send Message"}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <ContactExploreBand />
    </>
  );
}
