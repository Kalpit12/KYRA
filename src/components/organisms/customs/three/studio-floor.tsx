"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StudioFloorProps {
  animated?: boolean;
  receiveShadow?: boolean;
}

export function StudioFloor({ animated = true, receiveShadow = true }: StudioFloorProps) {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!animated || !ringRef.current) return;
    ringRef.current.rotation.z = state.clock.elapsedTime * 0.08;
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={receiveShadow}
        position={[0, 0, 0]}
      >
        <circleGeometry args={[8, animated ? 64 : 48]} />
        <meshStandardMaterial color="#151517" metalness={0.6} roughness={0.35} />
      </mesh>

      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[3.8, 4.1, animated ? 64 : 48]} />
        <meshBasicMaterial color="#e2131f" transparent opacity={0.35} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <ringGeometry args={[4.1, 4.12, animated ? 64 : 48]} />
        <meshBasicMaterial color="#e2131f" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
