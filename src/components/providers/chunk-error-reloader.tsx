"use client";

import { useEffect } from "react";

const RELOAD_KEY = "kyra-chunk-reload";

/**
 * After a Vercel deploy, open tabs can still hold HTML that points at old
 * `/_next/static/...` hashes (404). One hard reload recovers cleanly.
 */
export function ChunkErrorReloader() {
  useEffect(() => {
    const reloadOnce = () => {
      try {
        if (sessionStorage.getItem(RELOAD_KEY) === "1") return;
        sessionStorage.setItem(RELOAD_KEY, "1");
      } catch {
        // sessionStorage blocked — still attempt a single reload
      }
      window.location.reload();
    };

    const onError = (event: Event) => {
      const el = event.target;
      if (!(el instanceof HTMLElement)) return;
      const url =
        el instanceof HTMLScriptElement
          ? el.src
          : el instanceof HTMLLinkElement
            ? el.href
            : "";
      if (url.includes("/_next/static/")) reloadOnce();
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const message = String(event.reason?.message ?? event.reason ?? "");
      if (
        message.includes("Loading chunk") ||
        message.includes("ChunkLoadError") ||
        message.includes("/_next/static/")
      ) {
        reloadOnce();
      }
    };

    // Clear the guard after a successful boot so a future deploy can recover again
    try {
      sessionStorage.removeItem(RELOAD_KEY);
    } catch {
      // ignore
    }

    window.addEventListener("error", onError, true);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError, true);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
