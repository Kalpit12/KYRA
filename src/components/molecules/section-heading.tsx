"use client";

import { motion } from "framer-motion";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  showChevrons?: boolean;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  align = "left",
  className,
  showChevrons = false,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {label && (
        <Eyebrow
          className={cn("mb-3", align === "center" && "justify-center")}
          showChevrons={showChevrons}
        >
          {label}
        </Eyebrow>
      )}
      <h2
        className={cn(
          "font-display text-[clamp(1.75rem,4vw,2.625rem)] font-semibold italic leading-tight tracking-[0.02em] text-foreground uppercase",
          align === "center" && "text-center"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "mt-4 text-[14.5px] leading-relaxed text-kyra-steel md:text-base",
            align === "center"
              ? "mx-auto max-w-2xl text-center"
              : "max-w-md"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
