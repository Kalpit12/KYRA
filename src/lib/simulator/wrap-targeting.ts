import * as THREE from "three";
import {
  isBodyMaterial,
  isGlassMesh,
  isInteriorMesh,
  isLampHousingMesh,
  isLensGlassMaterial,
  isWindowGlassMaterial,
} from "@/lib/simulator/mesh-utils";

function meshMaterials(mesh: THREE.Mesh) {
  return (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).filter(Boolean);
}

function compact(name: string) {
  return name.toLowerCase().replace(/[_\-.#\s]/g, "");
}

function hasPaintMaterial(mat: THREE.Material) {
  const key = compact(mat.name || "");
  if (key === "body" || key === "carpaint" || key === "carpaint02") return true;
  return isBodyMaterial(mat);
}

function hasCabinGlassMaterial(mat: THREE.Material) {
  const key = compact(mat.name || "");
  if (key === "glass" || key === "dglass" || key === "vdglass") return true;
  return isWindowGlassMaterial(mat);
}

/** Wrap every mesh whose material is paint — ignore Unreal names like MI_Exhaust / MI_Cabin. */
export function collectWrapMeshes(root: THREE.Object3D) {
  const selected: THREE.Mesh[] = [];

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = meshMaterials(child);
    if (!materials.some((mat) => hasPaintMaterial(mat))) return;
    if (materials.some((mat) => isWindowGlassMaterial(mat) || isLensGlassMaterial(mat))) return;
    if (isGlassMesh(child) && !materials.some((mat) => hasPaintMaterial(mat))) return;
    selected.push(child);
  });

  return new Set(selected);
}

export function collectWindowMeshes(root: THREE.Object3D) {
  const selected: THREE.Mesh[] = [];

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    if (isInteriorMesh(child) || isLampHousingMesh(child)) return;
    const materials = meshMaterials(child);
    if (materials.some((mat) => isLensGlassMaterial(mat))) return;
    if (materials.some((mat) => hasCabinGlassMaterial(mat))) {
      selected.push(child);
    }
  });

  return new Set(selected);
}

export function collectLensMeshes(root: THREE.Object3D) {
  const selected: THREE.Mesh[] = [];

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = meshMaterials(child);
    if (materials.some((mat) => isLensGlassMaterial(mat))) {
      selected.push(child);
    }
  });

  return new Set(selected);
}
