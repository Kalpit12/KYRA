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
    roughness: 0.14,
    metalness: 0.1,
    clearcoat: 0.72,
    clearcoatRoughness: 0.12,
    envMapIntensity: 0.95,
  },
  satin: {
    roughness: 0.38,
    metalness: 0.12,
    clearcoat: 0.5,
    clearcoatRoughness: 0.22,
    envMapIntensity: 1.2,
  },
  matte: {
    roughness: 0.82,
    metalness: 0.05,
    clearcoat: 0.08,
    clearcoatRoughness: 0.72,
    envMapIntensity: 0.85,
  },
  carbon: {
    roughness: 0.34,
    metalness: 0.24,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.15,
  },
};

export function hexToThreeColor(hex: string): string {
  return hex.startsWith("#") ? hex : `#${hex}`;
}
