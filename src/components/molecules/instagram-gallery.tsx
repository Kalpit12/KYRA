"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { cn } from "@/lib/utils";

export type InstagramGalleryPost = {
  id: string;
  type: "post" | "reel";
  href: string;
  thumbnail: string;
  caption: string;
  alt: string;
};

type InstagramGalleryProps = {
  handle: string;
  profileUrl: string;
  subtitle: string;
  posts: readonly InstagramGalleryPost[];
  className?: string;
};

export function InstagramGallery({
  handle,
  profileUrl,
  subtitle,
  posts,
  className,
}: InstagramGalleryProps) {
  return (
    <section
      className={cn(
        "section-padding border-t border-border bg-muted",
        className
      )}
    >      <div className="container-kyra">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionHeading
            label="Follow Us"
            title={handle}
            subtitle={subtitle}
            align="center"
            className="mx-auto"
          />
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 font-mono text-xs tracking-[0.08em] text-kyra-red uppercase transition-colors hover:text-foreground"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
            Follow on Instagram
          </a>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="bg-background"
            >
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[4/5] overflow-hidden"
                aria-label={`${post.alt} — open on Instagram`}
              >
                <Image
                  src={post.thumbnail}
                  alt={post.alt}
                  fill
                  className="pointer-events-none object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 640px) 50vw, 33vw"
                />

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-95"
                  aria-hidden
                />

                {post.type === "reel" && (
                  <span
                    className="pointer-events-none absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-white/40 bg-black/40 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105"
                    aria-hidden
                  >
                    <Play size={18} fill="currentColor" className="ml-0.5" />
                  </span>
                )}

                <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-1 p-4">
                  <span className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                    {post.type === "reel" ? "Reel" : "Post"}
                  </span>
                  <p className="translate-y-1 text-sm text-white/90 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    {post.caption}
                  </p>
                  <span className="font-mono text-[10px] tracking-[0.1em] text-white/70 uppercase transition-colors group-hover:text-white">
                    View on Instagram →
                  </span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
