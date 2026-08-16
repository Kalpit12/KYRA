"use client";

import Image from "next/image";
import { LazyVideo } from "@/components/molecules/lazy-video";

interface PageHeroVideoProps {
  src: string;
  poster?: string;
}

export function PageHeroVideo({ src, poster }: PageHeroVideoProps) {
  return (
    <div className="absolute inset-0">
      {poster ? (
        <Image
          src={poster}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
      ) : null}
      <LazyVideo
        src={src}
        rootMargin="400px 0px"
        className="absolute inset-0 h-full w-full object-cover object-center"
        aria-hidden
      />
    </div>
  );
}
