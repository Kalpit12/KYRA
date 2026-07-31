"use client";

import { cn } from "@/lib/utils";

interface KyraLoaderProps {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
}

const sizes = {
  sm: { ring: 40, stroke: 2 },
  md: { ring: 56, stroke: 2.5 },
  lg: { ring: 72, stroke: 3 },
};

export function KyraLoader({ size = "md", label, className }: KyraLoaderProps) {
  const { ring, stroke } = sizes[size];
  const radius = (ring - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative" style={{ width: ring, height: ring }}>
        <div
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, var(--kyra-red), transparent)",
            animation: "kyra-loader-spin 1.4s linear infinite",
          }}
        />
        <svg
          width={ring}
          height={ring}
          className="-rotate-90"
          aria-hidden
        >
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={stroke}
          />
          <circle
            cx={ring / 2}
            cy={ring / 2}
            r={radius}
            fill="none"
            stroke="var(--kyra-red)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.72}
            className="origin-center"
            style={{ animation: "kyra-loader-dash 1.6s ease-in-out infinite" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[10px] tracking-[0.22em] text-foreground/80">
            K
          </span>
        </div>
      </div>
      {label && (
        <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-steel uppercase">
          {label}
        </p>
      )}
    </div>
  );
}
