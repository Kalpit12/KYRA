import * as THREE from "three";

const LOGO_SRC = "/kyra-customs-logo.jpg";

let cachedTexture: THREE.Texture | null = null;
let inflight: Promise<THREE.Texture | null> | null = null;

function cssFontFamily(variable: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.body).getPropertyValue(variable).trim();
  return value || fallback;
}

function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  tracking: number
) {
  let cursor = x;
  for (const char of text) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + tracking;
  }
}

function loadLogo(): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Failed to load KYRA Customs logo"));
    image.src = LOGO_SRC;
  });
}

async function buildLockupTexture(): Promise<THREE.Texture | null> {
  const logo = await loadLogo();
  await document.fonts.ready;

  const syne = cssFontFamily("--font-syne", "Syne");
  const plex = cssFontFamily("--font-plex", "IBM Plex Mono");
  const titleSize = 132;
  const tagSize = 26;
  const badge = 340;
  const gap = 52;
  const padX = 40;
  const padY = 36;

  await Promise.all([
    document.fonts.load(`800 ${titleSize}px ${syne}`),
    document.fonts.load(`500 ${tagSize}px ${plex}`),
  ]);

  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) return null;

  measure.font = `800 ${titleSize}px ${syne}, sans-serif`;
  const kyraWidth = measure.measureText("Kyra ").width;
  const customsWidth = measure.measureText("Customs").width;
  const textWidth = kyraWidth + customsWidth;

  measure.font = `500 ${tagSize}px ${plex}, monospace`;
  let tagWidth = 0;
  for (const char of "DIVINE ELEGANCE") {
    tagWidth += measure.measureText(char).width + 7;
  }

  const contentWidth = badge + gap + Math.max(textWidth, tagWidth);
  const width = Math.ceil(contentWidth + padX * 2);
  const height = Math.ceil(badge + padY * 2);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, width, height);

  const badgeX = padX;
  const badgeY = (height - badge) / 2;
  const radius = 16;
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badge, badge, radius);
  ctx.clip();
  ctx.fillStyle = "#000000";
  ctx.fillRect(badgeX, badgeY, badge, badge);
  ctx.drawImage(logo, badgeX, badgeY, badge, badge);
  ctx.restore();

  const textX = badgeX + badge + gap;
  const titleY = badgeY + badge * 0.58;
  const tagY = badgeY + badge * 0.82;

  ctx.textBaseline = "alphabetic";
  ctx.font = `800 ${titleSize}px ${syne}, sans-serif`;
  ctx.fillStyle = "#121214";
  ctx.fillText("Kyra ", textX, titleY);
  ctx.fillStyle = "#e2131f";
  ctx.fillText("Customs", textX + kyraWidth, titleY);

  ctx.font = `500 ${tagSize}px ${plex}, monospace`;
  ctx.fillStyle = "#6b6b70";
  drawTracked(ctx, "DIVINE ELEGANCE", textX, tagY, 7);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  texture.needsUpdate = true;
  return texture;
}

/** Start logo + wall lockup generation as soon as the customs page loads. */
export function warmStudioLockupTexture() {
  if (typeof window === "undefined" || cachedTexture || inflight) return;
  inflight = buildLockupTexture()
    .then((texture) => {
      cachedTexture = texture;
      return texture;
    })
    .catch(() => null)
    .finally(() => {
      inflight = null;
    });
}

export function getCachedStudioLockupTexture() {
  return cachedTexture;
}

export function getStudioLockupTexture(): Promise<THREE.Texture | null> {
  if (cachedTexture) return Promise.resolve(cachedTexture);
  if (inflight) return inflight;
  warmStudioLockupTexture();
  return inflight ?? Promise.resolve(null);
}

export function preloadStudioLogo() {
  if (typeof window === "undefined") return;
  const linkId = "kyra-studio-logo-preload";
  if (document.getElementById(linkId)) return;
  const link = document.createElement("link");
  link.id = linkId;
  link.rel = "preload";
  link.as = "image";
  link.href = LOGO_SRC;
  document.head.appendChild(link);
}
