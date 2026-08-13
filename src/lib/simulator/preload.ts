import { resolveSimulatorModelUrl } from "@/lib/simulator/assert-glb";
import { DRACO_DECODER_PATH } from "@/lib/simulator/draco";
import { warmStudioLockupTexture } from "@/lib/simulator/studio-lockup";
import { vehicleTypes } from "@/lib/data/simulator";

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

export function warmSimulatorRuntime() {
  warmStudioLockupTexture();
  void import("@react-three/fiber");
  void import("@react-three/drei");
  void import("@/components/organisms/customs/three/workshop-canvas");
}

export function warmDefaultSimulatorAssets() {
  warmSimulatorRuntime();
  const sedan = vehicleTypes.find((vehicle) => vehicle.id === "sedan");
  if (sedan) preloadSimulatorModel(sedan.modelPath);
}

export function warmAllSimulatorModelsIdle() {
  if (typeof window === "undefined") return;

  const run = () => {
    for (const vehicle of vehicleTypes) {
      prefetchGlb(resolveSimulatorModelUrl(vehicle.modelPath));
    }
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 4000 });
  } else {
    globalThis.setTimeout(run, 2500);
  }
}
