"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";

interface VehicleGalleryProps {
  images: string[];
  alt: string;
}

export function VehicleGallery({ images, alt }: VehicleGalleryProps) {
  const gallery = images.length > 0 ? images : [];
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = gallery.length;
  const current = count > 0 ? Math.min(active, count - 1) : 0;
  const src = gallery[current] ?? "";

  useScrollLock(lightbox);

  const go = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setActive((prev) => (prev + delta + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, go]);

  if (!src) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center border border-border bg-muted font-mono text-[10px] tracking-[0.14em] text-kyra-steel uppercase">
        No photos yet
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="group relative block w-full overflow-hidden border border-border bg-muted text-left"
          aria-label={`Open gallery — ${alt}`}
        >
          <Image
            src={src}
            alt={alt}
            width={960}
            height={600}
            className="photo-angular aspect-[16/10] h-auto w-full object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 border border-white/40 bg-black/55 px-2.5 py-1.5 font-mono text-[10px] tracking-[0.14em] text-white uppercase opacity-90 transition group-hover:opacity-100">
            <Expand size={12} aria-hidden />
            {count > 1 ? `${current + 1} / ${count}` : "View"}
          </span>
        </button>

        <div
          className="absolute -top-2.5 -right-2.5 h-14 w-14 bg-kyra-red"
          style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }}
          aria-hidden
        />

        {count > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scroll-fade-x">
            {gallery.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === current}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden border transition",
                  index === current
                    ? "border-kyra-red"
                    : "border-border opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[80] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} gallery`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-6">
            <p className="font-mono text-[10px] tracking-[0.14em] text-white/60 uppercase">
              {alt}
              {count > 1 ? ` — ${current + 1} / ${count}` : ""}
            </p>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="flex h-11 w-11 items-center justify-center text-white/80 transition hover:text-white"
              aria-label="Close gallery"
            >
              <X size={22} />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-6 md:px-16">
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 z-10 flex h-11 w-11 items-center justify-center border border-white/20 bg-black/40 text-white transition hover:border-kyra-red hover:bg-kyra-red md:left-6"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 z-10 flex h-11 w-11 items-center justify-center border border-white/20 bg-black/40 text-white transition hover:border-kyra-red hover:bg-kyra-red md:right-6"
                  aria-label="Next photo"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <div className="relative h-full max-h-[min(78vh,820px)] w-full max-w-5xl">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {count > 1 && (
            <div className="flex justify-center gap-2 overflow-x-auto border-t border-white/10 px-4 py-3">
              {gallery.map((image, index) => (
                <button
                  key={`lb-${image}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show photo ${index + 1}`}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden border",
                    index === current
                      ? "border-kyra-red"
                      : "border-white/20 opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
