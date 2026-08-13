"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { LazyVideo } from "@/components/molecules/lazy-video";
import { divisions } from "@/lib/data/home";
import { cn } from "@/lib/utils";

const ALL_IN_ONE_VIDEO = "/video/all-in-one-kyra.mp4";
const VIDEO_POSTER = "/video/posters/all-in-one-kyra.jpg";

function DivisionHoverCard({
  href,
  name,
  tagline,
  image,
  video,
  poster,
  index,
}: {
  href: string;
  name: string;
  tagline: string;
  image: string;
  video?: string;
  poster?: string;
  index: number;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState(false);
  const [armed, setArmed] = useState(false);
  const [finePointer, setFinePointer] = useState(true);

  useEffect(() => {
    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setFinePointer(hoverMq.matches && !motionMq.matches);
    sync();
    hoverMq.addEventListener("change", sync);
    motionMq.addEventListener("change", sync);
    return () => {
      hoverMq.removeEventListener("change", sync);
      motionMq.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !video) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const onScreen = Boolean(entry?.isIntersecting);
        if (onScreen) setArmed(true);
        if (!finePointer) setActive(onScreen);
      },
      { rootMargin: finePointer ? "240px 0px" : "0px", threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video, finePointer]);

  useEffect(() => {
    const node = videoRef.current;
    if (!node || !video || !armed) return;

    if (active) {
      void node.play().catch(() => {});
    } else {
      node.pause();
      try {
        node.currentTime = 0;
      } catch {
        // ignore seek errors while metadata loads
      }
    }
  }, [active, armed, video]);

  const start = () => {
    if (!video || !finePointer) return;
    setArmed(true);
    setActive(true);
  };

  const stop = () => {
    if (!finePointer) return;
    setActive(false);
  };

  return (
    <Link
      ref={cardRef}
      href={href}
      className="group block bg-muted"
      onMouseEnter={start}
      onMouseLeave={stop}
      onFocus={start}
      onBlur={stop}
    >
      <div className="relative aspect-[16/9] overflow-hidden lg:aspect-[16/10]">
        <Image
          src={image}
          alt={name}
          fill
          className={cn(
            "object-cover transition-[transform,opacity] duration-700 group-hover:scale-[1.03]",
            active && "opacity-0"
          )}
          sizes="(max-width: 1024px) 100vw, 33vw"
        />
        {video && armed ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-400",
              active ? "opacity-100" : "opacity-0"
            )}
          >
            <source src={video} type="video/mp4" />
          </video>
        ) : null}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/80 via-black/40 to-transparent"
          aria-hidden
        />
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 flex items-end justify-between gap-4 p-5 sm:p-6">
          <div>
            <p className="font-mono text-[11px] tracking-[0.1em] text-kyra-red uppercase drop-shadow">
              0{index + 1}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold italic uppercase text-white drop-shadow-md md:text-2xl">
              {name}
            </h3>
            <p className="mt-1.5 text-sm text-white/85 drop-shadow">{tagline}</p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/50 bg-black/40 text-white backdrop-blur-[2px] transition-all duration-300 group-hover:border-kyra-red group-hover:bg-kyra-red">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function AllInOneSection() {
  return (
    <section className="home-section-cv relative overflow-hidden border-y border-border bg-background">
      <div className="hero-accent-bar hidden lg:block" aria-hidden />

      <div className="relative min-h-[72vh] lg:min-h-[85vh]">
        <LazyVideo
          src={ALL_IN_ONE_VIDEO}
          poster={VIDEO_POSTER}
          rootMargin="120px 0px"
          className="absolute inset-0 h-full w-full object-cover object-center"
          aria-label="All in One KYRA — imports, customs, and wash"
        />

        <div className="container-kyra relative z-10 flex min-h-[72vh] flex-col justify-center px-6 py-20 md:px-12 lg:min-h-[85vh] lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-2xl"
          >
            <Eyebrow showChevrons>The Complete Experience</Eyebrow>

            <h2
              className="font-hero mt-5 text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92]"
              aria-label="All in One KYRA"
            >
              <span className="block text-white drop-shadow-md">All in One</span>
              <span className="text-flow-red mt-1 block">KYRA</span>
            </h2>

            <p className="mt-6 max-w-lg border-l-2 border-kyra-red pl-4 text-[15px] leading-relaxed text-white/90 drop-shadow md:text-base">
              From curated imports to bespoke wraps and premium car care — one
              destination for your entire automotive journey in Nairobi.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="grid gap-px border-t border-border bg-border lg:grid-cols-3">
        {divisions.map((division, index) => (
          <motion.div
            key={division.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.7,
              delay: index * 0.1,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            <DivisionHoverCard
              href={division.href}
              name={division.name}
              tagline={division.tagline}
              image={division.image}
              video={division.video}
              poster={division.videoPoster}
              index={index}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
