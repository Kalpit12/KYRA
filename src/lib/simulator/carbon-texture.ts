import * as THREE from "three";

export type CarbonTextureVariant = "twill" | "forged";

export interface CarbonTextures {
  map: THREE.CanvasTexture;
  normalMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
}

const cache = new Map<CarbonTextureVariant, CarbonTextures>();

function makeTexture(
  canvas: HTMLCanvasElement,
  repeat: number,
  colorSpace?: THREE.ColorSpace
) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeat, repeat);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  if (colorSpace) texture.colorSpace = colorSpace;
  return texture;
}

/** Classic 2×2 twill carbon weave with readable fiber contrast + normals */
function buildTwill(size = 1024): CarbonTextures {
  const albedo = document.createElement("canvas");
  albedo.width = size;
  albedo.height = size;
  const aCtx = albedo.getContext("2d")!;

  const normal = document.createElement("canvas");
  normal.width = size;
  normal.height = size;
  const nCtx = normal.getContext("2d")!;
  const nData = nCtx.createImageData(size, size);

  const roughness = document.createElement("canvas");
  roughness.width = size;
  roughness.height = size;
  const rCtx = roughness.getContext("2d")!;

  // Mid-grey base so material.color can tint without crushing the weave
  aCtx.fillStyle = "#2a2a2a";
  aCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = "#6a6a6a";
  rCtx.fillRect(0, 0, size, size);

  const cell = 32;
  const height = new Float32Array(size * size);

  for (let y = 0; y < size; y += cell) {
    for (let x = 0; x < size; x += cell) {
      const phase = ((x / cell) + (y / cell)) % 2;

      // Strand bundle
      const grad = aCtx.createLinearGradient(x, y, x + cell, y + cell);
      if (phase === 0) {
        grad.addColorStop(0, "#1c1c1c");
        grad.addColorStop(0.35, "#5a5a5a");
        grad.addColorStop(0.55, "#8a8a8a");
        grad.addColorStop(1, "#242424");
      } else {
        grad.addColorStop(0, "#161616");
        grad.addColorStop(0.4, "#484848");
        grad.addColorStop(0.65, "#6e6e6e");
        grad.addColorStop(1, "#1e1e1e");
      }
      aCtx.fillStyle = grad;
      aCtx.fillRect(x, y, cell, cell);

      // Per-fiber lines (twill direction)
      const fiberCount = 8;
      for (let i = 0; i < fiberCount; i++) {
        const t = (i + 0.5) / fiberCount;
        const bright = phase === 0 ? 0.22 : 0.14;
        aCtx.strokeStyle = `rgba(255,255,255,${bright})`;
        aCtx.lineWidth = 1.25;
        aCtx.beginPath();
        if (phase === 0) {
          aCtx.moveTo(x, y + cell * t);
          aCtx.lineTo(x + cell, y + cell * t);
        } else {
          aCtx.moveTo(x + cell * t, y);
          aCtx.lineTo(x + cell * t, y + cell);
        }
        aCtx.stroke();

        aCtx.strokeStyle = "rgba(0,0,0,0.35)";
        aCtx.lineWidth = 0.75;
        aCtx.beginPath();
        if (phase === 0) {
          aCtx.moveTo(x, y + cell * t + 1.5);
          aCtx.lineTo(x + cell, y + cell * t + 1.5);
        } else {
          aCtx.moveTo(x + cell * t + 1.5, y);
          aCtx.lineTo(x + cell * t + 1.5, y + cell);
        }
        aCtx.stroke();
      }

      // Roughness: fibers glossier along highlight ridges
      const rGrad = rCtx.createLinearGradient(x, y, x + cell, y + cell);
      rGrad.addColorStop(0, "#909090");
      rGrad.addColorStop(0.45, "#3a3a3a");
      rGrad.addColorStop(1, "#7a7a7a");
      rCtx.fillStyle = rGrad;
      rCtx.fillRect(x, y, cell, cell);

      // Height field for normals — raised ridges along fibers
      for (let py = 0; py < cell; py++) {
        for (let px = 0; px < cell; px++) {
          const u = px / cell;
          const v = py / cell;
          const ridge =
            phase === 0
              ? 0.55 + 0.45 * Math.sin(v * Math.PI * fiberCount)
              : 0.55 + 0.45 * Math.sin(u * Math.PI * fiberCount);
          const edge = Math.min(u, v, 1 - u, 1 - v);
          const h = ridge * (0.65 + 0.35 * Math.min(1, edge * 8));
          const ix = x + px;
          const iy = y + py;
          height[iy * size + ix] = h;
        }
      }
    }
  }

  // Convert height → tangent-space normal map
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = height[y * size + ((x - 1 + size) % size)];
      const r = height[y * size + ((x + 1) % size)];
      const u = height[((y - 1 + size) % size) * size + x];
      const d = height[((y + 1) % size) * size + x];
      const strength = 4.5;
      let nx = (l - r) * strength;
      let ny = (u - d) * strength;
      let nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;
      const i = (y * size + x) * 4;
      nData.data[i] = Math.round((nx * 0.5 + 0.5) * 255);
      nData.data[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      nData.data[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      nData.data[i + 3] = 255;
    }
  }
  nCtx.putImageData(nData, 0, 0);

  const repeat = 7;
  return {
    map: makeTexture(albedo, repeat, THREE.SRGBColorSpace),
    normalMap: makeTexture(normal, repeat),
    roughnessMap: makeTexture(roughness, repeat),
  };
}

/** Chaotic forged-carbon flecks */
function buildForged(size = 1024): CarbonTextures {
  const albedo = document.createElement("canvas");
  albedo.width = size;
  albedo.height = size;
  const aCtx = albedo.getContext("2d")!;

  const normal = document.createElement("canvas");
  normal.width = size;
  normal.height = size;
  const nCtx = normal.getContext("2d")!;
  const nData = nCtx.createImageData(size, size);

  const roughness = document.createElement("canvas");
  roughness.width = size;
  roughness.height = size;
  const rCtx = roughness.getContext("2d")!;

  aCtx.fillStyle = "#222222";
  aCtx.fillRect(0, 0, size, size);
  rCtx.fillStyle = "#555555";
  rCtx.fillRect(0, 0, size, size);

  const height = new Float32Array(size * size);
  height.fill(0.45);

  // Seeded-ish flecks
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 2800; i++) {
    const x = rand() * size;
    const y = rand() * size;
    const w = 4 + rand() * 28;
    const h = 2 + rand() * 10;
    const angle = rand() * Math.PI;
    const lite = 40 + Math.floor(rand() * 140);
    aCtx.save();
    aCtx.translate(x, y);
    aCtx.rotate(angle);
    aCtx.fillStyle = `rgb(${lite},${lite},${lite})`;
    aCtx.fillRect(-w / 2, -h / 2, w, h);
    aCtx.restore();

    rCtx.save();
    rCtx.translate(x, y);
    rCtx.rotate(angle);
    const rough = 30 + Math.floor(rand() * 160);
    rCtx.fillStyle = `rgb(${rough},${rough},${rough})`;
    rCtx.fillRect(-w / 2, -h / 2, w, h);
    rCtx.restore();

    // Approximate height stamp
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    for (let py = -h; py <= h; py++) {
      for (let px = -w / 2; px <= w / 2; px++) {
        const wx = Math.round(x + px * cos - py * sin);
        const wy = Math.round(y + px * sin + py * cos);
        if (wx < 0 || wy < 0 || wx >= size || wy >= size) continue;
        height[wy * size + wx] = Math.min(1, 0.45 + (lite / 255) * 0.55);
      }
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = height[y * size + ((x - 1 + size) % size)];
      const r = height[y * size + ((x + 1) % size)];
      const u = height[((y - 1 + size) % size) * size + x];
      const d = height[((y + 1) % size) * size + x];
      const strength = 3.2;
      let nx = (l - r) * strength;
      let ny = (u - d) * strength;
      let nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len;
      ny /= len;
      nz /= len;
      const i = (y * size + x) * 4;
      nData.data[i] = Math.round((nx * 0.5 + 0.5) * 255);
      nData.data[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      nData.data[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      nData.data[i + 3] = 255;
    }
  }
  nCtx.putImageData(nData, 0, 0);

  const repeat = 5;
  return {
    map: makeTexture(albedo, repeat, THREE.SRGBColorSpace),
    normalMap: makeTexture(normal, repeat),
    roughnessMap: makeTexture(roughness, repeat),
  };
}

export function getCarbonTextures(
  variant: CarbonTextureVariant = "twill"
): CarbonTextures {
  const hit = cache.get(variant);
  if (hit) return hit;
  const built = variant === "forged" ? buildForged() : buildTwill();
  cache.set(variant, built);
  return built;
}

/** @deprecated Prefer getCarbonTextures().map */
export function getCarbonWeaveTexture(): THREE.CanvasTexture {
  return getCarbonTextures("twill").map;
}

/**
 * SSR-safe CSS weave for carbon colour swatches.
 * Overlay tint keeps brand colour; hatch reads as fibre.
 */
export function carbonSwatchBackground(hex: string, forged = false): string {
  if (forged) {
    return [
      `linear-gradient(0deg, ${hex}d0, ${hex}90)`,
      "radial-gradient(circle at 20% 30%, #6a6a6a 0 1px, transparent 2px)",
      "radial-gradient(circle at 70% 55%, #4a4a4a 0 1.5px, transparent 3px)",
      "radial-gradient(circle at 40% 80%, #888 0 1px, transparent 2px)",
      "radial-gradient(circle at 85% 20%, #333 0 2px, transparent 3px)",
      "linear-gradient(135deg, #1a1a1a, #2e2e2e)",
    ].join(", ");
  }

  return [
    `linear-gradient(0deg, ${hex}d0, ${hex}88)`,
    "repeating-linear-gradient(90deg, transparent 0 1px, rgba(255,255,255,0.14) 1px 2px, transparent 2px 4px)",
    "repeating-linear-gradient(0deg, transparent 0 1px, rgba(0,0,0,0.45) 1px 2px, transparent 2px 4px)",
    "repeating-linear-gradient(45deg, #161616 0 3px, #3f3f3f 3px 6px, #222 6px 9px, #555 9px 12px)",
  ].join(", ");
}