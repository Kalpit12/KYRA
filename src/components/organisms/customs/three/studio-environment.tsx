"use client";

import { useEffect, useState } from "react";
import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  getCachedStudioLockupTexture,
  getStudioLockupTexture,
} from "@/lib/simulator/studio-lockup";

const WALL = "#16171c";
const CEILING = "#0f1013";
const FLOOR = "#121317";
const ACCENT = "#e2131f";
const LOGO_SRC = "/kyra-customs-logo.jpg";

export const STUDIO_PAD_TOP = 0;

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
      <meshStandardMaterial
        color="#1a1b20"
        emissive="#fff4e6"
        emissiveIntensity={1.65}
        roughness={1}
        metalness={0}
        envMapIntensity={0}
      />
    </mesh>
  );
}

function AccentStrip({
  position,
  rotation,
  size,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  size: [number, number];
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial
        color={ACCENT}
        emissive={ACCENT}
        emissiveIntensity={0.85}
        roughness={0.35}
        metalness={0.1}
        envMapIntensity={0}
      />
    </mesh>
  );
}

function StudioWallBranding() {
  const invalidate = useThree((state) => state.invalidate);
  const logoTexture = useTexture(LOGO_SRC);
  const [lockup, setLockup] = useState<THREE.Texture | null>(() =>
    getCachedStudioLockupTexture()
  );

  useEffect(() => {
    if (lockup) {
      invalidate();
      return;
    }
    let active = true;
    void getStudioLockupTexture().then((texture) => {
      if (active && texture) {
        setLockup(texture);
        invalidate();
      }
    });
    return () => {
      active = false;
    };
  }, [lockup, invalidate]);

  const texture = lockup ?? logoTexture;
  const backWidth = lockup ? 11.4 : 4.4;
  const sideWidth = lockup ? 7.6 : 3.2;

  return (
    <>
      <KyraWallLockup texture={texture} position={[0, 3.55, -13.92]} width={backWidth} />
      <KyraWallLockup
        texture={texture}
        position={[-13.92, 3.2, -1.6]}
        rotation={[0, Math.PI / 2, 0]}
        width={sideWidth}
      />
      <KyraWallLockup
        texture={texture}
        position={[13.92, 3.2, -1.6]}
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
        <planeGeometry args={[48, 48]} />
        <meshPhysicalMaterial
          color={FLOOR}
          roughness={0.22}
          metalness={0.18}
          clearcoat={0.55}
          clearcoatRoughness={0.18}
          envMapIntensity={0.55}
        />
      </mesh>

      <mesh position={[0, 4.1, -14]} receiveShadow={receiveShadow}>
        <planeGeometry args={[48, 8.2]} />
        <meshStandardMaterial color={WALL} roughness={0.88} metalness={0.04} envMapIntensity={0.12} />
      </mesh>
      <mesh position={[-14, 4.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow={receiveShadow}>
        <planeGeometry args={[28, 8.2]} />
        <meshStandardMaterial color={WALL} roughness={0.88} metalness={0.04} envMapIntensity={0.12} />
      </mesh>
      <mesh position={[14, 4.1, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow={receiveShadow}>
        <planeGeometry args={[28, 8.2]} />
        <meshStandardMaterial color={WALL} roughness={0.88} metalness={0.04} envMapIntensity={0.12} />
      </mesh>
      <mesh position={[0, 8.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[48, 48]} />
        <meshStandardMaterial color={CEILING} roughness={1} metalness={0} envMapIntensity={0} />
      </mesh>

      <AccentStrip position={[0, 0.06, -13.98]} size={[22, 0.045]} />
      <AccentStrip position={[0, 7.55, -13.98]} size={[22, 0.035]} />
      <AccentStrip
        position={[-13.98, 0.06, -1.4]}
        rotation={[0, Math.PI / 2, 0]}
        size={[16, 0.045]}
      />
      <AccentStrip
        position={[13.98, 0.06, -1.4]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[16, 0.045]}
      />

      <StudioWallBranding />

      <CeilingSoftbox position={[0, 8.12, -3.2]} scale={[13, 0.06, 0.95]} />
      <CeilingSoftbox position={[0, 8.12, 0.2]} scale={[13, 0.06, 0.95]} />
      <CeilingSoftbox position={[0, 8.12, 3.4]} scale={[13, 0.06, 0.95]} />
      <CeilingSoftbox position={[-4.8, 8.12, 0.2]} scale={[0.85, 0.06, 9.5]} />
      <CeilingSoftbox position={[4.8, 8.12, 0.2]} scale={[0.85, 0.06, 9.5]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, -0.55]}>
        <ringGeometry args={[3.92, 4.08, 96]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={0.55}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, -0.55]}>
        <ringGeometry args={[2.18, 2.26, 96]} />
        <meshStandardMaterial color="#2a2c32" roughness={0.5} metalness={0.25} />
      </mesh>
    </group>
  );
}

useTexture.preload(LOGO_SRC);
