"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useState,
  type ErrorInfo,
  type ReactNode,
} from "react";

const WEBGL_BLOCK_KEY = "kyra-webgl-blocked";

const Beams = dynamic(() => import("@/components/react-bits/Beams"), {
  ssr: false,
  loading: () => null,
});

function FallbackBackground() {
  return (
    <div className="hero-beams-fallback absolute inset-0" aria-hidden>
      <div className="hero-beams-fallback__glow" />
      <div className="hero-beams-fallback__stripes" />
    </div>
  );
}

class BeamsErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    const message = String(error?.message ?? error ?? "");
    if (message.includes("WebGL") || message.includes("webgl")) {
      this.props.onError();
    }
  }

  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

function isWebGLBlocked(): boolean {
  try {
    return sessionStorage.getItem(WEBGL_BLOCK_KEY) === "1";
  } catch {
    return false;
  }
}

function markWebGLBlocked() {
  try {
    sessionStorage.setItem(WEBGL_BLOCK_KEY, "1");
  } catch {
    // ignore
  }
}

function probeWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (isWebGLBlocked()) return false;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", {
        failIfMajorPerformanceCaveat: false,
        powerPreference: "low-power",
      }) ||
      canvas.getContext("webgl", {
        failIfMajorPerformanceCaveat: false,
        powerPreference: "low-power",
      });
    return Boolean(gl);
  } catch {
    return false;
  }
}

export function HeroBackground() {
  const [mode, setMode] = useState<"loading" | "beams" | "fallback">("loading");

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !probeWebGL()) {
      setMode("fallback");
      return;
    }

    // Delay one frame so Fast Refresh can finish disposing the old context.
    const id = window.setTimeout(() => setMode("beams"), 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (mode !== "beams") return;

    const onError = (event: ErrorEvent) => {
      const message = String(event.message ?? event.error ?? "");
      if (
        message.includes("WebGL") ||
        message.includes("webgl") ||
        message.includes("CONTEXT_LOST")
      ) {
        markWebGLBlocked();
        setMode("fallback");
      }
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason?.message ?? event.reason ?? "");
      if (reason.includes("WebGL") || reason.includes("webgl")) {
        markWebGLBlocked();
        setMode("fallback");
        event.preventDefault();
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, [mode]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black"
      aria-hidden
    >
      <FallbackBackground />
      {mode === "beams" && (
        <div className="absolute inset-0" onContextMenu={(e) => e.preventDefault()}>
          <BeamsErrorBoundary
            onError={() => {
              markWebGLBlocked();
              setMode("fallback");
            }}
          >
            <Beams
              beamWidth={2}
              beamHeight={15}
              beamNumber={6}
              lightColor="#ffffff"
              speed={1.25}
              noiseIntensity={1.35}
              scale={0.2}
              rotation={0}
            />
          </BeamsErrorBoundary>
        </div>
      )}
    </div>
  );
}
