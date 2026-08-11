"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { finishPresets, hexToThreeColor } from "@/lib/simulator/finish-presets";
import { getCarbonTextures } from "@/lib/simulator/carbon-texture";
import {
  isBodyMaterial,
  isBodyMesh,
  isBrakeMaterial,
  isGlassMesh,
  isLampCoverGlassMesh,
  isLensGlassMaterial,
  isLightMaterial,
  isWindowGlassMaterial,
  normalizeModel,
} from "@/lib/simulator/mesh-utils";
import type { WrapFinishId, WrapOption, WindowFilm } from "@/lib/data/simulator";

interface CarModelProps {
  modelPath: string;
  modelScale?: number;
  wrap: WrapOption;
  finish: WrapFinishId;
  tint: WindowFilm;
  enableShadows?: boolean;
  /** Skip expensive MeshPhysical transmission (hero preview) */
  liteMaterials?: boolean;
}

/** Phantom-style physical window glass from film preset */
function createWindowGlassMaterial(tint: WindowFilm, lite = false) {
  if (lite) {
    return new THREE.MeshStandardMaterial({
      name: `WindowTint:${tint.id}`,
      color: new THREE.Color(tint.overlayColor),
      metalness: 0.05,
      roughness: Math.max(tint.roughness, 0.12),
      transparent: true,
      opacity: Math.min(0.92, 0.35 + tint.overlayOpacity * 0.9),
      envMapIntensity: 0.8,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    name: `WindowTint:${tint.id}`,
    color: new THREE.Color(tint.overlayColor),
    metalness: 0,
    roughness: tint.roughness,
    transmission: tint.transmission,
    thickness: tint.thickness,
    ior: 1.45,
    transparent: true,
    opacity: 1,
    attenuationColor: new THREE.Color(tint.overlayColor),
    attenuationDistance: tint.attenuationDistance,
    envMapIntensity: 1.35,
    specularIntensity: 1,
  });
}

/** Clear / colored lamp lenses — never receive dark cabin tint */
function createLensGlassMaterial(source: THREE.Material, lite = false) {
  const name = (source.name || "").toLowerCase();
  // Only GlassRed / *red* materials get red lenses — never GlassBlack covers
  const isRed = name.includes("red") && !name.includes("glassblack");
  const color = isRed ? "#ff1a1a" : "#e8eef5";
  const emissive = isRed ? "#ff2200" : "#000000";

  if (lite) {
    return new THREE.MeshStandardMaterial({
      name: source.name || "LensGlass",
      color: new THREE.Color(color),
      metalness: 0.15,
      roughness: 0.18,
      transparent: true,
      opacity: isRed ? 0.7 : 0.35,
      emissive: new THREE.Color(emissive),
      emissiveIntensity: isRed ? 0.25 : 0,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    name: source.name || "LensGlass",
    color: new THREE.Color(color),
    metalness: 0,
    roughness: 0.06,
    transmission: isRed ? 0.5 : 0.92,
    thickness: 0.01,
    ior: 1.5,
    transparent: true,
    opacity: 1,
    attenuationColor: new THREE.Color(isRed ? "#ff1a1a" : "#ffffff"),
    attenuationDistance: isRed ? 0.5 : 4,
    emissive: new THREE.Color(emissive),
    emissiveIntensity: isRed ? 0.3 : 0,
    envMapIntensity: 1.35,
  });
}

/** Headlight / taillight emitters — parked “off” look (reflector, not lit) */
function enhanceLightMaterial(source: THREE.Material) {
  const mat = source.clone() as THREE.MeshStandardMaterial;
  const name = (source.name || "").toLowerCase();
  const isRed = name.includes("red");

  if (!mat.emissive) {
    mat.emissive = new THREE.Color("#000000");
  }

  if (isRed) {
    // Soft parked taillight plastic — not glowing
    mat.color = new THREE.Color("#5a1010");
    mat.emissive.set("#1a0505");
    mat.emissiveIntensity = 0.08;
    mat.roughness = Math.min(mat.roughness ?? 1, 0.45);
    mat.metalness = Math.min(mat.metalness ?? 0, 0.2);
  } else {
    // Chrome / silver reflector cup — headlights off
    mat.color = new THREE.Color("#c8d0da");
    mat.emissive.set("#000000");
    mat.emissiveIntensity = 0;
    mat.roughness = Math.min(mat.roughness ?? 1, 0.28);
    mat.metalness = Math.max(mat.metalness ?? 0, 0.75);
    mat.envMapIntensity = 1.6;
  }

  mat.toneMapped = true;
  mat.needsUpdate = true;
  return mat;
}

function enhanceBrakeMaterial(source: THREE.Material) {
  const mat = source.clone() as THREE.MeshStandardMaterial;
  // Keep original albedo/maps; lift metal response so discs/calipers read in studio light
  mat.metalness = Math.max(mat.metalness ?? 0, 0.65);
  mat.roughness = Math.min(mat.roughness ?? 1, 0.38);
  mat.envMapIntensity = 1.35;
  return mat;
}

/** Lift near-black carbon tints so weave map * color still reads as fibre */
function carbonTintColor(hex: string) {
  const c = new THREE.Color(hexToThreeColor(hex));
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  // Keep hue/sat; floor lightness so multiply doesn't flatten the weave
  c.setHSL(hsl.h, Math.min(1, hsl.s * 1.15), Math.max(0.42, Math.min(0.72, hsl.l * 2.4 + 0.28)));
  return c;
}

function createBodyMaterial(
  wrap: WrapOption,
  finish: WrapFinishId,
  primaryColor: string,
  secondaryColor: string
) {
  const preset = finishPresets[finish];
  const isCarbon = finish === "carbon" || wrap.category === "carbon";

  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(hexToThreeColor(primaryColor)),
    metalness: preset.metalness,
    roughness: preset.roughness,
    clearcoat: preset.clearcoat,
    clearcoatRoughness: preset.clearcoatRoughness,
    envMapIntensity: preset.envMapIntensity,
  });

  if (wrap.colors.length > 1) {
    bodyMat.color.lerp(new THREE.Color(hexToThreeColor(secondaryColor)), 0.35);
  }

  if (isCarbon) {
    const forged = wrap.id.includes("forged");
    const { map, normalMap, roughnessMap } = getCarbonTextures(
      forged ? "forged" : "twill"
    );

    bodyMat.map = map;
    bodyMat.normalMap = normalMap;
    bodyMat.normalScale = new THREE.Vector2(1.15, 1.15);
    bodyMat.roughnessMap = roughnessMap;
    bodyMat.metalness = finishPresets.carbon.metalness;
    bodyMat.roughness = finishPresets.carbon.roughness;
    bodyMat.clearcoat = finishPresets.carbon.clearcoat;
    bodyMat.clearcoatRoughness = finishPresets.carbon.clearcoatRoughness;
    bodyMat.envMapIntensity = finishPresets.carbon.envMapIntensity;
    // Tint weave (lifted) — map carries fibre contrast; clearcoat adds resin gloss
    bodyMat.color = carbonTintColor(primaryColor);
    if (wrap.colors.length > 1) {
      bodyMat.color.lerp(carbonTintColor(secondaryColor), 0.25);
    }
  }

  return bodyMat;
}
export function CarModel({
  modelPath,
  modelScale,
  wrap,
  finish,
  tint,
  enableShadows = true,
  liteMaterials = false,
}: CarModelProps) {
  const { scene } = useGLTF(modelPath, true);
  const primaryColor = wrap.colors[0];
  const secondaryColor = wrap.colors[1] ?? wrap.colors[0];

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    const bodyMat = createBodyMaterial(wrap, finish, primaryColor, secondaryColor);
    const windowGlassMat = createWindowGlassMaterial(tint, liteMaterials);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      // Heavy studio meshes: skip casting shadows from tiny trim to cut draw cost
      child.castShadow = false;
      child.receiveShadow = enableShadows;
      child.frustumCulled = true;

      const sourceMats = Array.isArray(child.material) ? child.material : [child.material];
      const nextMats = sourceMats.map((mat) => {
        if (!mat) return mat;

        // Sedan quirk: GlassBlack on thin lamp covers → clear lens (not cabin tint / not red)
        if (isLampCoverGlassMesh(child, mat)) {
          return createLensGlassMaterial(mat, liteMaterials);
        }

        if (isWindowGlassMaterial(mat)) return windowGlassMat;
        if (isLensGlassMaterial(mat)) return createLensGlassMaterial(mat, liteMaterials);
        if (isLightMaterial(mat)) return enhanceLightMaterial(mat);
        if (isBrakeMaterial(mat)) return enhanceBrakeMaterial(mat);
        if (isBodyMaterial(mat)) return bodyMat;

        return mat;
      });

      const replacedByMaterial = nextMats.some((mat, i) => mat !== sourceMats[i]);

      if (replacedByMaterial) {
        child.material = nextMats.length === 1 ? nextMats[0] : nextMats;
        if (enableShadows && nextMats.some((mat) => mat === bodyMat)) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
        if (nextMats.some((mat) => mat === windowGlassMat || (mat && isLensGlassMaterial(mat)))) {
          child.castShadow = false;
        }
        return;
      }

      if (sourceMats.length === 1 && isGlassMesh(child)) {
        child.material = windowGlassMat;
        child.castShadow = false;
        return;
      }

      if (sourceMats.length === 1 && isBodyMesh(child)) {
        child.material = bodyMat;
        if (enableShadows) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      }
    });

    normalizeModel(clone, 4.2 * (modelScale ?? 1));
    clone.position.set(0, 0, 0);
    return clone;
  }, [
    scene,
    wrap,
    finish,
    tint,
    primaryColor,
    secondaryColor,
    modelScale,
    enableShadows,
    liteMaterials,
  ]);

  return <primitive object={clonedScene} />;
}
