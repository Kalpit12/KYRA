"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden font-display font-semibold uppercase tracking-[0.06em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kyra-red focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "btn-cut-tr bg-kyra-red text-[color:var(--btn-primary-fg)] shadow-[0_4px_0_0_var(--kyra-red-dark)] hover:-translate-y-0.5 hover:bg-kyra-red-hover hover:shadow-[0_6px_20px_var(--kyra-red-glow)] active:translate-y-0 active:shadow-[0_2px_0_0_var(--kyra-red-dark)]",
        secondary:
          "btn-cut-bl border border-border bg-muted/60 text-foreground before:absolute before:top-0 before:left-0 before:h-full before:w-[3px] before:origin-top before:scale-y-0 before:bg-kyra-red before:transition-transform before:duration-200 hover:border-kyra-red/40 hover:bg-panel hover:before:scale-y-100",
        ghost:
          "text-foreground/75 hover:bg-white/5 hover:text-foreground",
        outline:
          "border border-kyra-red/35 bg-transparent text-foreground hover:border-kyra-red hover:bg-kyra-red/8",
        dark:
          "btn-cut-tr border border-black bg-black text-white shadow-[0_4px_0_0_#000] hover:-translate-y-0.5 hover:bg-[#141414] hover:shadow-[0_6px_18px_rgba(0,0,0,0.45)]",
      },
      size: {
        sm: "h-10 px-5 text-[11px]",
        md: "h-12 px-7 text-xs",
        lg: "h-14 px-9 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
  magnetic?: boolean;
  showArrow?: boolean;
}

export function Button({
  className,
  variant,
  size,
  href,
  magnetic = false,
  showArrow,
  children,
  onMouseMove,
  onMouseLeave,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const withArrow = showArrow ?? (variant === "primary" || variant === "dark");

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseMove?.(e);
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x: x * 0.2, y: y * 0.2 });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    onMouseLeave?.(e);
    setPosition({ x: 0, y: 0 });
  };

  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap">
        {children}
      </span>
      {withArrow && (
        <span
          className="relative z-10 font-mono text-[11px] leading-none opacity-80 transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        >
          →
        </span>
      )}
    </>
  );

  const classNames = cn(buttonVariants({ variant, size }), className);

  if (href) {
    const isExternal = href.startsWith("http");

    if (magnetic) {
      return (
        <motion.div
          animate={{ x: position.x, y: position.y }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          className="inline-block"
          onMouseMove={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            setPosition({ x: x * 0.2, y: y * 0.2 });
          }}
          onMouseLeave={() => setPosition({ x: 0, y: 0 })}
        >
          {isExternal ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={classNames}>
              {content}
            </a>
          ) : (
            <Link href={href} className={classNames}>
              {content}
            </Link>
          )}
        </motion.div>
      );
    }

    return isExternal ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classNames}>
        {content}
      </a>
    ) : (
      <Link href={href} className={classNames}>
        {content}
      </Link>
    );
  }

  if (magnetic) {
    return (
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
        className="inline-block"
      >
        <button
          ref={ref}
          className={classNames}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          {content}
        </button>
      </motion.div>
    );
  }

  return (
    <button ref={ref} className={classNames} {...props}>
      {content}
    </button>
  );
}
