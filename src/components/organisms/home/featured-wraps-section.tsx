"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/molecules/section-heading";
import { Button } from "@/components/atoms/button";
import { wrapProjects } from "@/lib/data/home";
import type { WrapProject } from "@/types";

const SLIDE_MS = 4200;
const FADE_MS = 1.1;

const WRAP_SIZES = "(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px";
const CARD_WIDTH = 720;
const CARD_HEIGHT = 900;

const prefetched = new Set<string>();

/** Prefetch the Next-optimized URL (AVIF/WebP), not the raw JPG. */
function prefetchOptimized(src: string) {
  if (typeof window === "undefined" || prefetched.has(src)) return;
  prefetched.add(src);

  const { props } = getImageProps({
    src,
    alt: "",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    quality: 70,
    sizes: WRAP_SIZES,
  });
  const href =
    props.srcSet?.split(",")[0]?.trim().split(" ")[0] ?? props.src;
  if (!href) return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "image";
  link.href = href;
  document.head.appendChild(link);
}

function WrapProjectCard({
  project,
  index,
  slide,
  active,
}: {
  project: WrapProject;
  index: number;
  slide: number;
  active: boolean;
}) {
  const count = project.images.length;
  const current = count > 0 ? slide % count : 0;
  const src = project.images[current];
  const nextSrc =
    count > 1 ? project.images[(current + 1) % count] : undefined;

  useEffect(() => {
    if (!active || !nextSrc) return;
    const run = () => prefetchOptimized(nextSrc);
    const ric = window.requestIdleCallback?.bind(window);
    if (ric) {
      const id = ric(run, { timeout: 1200 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(run, 300);
    return () => window.clearTimeout(t);
  }, [active, nextSrc]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.7 }}
    >
      <Link href="/customs" className="group block bg-background">
        <div className="relative aspect-[4/5] overflow-hidden bg-muted">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: FADE_MS, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={src}
                alt={`${project.title} — ${project.vehicle}`}
                fill
                sizes={WRAP_SIZES}
                quality={70}
                priority={active && current === 0}
                loading={active ? "eager" : "lazy"}
                fetchPriority={active && current === 0 ? "high" : "auto"}
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </motion.div>
          </AnimatePresence>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[42%] bg-gradient-to-t from-black/80 via-black/35 to-transparent transition-opacity duration-500 group-hover:from-black/90"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[2] bg-black/0 transition-colors duration-500 group-hover:bg-black/20"
            aria-hidden
          />

          <div className="absolute right-0 bottom-0 left-0 z-[3] p-6">
            <span className="font-mono text-[10px] tracking-[0.1em] text-kyra-red uppercase">
              {project.finish} · {project.color}
            </span>
            <h3 className="mt-2 font-display text-xl font-semibold italic uppercase text-white">
              {project.title}
            </h3>
            <p className="mt-1 text-sm text-white/70">{project.vehicle}</p>

            {count > 1 && (
              <div className="mt-4 flex items-center gap-1.5" aria-hidden>
                {project.images.map((imageSrc, i) => (
                  <span
                    key={imageSrc}
                    className="relative h-0.5 overflow-hidden bg-white/30 transition-[width] duration-500 ease-out"
                    style={{ width: i === current ? 20 : 10 }}
                  >
                    {i === current && (
                      <span
                        key={`${slide}-${imageSrc}`}
                        className="featured-wrap-progress absolute inset-y-0 left-0 bg-kyra-red"
                      />
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function FeaturedWrapsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  // Keep observing — pause slideshow when the section leaves the viewport
  const inView = useInView(sectionRef, { once: false, margin: "200px 0px" });
  const warmed = useRef(false);
  const slideCount = Math.max(
    ...wrapProjects.map((project) => project.images.length),
    1
  );
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!inView || warmed.current) return;
    warmed.current = true;
    wrapProjects.forEach((project) => {
      const first = project.images[0];
      if (first) prefetchOptimized(first);
    });
  }, [inView]);

  useEffect(() => {
    if (!inView || slideCount <= 1) return;
    if (document.hidden) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setSlide((current) => (current + 1) % slideCount);
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [inView, slideCount]);

  return (
    <section
      ref={sectionRef}
      className="home-section-cv section-padding border-t border-border bg-background"
    >
      <div className="container-kyra">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            label="KYRA Customs"
            title="Featured wraps."
            subtitle="Precision vinyl wraps and PPF installations that transform vehicles into rolling art."
          />
          <Button href="/customs" variant="primary" size="sm">
            Configure Your Wrap
          </Button>
        </div>

        <div className="mt-12 grid gap-px bg-border md:grid-cols-3">
          {wrapProjects.map((project, index) => (
            <WrapProjectCard
              key={project.id}
              project={project}
              index={index}
              slide={slide}
              active={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
