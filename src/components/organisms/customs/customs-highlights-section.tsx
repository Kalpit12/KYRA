"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { customsHighlights } from "@/lib/data/wraps";
import { prefetchStaticImage, prefetchStaticVideo } from "@/lib/media-prefetch";
import { cn } from "@/lib/utils";

function HighlightReel({
  src,
  poster,
  title,
  tag,
  description,
  index,
}: {
  src: string;
  poster: string;
  title: string;
  tag: string;
  description: string;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          prefetchStaticImage(poster);
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin: "320px 0px", threshold: 0.01 }
    );
    io.observe(video);
    return () => io.disconnect();
  }, [poster]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = muted;
  }, [muted]);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!ready) setReady(true);
    if (video.paused) {
      try {
        await video.play();
      } catch {
        /* autoplay policies */
      }
    } else {
      video.pause();
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      className="bg-background"
    >
      <div className="group relative aspect-[9/16] overflow-hidden bg-muted">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          loop
          muted={muted}
          preload={ready ? "metadata" : "none"}
          poster={poster}
          aria-label={title}
        >
          {ready ? <source src={src} type="video/mp4" /> : null}
        </video>

        <button
          type="button"
          onClick={() => void togglePlay()}
          onMouseEnter={() => prefetchStaticVideo(src)}
          onFocus={() => prefetchStaticVideo(src)}
          className="absolute inset-0 z-10"
          aria-label={playing ? `Pause ${title}` : `Play ${title}`}
        />

        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent transition-opacity",
            playing ? "opacity-70" : "opacity-90"
          )}
          aria-hidden
        />

        {!playing && (
          <span
            className="pointer-events-none absolute top-1/2 left-1/2 z-20 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/45 text-white backdrop-blur-sm"
            aria-hidden
          >
            <Play size={22} fill="currentColor" className="ml-0.5" />
          </span>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 space-y-1.5 p-4 sm:p-5">
          <p className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
            {tag}
          </p>
          <h3 className="font-display text-lg font-semibold italic uppercase text-white">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-white/75">{description}</p>
        </div>

        <div className="absolute top-3 right-3 z-30 flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void togglePlay();
            }}
            className="flex h-9 w-9 items-center justify-center border border-white/25 bg-black/50 text-white backdrop-blur-sm transition hover:border-kyra-red hover:bg-kyra-red"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMuted((m) => !m);
            }}
            className="flex h-9 w-9 items-center justify-center border border-white/25 bg-black/50 text-white backdrop-blur-sm transition hover:border-kyra-red hover:bg-kyra-red"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

export function CustomsHighlightsSection() {
  return (
    <section className="section-padding border-t border-border bg-muted">
      <div className="container-kyra">
        <SectionHeading
          label="Highlights"
          title="Behind the scenes."
          subtitle="Customer projects and studio reels from KYRA Customs — wraps, PPF, and finishes in motion."
          showChevrons
        />

        <div className="mt-12 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {customsHighlights.map((reel, index) => (
            <HighlightReel
              key={reel.id}
              index={index}
              src={reel.src}
              poster={reel.poster}
              title={reel.title}
              tag={reel.tag}
              description={reel.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
