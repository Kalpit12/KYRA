"use client";

import { useEffect } from "react";
import { warmSimulatorRuntime } from "@/lib/simulator/preload";

/** Prefetch drei/fiber JS while the user is on /customs. Does not load GLBs. */
export function SimulatorWarmup() {
  useEffect(() => {
    warmSimulatorRuntime();
  }, []);

  return null;
}
