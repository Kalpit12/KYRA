"use client";

import { Environment } from "@react-three/drei";

export function StudioLights({ preview = false }: { preview?: boolean }) {
  if (preview) {
    return (
      <>
        <ambientLight intensity={0.85} />
        <hemisphereLight args={["#ffffff", "#d5d5da", 0.8]} />
        <directionalLight position={[4, 8, 4]} intensity={1.05} />
        <Environment preset="warehouse" environmentIntensity={0.55} />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.32} />
      <hemisphereLight args={["#ffffff", "#c9c9ce", 0.42]} />

      <Environment
        preset="warehouse"
        resolution={256}
        environmentIntensity={0.62}
      />

      <directionalLight
        position={[3.8, 10, 5]}
        intensity={0.62}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-radius={2}
        shadow-camera-near={1}
        shadow-camera-far={28}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.0002}
      />
    </>
  );
}
