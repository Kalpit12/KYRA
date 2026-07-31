"use client";

import { Suspense } from "react";
import { KyraLoader } from "@/components/atoms/kyra-loader";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Html,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { CarModel } from "@/components/organisms/customs/three/car-model";
import { StudioFloor } from "@/components/organisms/customs/three/studio-floor";
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

  return (
    <Canvas
      shadows={!isPreview}
      dpr={isPreview ? 1 : [1, 1.5]}
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
        gl.toneMappingExposure = isPreview ? 1.05 : 1.15;
        // Three r183+: PCFSoftShadowMap is deprecated — set explicitly to avoid per-frame warns
        gl.shadowMap.enabled = !isPreview;
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
      className="h-full w-full"
    >
      <color attach="background" args={["#0a0a0a"]} />
      {!isPreview && <fog attach="fog" args={["#0a0a0a", 14, 32]} />}

      <PerspectiveCamera
        makeDefault
        position={isPreview ? [3.8, 1.55, 4.6] : [4.5, 1.8, 5.5]}
        fov={isPreview ? 42 : 38}
      />
      <OrbitControls
        target={[0, 0.85, 0]}
        enablePan={false}
        enableZoom={!isPreview}
        autoRotate={isPreview}
        autoRotateSpeed={0.55}
        minDistance={3.5}
        maxDistance={9}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        enableDamping
        dampingFactor={0.06}
      />

      <ambientLight intensity={isPreview ? 0.7 : 0.5} />
      <hemisphereLight args={["#ffffff", "#1a1020", isPreview ? 0.75 : 0.55]} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={isPreview ? 1.1 : 1.25}
        castShadow={!isPreview}
        shadow-mapSize={isPreview ? [256, 256] : [512, 512]}
      />
      {!isPreview && (
        <>
          <directionalLight position={[-4, 3, -2]} intensity={0.4} color="#c8d4ff" />
          <spotLight
            position={[-3, 6, 2]}
            angle={0.45}
            penumbra={0.55}
            intensity={0.9}
            color="#fff5f0"
          />
          <pointLight position={[1.4, 0.35, 1.1]} intensity={0.4} color="#ffffff" distance={4} />
          <pointLight position={[-1.4, 0.35, 1.1]} intensity={0.4} color="#ffffff" distance={4} />
          <pointLight position={[0, 1.2, -3.2]} intensity={0.4} color="#ff3b3b" />
        </>
      )}

      <Suspense
        fallback={
          <LoadingFallback label={isPreview ? "Loading preview" : "Loading workshop"} />
        }
      >
        {!isPreview && <Environment preset="city" environmentIntensity={0.75} />}
        <StudioFloor animated={!isPreview} receiveShadow={!isPreview} />
        <CarModel
          modelPath={modelPath}
          modelScale={modelScale}
          wrap={wrap}
          finish={finish}
          tint={tint}
          enableShadows={!isPreview}
          liteMaterials={isPreview}
        />
        {!isPreview && (
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.4}
            scale={14}
            blur={1.6}
            far={5}
            resolution={256}
            frames={1}
          />
        )}
      </Suspense>
    </Canvas>
  );
}
