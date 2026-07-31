import * as THREE from "three";

/** Material / mesh names that should receive wrap color */
const BODY_MATERIAL_HINTS = [
  "car paint",
  "carpaint",
  "carpaint02",
  "paint 1",
  "paint 2",
  "paint1",
  "paint2",
  "body paint",
  "bodypaint",
  "toycar",
];

/** Cabin window glass only — receives window tint (Phantom excludes headlights/taillights) */
const WINDOW_GLASS_HINTS = [
  "glassblack",
  "windows",
  "window",
  "windshield",
  "windscreen",
  "windows glass",
  "windows_glass",
  "d glass",
  "d_glass",
];

/** Headlight / taillight lenses — keep clear or colored, never dark window tint */
const LENS_GLASS_HINTS = [
  "glasswhite",
  "glassred",
  "glass light",
  "glass_light",
  "red glass",
  "redglass",
  "clear glass",
  "clearglass",
  "lamp cover",
  "light cover",
];

/** Generic "glass" token — treated as window unless also a lens/light */
const GENERIC_GLASS_HINTS = ["glass"];

const LIGHT_MATERIAL_HINTS = [
  "light",
  "lamp",
  "bulb",
  "emissive",
  "front_white_light",
  "red_light",
  "headlight",
  "taillight",
  "brakelight",
  "signallight",
];

const BRAKE_MATERIAL_HINTS = ["brakedisc", "brake disc", "caliper", "metallicred"];

/** Never wrap these — lights, rubber, trim, interior, etc. */
const EXCLUDE_HINTS = [
  "wheel",
  "tire",
  "tyre",
  "rim",
  "brake",
  "brakedisc",
  "light",
  "lamp",
  "bulb",
  "interior",
  "seat",
  "steering",
  "mirror",
  "metallic",
  "carbon",
  "logo",
  "numberplate",
  "plate",
  "bottomcar",
  "disc",
  "hardware",
  "mechanical",
  "floormat",
  "dashboard",
  "clock",
  "chrome",
  "headlight",
  "taillight",
];

const BODY_MESH_HINTS = [
  "body",
  "paint",
  "exterior",
  "chassis",
  "shell",
  "hood",
  "door",
  "fender",
  "bumper",
  "roof",
  "trunk",
  "bonnet",
];

function normalizeName(name: string) {
  return name.toLowerCase().replace(/[_\-.#]/g, " ").replace(/\s+/g, " ").trim();
}

function compactName(name: string) {
  return normalizeName(name).replace(/\s+/g, "");
}

function matchesHints(name: string, hints: string[]) {
  const lower = normalizeName(name);
  const compact = compactName(name);
  return hints.some((hint) => {
    const h = hint.toLowerCase();
    return lower.includes(h) || compact.includes(h.replace(/\s+/g, ""));
  });
}

function materialNames(mesh: THREE.Mesh): string[] {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials.filter(Boolean).map((mat) => mat.name || "");
}

export function isLightMaterial(material: THREE.Material): boolean {
  const name = material.name || "";
  if (!name) {
    const std = material as THREE.MeshStandardMaterial;
    return !!std.emissive && std.emissiveIntensity > 0.2 && std.emissive.getHex() !== 0;
  }
  // Glass lens names contain "glass" — not light emitters
  if (matchesHints(name, LENS_GLASS_HINTS) || matchesHints(name, WINDOW_GLASS_HINTS)) {
    return false;
  }
  if (matchesHints(name, LIGHT_MATERIAL_HINTS)) return true;
  const std = material as THREE.MeshStandardMaterial;
  return !!std.emissive && std.emissiveIntensity > 0.2 && std.emissive.getHex() !== 0;
}

export function isBrakeMaterial(material: THREE.Material): boolean {
  return matchesHints(material.name || "", BRAKE_MATERIAL_HINTS);
}

export function isLensGlassMaterial(material: THREE.Material): boolean {
  const name = material.name || "";
  if (!name) return false;
  return matchesHints(name, LENS_GLASS_HINTS);
}

export function isWindowGlassMaterial(material: THREE.Material): boolean {
  const name = material.name || "";
  if (!name) {
    const physical = material as THREE.MeshPhysicalMaterial;
    return physical.transmission !== undefined && physical.transmission > 0.15;
  }
  if (isLensGlassMaterial(material)) return false;
  if (matchesHints(name, LIGHT_MATERIAL_HINTS) && !matchesHints(name, WINDOW_GLASS_HINTS)) {
    return false;
  }
  if (matchesHints(name, WINDOW_GLASS_HINTS)) return true;
  // Bare "Glass" / "glass" from Khronos samples = cabin glass
  if (matchesHints(name, GENERIC_GLASS_HINTS) && !matchesHints(name, LENS_GLASS_HINTS)) {
    return true;
  }
  const physical = material as THREE.MeshPhysicalMaterial;
  return physical.transmission !== undefined && physical.transmission > 0.15;
}

/** @deprecated Prefer isWindowGlassMaterial / isLensGlassMaterial */
export function isGlassMaterial(material: THREE.Material): boolean {
  return isWindowGlassMaterial(material) || isLensGlassMaterial(material);
}

export function isBodyMaterial(material: THREE.Material): boolean {
  const name = material.name || "";
  if (!name) return false;
  if (matchesHints(name, EXCLUDE_HINTS)) return false;
  if (isGlassMaterial(material)) return false;
  if (isLightMaterial(material)) return false;
  return matchesHints(name, BODY_MATERIAL_HINTS);
}

export function isGlassMesh(mesh: THREE.Mesh): boolean {
  const names = materialNames(mesh);
  if (names.some((n) => {
    const fake = { name: n } as THREE.Material;
    return isWindowGlassMaterial(fake) || isLensGlassMaterial(fake);
  })) {
    return true;
  }

  const meshName = mesh.name || mesh.parent?.name || "";
  if (matchesHints(meshName, WINDOW_GLASS_HINTS) || matchesHints(meshName, GENERIC_GLASS_HINTS)) {
    return true;
  }

  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  return materials.some((mat) => mat && isGlassMaterial(mat));
}

/**
 * True when this mesh should receive wrap color.
 * Prefer material names (Hum3D: "Car paint" / "CarPaint"). Do not treat all opaque meshes as body.
 */
export function isBodyMesh(mesh: THREE.Mesh): boolean {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  if (materials.some((mat) => mat && isBodyMaterial(mat))) return true;

  const meshName = mesh.name || mesh.parent?.name || "";
  if (matchesHints(meshName, EXCLUDE_HINTS)) return false;
  if (isGlassMesh(mesh)) return false;

  if (matchesHints(meshName, BODY_MESH_HINTS)) {
    if (materials.some((mat) => mat && matchesHints(mat.name || "", EXCLUDE_HINTS))) {
      return false;
    }
    return true;
  }

  return false;
}

export function normalizeModel(scene: THREE.Object3D, targetSize = 4.2) {
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = targetSize / maxDim;
  scene.scale.setScalar(scale);

  const centered = new THREE.Box3().setFromObject(scene);
  const center = centered.getCenter(new THREE.Vector3());
  scene.position.sub(center.multiplyScalar(scale));
  scene.position.y -= centered.min.y * scale;
}
