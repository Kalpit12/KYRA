"use client";

import { Suspense, useState } from "react";
import { KyraLoader } from "@/components/atoms/kyra-loader";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { CarModel } from "@/components/organisms/customs/three/car-model";
import { StudioEnvironment } from "@/components/organisms/customs/three/studio-environment";
import { StudioLights } from "@/components/organisms/customs/three/studio-lights";
import { silenceThreeClockDeprecation } from "@/lib/three/silence-clock-deprecation";
import type { WrapFinishId, WrapOption, WindowFilm } from "@/lib/data/simulator";

silenceThreeClockDeprecation();

export type WorkshopPerformanceMode = "full" | "preview";

interface WorkshopCanvasProps {
  modelPath: string;
  modelScale?: number;
  wrap: WrapOption;
  finish: WrapFinishId;
  tint: WindowFilm;
  /** Hero teaser uses preview — no shadows / HDR, lower DPR */
  performanceMode?: WorkshopPerformanceMode;
}

function LoadingFallback({ label }: { label: string }) {
  return (
    <Html center>
      <KyraLoader size="lg" label={label} />
    </Html>
  );
}

export function WorkshopCanvas({
  modelPath,
  modelScale,
  wrap,
  finish,
  tint,
  performanceMode = "full",
}: WorkshopCanvasProps) {
  const isPreview = performanceMode === "preview";
  const [autoRotate, setAutoRotate] = useState(!isPreview);

  return (
    <Canvas
      shadows={!isPreview}
      dpr={isPreview ? 1 : [1, 1.6]}
      frameloop="always"
      gl={{
        antialias: !isPreview,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        stencil: false,
        depth: true,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = isPreview ? 1.06 : 1.04;
        gl.shadowMap.enabled = !isPreview;
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
      className="h-full w-full"
    >
      <color attach="background" args={["#ececee"]} />

      <PerspectiveCamera
        makeDefault
        position={isPreview ? [3.4, 1.35, 4.4] : [3.55, 1.28, 4.85]}
        fov={isPreview ? 40 : 34}
      />
      <OrbitControls
        target={[0, 0.72, 0]}
        enablePan={false}
        enableZoom={!isPreview}
        autoRotate={autoRotate}
        autoRotateSpeed={isPreview ? 0.55 : 0.22}
        minDistance={3.1}
        maxDistance={8.5}
        minPolarAngle={Math.PI / 5.5}
        maxPolarAngle={Math.PI / 2.12}
        enableDamping
        dampingFactor={0.06}
        onStart={() => setAutoRotate(false)}
      />

      <StudioLights preview={isPreview} />

      <Suspense
        fallback={
          <LoadingFallback label={isPreview ? "Loading preview" : "Loading studio"} />
        }
      >
        <StudioEnvironment receiveShadow={!isPreview} />
        <group position={[0, 0.07, 0]}>
          <CarModel
            modelPath={modelPath}
            modelScale={modelScale}
            wrap={wrap}
            finish={finish}
            tint={tint}
            enableShadows={!isPreview}
            liteMaterials={isPreview}
          />
        </group>
        {!isPreview && (
          <ContactShadows
            position={[0, 0.07, 0]}
            opacity={0.2}
            scale={14}
            blur={2.8}
            far={6.5}
            color="#2a2a2e"
            resolution={512}
            frames={1}
          />
        )}
      </Suspense>
    </Canvas>
  );
}
