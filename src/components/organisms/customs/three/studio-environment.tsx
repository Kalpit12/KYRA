"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";

const WALL = "#f4f4f6";
const CEILING = "#f8f8f9";
const FLOOR = "#efeff1";

function cssFontFamily(variable: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.body).getPropertyValue(variable).trim();
  return value || fallback;
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number
) {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + tracking;
  }
}

function lockupAspect(texture: THREE.Texture) {
  const image = texture.image as { width?: number; height?: number } | undefined;
  if (!image?.width || !image?.height) return 2048 / 520;
  return image.width / image.height;
}

async function createHeaderLockupTexture() {
  const logo = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load KYRA Customs logo"));
    image.src = "/kyra-customs-logo.jpg";
  });

  await document.fonts.ready;
  const syne = cssFontFamily("--font-syne", "Syne");
  const plex = cssFontFamily("--font-plex", "IBM Plex Mono");
  const titleSize = 132;
  const tagSize = 26;
  const badge = 340;
  const gap = 52;
  const padX = 40;
  const padY = 36;

  await Promise.all([
    document.fonts.load(`800 ${titleSize}px ${syne}`),
    document.fonts.load(`500 ${tagSize}px ${plex}`),
  ]);

  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) return null;

  measure.font = `800 ${titleSize}px ${syne}, sans-serif`;
  const kyraWidth = measure.measureText("Kyra ").width;
  const customsWidth = measure.measureText("Customs").width;
  const textWidth = kyraWidth + customsWidth;

  measure.font = `500 ${tagSize}px ${plex}, monospace`;
  let tagWidth = 0;
  for (const char of "DIVINE ELEGANCE") {
    tagWidth += measure.measureText(char).width + 7;
  }

  const contentWidth = badge + gap + Math.max(textWidth, tagWidth);
  const width = Math.ceil(contentWidth + padX * 2);
  const height = Math.ceil(badge + padY * 2);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, width, height);

  const badgeX = padX;
  const badgeY = (height - badge) / 2;
  const radius = 16;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badge, badge, radius);
  ctx.clip();
  ctx.fillStyle = "#000000";
  ctx.fillRect(badgeX, badgeY, badge, badge);
  ctx.drawImage(logo, badgeX, badgeY, badge, badge);
  ctx.restore();

  const textX = badgeX + badge + gap;
  const titleY = badgeY + badge * 0.58;
  const tagY = badgeY + badge * 0.82;

  ctx.textBaseline = "alphabetic";
  ctx.font = `800 ${titleSize}px ${syne}, sans-serif`;
  ctx.fillStyle = "#121214";
  ctx.fillText("Kyra ", textX, titleY);
  ctx.fillStyle = "#e2131f";
  ctx.fillText("Customs", textX + kyraWidth, titleY);

  ctx.font = `500 ${tagSize}px ${plex}, monospace`;
  ctx.fillStyle = "#6b6b70";
  drawTracked(ctx, "DIVINE ELEGANCE", textX, tagY, 7);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
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

export function StudioEnvironment({ receiveShadow = true }: { receiveShadow?: boolean }) {
  const [lockup, setLockup] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    let disposed = false;
    let texture: THREE.Texture | null = null;

    void createHeaderLockupTexture()
      .then((next) => {
        if (disposed) {
          next?.dispose();
          return;
        }
        texture = next;
        setLockup(next);
      })
      .catch(() => {
        if (!disposed) setLockup(null);
      });

    return () => {
      disposed = true;
      texture?.dispose();
    };
  }, []);

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

      {lockup && (
        <>
          <KyraWallLockup texture={lockup} position={[0, 4.35, -15.92]} width={10.2} />
          <KyraWallLockup
            texture={lockup}
            position={[-15.92, 3.9, -1.4]}
            rotation={[0, Math.PI / 2, 0]}
            width={7.4}
          />
          <KyraWallLockup
            texture={lockup}
            position={[15.92, 3.9, -1.4]}
            rotation={[0, -Math.PI / 2, 0]}
            width={7.4}
          />
        </>
      )}

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
