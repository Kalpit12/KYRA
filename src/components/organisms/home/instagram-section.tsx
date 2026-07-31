"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/molecules/section-heading";
import { INSTAGRAM, instagramPosts } from "@/lib/data/home";

export function InstagramSection() {
  return (
    <section className="section-padding border-t border-border bg-muted">
      <div className="container-kyra">
        <div className="flex flex-col items-center gap-4 text-center">
          <SectionHeading
            label="Follow Us"
            title={INSTAGRAM.handle}
            subtitle="Behind the scenes, new arrivals, and stunning transformations."
            align="center"
            className="mx-auto"
          />
          <a
            href={INSTAGRAM.url}
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

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {instagramPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
              className="group relative overflow-hidden border border-border bg-background"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                <iframe
                  src={post.embedUrl}
                  title={post.alt}
                  loading="lazy"
                  allow="encrypted-media; clipboard-write"
                  className="absolute inset-0 h-full w-full border-0"
                />
              </div>

              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 transition-colors hover:bg-muted"
              >
                <span className="font-mono text-[10px] tracking-[0.14em] text-kyra-red uppercase">
                  {post.type === "reel" ? "Reel" : "Post"}
                </span>
                <span className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase transition-colors group-hover:text-foreground">
                  View on Instagram →
                </span>
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
