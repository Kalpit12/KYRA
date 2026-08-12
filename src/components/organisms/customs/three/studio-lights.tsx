"use client";

import { Environment, Lightformer } from "@react-three/drei";

export function StudioLights({ preview = false }: { preview?: boolean }) {
  if (preview) {
    return (
      <>
        <ambientLight intensity={0.85} />
        <hemisphereLight args={["#ffffff", "#d5d5da", 0.8]} />
        <directionalLight position={[4, 8, 4]} intensity={1.05} />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={0.22} />
      <hemisphereLight args={["#ffffff", "#c9c9ce", 0.38]} />

      <Environment frames={1} resolution={256} environmentIntensity={0.78}>
        <Lightformer
          intensity={1.45}
          rotation-x={Math.PI / 2}
          position={[0, 8, 0]}
          scale={[20, 20, 1]}
        />
        <Lightformer
          intensity={1.2}
          rotation-x={Math.PI / 2}
          position={[0, 8, -3]}
          scale={[14, 1.15, 1]}
        />
        <Lightformer
          intensity={1.2}
          rotation-x={Math.PI / 2}
          position={[0, 8, 0]}
          scale={[14, 1.15, 1]}
        />
        <Lightformer
          intensity={1.2}
          rotation-x={Math.PI / 2}
          position={[0, 8, 3.2]}
          scale={[14, 1.15, 1]}
        />
        <Lightformer intensity={1.9} position={[0, 2.4, 7.2]} scale={[12, 5.5, 1]} />
        <Lightformer
          intensity={1.15}
          position={[6.8, 3.4, 2.2]}
          rotation-y={-Math.PI / 3.2}
          scale={[6, 9, 1]}
        />
        <Lightformer
          intensity={0.62}
          position={[-6.8, 2.9, 2.2]}
          rotation-y={Math.PI / 3.2}
          scale={[6, 8, 1]}
          color="#f2f4ff"
        />
        <Lightformer
          intensity={0.42}
          position={[0, 3.2, -8.5]}
          scale={[18, 9, 1]}
          color="#fff6f1"
        />
      </Environment>

      <directionalLight
        position={[3.8, 10, 5]}
        intensity={0.28}
        castShadow
        shadow-mapSize={[1024, 1024]}
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
