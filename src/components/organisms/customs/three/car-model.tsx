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
  normalizeModel,
  sanitizeWorkshopModel,
  sharpenMaterialTextures,
  sharpenSceneTextures,
} from "@/lib/simulator/mesh-utils";
import {
  collectLensMeshes,
  collectWindowMeshes,
  collectWrapMeshes,
} from "@/lib/simulator/wrap-targeting";
import type {
  VehicleTypeId,
  WrapFinishId,
  WrapOption,
  WindowFilm,
} from "@/lib/data/simulator";

interface CarModelProps {
  modelPath: string;
  modelScale?: number;
  vehicleTypeId?: VehicleTypeId;
  wrap: WrapOption;
  finish: WrapFinishId;
  tint: WindowFilm;
  enableShadows?: boolean;
  liteMaterials?: boolean;
}

const CAR_OFFSET: [number, number, number] = [0, 0, -0.55];
const WORKSHOP_SIZE = 5.8;

function carbonTintColor(hex: string) {
  const c = new THREE.Color(hexToThreeColor(hex));
  const hsl = { h: 0, s: 0, l: 0 };
  c.getHSL(hsl);
  c.setHSL(hsl.h, Math.min(1, hsl.s * 1.15), Math.max(0.42, Math.min(0.72, hsl.l * 2.4 + 0.28)));
  return c;
}

function createWrapMaterial(wrap: WrapOption, finish: WrapFinishId, primary: THREE.Color) {
  const preset = finishPresets[finish];
  const ppf = wrap.ppfType && wrap.ppfType !== "none";
  const material = new THREE.MeshPhysicalMaterial({
    name: "CarPaint",
    color: primary,
    roughness: Math.max(0.04, preset.roughness - (ppf ? 0.06 : 0)),
    metalness: Math.min(0.35, preset.metalness),
    clearcoat: Math.min(1, preset.clearcoat + (wrap.ppfType === "clear" ? 0.15 : ppf ? 0.1 : 0)),
    clearcoatRoughness: Math.max(0.02, preset.clearcoatRoughness * (ppf ? 0.75 : 1)),
    envMapIntensity: Math.min(1.45, preset.envMapIntensity),
    ior: 1.5,
    specularIntensity: 1,
    side: THREE.FrontSide,
    transparent: false,
    opacity: 1,
  });

  if (finish === "carbon" || wrap.category === "carbon") {
    const forged = wrap.id.includes("forged");
    const { map, normalMap, roughnessMap } = getCarbonTextures(forged ? "forged" : "twill");
    material.map = map;
    material.normalMap = normalMap;
    material.normalScale = new THREE.Vector2(1.15, 1.15);
    material.roughnessMap = roughnessMap;
    material.metalness = finishPresets.carbon.metalness;
    material.roughness = finishPresets.carbon.roughness;
    material.clearcoat = finishPresets.carbon.clearcoat;
    material.clearcoatRoughness = finishPresets.carbon.clearcoatRoughness;
    material.envMapIntensity = finishPresets.carbon.envMapIntensity;
    material.color = carbonTintColor(wrap.colors[0]);
    if (wrap.colors[1]) {
      material.color.lerp(carbonTintColor(wrap.colors[1]), 0.25);
    }
  }

  return material;
}

/** Cabin film without transmission — Hum3D GlassBlack is opaque white until replaced. */
function createWindowFilmMaterial(tint: WindowFilm, lite = false) {
  const vlt = THREE.MathUtils.clamp(tint.transmission, 0, 1);
  const color = new THREE.Color("#cfd8e2").lerp(new THREE.Color(tint.overlayColor), 1 - vlt);
  const opacity = THREE.MathUtils.clamp(0.1 + (1 - vlt) * 0.72, 0.1, 0.84);

  if (lite) {
    return new THREE.MeshStandardMaterial({
      name: `WindowTint:${tint.id}`,
      color,
      metalness: 0,
      roughness: 0.08,
      transparent: true,
      opacity,
      envMapIntensity: 0.45,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    name: `WindowTint:${tint.id}`,
    color,
    metalness: 0,
    roughness: 0.06,
    transmission: 0,
    transparent: true,
    opacity,
    envMapIntensity: 0.7,
    ior: 1.45,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}

function createLensGlassMaterial(source: THREE.Material) {
  const name = (source.name || "").toLowerCase();
  const compact = name.replace(/[_\-.\s]/g, "");
  const isRed =
    compact === "rglass" ||
    compact === "dred" ||
    (name.includes("red") && !name.includes("glassblack"));
  const isAmber = compact === "oglass" || name.includes("orange");

  return new THREE.MeshPhysicalMaterial({
    name: isRed ? "GlassRed" : isAmber ? "GlassAmber" : "GlassWhite",
    color: new THREE.Color(isRed ? "#ff2a2a" : isAmber ? "#ff7a18" : "#f2f6fb"),
    metalness: 0,
    roughness: isRed || isAmber ? 0.1 : 0.05,
    transmission: 0,
    transparent: true,
    opacity: isRed || isAmber ? 0.55 : 0.28,
    envMapIntensity: 1.1,
    ior: 1.5,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

export function CarModel({
  modelPath,
  modelScale,
  vehicleTypeId = "sedan",
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

    const wrapMeshes = collectWrapMeshes(clone);
    const windowMeshes = collectWindowMeshes(clone);
    const lensMeshes = collectLensMeshes(clone);
    const { lamps: lampCovers } = classifyGlassBlackMeshes(clone);

    const primary = new THREE.Color(hexToThreeColor(primaryColor));
    if (wrap.colors.length > 1) {
      primary.lerp(new THREE.Color(hexToThreeColor(secondaryColor)), 0.32);
    }

    const bodyMat = createWrapMaterial(wrap, finish, primary);
    sharpenMaterialTextures(bodyMat, anisotropy);
    const windowMat = createWindowFilmMaterial(tint, liteMaterials);

    wrapMeshes.forEach((mesh) => {
      mesh.material = bodyMat;
      mesh.castShadow = enableShadows;
      mesh.receiveShadow = enableShadows;
    });

    lensMeshes.forEach((mesh) => {
      if (wrapMeshes.has(mesh)) return;
      const source = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      mesh.material = createLensGlassMaterial(source);
      mesh.castShadow = false;
    });

    lampCovers.forEach((mesh) => {
      if (wrapMeshes.has(mesh) || lensMeshes.has(mesh)) return;
      const source = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      mesh.material = createLensGlassMaterial(source);
      mesh.castShadow = false;
    });

    windowMeshes.forEach((mesh) => {
      if (wrapMeshes.has(mesh) || lensMeshes.has(mesh) || lampCovers.has(mesh)) return;
      mesh.material = windowMat;
      mesh.castShadow = false;
      mesh.receiveShadow = enableShadows;
    });

    sanitizeWorkshopModel(clone);
    normalizeModel(clone, WORKSHOP_SIZE * (modelScale ?? 1));
    clone.position.set(...CAR_OFFSET);
    return clone;
  }, [
    scene,
    wrap,
    finish,
    tint,
    primaryColor,
    secondaryColor,
    modelScale,
    vehicleTypeId,
    enableShadows,
    liteMaterials,
    anisotropy,
  ]);

  return <primitive object={clonedScene} />;
}
