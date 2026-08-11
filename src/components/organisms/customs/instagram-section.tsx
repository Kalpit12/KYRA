"use client";

import { InstagramGallery } from "@/components/molecules/instagram-gallery";
import { CUSTOMS_INSTAGRAM, customsInstagramPosts } from "@/lib/data/wraps";

export function CustomsInstagramSection() {
  return (
    <InstagramGallery
      handle={CUSTOMS_INSTAGRAM.handle}
      profileUrl={CUSTOMS_INSTAGRAM.url}
      subtitle="Wraps, colored PPF, and studio builds from KYRA Customs."
      posts={customsInstagramPosts}
      className="bg-background"
    />
  );
}
