"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { finishPresets, hexToThreeColor } from "@/lib/simulator/finish-presets";
import { getCarbonWeaveTexture } from "@/lib/simulator/carbon-texture";
import {
  isBodyMaterial,
  isBodyMesh,
  isBrakeMaterial,
  isGlassMesh,
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
  const isRed = name.includes("red");
  const color = isRed ? "#ff1a1a" : "#f2f6fb";
  const emissive = isRed ? "#ff2200" : "#ffffff";

  if (lite) {
    return new THREE.MeshStandardMaterial({
      name: source.name || "LensGlass",
      color: new THREE.Color(color),
      metalness: 0.1,
      roughness: 0.2,
      transparent: true,
      opacity: isRed ? 0.65 : 0.45,
      emissive: new THREE.Color(emissive),
      emissiveIntensity: isRed ? 0.4 : 0.25,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    name: source.name || "LensGlass",
    color: new THREE.Color(color),
    metalness: 0,
    roughness: 0.08,
    transmission: isRed ? 0.55 : 0.88,
    thickness: 0.012,
    ior: 1.5,
    transparent: true,
    opacity: 1,
    attenuationColor: new THREE.Color(color),
    attenuationDistance: isRed ? 0.45 : 2.4,
    emissive: new THREE.Color(emissive),
    emissiveIntensity: isRed ? 0.55 : 0.35,
    envMapIntensity: 1.2,
  });
}

function enhanceLightMaterial(source: THREE.Material) {
  const mat = source.clone() as THREE.MeshStandardMaterial;
  if (!mat.emissive) {
    mat.emissive = new THREE.Color("#ffffff");
  }
  const name = (source.name || "").toLowerCase();
  if (name.includes("red")) {
    mat.emissive.set("#ff1a00");
    mat.emissiveIntensity = Math.max(mat.emissiveIntensity || 0, 2.2);
  } else {
    if (mat.emissive.getHex() === 0) mat.emissive.set("#ffffff");
    mat.emissiveIntensity = Math.max(mat.emissiveIntensity || 0, 4.5);
  }
  mat.toneMapped = true;
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
    const weave = getCarbonWeaveTexture();
    bodyMat.map = weave;
    bodyMat.roughnessMap = weave;
    bodyMat.metalness = finishPresets.carbon.metalness;
    bodyMat.roughness = finishPresets.carbon.roughness;
    bodyMat.clearcoat = finishPresets.carbon.clearcoat;
    bodyMat.clearcoatRoughness = finishPresets.carbon.clearcoatRoughness;
    bodyMat.envMapIntensity = finishPresets.carbon.envMapIntensity;
    // Tint the weave with the selected wrap colour (exposed carbon stays near-black)
    bodyMat.color = new THREE.Color(hexToThreeColor(primaryColor));
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
  const { scene } = useGLTF(modelPath);
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
