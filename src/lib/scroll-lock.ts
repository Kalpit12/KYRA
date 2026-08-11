type LenisLike = {
  stop: () => void;
  start: () => void;
  destroy: () => void;
  raf: (time: number) => void;
};

let lenis: LenisLike | null = null;
let lockCount = 0;

export function registerLenis(instance: LenisLike | null) {
  lenis = instance;
}

/** Nested-safe scroll lock for modals, menus, lightboxes, and workshop. */
export function lockScroll() {
  if (typeof document === "undefined") return;
  lockCount += 1;
  if (lockCount === 1) {
    document.documentElement.classList.add("lenis-stopped");
    document.body.style.overflow = "hidden";
    lenis?.stop();
  }
}

export function unlockScroll() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.documentElement.classList.remove("lenis-stopped");
    document.body.style.overflow = "";
    lenis?.start();
  }
}
