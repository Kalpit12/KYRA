"use client";

import { useEffect, useState } from "react";

export type GlbStatus = "checking" | "ready" | "invalid";

const MIN_GLB_BYTES = 1024;
const GLB_MAGIC = "glTF";

/** Bust stale browser cache from the Git LFS pointer era. */
export const SIMULATOR_MODEL_CACHE_VERSION = "2";

export function resolveSimulatorModelUrl(path: string) {
  const base = path.split("?")[0] ?? path;
  return `${base}?v=${SIMULATOR_MODEL_CACHE_VERSION}`;
}

async function readGlbMagic(url: string, signal: AbortSignal) {
  const res = await fetch(url, {
    signal,
    cache: "no-store",
    headers: { Range: "bytes=0-3" },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.length < 4) {
    throw new Error("Response too short for GLB header");
  }

  return String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
}

/** Reject Git LFS pointers / HTML error pages before Three.js tries to parse them. */
export function useGlbStatus(modelPath: string): GlbStatus {
  const [status, setStatus] = useState<GlbStatus>("checking");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const url = resolveSimulatorModelUrl(modelPath);

    async function check() {
      try {
        const magic = await readGlbMagic(url, controller.signal);
        if (!active) return;

        if (magic === GLB_MAGIC) {
          setStatus("ready");
          return;
        }

        if (magic.startsWith("vers")) {
          setStatus("invalid");
          return;
        }

        setStatus("invalid");
      } catch (error) {
        if (!active || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }

        try {
          const head = await fetch(url, {
            method: "HEAD",
            signal: controller.signal,
            cache: "no-store",
          });
          const length = Number(head.headers.get("content-length") || 0);
          if (active && head.ok && length >= MIN_GLB_BYTES) {
            setStatus("ready");
            return;
          }
        } catch {
          // fall through to invalid
        }

        if (active) setStatus("invalid");
      }
    }

    setStatus("checking");
    void check();

    return () => {
      active = false;
      controller.abort();
    };
  }, [modelPath]);

  return status;
}
