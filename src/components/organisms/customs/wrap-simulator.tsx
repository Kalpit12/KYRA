"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { SimulatorWarmup } from "@/components/organisms/customs/simulator-warmup";
import { SimulatorWelcome } from "@/components/organisms/customs/simulator-welcome";
import { VehicleTypeGrid } from "@/components/organisms/customs/vehicle-type-grid";
import { WorkshopViewer } from "@/components/organisms/customs/workshop-viewer";
import {
  vehicleTypes,
  type SimulatorStep,
  type VehicleTypeId,
} from "@/lib/data/simulator";
import { warmDefaultSimulatorAssets } from "@/lib/simulator/preload";

export function WrapSimulator() {
  const [step, setStep] = useState<SimulatorStep>(0);
  const [vehicleTypeId, setVehicleTypeId] = useState<VehicleTypeId>("sedan");

  useEffect(() => {
    if (step >= 1) {
      void import("@/components/organisms/customs/workshop-viewer");
    }
  }, [step]);

  return (
    <section className="relative min-h-screen bg-background pt-20">
      <SimulatorWarmup />
      <AnimatePresence mode="wait">
        {step === 0 && (
          <SimulatorWelcome key="welcome" onStart={() => setStep(1)} />
        )}

        {step === 1 && (
          <VehicleTypeGrid
            key="vehicles"
            vehicles={vehicleTypes}
            onBack={() => setStep(0)}
            onSelect={(id) => {
              warmDefaultSimulatorAssets();
              setVehicleTypeId(id);
              setStep(2);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step === 2 && (
          <WorkshopViewer
            key="workshop"
            vehicleTypeId={vehicleTypeId}
            onExit={() => setStep(1)}
            onSwitchVehicle={setVehicleTypeId}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
