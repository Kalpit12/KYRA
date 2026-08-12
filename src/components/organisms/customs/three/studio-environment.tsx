"use client";

import { useEffect, useState } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import {
  getCachedStudioLockupTexture,
  getStudioLockupTexture,
} from "@/lib/simulator/studio-lockup";

const WALL = "#f4f4f6";
const CEILING = "#f8f8f9";
const FLOOR = "#efeff1";
const LOGO_SRC = "/kyra-customs-logo.jpg";

function lockupAspect(texture: THREE.Texture) {
  const image = texture.image as { width?: number; height?: number } | undefined;
  if (!image?.width || !image?.height) return 2048 / 520;
  return image.width / image.height;
}

function KyraWallLockup({
  texture,
  position,
  rotation,
  width = 9.6,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
}) {
  const aspect = lockupAspect(texture);
  const height = width / aspect;

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        toneMapped={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CeilingSoftbox({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: [number, number, number];
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={scale} />
      <meshBasicMaterial color="#ffffff" />
    </mesh>
  );
}

function StudioWallBranding() {
  const logoTexture = useTexture(LOGO_SRC);
  const [lockup, setLockup] = useState<THREE.Texture | null>(() =>
    getCachedStudioLockupTexture()
  );

  useEffect(() => {
    if (lockup) return;
    let active = true;
    void getStudioLockupTexture().then((texture) => {
      if (active && texture) setLockup(texture);
    });
    return () => {
      active = false;
    };
  }, [lockup]);

  const texture = lockup ?? logoTexture;
  const backWidth = lockup ? 10.2 : 4.2;
  const sideWidth = lockup ? 7.4 : 3.2;

  return (
    <>
      <KyraWallLockup texture={texture} position={[0, 4.35, -15.92]} width={backWidth} />
      <KyraWallLockup
        texture={texture}
        position={[-15.92, 3.9, -1.4]}
        rotation={[0, Math.PI / 2, 0]}
        width={sideWidth}
      />
      <KyraWallLockup
        texture={texture}
        position={[15.92, 3.9, -1.4]}
        rotation={[0, -Math.PI / 2, 0]}
        width={sideWidth}
      />
    </>
  );
}

export function StudioEnvironment({ receiveShadow = true }: { receiveShadow?: boolean }) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow={receiveShadow}>
        <planeGeometry args={[56, 56]} />
        <meshStandardMaterial color={FLOOR} roughness={0.94} metalness={0} />
      </mesh>
      <mesh position={[0, 6, -16]} receiveShadow={receiveShadow}>
        <planeGeometry args={[56, 12]} />
        <meshStandardMaterial color={WALL} roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[-16, 6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow={receiveShadow}>
        <planeGeometry args={[32, 12]} />
        <meshStandardMaterial color={WALL} roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[16, 6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow={receiveShadow}>
        <planeGeometry args={[32, 12]} />
        <meshStandardMaterial color={WALL} roughness={0.92} metalness={0} />
      </mesh>
      <mesh position={[0, 12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[56, 56]} />
        <meshStandardMaterial color={CEILING} roughness={1} metalness={0} />
      </mesh>

      <StudioWallBranding />

      <CeilingSoftbox position={[0, 11.9, -3]} scale={[14, 0.05, 1.1]} />
      <CeilingSoftbox position={[0, 11.9, 0]} scale={[14, 0.05, 1.1]} />
      <CeilingSoftbox position={[0, 11.9, 3.2]} scale={[14, 0.05, 1.1]} />
      <CeilingSoftbox position={[-5.2, 11.9, 0]} scale={[1.1, 0.05, 10]} />
      <CeilingSoftbox position={[5.2, 11.9, 0]} scale={[1.1, 0.05, 10]} />

      <group position={[0, 0.03, 0]}>
        <mesh receiveShadow={receiveShadow}>
          <cylinderGeometry args={[4.05, 4.05, 0.06, 72]} />
          <meshStandardMaterial color="#3c4046" metalness={0.82} roughness={0.32} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.032, 0]}>
          <ringGeometry args={[3.72, 3.92, 72]} />
          <meshStandardMaterial color="#8b9098" metalness={0.88} roughness={0.22} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.033, 0]}>
          <ringGeometry args={[2.35, 2.48, 72]} />
          <meshStandardMaterial color="#6a7078" metalness={0.86} roughness={0.26} />
        </mesh>
      </group>
    </group>
  );
}

useTexture.preload(LOGO_SRC);
