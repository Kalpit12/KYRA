"use client";

import { useEffect } from "react";
import {
  warmAllSimulatorModelsIdle,
  warmDefaultSimulatorAssets,
} from "@/lib/simulator/preload";

/** Warms 3D studio assets while the user is on /customs. */
export function SimulatorWarmup() {
  useEffect(() => {
    warmDefaultSimulatorAssets();
    warmAllSimulatorModelsIdle();
  }, []);

  return null;
}
