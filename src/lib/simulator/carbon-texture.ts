import * as THREE from "three";

let cachedWeave: THREE.CanvasTexture | null = null;

/**
 * Procedural twill carbon-fiber weave for body wrap materials.
 * Shared / repeated so we don't rebuild the canvas every colour change.
 */
export function getCarbonWeaveTexture(): THREE.CanvasTexture {
  if (cachedWeave) return cachedWeave;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#0c0c0c";
  ctx.fillRect(0, 0, size, size);

  const cell = 16;
  for (let y = 0; y < size; y += cell) {
    for (let x = 0; x < size; x += cell) {
      const phase = ((x / cell) + (y / cell)) % 2;
      // Twill strands
      const grad = ctx.createLinearGradient(x, y, x + cell, y + cell);
      if (phase === 0) {
        grad.addColorStop(0, "#1f1f1f");
        grad.addColorStop(0.45, "#3a3a3a");
        grad.addColorStop(1, "#141414");
      } else {
        grad.addColorStop(0, "#101010");
        grad.addColorStop(0.5, "#2c2c2c");
        grad.addColorStop(1, "#181818");
      }
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, cell, cell);

      // Fiber highlight lines
      ctx.strokeStyle = phase === 0 ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y + cell * 0.25);
      ctx.lineTo(x + cell, y + cell * 0.25);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + cell * 0.25, y);
      ctx.lineTo(x + cell * 0.25, y + cell);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(14, 14);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  cachedWeave = texture;
  return texture;
}
