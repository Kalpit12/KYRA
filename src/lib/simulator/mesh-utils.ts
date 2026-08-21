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
  "paint",
  // Sketchfab Lexus IS etc. — paint slot is named "body"
  "body",
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
  "glasses",
];

/** Headlight / taillight lenses — keep clear or colored, never dark window tint */
const LENS_GLASS_HINTS = [
  "glasswhite",
  "glassred",
  "glass light",
  "glass_light",
  "red glass",
  "redglass",
  "r glass",
  "r_glass",
  "o glass",
  "o_glass",
  "clear glass",
  "clearglass",
  "lamp cover",
  "light cover",
  "headlight glass",
  "headlamp",
  "front_light_glass",
  "front light glass",
  "back_light_glass",
  "back light glass",
];

const LAMP_MESH_HINTS = [
  "headlight",
  "headlamp",
  "head lamp",
  "taillight",
  "tail lamp",
  "foglight",
  "fog lamp",
  "lamp cover",
  "light cover",
  "frontlight",
  "sm light",
  "sk light",
  "light f",
  "light b",
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
  "exhaust",
  "atlas",
  "grille",
  "badge",
  "stripe",
  "caliper",
  "rotor",
  "diffuser",
  "reflector",
  "speaker",
  "sunroof",
];

/** Shared trim atlases / non-paint shaders (Sketchfab, game-ready cars) */
const TRIM_MATERIAL_HINTS = [
  "atlas",
  "exhaust",
  "grille",
  "badge",
  "stripe",
  "caliper",
  "rotor",
  "reflector",
  "speaker",
  "leather",
  "carpet",
  "fabric",
  "plastic",
  "rubber",
];

const INTERIOR_NAME_HINTS = ["int ", "interior"];

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
  if (name && matchesHints(name, LENS_GLASS_HINTS)) return true;
  const physical = material as THREE.MeshPhysicalMaterial;
  const transmission = physical.transmission ?? 0;
  if (transmission < 0.08) return false;
  const color = physical.color;
  if (!color) return false;
  // Red tail covers (Maya phong1, Sketchfab red_glass)
  return color.r > 0.28 && color.g < 0.18 && color.b < 0.18;
}

export function isLampHousingMesh(mesh: THREE.Mesh): boolean {
  const name = `${mesh.name} ${mesh.parent?.name ?? ""}`;
  if (matchesHints(name, LAMP_MESH_HINTS)) return true;
  const compact = compactName(name);
  return compact.includes("smlight") || compact.includes("sklight");
}

/** Real exhaust systems — not Toyota TMI materials baked into door node names. */
export function isExhaustMesh(mesh: THREE.Mesh): boolean {
  const compact = compactName(`${mesh.name} ${mesh.parent?.name ?? ""}`);
  return (
    compact.includes("exhaustsystem") ||
    compact.includes("extbodyexhaust") ||
    compact.includes("skexhaust") ||
    compact.includes("exhausttip") ||
    compact.includes("muffler")
  );
}

function createBlackExhaustMaterial() {
  return new THREE.MeshPhysicalMaterial({
    name: "ExhaustBlack",
    color: new THREE.Color("#1a1b1d"),
    metalness: 0.28,
    roughness: 0.48,
    envMapIntensity: 0.22,
    side: THREE.DoubleSide,
  });
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

/**
 * Hum3D sedan quirk: headlight / taillight covers are often named GlassBlack
 * (same as cabin glass). Lamp covers are thin shells; windshields are large panels.
 */
export function isLampCoverGlassMesh(mesh: THREE.Mesh, material?: THREE.Material): boolean {
  const matName = material?.name || "";
  const names = material
    ? [matName]
    : materialNames(mesh);

  const isGlassBlack = names.some((n) => compactName(n) === "glassblack");
  if (!isGlassBlack) return false;

  const box = new THREE.Box3().setFromObject(mesh);
  const center = box.getCenter(new THREE.Vector3());
  // Hum3D cabin / quarter glass sits on the belt line; lenses are bumper height
  if (center.y > 1.0) return false;

  const size = box.getSize(new THREE.Vector3());
  const dims = [size.x, size.y, size.z].sort((a, b) => a - b);
  const [thin, mid, long] = dims;
  if (long < 1e-4) return false;

  // Thin cover: small thickness + narrow face vs cabin glass
  if (thin / long < 0.18 && mid / long < 0.42) return true;
  // Compact lamp pods (round headlights) that aren't windshield-sized
  if (long < 2.1 && thin / long < 0.22 && mid / long < 0.55) return true;

  return false;
}

function meshSurfaceProxy(mesh: THREE.Mesh) {
  const box = new THREE.Box3().setFromObject(mesh);
  const size = box.getSize(new THREE.Vector3());
  return size.x * size.y + size.y * size.z + size.z * size.x;
}

function isGlassBlackMaterial(material: THREE.Material) {
  return compactName(material.name || "") === "glassblack";
}

/**
 * Hum3D names lamp covers GlassBlack (same as cabin glass).
 * Largest GlassBlack shells are windows; smaller pods are headlights / tails.
 */
export function classifyGlassBlackMeshes(root: THREE.Object3D) {
  const lamps = new Set<THREE.Mesh>();
  const windows = new Set<THREE.Mesh>();
  const black: THREE.Mesh[] = [];

  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const mats = Array.isArray(child.material) ? child.material : [child.material];
    if (!mats.some((mat) => mat && isGlassBlackMaterial(mat))) return;

    const meshName = `${child.name} ${child.parent?.name ?? ""}`;
    if (matchesHints(meshName, LAMP_MESH_HINTS) || isLampCoverGlassMesh(child)) {
      lamps.add(child);
      return;
    }
    black.push(child);
  });

  const scored = black
    .map((mesh) => ({ mesh, area: meshSurfaceProxy(mesh) }))
    .sort((a, b) => b.area - a.area);
  const cutoff = scored[0] ? scored[0].area * 0.32 : 0;

  for (const item of scored) {
    if (item.area >= cutoff) windows.add(item.mesh);
    else lamps.add(item.mesh);
  }

  return { lamps, windows };
}

/** True when GlassBlack (or similar) should render as a clear/red lamp lens */
export function isHeadlightGlassMaterial(
  material: THREE.Material,
  mesh?: THREE.Mesh
): boolean {
  if (mesh && isLampCoverGlassMesh(mesh, material)) return true;
  return isLensGlassMaterial(material);
}

/** @deprecated Prefer isWindowGlassMaterial / isLensGlassMaterial */
export function isGlassMaterial(material: THREE.Material): boolean {
  return isWindowGlassMaterial(material) || isLensGlassMaterial(material);
}

export function isBodyMaterial(material: THREE.Material): boolean {
  const name = material.name || "";
  if (name && matchesHints(name, EXCLUDE_HINTS)) return false;
  if (isGlassMaterial(material)) return false;
  if (isLightMaterial(material)) return false;
  if (isTrimMaterial(material)) return false;
  if (name && matchesHints(name, BODY_MATERIAL_HINTS)) return true;
  return isUntexturedPaintMaterial(material);
}

/** Toyota/Sketchfab cars often hash paint (TMI_1350010001) instead of "CarPaint". */
function isUntexturedPaintMaterial(material: THREE.Material): boolean {
  const std = material as THREE.MeshPhysicalMaterial;
  if (std.map) return false;
  if ((std.transmission ?? 0) > 0.05) return false;
  if (std.transparent && (std.opacity ?? 1) < 0.9) return false;
  const roughness = std.roughness ?? 1;
  const metalness = std.metalness ?? 1;
  if (roughness > 0.2 || metalness > 0.32) return false;
  const name = compactName(material.name || "");
  if (
    name.includes("cabin") ||
    name.includes("leather") ||
    name.includes("dash") ||
    name.includes("rim") ||
    name.includes("mirror")
  ) {
    return false;
  }
  return true;
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

export function isTrimMaterial(material: THREE.Material): boolean {
  return matchesHints(material.name || "", TRIM_MATERIAL_HINTS);
}

export function isInteriorMesh(mesh: THREE.Mesh): boolean {
  const name = `${mesh.name} ${mesh.parent?.name ?? ""}`;
  return matchesHints(name, INTERIOR_NAME_HINTS);
}

/** True when the GLB already tags paint (CarPaint / Car paint). Skip name guessing. */
export function hasNamedBodyPaint(root: THREE.Object3D): boolean {
  let found = false;
  root.traverse((child) => {
    if (found || !(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    if (materials.some((mat) => mat && isBodyMaterial(mat))) found = true;
  });
  return found;
}

/**
 * True when this mesh should receive wrap color.
 * Prefer material names (Hum3D / Sketchfab: "Car paint" / "CarPaint").
 * Mesh-name fallback is last resort — "body" in Ext_Body_Exhaust is trim, not paint.
 */
export function isBodyMesh(mesh: THREE.Mesh): boolean {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  if (materials.some((mat) => mat && isBodyMaterial(mat))) return true;

  const meshName = `${mesh.name} ${mesh.parent?.name ?? ""}`;
  if (isInteriorMesh(mesh)) return false;
  if (matchesHints(meshName, EXCLUDE_HINTS)) return false;
  if (materials.some((mat) => mat && (isTrimMaterial(mat) || matchesHints(mat.name || "", EXCLUDE_HINTS)))) {
    return false;
  }
  if (isGlassMesh(mesh)) return false;

  if (matchesHints(meshName, BODY_MESH_HINTS)) {
    return true;
  }

  return false;
}

const MATERIAL_MAP_KEYS = [
  "map",
  "normalMap",
  "roughnessMap",
  "metalnessMap",
  "aoMap",
  "emissiveMap",
  "bumpMap",
  "displacementMap",
  "alphaMap",
  "clearcoatMap",
  "clearcoatNormalMap",
  "clearcoatRoughnessMap",
  "sheenColorMap",
  "sheenRoughnessMap",
  "specularMap",
  "specularIntensityMap",
  "specularColorMap",
  "transmissionMap",
  "thicknessMap",
] as const;

/** Sharpen embedded GLB maps so 1–3k textures stay crisp on retina. */
export function sharpenMaterialTextures(material: THREE.Material, anisotropy: number) {
  const record = material as unknown as Record<string, unknown>;
  for (const key of MATERIAL_MAP_KEYS) {
    const tex = record[key];
    if (!(tex instanceof THREE.Texture)) continue;
    tex.anisotropy = Math.max(tex.anisotropy, anisotropy);
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    tex.needsUpdate = true;
  }
}

export function sharpenSceneTextures(scene: THREE.Object3D, anisotropy: number) {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    for (const material of materials) {
      if (material) sharpenMaterialTextures(material, anisotropy);
    }
  });
}

const _sanitizeSize = new THREE.Vector3();

/**
 * Hum3D workshop cars export every material as double-sided. Inner paint/trim
 * faces z-fight with the outer shell (glowing panel edges) and pick up the HDRI
 * as a second ghost reflection. Force front faces and quiet chrome/lights.
 */
export function sanitizeWorkshopModel(root: THREE.Object3D) {
  root.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    if (isExhaustMesh(child)) {
      child.visible = true;
      child.material = createBlackExhaustMaterial();
      child.castShadow = true;
      return;
    }

    const geometry = child.geometry;
    if (geometry) {
      if (!geometry.boundingBox) geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      if (box) {
        box.getSize(_sanitizeSize);
        const volume = _sanitizeSize.x * _sanitizeSize.y * _sanitizeSize.z;
        const minDim = Math.min(_sanitizeSize.x, _sanitizeSize.y, _sanitizeSize.z);
        const verts = geometry.getAttribute("position")?.count ?? 0;
        if (volume < 1e-8 || (minDim < 1e-4 && verts < 400)) {
          child.visible = false;
          return;
        }
      }
    }

    const sourceMats = Array.isArray(child.material) ? child.material : [child.material];
    if (sourceMats.every((mat) => !mat)) {
      child.material = new THREE.MeshStandardMaterial({
        color: "#141414",
        roughness: 0.65,
        metalness: 0.15,
        side: THREE.FrontSide,
        envMapIntensity: 0.3,
      });
      return;
    }

    for (const mat of sourceMats) {
      if (!mat) continue;

      const name = compactName(mat.name || child.name || "");
      const factoryLensOrTrim =
        isTrimMaterial(mat) ||
        isLensGlassMaterial(mat) ||
        isWindowGlassMaterial(mat) ||
        isLampHousingMesh(child) ||
        name === "atlas" ||
        name === "glow" ||
        name === "redglow" ||
        name.includes("exhaust");

      // Atlas/exhaust/lenses are authored double-sided. Front-only hides the
      // black exhaust shell and leaves the inner honeycomb looking white.
      if (!factoryLensOrTrim) {
        mat.side = THREE.FrontSide;
      }

      if (
        isBodyMaterial(mat) ||
        name.startsWith("windowtint") ||
        name === "glasswhite" ||
        name === "glassred" ||
        isLensGlassMaterial(mat)
      ) {
        continue;
      }

      const std = mat as THREE.MeshStandardMaterial;
      const factoryEmitter =
        name === "glow" ||
        name === "redglow" ||
        name === "light" ||
        name.includes("tmilight") ||
        name.includes("glasslight") ||
        compactName(child.name).includes("smlight") ||
        compactName(child.name).includes("extlight") ||
        compactName(child.name).includes("drl");
      if (!factoryEmitter && (isLightMaterial(mat) || name === "light")) {
        if (std.emissive) {
          std.emissiveIntensity = Math.min(std.emissiveIntensity || 1, 0.32);
        }
        continue;
      }

      if (name.includes("interior")) {
        std.metalness = 0;
        std.roughness = Math.max(std.roughness ?? 0.5, 0.74);
        std.envMapIntensity = 0.18;
        continue;
      }

      if (name.includes("metallicblack")) {
        std.roughness = Math.max(std.roughness ?? 0.2, 0.34);
        std.metalness = Math.min(std.metalness ?? 0.7, 0.45);
        std.envMapIntensity = 0.32;
      }

      if (name.includes("logo") || name.includes("numberplate") || name.includes("whitelogo")) {
        mat.polygonOffset = true;
        mat.polygonOffsetFactor = -1;
        mat.polygonOffsetUnits = -1;
      }
    }
  });
}

export function normalizeModel(scene: THREE.Object3D, targetSize = 4.2) {
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  scene.scale.setScalar(targetSize / maxDim);
  scene.updateMatrixWorld(true);

  const scaled = new THREE.Box3().setFromObject(scene);
  const center = scaled.getCenter(new THREE.Vector3());
  scene.position.x -= center.x;
  scene.position.z -= center.z;
  scene.position.y -= scaled.min.y;
}
