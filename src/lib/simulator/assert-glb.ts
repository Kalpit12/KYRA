"use client";

import { useEffect, useState } from "react";

export type GlbStatus = "checking" | "ready" | "invalid";

const MIN_GLB_BYTES = 1024;

/** Reject Git LFS pointers / HTML error pages before Three.js tries to parse them. */
export function useGlbStatus(modelPath: string): GlbStatus {
  const [status, setStatus] = useState<GlbStatus>("checking");

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function check() {
      try {
        const head = await fetch(modelPath, {
          method: "HEAD",
          signal: controller.signal,
        });
        const length = Number(head.headers.get("content-length") || 0);
        if (head.ok && length >= MIN_GLB_BYTES) {
          if (!cancelled) setStatus("ready");
          return;
        }

        const res = await fetch(modelPath, {
          signal: controller.signal,
          headers: { Range: "bytes=0-3" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const bytes = new Uint8Array(await res.arrayBuffer());
        const magic = String.fromCharCode(...bytes.slice(0, 4));
        if (!cancelled) setStatus(magic === "glTF" ? "ready" : "invalid");
      } catch (error) {
        if (cancelled || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        if (!cancelled) setStatus("invalid");
      }
    }

    setStatus("checking");
    void check();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [modelPath]);

  return status;
}
