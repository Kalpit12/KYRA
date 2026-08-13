"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { KyraLoader } from "@/components/atoms/kyra-loader";
import { Canvas, useThree } from "@react-three/fiber";
import {
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
import type { WrapFinishId, WrapOption, WindowFilm } from "@/lib/data/simulator";

silenceThreeClockDeprecation();
useGLTF.setDecoderPath(DRACO_DECODER_PATH);

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

function WorkshopScene({
  modelPath,
  modelScale,
  wrap,
  finish,
  tint,
  performanceMode = "full",
  liteMaterials,
  onContextLost,
}: WorkshopCanvasProps & { liteMaterials: boolean; onContextLost: () => void }) {
  const isPreview = performanceMode === "preview";
  const [autoRotate, setAutoRotate] = useState(!isPreview);

  return (
    <Canvas
      shadows={!isPreview}
      dpr={isPreview ? 1 : [1, 1.25]}
      frameloop="always"
      gl={{
        antialias: !isPreview && !liteMaterials,
        alpha: false,
        powerPreference: "default",
        toneMapping: THREE.ACESFilmicToneMapping,
        stencil: false,
        depth: true,
        failIfMajorPerformanceCaveat: false,
        preserveDrawingBuffer: false,
      }}
      onCreated={({ gl }) => {
        gl.toneMappingExposure = isPreview ? 1.06 : 1.04;
        gl.shadowMap.enabled = !isPreview;
        gl.shadowMap.type = THREE.PCFShadowMap;
      }}
      className="h-full w-full"
    >
      <ContextLostGuard onLost={onContextLost} />
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

      <StudioLights preview={isPreview || liteMaterials} />

      <Suspense
        fallback={
          <LoadingFallback label={isPreview ? "Loading preview" : "Loading studio"} />
        }
      >
        <StudioEnvironment receiveShadow={!isPreview && !liteMaterials} />
        <group position={[0, 0.07, 0]}>
          <CarModel
            modelPath={modelPath}
            modelScale={modelScale}
            wrap={wrap}
            finish={finish}
            tint={tint}
            enableShadows={!isPreview && !liteMaterials}
            liteMaterials={isPreview || liteMaterials}
          />
        </group>
        {!isPreview && !liteMaterials && (
          <ContactShadows
            position={[0, 0.07, 0]}
            opacity={0.2}
            scale={14}
            blur={2.8}
            far={6.5}
            color="#2a2a2e"
            resolution={256}
            frames={1}
          />
        )}
      </Suspense>
    </Canvas>
  );
}

export function WorkshopCanvas(props: WorkshopCanvasProps) {
  const [epoch, setEpoch] = useState(0);
  const [liteMaterials, setLiteMaterials] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const lostCount = useRef(0);

  const handleContextLost = useCallback(() => {
    lostCount.current += 1;
    if (lostCount.current > 2) {
      setGaveUp(true);
      return;
    }
    setLiteMaterials(true);
    window.setTimeout(() => setEpoch((current) => current + 1), 280);
  }, []);

  if (gaveUp) {
    return (
      <div className="flex h-full min-h-[240px] w-full flex-col items-center justify-center gap-3 bg-[#ececee] px-6 text-center">
        <p className="font-mono text-[10px] tracking-[0.16em] text-kyra-red uppercase">
          Studio preview
        </p>
        <p className="font-display text-xl italic uppercase text-foreground">
          3D model unavailable
        </p>
        <p className="max-w-sm text-sm text-foreground/70">
          This browser lost its WebGL context. Close other GPU-heavy tabs and retry.
        </p>
        <button
          type="button"
          className="mt-2 border border-border px-4 py-2 font-mono text-[10px] tracking-[0.14em] uppercase text-foreground transition hover:border-kyra-red"
          onClick={() => {
            lostCount.current = 0;
            setGaveUp(false);
            setLiteMaterials(true);
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
      liteMaterials={liteMaterials}
      onContextLost={handleContextLost}
    />
  );
}
