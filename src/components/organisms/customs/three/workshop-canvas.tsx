"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { KyraLoader } from "@/components/atoms/kyra-loader";
import { Canvas, useThree } from "@react-three/fiber";
import {
  AdaptiveDpr,
  ContactShadows,
  Html,
  OrbitControls,
  PerspectiveCamera,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";
import { CarModel } from "@/components/organisms/customs/three/car-model";
import { StudioEnvironment } from "@/components/organisms/customs/three/studio-environment";
import { StudioLights } from "@/components/organisms/customs/three/studio-lights";
import { silenceThreeClockDeprecation } from "@/lib/three/silence-clock-deprecation";
import { DRACO_DECODER_PATH } from "@/lib/simulator/draco";
import type {
  VehicleTypeId,
  WrapFinishId,
  WrapOption,
  WindowFilm,
} from "@/lib/data/simulator";

silenceThreeClockDeprecation();
useGLTF.setDecoderPath(DRACO_DECODER_PATH);

export type WorkshopPerformanceMode = "full" | "preview";

interface WorkshopCanvasProps {
  modelPath: string;
  modelScale?: number;
  vehicleTypeId?: VehicleTypeId;
  wrap: WrapOption;
  finish: WrapFinishId;
  tint: WindowFilm;
  performanceMode?: WorkshopPerformanceMode;
}

function LoadingFallback({ label }: { label: string }) {
  return (
    <Html center>
      <KyraLoader size="lg" label={label} />
    </Html>
  );
}

function ContextLostGuard({ onLost }: { onLost: () => void }) {
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    const canvas = gl.domElement;
    const handleLost = () => {
      onLost();
    };
    canvas.addEventListener("webglcontextlost", handleLost, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", handleLost, false);
    };
  }, [gl, onLost]);

  return null;
}

function RenderWhenPropsChange({ token }: { token: string }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [invalidate, token]);
  return null;
}

function StudioControls({ isPreview }: { isPreview: boolean }) {
  const invalidate = useThree((state) => state.invalidate);

  return (
    <OrbitControls
      target={[0, 0.92, -0.55]}
      enablePan={false}
      enableZoom={!isPreview}
      autoRotate={false}
      minDistance={3.6}
      maxDistance={12.5}
      minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2 - 0.04}
      enableDamping
      dampingFactor={0.08}
      onChange={() => invalidate()}
      onEnd={() => invalidate()}
    />
  );
}

function WorkshopScene({
  modelPath,
  modelScale,
  vehicleTypeId,
  wrap,
  finish,
  tint,
  performanceMode = "full",
  onContextLost,
}: WorkshopCanvasProps & { onContextLost: () => void }) {
  const isPreview = performanceMode === "preview";

  return (
    <Canvas
      shadows={!isPreview}
      dpr={isPreview ? 1 : [1.25, 2]}
      frameloop="demand"
      performance={{ min: 0.7 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.94,
        stencil: false,
        depth: true,
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: true,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = 0.94;
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.shadowMap.enabled = !isPreview;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
      className="h-full w-full"
    >
      <AdaptiveDpr pixelated={false} />
      <RenderWhenPropsChange
        token={`${modelPath}:${vehicleTypeId ?? ""}:${wrap.id}:${finish}:${tint.id}:${modelScale ?? 1}`}
      />
      <ContextLostGuard onLost={onContextLost} />
      <color attach="background" args={["#0c0d10"]} />

      <PerspectiveCamera
        makeDefault
        position={isPreview ? [3.4, 1.35, 4.4] : [4.85, 1.62, 7.15]}
        fov={38}
      />
      <StudioControls isPreview={isPreview} />

      <Suspense
        fallback={
          <LoadingFallback label={isPreview ? "Loading preview" : "Loading workshop"} />
        }
      >
        <StudioLights preview={isPreview} />
        <StudioEnvironment receiveShadow={!isPreview} />
        <CarModel
          modelPath={modelPath}
          modelScale={modelScale}
          vehicleTypeId={vehicleTypeId}
          wrap={wrap}
          finish={finish}
          tint={tint}
          enableShadows={!isPreview}
          liteMaterials={isPreview}
        />
        {!isPreview && (
          <ContactShadows
            position={[0, 0.008, -0.55]}
            opacity={0.62}
            scale={16}
            blur={1.85}
            far={10}
            color="#000000"
            resolution={1024}
            frames={1}
          />
        )}
      </Suspense>
    </Canvas>
  );
}

export function WorkshopCanvas(props: WorkshopCanvasProps) {
  const [epoch, setEpoch] = useState(0);
  const [gaveUp, setGaveUp] = useState(false);
  const lostCount = useRef(0);

  const handleContextLost = useCallback(() => {
    lostCount.current += 1;
    if (lostCount.current > 2) {
      setGaveUp(true);
      return;
    }
    window.setTimeout(() => setEpoch((current) => current + 1), 280);
  }, []);

  if (gaveUp) {
    return (
      <div className="flex h-full min-h-[240px] w-full flex-col items-center justify-center gap-3 bg-[#0c0d10] px-6 text-center">
        <p className="font-mono text-[10px] tracking-[0.16em] text-kyra-red uppercase">
          Studio preview
        </p>
        <p className="font-display text-xl italic uppercase text-foreground">
          3D model unavailable
        </p>
        <p className="max-w-sm text-sm text-white/70">
          This browser lost its WebGL context. Close other GPU-heavy tabs and retry.
        </p>
        <button
          type="button"
          className="mt-2 border border-white/15 px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase text-white transition hover:border-kyra-red"
          onClick={() => {
            lostCount.current = 0;
            setGaveUp(false);
            setEpoch((current) => current + 1);
          }}
        >
          Retry studio
        </button>
      </div>
    );
  }

  return (
    <WorkshopScene
      key={epoch}
      {...props}
      onContextLost={handleContextLost}
    />
  );
}
