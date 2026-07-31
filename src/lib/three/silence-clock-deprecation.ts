import * as THREE from "three";

declare global {
  interface Window {
    __kyraSilencedThreeNoise?: boolean;
  }
}

/**
 * Silence known Three.js / R3F noise that spams every frame and hurts perf:
 * - Clock deprecation (R3F v9)
 * - PCFSoftShadowMap deprecation (Three r183+)
 */
export function silenceThreeClockDeprecation() {
  if (typeof window === "undefined") return;
  if (window.__kyraSilencedThreeNoise) return;
  window.__kyraSilencedThreeNoise = true;

  const previous = THREE.getConsoleFunction();

  THREE.setConsoleFunction((type, message, ...params) => {
    if (
      type === "warn" &&
      typeof message === "string" &&
      (message.includes("Clock: This module has been deprecated") ||
        message.includes("PCFSoftShadowMap has been deprecated"))
    ) {
      return;
    }

    if (previous) {
      previous(type, message, ...params);
      return;
    }

    const fn =
      type === "error"
        ? console.error
        : type === "warn"
          ? console.warn
          : console.log;
    fn(message, ...params);
  });
}
