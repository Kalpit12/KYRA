"use client";

import { useEffect, useState } from "react";
import { Calendar, Phone } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { WhatsAppIcon } from "@/components/atoms/whatsapp-icon";
import { kyraContact } from "@/lib/data/contact";
import { cn, formatPrice, formatWhatsAppLink } from "@/lib/utils";

interface VehicleInquiryBarProps {
  brand: string;
  model: string;
  year: number;
  price: number;
  className?: string;
}

export function VehicleInquiryBar({
  brand,
  model,
  year,
  price,
  className,
}: VehicleInquiryBarProps) {
  const [stuck, setStuck] = useState(false);
  const title = `${brand} ${model}`;
  const whatsappHref = formatWhatsAppLink(
    "254724809009",
    `Hi KYRA, I'm interested in the ${brand} ${model} (${year}).`
  );
  const viewingHref = `/contact?interest=viewing&vehicle=${encodeURIComponent(
    `${brand} ${model} ${year}`
  )}`;

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setStuck(window.scrollY > 420);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={cn(
          "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch",
          className
        )}
      >
        <Button
          href={whatsappHref}
          variant="primary"
          size="lg"
          magnetic
          showArrow={false}
          className="w-full sm:w-auto"
        >
          <WhatsAppIcon size={18} />
          WhatsApp Inquiry
        </Button>
        <Button
          href={viewingHref}
          variant="secondary"
          size="lg"
          showArrow={false}
          className="w-full sm:w-auto"
        >
          <Calendar size={18} />
          Book Viewing
        </Button>
        <Button
          href={kyraContact.phoneHref}
          variant="secondary"
          size="lg"
          showArrow={false}
          className="w-full sm:w-auto"
        >
          <Phone size={18} />
          Call
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-md transition-transform duration-300 md:hidden",
          stuck ? "translate-y-0" : "translate-y-full"
        )}
        aria-hidden={!stuck}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold uppercase text-foreground">
              {title}
            </p>
            <p className="font-mono text-xs text-kyra-steel">{formatPrice(price)}</p>
          </div>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 shrink-0 items-center justify-center bg-kyra-red text-white"
            aria-label="WhatsApp inquiry"
          >
            <WhatsAppIcon size={20} />
          </a>
          <a
            href={kyraContact.phoneHref}
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-border text-foreground"
            aria-label="Call KYRA"
          >
            <Phone size={18} />
          </a>
          <Button href={viewingHref} variant="primary" size="sm" showArrow={false}>
            View
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "fixed right-6 bottom-6 z-40 hidden max-w-sm border border-border bg-background p-4 shadow-[var(--shadow-premium)] transition-all duration-300 md:block",
          stuck
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        )}
        aria-hidden={!stuck}
      >
        <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
          Private viewing
        </p>
        <p className="mt-1 font-display text-base font-semibold uppercase text-foreground">
          {title}
        </p>
        <p className="mt-0.5 font-mono text-sm text-kyra-steel">
          {formatPrice(price)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href={whatsappHref} variant="primary" size="sm" showArrow={false}>
            <WhatsAppIcon size={16} />
            WhatsApp
          </Button>
          <Button href={viewingHref} variant="secondary" size="sm" showArrow={false}>
            <Calendar size={14} />
            Book
          </Button>
          <Button
            href={kyraContact.phoneHref}
            variant="secondary"
            size="sm"
            showArrow={false}
          >
            <Phone size={14} />
            Call
          </Button>
        </div>
      </div>
    </>
  );
}
