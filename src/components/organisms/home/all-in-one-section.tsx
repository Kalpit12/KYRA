"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/atoms/eyebrow";
import { LazyVideo } from "@/components/molecules/lazy-video";

const ALL_IN_ONE_VIDEO = "/video/all-in-one-kyra.mp4";
const VIDEO_POSTER = "/video/posters/all-in-one-kyra.jpg";

const divisionLinks = [
  { label: "Imports", href: "/imports" },
  { label: "Customs", href: "/customs" },
  { label: "Wash", href: "/wash" },
] as const;

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

            <div className="mt-8 flex flex-wrap gap-2">
              {divisionLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group inline-flex items-center gap-2 border border-white/40 bg-black/35 px-4 py-2.5 font-mono text-[10px] tracking-[0.14em] text-white uppercase transition hover:border-kyra-red hover:bg-kyra-red"
                >
                  {item.label}
                  <ArrowUpRight
                    size={14}
                    className="text-kyra-red transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                  />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
