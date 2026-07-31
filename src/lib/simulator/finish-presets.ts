import type { WrapFinishId } from "@/lib/data/simulator";

export interface FinishPreset {
  roughness: number;
  metalness: number;
  clearcoat: number;
  clearcoatRoughness: number;
  envMapIntensity: number;
}

export const finishPresets: Record<WrapFinishId, FinishPreset> = {
  gloss: {
    roughness: 0.08,
    metalness: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.9,
  },
  satin: {
    roughness: 0.42,
    metalness: 0.1,
    clearcoat: 0.42,
    clearcoatRoughness: 0.3,
    envMapIntensity: 1.3,
  },
  matte: {
    roughness: 0.88,
    metalness: 0.04,
    clearcoat: 0.05,
    clearcoatRoughness: 0.8,
    envMapIntensity: 0.95,
  },
  carbon: {
    roughness: 0.32,
    metalness: 0.28,
    clearcoat: 0.9,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.55,
  },
};

export function hexToThreeColor(hex: string): string {
  return hex.startsWith("#") ? hex : `#${hex}`;
}
