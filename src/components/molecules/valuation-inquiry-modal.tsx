"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/atoms/button";
import { createClient } from "@/lib/supabase/client";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";
import {
  buildValuationMessage,
  valuationConditions,
} from "@/lib/data/valuation";

const valuationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().optional(),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .string()
    .min(4, "Enter a valid year")
    .regex(/^\d{4}$/, "Enter a 4-digit year"),
  mileage: z.string().min(1, "Mileage is required"),
  condition: z.string().min(1, "Select condition"),
  transmission: z.string().optional(),
  notes: z.string().optional(),
});

interface ValuationInquiryModalProps {
  open: boolean;
  onClose: () => void;
}

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  brand: "",
  model: "",
  year: "",
  mileage: "",
  condition: "good",
  transmission: "",
  notes: "",
};

export function ValuationInquiryModal({
  open,
  onClose,
}: ValuationInquiryModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useScrollLock(open);

  const setField = (key: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const parsed = valuationSchema.parse(form);
      const conditionLabel =
        valuationConditions.find((c) => c.id === parsed.condition)?.label ??
        parsed.condition;

      const message = buildValuationMessage({
        brand: parsed.brand,
        model: parsed.model,
        year: parsed.year,
        mileage: parsed.mileage,
        condition: conditionLabel,
        transmission: parsed.transmission,
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
        setError(
          err instanceof Error ? err.message : "Could not send valuation request"
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    window.setTimeout(() => {
      setSubmitted(false);
      setError(null);
      setForm(emptyForm);
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
            aria-label="Close valuation form"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="valuation-inquiry-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto border border-border bg-muted shadow-2xl"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-muted px-5 py-4">
              <div>
                <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                  Trade-in
                </p>
                <h2
                  id="valuation-inquiry-title"
                  className="mt-1 font-display text-xl font-semibold italic uppercase text-foreground"
                >
                  Get a Valuation
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
                  Valuation request sent
                </p>
                <p className="mt-2 max-w-xs text-sm text-kyra-steel">
                  Our import specialists will review your vehicle and follow up
                  within 24 hours.
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="mt-6"
                  showArrow={false}
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 p-5">
                <p className="text-sm text-kyra-steel">
                  Tell us about your vehicle — we&apos;ll get back with a fair
                  valuation.
                </p>

                <div className="grid gap-3.5 sm:grid-cols-2">
                  {(
                    [
                      {
                        name: "name" as const,
                        label: "Full Name",
                        type: "text",
                        required: true,
                        span: true,
                      },
                      {
                        name: "email" as const,
                        label: "Email",
                        type: "email",
                        required: true,
                      },
                      {
                        name: "phone" as const,
                        label: "Phone",
                        type: "tel",
                        required: false,
                      },
                    ] as const
                  ).map((field) => (
                    <div
                      key={field.name}
                      className={"span" in field && field.span ? "sm:col-span-2" : undefined}
                    >
                      <label
                        className="form-label !mb-1"
                        htmlFor={`val-${field.name}`}
                      >
                        {field.label}
                      </label>
                      <input
                        id={`val-${field.name}`}
                        type={field.type}
                        required={field.required}
                        value={form[field.name]}
                        onChange={(e) => setField(field.name, e.target.value)}
                        className="form-input !min-h-[38px] !py-2"
                      />
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-3.5">
                  <p className="mb-3 font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
                    Vehicle details
                  </p>
                  <div className="grid gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="form-label !mb-1" htmlFor="val-brand">
                        Brand
                      </label>
                      <input
                        id="val-brand"
                        type="text"
                        required
                        placeholder="e.g. BMW"
                        value={form.brand}
                        onChange={(e) => setField("brand", e.target.value)}
                        className="form-input !min-h-[38px] !py-2"
                      />
                    </div>
                    <div>
                      <label className="form-label !mb-1" htmlFor="val-model">
                        Model
                      </label>
                      <input
                        id="val-model"
                        type="text"
                        required
                        placeholder="e.g. M4 Competition"
                        value={form.model}
                        onChange={(e) => setField("model", e.target.value)}
                        className="form-input !min-h-[38px] !py-2"
                      />
                    </div>
                    <div>
                      <label className="form-label !mb-1" htmlFor="val-year">
                        Year
                      </label>
                      <input
                        id="val-year"
                        type="text"
                        inputMode="numeric"
                        required
                        placeholder="e.g. 2022"
                        value={form.year}
                        onChange={(e) => setField("year", e.target.value)}
                        className="form-input !min-h-[38px] !py-2"
                      />
                    </div>
                    <div>
                      <label className="form-label !mb-1" htmlFor="val-mileage">
                        Mileage (km)
                      </label>
                      <input
                        id="val-mileage"
                        type="text"
                        inputMode="numeric"
                        required
                        placeholder="e.g. 24000"
                        value={form.mileage}
                        onChange={(e) => setField("mileage", e.target.value)}
                        className="form-input !min-h-[38px] !py-2"
                      />
                    </div>
                    <div>
                      <label
                        className="form-label !mb-1"
                        htmlFor="val-condition"
                      >
                        Condition
                      </label>
                      <select
                        id="val-condition"
                        required
                        value={form.condition}
                        onChange={(e) => setField("condition", e.target.value)}
                        className="form-input !min-h-[38px] !py-2"
                      >
                        {valuationConditions.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        className="form-label !mb-1"
                        htmlFor="val-transmission"
                      >
                        Transmission
                      </label>
                      <select
                        id="val-transmission"
                        value={form.transmission}
                        onChange={(e) =>
                          setField("transmission", e.target.value)
                        }
                        className="form-input !min-h-[38px] !py-2"
                      >
                        <option value="">Select…</option>
                        <option value="Automatic">Automatic</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="form-label !mb-1" htmlFor="val-notes">
                    Notes (optional)
                  </label>
                  <textarea
                    id="val-notes"
                    rows={2}
                    value={form.notes}
                    onChange={(e) => setField("notes", e.target.value)}
                    className="form-input !min-h-[64px] resize-none !py-2"
                    placeholder="Service history, accidents, extras…"
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
                  {submitting ? "Sending…" : "Request valuation"}
                </Button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
