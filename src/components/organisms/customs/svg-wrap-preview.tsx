"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { KyraLoader } from "@/components/atoms/kyra-loader";
import { cn } from "@/lib/utils";
import type { WrapFinish } from "@/lib/data/wraps";

interface SvgWrapPreviewProps {
  svgPath: string;
  vehicleId: string;
  color: string;
  finish: WrapFinish;
  finishId: string;
  viewIndex: number;
  vehicleName: string;
  colorName: string;
  className?: string;
}

const BACKGROUND: Record<string, string> = {
  "bmw-m4": "#DCDCDC",
  "mercedes-g-wagon": "#F2F2F2",
};

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  if (h.length !== 6) return 0;
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function saturation(hex: string): number {
  const h = hex.replace("#", "");
  if (h.length !== 6) return 0;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

/** Detect Hum3D body panel paths by fill color */
function isBodyPanelFill(fill: string, vehicleId: string): boolean {
  if (!fill.startsWith("#") || fill.length !== 7) return false;

  const bg = BACKGROUND[vehicleId]?.toUpperCase();
  if (fill.toUpperCase() === bg) return false;

  const r = parseInt(fill.slice(1, 3), 16);
  const g = parseInt(fill.slice(3, 5), 16);
  const b = parseInt(fill.slice(5, 7), 16);
  const sat = saturation(fill);
  const lum = luminance(fill);

  if (vehicleId === "bmw-m4") {
    // Dark gray Hum3D body panels (primary paint surface)
    if (sat < 0.07 && lum >= 0.15 && lum <= 0.32) return true;
    // Gold/yellow shading highlights on the body
    if (r > 130 && g > 90 && b < 140 && sat > 0.12) return true;
    return false;
  }

  if (vehicleId === "mercedes-g-wagon") {
    // Light gray body panels — low saturation, not windows/wheels
    return sat < 0.12 && lum >= 0.42 && lum <= 0.93;
  }

  return false;
}

function markBodyElements(svg: SVGSVGElement, vehicleId: string) {
  const wrapBodyLayer = svg.querySelector("#wrap-body");
  if (wrapBodyLayer) {
    wrapBodyLayer.querySelectorAll("path, rect, polygon, ellipse").forEach((el) => {
      el.setAttribute("data-wrap-body", "true");
    });
    return;
  }

  svg.querySelectorAll("path[fill]").forEach((el) => {
    const fill = el.getAttribute("fill");
    if (!fill) return;
    if (isBodyPanelFill(fill, vehicleId)) {
      el.setAttribute("data-wrap-body", "true");
    }
  });
}

function ensureFinishDefs(svg: SVGSVGElement, prefix: string) {
  if (svg.querySelector(`#${prefix}-chrome-fill`)) return;

  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.innerHTML = `
    <linearGradient id="${prefix}-chrome-fill" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5f5f5"/>
      <stop offset="35%" stop-color="#9a9a9a"/>
      <stop offset="65%" stop-color="#e8e8e8"/>
      <stop offset="100%" stop-color="#6a6a6a"/>
    </linearGradient>
    <pattern id="${prefix}-carbon-pattern" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <rect width="8" height="8" fill="#1a1a1a"/>
      <line x1="0" y1="0" x2="0" y2="8" stroke="#2a2a2a" stroke-width="4"/>
    </pattern>
  `;
  svg.insertBefore(defs, svg.firstChild);
}

function resolveFill(finishId: string, color: string, prefix: string): string {
  if (finishId === "chrome") return `url(#${prefix}-chrome-fill)`;
  if (finishId === "carbon") return `url(#${prefix}-carbon-pattern)`;
  return color;
}

function applyWrapToSvg(
  svg: SVGSVGElement,
  vehicleId: string,
  color: string,
  finishId: string
) {
  const prefix = vehicleId === "bmw-m4" ? "bmw" : "gwagon";
  ensureFinishDefs(svg, prefix);

  const bodyFill = resolveFill(finishId, color, prefix);
  const isMatte = finishId === "matte" || finishId === "carbon";

  if (!svg.querySelector("[data-wrap-body='true']")) {
    markBodyElements(svg, vehicleId);
  }

  svg.querySelectorAll("[data-wrap-body='true']").forEach((el) => {
    el.setAttribute("fill", bodyFill);
    if (isMatte) {
      el.setAttribute("opacity", "0.96");
    } else {
      el.removeAttribute("opacity");
    }
  });
}

const VIEW_TRANSFORMS = [
  { rotateY: -6, rotateX: 1, scale: 1 },
  { rotateY: 0, rotateX: 0, scale: 0.97 },
  { rotateY: 8, rotateX: 1, scale: 0.94 },
];

export function SvgWrapPreview({
  svgPath,
  vehicleId,
  color,
  finish,
  finishId,
  viewIndex,
  vehicleName,
  colorName,
  className,
}: SvgWrapPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragRotateY = useMotionValue(0);
  const springRotateY = useSpring(dragRotateY, { stiffness: 180, damping: 26 });
  const baseRotateY = useMotionValue(0);

  const view = VIEW_TRANSFORMS[viewIndex] ?? VIEW_TRANSFORMS[0];
  const combinedRotateY = useTransform(
    [baseRotateY, springRotateY],
    ([base, drag]) => (base as number) + (drag as number)
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      dragStartX.current = event.clientX;
      dragStartRotation.current = dragRotateY.get();
      setIsDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [dragRotateY]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const deltaX = event.clientX - dragStartX.current;
      dragRotateY.set(dragStartRotation.current + deltaX * 0.18);
    },
    [dragRotateY, isDragging]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      setIsDragging(false);
      event.currentTarget.releasePointerCapture(event.pointerId);
    },
    []
  );

  useEffect(() => {
    baseRotateY.set(view.rotateY);
    dragRotateY.set(0);
  }, [viewIndex, vehicleId, view.rotateY, baseRotateY, dragRotateY]);

  // Load SVG once
  useEffect(() => {
    let cancelled = false;
    setLoaded(false);
    setError(false);
    svgRef.current = null;

    fetch(svgPath)
      .then((res) => {
        if (!res.ok) throw new Error("SVG not found");
        return res.text();
      })
      .then((svgText) => {
        if (cancelled || !containerRef.current) return;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (!svg) throw new Error("Invalid SVG");

        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.style.display = "block";

        containerRef.current.innerHTML = "";
        containerRef.current.appendChild(svg);
        svgRef.current = svg;
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [svgPath]);

  // Apply wrap color when selection changes
  useEffect(() => {
    if (!loaded || !svgRef.current) return;
    applyWrapToSvg(svgRef.current, vehicleId, color, finishId);
  }, [loaded, vehicleId, color, finishId]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <motion.div
        className={cn(
          "relative mx-auto h-full w-full touch-none select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={{
          perspective: 1400,
          rotateY: combinedRotateY,
        }}
        animate={{
          rotateX: view.rotateX,
          scale: view.scale,
        }}
        transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          ref={containerRef}
          className="h-full w-full [&_svg]:mx-auto [&_svg]:h-full [&_svg]:max-h-full [&_svg]:w-full"
          role="img"
          aria-label={`${vehicleName} in ${finish.name} ${colorName}`}
        />
      </motion.div>

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-neutral-500">SVG preview unavailable</p>
        </div>
      )}

      {!loaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#E8E8E8]/50">
          <KyraLoader size="md" label="Loading preview" />
        </div>
      )}
    </div>
  );
}
