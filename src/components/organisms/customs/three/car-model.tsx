"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { DRACO_DECODER_PATH } from "@/lib/simulator/draco";
import { finishPresets, hexToThreeColor } from "@/lib/simulator/finish-presets";
import { getCarbonTextures } from "@/lib/simulator/carbon-texture";
import {
  classifyGlassBlackMeshes,
  isBodyMaterial,
  isBodyMesh,
  isGlassMesh,
  isLensGlassMaterial,
  isWindowGlassMaterial,
  normalizeModel,
  sanitizeWorkshopModel,
  sharpenMaterialTextures,
  sharpenSceneTextures,
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

/**
 * Cabin glass: FrontSide + opacity (no transmission). Transmission + double-sided
 * glass refracts interior lights into magenta/cyan blobs and a second windshield.
 */
function createWindowGlassMaterial(tint: WindowFilm, lite = false) {
  const film = new THREE.Color(tint.overlayColor);
  const vlt = THREE.MathUtils.clamp(tint.transmission, 0, 1);
  const glassColor = new THREE.Color("#eef3f8").lerp(film, 1 - vlt);
  const opacity = THREE.MathUtils.clamp(0.16 + (1 - vlt) * 0.62, 0.16, 0.78);

  if (lite) {
    return new THREE.MeshStandardMaterial({
      name: `WindowTint:${tint.id}`,
      color: glassColor,
      metalness: 0,
      roughness: Math.max(tint.roughness, 0.1),
      transparent: true,
      opacity,
      envMapIntensity: 0.28,
      depthWrite: true,
      side: THREE.FrontSide,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    name: `WindowTint:${tint.id}`,
    color: glassColor,
    metalness: 0,
    roughness: Math.max(0.06, tint.roughness),
    transmission: 0,
    transparent: true,
    opacity,
    envMapIntensity: 0.32,
    specularIntensity: 0.25,
    depthWrite: true,
    side: THREE.FrontSide,
  });
}

/** Clear headlamp / red tail covers — never cabin tint */
function createLensGlassMaterial(source: THREE.Material) {
  const name = (source.name || "").toLowerCase();
  const isRed = name.includes("red") && !name.includes("glassblack");

  return new THREE.MeshPhysicalMaterial({
    name: isRed ? source.name || "GlassRed" : "GlassWhite",
    color: new THREE.Color(isRed ? "#ff2a2a" : "#f2f6fb"),
    metalness: 0,
    roughness: isRed ? 0.08 : 0.04,
    transmission: isRed ? 0.55 : 0.92,
    thickness: 0.012,
    ior: 1.5,
    transparent: true,
    opacity: 1,
    attenuationColor: new THREE.Color(isRed ? "#ff1a1a" : "#ffffff"),
    attenuationDistance: isRed ? 0.55 : 4,
    envMapIntensity: 1.25,
    depthWrite: false,
    side: THREE.FrontSide,
  });
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

/** Keep factory maps / clearcoat / IOR; only retint for the chosen wrap. */
function createBodyMaterial(
  source: THREE.Material | undefined,
  wrap: WrapOption,
  finish: WrapFinishId,
  primaryColor: string,
  secondaryColor: string
) {
  const preset = finishPresets[finish];
  const isCarbon = finish === "carbon" || wrap.category === "carbon";
  const from =
    source instanceof THREE.MeshPhysicalMaterial
      ? source.clone()
      : source instanceof THREE.MeshStandardMaterial
        ? new THREE.MeshPhysicalMaterial({
            map: source.map,
            normalMap: source.normalMap,
            roughnessMap: source.roughnessMap,
            metalnessMap: source.metalnessMap,
            aoMap: source.aoMap,
            emissiveMap: source.emissiveMap,
            normalScale: source.normalScale?.clone(),
            side: source.side,
          })
        : new THREE.MeshPhysicalMaterial();

  from.name = source?.name || "CarPaint";
  from.side = THREE.FrontSide;
  from.polygonOffset = true;
  from.polygonOffsetFactor = 1;
  from.polygonOffsetUnits = 1;
  from.color = new THREE.Color(hexToThreeColor(primaryColor));
  from.metalness = preset.metalness;
  from.roughness = preset.roughness;
  from.clearcoat = preset.clearcoat;
  from.clearcoatRoughness = preset.clearcoatRoughness;
  from.envMapIntensity = preset.envMapIntensity;
  from.ior = 1.45;
  from.specularIntensity = 1;

  if (wrap.colors.length > 1) {
    from.color.lerp(new THREE.Color(hexToThreeColor(secondaryColor)), 0.35);
  }

  if (isCarbon) {
    const forged = wrap.id.includes("forged");
    const { map, normalMap, roughnessMap } = getCarbonTextures(
      forged ? "forged" : "twill"
    );

    from.map = map;
    from.normalMap = normalMap;
    from.normalScale = new THREE.Vector2(1.15, 1.15);
    from.roughnessMap = roughnessMap;
    from.metalness = finishPresets.carbon.metalness;
    from.roughness = finishPresets.carbon.roughness;
    from.clearcoat = finishPresets.carbon.clearcoat;
    from.clearcoatRoughness = finishPresets.carbon.clearcoatRoughness;
    from.envMapIntensity = finishPresets.carbon.envMapIntensity;
    from.color = carbonTintColor(primaryColor);
    if (wrap.colors.length > 1) {
      from.color.lerp(carbonTintColor(secondaryColor), 0.25);
    }
  }

  from.needsUpdate = true;
  return from;
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
  useGLTF.setDecoderPath(DRACO_DECODER_PATH);
  const { scene } = useGLTF(modelPath, DRACO_DECODER_PATH);
  const anisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());
  const primaryColor = wrap.colors[0];
  const secondaryColor = wrap.colors[1] ?? wrap.colors[0];

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    sharpenSceneTextures(clone, anisotropy);

    let paintSource: THREE.Material | undefined;
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      paintSource ??= mats.find((mat) => mat && isBodyMaterial(mat));
    });

    const { lamps: lampMeshes } = classifyGlassBlackMeshes(clone);
    const bodyMat = createBodyMaterial(
      paintSource,
      wrap,
      finish,
      primaryColor,
      secondaryColor
    );
    sharpenMaterialTextures(bodyMat, anisotropy);
    const windowGlassMat = createWindowGlassMaterial(tint, liteMaterials);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = false;
      child.receiveShadow = enableShadows;
      child.frustumCulled = true;

      const sourceMats = Array.isArray(child.material) ? child.material : [child.material];
      const isLampMesh = lampMeshes.has(child);
      const nextMats = sourceMats.map((mat) => {
        if (!mat) return mat;
        if (isLampMesh || isLensGlassMaterial(mat)) {
          return createLensGlassMaterial(mat);
        }
        if (isWindowGlassMaterial(mat)) return windowGlassMat;
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
        if (isLampMesh || nextMats.some((mat) => mat === windowGlassMat)) {
          child.castShadow = false;
        }
        return;
      }

      if (sourceMats.length === 1 && isGlassMesh(child) && !isLampMesh) {
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

    sanitizeWorkshopModel(clone);
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
    anisotropy,
  ]);

  return <primitive object={clonedScene} />;
}
