"use client";

import { InstagramGallery } from "@/components/molecules/instagram-gallery";
import { INSTAGRAM, instagramPosts } from "@/lib/data/home";

export function InstagramSection() {
  return (
    <InstagramGallery
      handle={INSTAGRAM.handle}
      profileUrl={INSTAGRAM.url}
      subtitle="Behind the scenes, new arrivals, and road-ready stock from Platinum Imports."
      posts={instagramPosts}
    />
  );
}
