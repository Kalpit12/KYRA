"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/atoms/button";
import { createClient } from "@/lib/supabase/client";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";
import {
  buildQuoteSummary,
  buildWrapQuoteMessage,
  type VehicleType,
  type WindowFilm,
  type WrapFinishId,
  type WrapOption,
} from "@/lib/data/simulator";

const quoteSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  notes: z.string().optional(),
});

interface QuoteInquiryModalProps {
  open: boolean;
  onClose: () => void;
  vehicleType: VehicleType;
  finish: WrapFinishId;
  wrap: WrapOption;
  tint: WindowFilm;
}

export function QuoteInquiryModal({
  open,
  onClose,
  vehicleType,
  finish,
  wrap,
  tint,
}: QuoteInquiryModalProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useScrollLock(open);

  const summary = buildQuoteSummary(vehicleType, finish, wrap, tint);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const parsed = quoteSchema.parse(form);
      const message = buildWrapQuoteMessage({
        vehicleType,
        finish,
        wrap,
        tint,
        notes: parsed.notes,
      });

      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("contact_inquiries")
        .insert({
          name: parsed.name,
          email: parsed.email,
          phone: parsed.phone?.trim() || null,
          message,
          status: "new",
        });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues[0]?.message ?? "Please check the form");
      } else {
        setError(err instanceof Error ? err.message : "Could not send quote request");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset after close animation
    window.setTimeout(() => {
      setSubmitted(false);
      setError(null);
      setForm({ name: "", email: "", phone: "", notes: "" });
    }, 200);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            aria-label="Close quote form"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-inquiry-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative z-10 w-full max-w-md border border-border bg-muted shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                  Customs
                </p>
                <h2
                  id="quote-inquiry-title"
                  className="mt-1 font-display text-xl font-semibold italic uppercase text-foreground"
                >
                  Get a Quote
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-kyra-steel transition hover:text-foreground"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="flex min-h-[240px] flex-col items-center justify-center px-5 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center border-2 border-kyra-red font-mono text-lg text-kyra-red">
                  ✓
                </div>
                <p className="mt-5 font-display text-lg font-semibold italic uppercase text-foreground">
                  Quote request sent
                </p>
                <p className="mt-2 max-w-xs text-sm text-kyra-steel">
                  Your configuration is in our inquiries inbox. We&apos;ll follow up shortly.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-6"
                  showArrow={false}
                  onClick={handleClose}
                >
                  Back to workshop
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 p-5">
                <div className="border border-border bg-background px-3 py-2.5">
                  <p className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
                    Your configuration
                  </p>
                  <p className="mt-1 text-sm text-foreground">{summary}</p>
                  <ul className="mt-2 space-y-0.5 font-mono text-[10px] tracking-[0.06em] text-kyra-steel uppercase">
                    <li>Model · {vehicleType.name}</li>
                    <li>
                      Wrap · {finish} · {wrap.name} ({wrap.colors[0]})
                    </li>
                    <li>Tint · {tint.name}</li>
                  </ul>
                </div>

                {(
                  [
                    { name: "name", label: "Full Name", type: "text", required: true },
                    { name: "email", label: "Email", type: "email", required: true },
                    { name: "phone", label: "Phone", type: "tel", required: false },
                  ] as const
                ).map((field) => (
                  <div key={field.name}>
                    <label className="form-label !mb-1" htmlFor={`quote-${field.name}`}>
                      {field.label}
                    </label>
                    <input
                      id={`quote-${field.name}`}
                      type={field.type}
                      required={field.required}
                      value={form[field.name]}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [field.name]: e.target.value }))
                      }
                      className="form-input !min-h-[38px] !py-2"
                    />
                  </div>
                ))}

                <div>
                  <label className="form-label !mb-1" htmlFor="quote-notes">
                    Notes (optional)
                  </label>
                  <textarea
                    id="quote-notes"
                    rows={2}
                    value={form.notes}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="form-input !min-h-[64px] resize-none !py-2"
                    placeholder="Preferred timeline, vehicle year…"
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
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Send quote request"}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
