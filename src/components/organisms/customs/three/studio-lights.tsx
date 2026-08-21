"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Phantom Wrap lighting recipe, tuned for a dark KYRA showroom:
 * low ambient, warm overhead spot, and sharp lightformers in the
 * environment map so gloss wrap reads as vinyl.
 */
export function StudioLights({ preview = false }: { preview?: boolean }) {
  if (preview) {
    return (
      <>
        <ambientLight intensity={0.35} />
        <hemisphereLight args={["#ffffff", "#2a2c32", 0.35]} />
        <directionalLight position={[4, 8, 4]} intensity={1.05} />
        <Environment preset="studio" environmentIntensity={0.85} />
      </>
    );
  }

  return (
    <>
      <fog attach="fog" args={["#101114", 16, 38]} />
      <ambientLight intensity={0.16} />
      <hemisphereLight args={["#f7f4ee", "#1c1d22", 0.34]} />

      <directionalLight
        position={[3.1, 6.4, 4.2]}
        intensity={0.72}
        color="#fffdf8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00018}
        shadow-normalBias={0.022}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />
      <directionalLight position={[-5.4, 3.4, 1.8]} intensity={0.28} color="#dfe7f4" />
      <directionalLight position={[1.2, 3.2, -6.5]} intensity={0.42} color="#ffffff" />

      <spotLight
        position={[0, 7.1, -0.55]}
        angle={0.62}
        penumbra={0.72}
        intensity={1.85}
        distance={22}
        decay={1.4}
        color="#fff8ee"
      />

      <Environment frames={1} resolution={1024} environmentIntensity={1.05}>
        <Lightformer
          intensity={3.6}
          position={[0, 6.8, -1.2]}
          scale={[14, 1.05, 1]}
          form="rect"
        />
        <Lightformer
          intensity={2.4}
          position={[6.8, 3.1, 0.6]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[11, 2.4, 1]}
          form="rect"
        />
        <Lightformer
          intensity={1.6}
          position={[-6.8, 2.8, 0.6]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[11, 2.1, 1]}
          form="rect"
        />
        <Lightformer
          intensity={2.1}
          position={[0, 7.4, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[12, 12, 1]}
          form="rect"
        />
        <Lightformer
          intensity={0.7}
          position={[0, 1.4, 8.2]}
          scale={[8, 3.2, 1]}
          form="rect"
        />
      </Environment>
    </>
  );
}
