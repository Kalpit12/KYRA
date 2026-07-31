"use client";

import { useEffect, useRef } from "react";

interface PageHeroVideoProps {
  src: string;
  poster?: string;
}

export function PageHeroVideo({ src, poster }: PageHeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster={poster}
      className="absolute inset-0 h-full w-full object-cover object-center"
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
