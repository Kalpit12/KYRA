"use client";

import { LazyVideo } from "@/components/molecules/lazy-video";

interface PageHeroVideoProps {
  src: string;
  poster?: string;
}

export function PageHeroVideo({ src, poster }: PageHeroVideoProps) {
  return (
    <LazyVideo
      src={src}
      poster={poster}
      rootMargin="400px 0px"
      className="absolute inset-0 h-full w-full object-cover object-center"
      aria-hidden
    />
  );
}
