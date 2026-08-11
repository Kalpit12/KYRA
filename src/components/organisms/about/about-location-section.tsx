"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { SectionHeading } from "@/components/molecules/section-heading";
import { aboutLocation } from "@/lib/data/about";
import { cn } from "@/lib/utils";

const contactItems = [
  { icon: MapPin, label: "Address", value: aboutLocation.address },
  {
    icon: Phone,
    label: "Phone",
    value: aboutLocation.phone,
    href: aboutLocation.phoneHref,
  },
  {
    icon: Mail,
    label: "Email",
    value: aboutLocation.email,
    href: aboutLocation.emailHref,
  },
  { icon: Clock, label: "Hours", value: aboutLocation.hours },
] as const;

export function AboutLocationSection() {
  return (
    <section className="border-t border-border bg-muted">
      <div className="container-kyra section-padding !py-24">
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          >
            <SectionHeading
              label={aboutLocation.label}
              title={aboutLocation.title}
              subtitle={aboutLocation.subtitle}
            />

            <div className="mt-8 space-y-5">
              {contactItems.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background">
                    <item.icon size={18} className="text-kyra-red" />
                  </div>
                  <div>
                    <p className="form-label !mb-1">{item.label}</p>
                    {"href" in item && item.href ? (
                      <a
                        href={item.href}
                        className="text-sm text-foreground transition-colors hover:text-kyra-red md:text-base"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p
                        className={cn(
                          "text-sm text-foreground md:text-base",
                          item.label === "Hours" && "whitespace-pre-line"
                        )}
                      >
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button
                href={aboutLocation.directionsUrl}
                variant="secondary"
                size="md"
                magnetic
                className="w-full sm:w-auto"
              >
                Get Directions
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.75, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="relative w-full"
          >
            {/* Offset accent aligns to the map frame only (not the tall grid cell) */}
            <div className="relative">
              <div
                className="pointer-events-none absolute -top-3 -right-3 hidden h-full w-full border border-kyra-red/35 sm:block"
                aria-hidden
              />
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-background">
                <iframe
                  title="KYRA Platinum Imports — Spring Valley showroom"
                  src={aboutLocation.embedUrl}
                  className="absolute inset-0 h-full w-full border-0 grayscale opacity-85 transition-[filter,opacity] duration-500 hover:opacity-100 hover:grayscale-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
