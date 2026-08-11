"use client";

import { useEffect, useRef, useState, type VideoHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type LazyVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "src" | "preload"
> & {
  src: string;
  poster?: string;
  /** Start playback when near viewport (default true for muted autoplay heroes) */
  autoPlayWhenVisible?: boolean;
  /** Intersection rootMargin — keep generous for smooth hero start */
  rootMargin?: string;
  className?: string;
};

/**
 * Defers media download until near viewport. Uses preload=metadata only after
 * the element is observed; prefers poster first for LCP.
 */
export function LazyVideo({
  src,
  poster,
  autoPlayWhenVisible = true,
  rootMargin = "200px 0px",
  className,
  muted = true,
  loop = true,
  playsInline = true,
  onError,
  children,
  ...rest
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reducedMotion) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active || reducedMotion || !autoPlayWhenVisible) return;
    video.play().catch(() => {});
  }, [active, reducedMotion, autoPlayWhenVisible]);

  return (
    <video
      ref={videoRef}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={active && !reducedMotion ? "metadata" : "none"}
      poster={poster}
      autoPlay={active && autoPlayWhenVisible && !reducedMotion}
      onError={onError}
      className={cn(className)}
      {...rest}
    >
      {active && !reducedMotion ? (
        children ?? <source src={src} type="video/mp4" />
      ) : null}
    </video>
  );
}
