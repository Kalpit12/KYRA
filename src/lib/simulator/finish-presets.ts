import type { WrapFinishId } from "@/lib/data/simulator";

export interface FinishPreset {
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  envMapIntensity: number;
  sheen: number;
  sheenRoughness: number;
}

/** Vinyl wrap PBR — same values as Phantom Wrap's workshop. */
export const finishPresets: Record<WrapFinishId, FinishPreset> = {
  gloss: {
    roughness: 0.08,
    metalness: 0.12,
    clearcoat: 1,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.35,
    sheen: 0,
    sheenRoughness: 0.25,
  },
  satin: {
    roughness: 0.42,
    metalness: 0.1,
    clearcoat: 0.42,
    clearcoatRoughness: 0.34,
    envMapIntensity: 1.3,
    sheen: 0,
    sheenRoughness: 0.5,
  },
  matte: {
    roughness: 0.88,
    metalness: 0.04,
    clearcoat: 0.05,
    clearcoatRoughness: 0.9,
    envMapIntensity: 0.95,
    sheen: 0,
    sheenRoughness: 0.9,
  },
  carbon: {
    roughness: 0.32,
    metalness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.15,
    sheen: 0.12,
    sheenRoughness: 0.4,
  },
};

export function hexToThreeColor(hex: string): string {
  return hex.startsWith("#") ? hex : `#${hex}`;
}
