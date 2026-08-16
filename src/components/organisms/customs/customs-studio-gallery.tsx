"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { useScrollLock } from "@/lib/hooks/use-scroll-lock";
import {
  customsGalleryFlat,
  customsGalleryProjects,
} from "@/lib/data/wraps";
import { prefetchStaticImage } from "@/lib/media-prefetch";

export function CustomsStudioGallery() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [projectIndex, setProjectIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const activeProject = customsGalleryProjects[projectIndex];
  const projectCount = customsGalleryProjects.length;

  const projectImages = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.images.map((image) => ({
      ...image,
      projectId: activeProject.id,
      vehicle: activeProject.vehicle,
      title: activeProject.title,
      finish: activeProject.finish,
    }));
  }, [activeProject]);

  const activeLightboxIndex = activeId
    ? customsGalleryFlat.findIndex((img) => img.id === activeId)
    : -1;
  const activeLightbox =
    activeLightboxIndex >= 0 ? customsGalleryFlat[activeLightboxIndex] : null;

  useScrollLock(Boolean(activeLightbox));

  const goNextCar = useCallback(() => {
    setProjectIndex((i) => (i + 1) % projectCount);
  }, [projectCount]);

  const goPrevCar = useCallback(() => {
    setProjectIndex((i) => (i - 1 + projectCount) % projectCount);
  }, [projectCount]);

  // Warm the first two shots of the active project before the user opens lightbox
  useEffect(() => {
    projectImages.slice(0, 2).forEach((image) => prefetchStaticImage(image.src));
  }, [projectImages]);

  const warmProject = useCallback((projectId: string) => {
    const project = customsGalleryProjects.find((item) => item.id === projectId);
    project?.images.slice(0, 3).forEach((image) => prefetchStaticImage(image.src));
  }, []);
  useEffect(() => {
    if (paused || activeLightbox || projectCount <= 1) return;
    const timer = window.setInterval(goNextCar, 3000);
    return () => window.clearInterval(timer);
  }, [paused, activeLightbox, projectCount, goNextCar]);

  useEffect(() => {
    if (!activeLightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveId(null);
      if (e.key === "ArrowRight") {
        const next =
          customsGalleryFlat[
            (activeLightboxIndex + 1) % customsGalleryFlat.length
          ];
        setActiveId(next.id);
      }
      if (e.key === "ArrowLeft") {
        const prev =
          customsGalleryFlat[
            (activeLightboxIndex - 1 + customsGalleryFlat.length) %
              customsGalleryFlat.length
          ];
        setActiveId(prev.id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [activeLightbox, activeLightboxIndex]);

  if (!activeProject) return null;

  return (
    <section className="border-t border-border bg-background">
      <div className="container-kyra section-padding !py-16 md:!py-20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            label="Portfolio"
            title="Customer projects."
            subtitle="Studio builds on rotation — wraps, PPF, and forged carbon finishes."
            showChevrons
          />

          <div className="lg:max-w-xs lg:text-right">
            <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
              {activeProject.finish}
            </p>
            <p className="mt-1 font-display text-lg font-semibold italic uppercase text-foreground">
              {activeProject.vehicle}
            </p>
            <p className="mt-1 text-sm text-kyra-steel">{activeProject.title}</p>
          </div>
        </div>

        <div className="scroll-fade-x mt-8 flex justify-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {customsGalleryProjects.map((project, index) => {
            const selected = index === projectIndex;
            return (
              <button
                key={project.id}
                type="button"
                onClick={() => setProjectIndex(index)}
                onMouseEnter={() => warmProject(project.id)}
                onFocus={() => warmProject(project.id)}
                className={
                  selected
                    ? "shrink-0 border border-kyra-red bg-kyra-red/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] text-foreground uppercase"
                    : "shrink-0 border border-border px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] text-kyra-steel uppercase transition hover:border-kyra-red hover:text-foreground"
                }
              >
                {project.vehicle}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className="relative pb-16 md:pb-20"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              className="mx-auto flex w-max justify-center gap-3 px-6 md:gap-4 md:px-12 lg:px-20"
            >
              {projectImages.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setActiveId(image.id)}
                  className="group relative h-[220px] w-[160px] shrink-0 overflow-hidden bg-muted sm:h-[260px] sm:w-[190px] md:h-[300px] md:w-[220px]"
                  aria-label={`View ${image.alt}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 160px, (max-width: 768px) 190px, 220px"
                    priority={index < 2}
                    loading={index < 2 ? undefined : "lazy"}
                    fetchPriority={index < 2 ? "high" : "low"}
                  />
                  <div
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-95"
                    aria-hidden
                  />
                  <span className="pointer-events-none absolute right-3 bottom-3 font-mono text-[10px] tracking-[0.12em] text-white/80 uppercase transition-colors group-hover:text-white">
                    View
                  </span>
                </button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-5 flex items-center justify-center gap-3 px-6 md:px-12 lg:px-20">
          <button
            type="button"
            onClick={goPrevCar}
            className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition hover:border-kyra-red hover:text-kyra-red"
            aria-label="Previous car"
          >
            <ChevronLeft size={18} />
          </button>
          <p className="font-mono text-[10px] tracking-[0.12em] text-kyra-steel uppercase">
            {String(projectIndex + 1).padStart(2, "0")} /{" "}
            {String(projectCount).padStart(2, "0")}
            <span className="mx-2 text-border">·</span>
            Next car · 3s
          </p>
          <button
            type="button"
            onClick={goNextCar}
            className="flex h-10 w-10 items-center justify-center border border-border text-foreground transition hover:border-kyra-red hover:text-kyra-red"
            aria-label="Next car"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            className="fixed inset-0 z-[130] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${activeLightbox.vehicle} — ${activeLightbox.title}`}
          >
            <button
              type="button"
              className="absolute inset-0 cursor-default"
              aria-label="Close gallery"
              onClick={() => setActiveId(null)}
            />

            <motion.div
              key={activeLightbox.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22 }}
              className="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-black sm:aspect-[16/10]">
                <Image
                  src={activeLightbox.src}
                  alt={activeLightbox.alt}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>

              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                    {activeLightbox.finish}
                  </p>
                  <h3 className="mt-1 font-display text-xl font-semibold italic uppercase text-white">
                    {activeLightbox.vehicle}
                  </h3>
                  <p className="mt-1 text-sm text-white/70">
                    {activeLightbox.title}
                  </p>
                </div>
                <p className="font-mono text-[10px] tracking-[0.12em] text-white/50 uppercase">
                  {activeLightboxIndex + 1} / {customsGalleryFlat.length}
                </p>
              </div>
            </motion.div>

            <button
              type="button"
              onClick={() => setActiveId(null)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center border border-white/25 bg-black/50 text-white transition hover:border-kyra-red hover:bg-kyra-red-dark"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <button
              type="button"
              onClick={() => {
                const prev =
                  customsGalleryFlat[
                    (activeLightboxIndex - 1 + customsGalleryFlat.length) %
                      customsGalleryFlat.length
                  ];
                setActiveId(prev.id);
              }}
              className="absolute top-1/2 left-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-black/50 text-white transition hover:border-kyra-red hover:bg-kyra-red-dark sm:left-6"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => {
                const next =
                  customsGalleryFlat[
                    (activeLightboxIndex + 1) % customsGalleryFlat.length
                  ];
                setActiveId(next.id);
              }}
              className="absolute top-1/2 right-3 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/25 bg-black/50 text-white transition hover:border-kyra-red hover:bg-kyra-red-dark sm:right-6"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
