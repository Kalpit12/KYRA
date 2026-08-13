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
 * Defers media download until near viewport. Pauses decode when off-screen
 * so scrolling past looping heroes does not keep burning GPU/CPU.
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
  const [armed, setArmed] = useState(false);
  const [visible, setVisible] = useState(false);
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
        const onScreen = Boolean(entry?.isIntersecting);
        setVisible(onScreen);
        if (onScreen) setArmed(true);
      },
      { rootMargin, threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, reducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !armed || reducedMotion || !autoPlayWhenVisible) return;

    if (visible) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [armed, visible, reducedMotion, autoPlayWhenVisible]);

  const playing = armed && visible && autoPlayWhenVisible && !reducedMotion;

  return (
    <video
      ref={videoRef}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={armed && !reducedMotion ? "metadata" : "none"}
      poster={poster}
      autoPlay={playing}
      onError={onError}
      className={cn(className)}
      {...rest}
    >
      {armed && !reducedMotion ? (
        children ?? <source src={src} type="video/mp4" />
      ) : null}
    </video>
  );
}
