const prefetched = new Set<string>();

/** Prefetch a static image once (gallery tab hover / section warm-up). */
export function prefetchStaticImage(src: string) {
  if (typeof window === "undefined" || prefetched.has(src)) return;
  prefetched.add(src);

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "image";
  link.href = src;
  document.head.appendChild(link);
}

/** Prefetch a video file once when the highlights grid nears the viewport. */
export function prefetchStaticVideo(src: string) {
  if (typeof window === "undefined" || prefetched.has(src)) return;
  prefetched.add(src);

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "video";
  link.href = src;
  document.head.appendChild(link);
}
