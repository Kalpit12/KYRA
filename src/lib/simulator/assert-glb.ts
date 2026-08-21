"use client";

import { useEffect, useState } from "react";

export type GlbStatus = "checking" | "ready" | "invalid";

const GLB_MAGIC = "glTF";

/** Bust stale browser cache from the Git LFS pointer / Range-check era. */
export const SIMULATOR_MODEL_CACHE_VERSION = "7";

export function resolveSimulatorModelUrl(path: string) {
  const base = path.split("?")[0] ?? path;
  return `${base}?v=${SIMULATOR_MODEL_CACHE_VERSION}`;
}

function magicOf(bytes: Uint8Array) {
  if (bytes.length < 4) return "";
  return String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]);
}

function isConfirmedInvalid(magic: string) {
  if (!magic || magic === GLB_MAGIC) return false;
  // Git LFS pointer: "version https://git-lfs.github.com/spec/v1"
  if (magic.startsWith("vers")) return true;
  // HTML/JSON error page instead of a binary
  if (magic.startsWith("<") || magic.startsWith("{")) return true;
  return false;
}

async function readGlbMagic(url: string, signal: AbortSignal, cache: RequestCache) {
  const res = await fetch(url, { signal, cache });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const reader = res.body?.getReader();
  if (!reader) {
    return magicOf(new Uint8Array(await res.arrayBuffer()));
  }

  const first = await reader.read();
  await reader.cancel();
  return magicOf(first.value ?? new Uint8Array());
}

/** Reject Git LFS pointers / HTML error pages before Three.js tries to parse them. */
export function useGlbStatus(modelPath: string): GlbStatus {
  const [status, setStatus] = useState<GlbStatus>("ready");

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const url = resolveSimulatorModelUrl(modelPath);
    const fetchCache: RequestCache =
      process.env.NODE_ENV === "production" ? "default" : "no-store";

    async function check() {
      try {
        const magic = await readGlbMagic(url, controller.signal, fetchCache);
        if (!active) return;
        setStatus(isConfirmedInvalid(magic) ? "invalid" : "ready");
      } catch (error) {
        if (!active || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        // Range/CDN/network uncertainty must not hide a valid model.
        if (active) setStatus("ready");
      }
    }

    setStatus("ready");
    void check();

    return () => {
      active = false;
      controller.abort();
    };
  }, [modelPath]);

  return status;
}
