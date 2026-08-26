import { resolveSimulatorModelUrl } from "@/lib/simulator/assert-glb";
import { DRACO_DECODER_PATH } from "@/lib/simulator/draco";
import { warmStudioLockupTexture } from "@/lib/simulator/studio-lockup";

const prefetchedModels = new Set<string>();
const decodedModels = new Set<string>();

function prefetchGlb(url: string) {
  if (typeof window === "undefined" || prefetchedModels.has(url)) return;
  prefetchedModels.add(url);

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.as = "fetch";
  link.href = url;
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
}

/** HTTP cache only — does not decode the GLB into GPU memory. */
export function prefetchSimulatorModel(modelPath: string) {
  prefetchGlb(resolveSimulatorModelUrl(modelPath));
}

/** Decode a single GLB into the Three.js cache. Call only when the workshop opens it. */
export function preloadSimulatorModel(modelPath: string) {
  const url = resolveSimulatorModelUrl(modelPath);
  prefetchGlb(url);

  if (decodedModels.has(url)) return;
  decodedModels.add(url);

  void import("@react-three/drei").then(({ useGLTF }) => {
    useGLTF.setDecoderPath(DRACO_DECODER_PATH);
    useGLTF.preload(url, DRACO_DECODER_PATH);
  });
}

export function releaseSimulatorModel(modelPath: string) {
  const url = resolveSimulatorModelUrl(modelPath);
  decodedModels.delete(url);
  void import("@react-three/drei").then((mod) => {
    const gltf = mod.useGLTF as typeof mod.useGLTF & {
      clear?: (input: string) => void;
    };
    try {
      gltf.clear?.(url);
    } catch {
      // best-effort GPU eviction
    }
  });
}

/** Load drei/fiber chunks only. Never decode vehicle GLBs here. */
export function warmSimulatorRuntime() {
  warmStudioLockupTexture();
  void import("@react-three/fiber");
  void import("@react-three/drei");
  void import("@/components/organisms/customs/three/workshop-canvas");
}

export function warmDefaultSimulatorAssets() {
  warmSimulatorRuntime();
}
