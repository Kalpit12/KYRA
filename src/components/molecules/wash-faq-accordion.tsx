"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  q: string;
  a: string;
}

interface WashFaqAccordionProps {
  items: FaqItem[];
}

export function WashFaqAccordion({ items }: WashFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="divide-y divide-border border border-border bg-background">
      {items.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={faq.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full min-h-[52px] items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-panel/50 sm:px-6"
            >
              <span className="font-display text-sm font-semibold uppercase text-foreground sm:text-base">
                {faq.q}
              </span>
              <ChevronDown
                size={18}
                className={cn(
                  "shrink-0 text-kyra-red transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-kyra-steel sm:px-6">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
