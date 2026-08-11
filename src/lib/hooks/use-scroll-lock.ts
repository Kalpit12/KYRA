"use client";

import { useEffect } from "react";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";

/** Locks page scroll (and Lenis) while `locked` is true. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockScroll();
    return () => unlockScroll();
  }, [locked]);
}
