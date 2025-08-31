/** biome-ignore-all lint/suspicious/noConsole: let me do it */
import * as resvg from "@resvg/resvg-wasm";
import type { ResvgWorkerMessage, ResvgWorkerMessageResult } from "./types";

// Initialize WASM module
const initializeWasm = async (): Promise<void> => {
  try {
    const wasmPath = new URL(
      "@resvg/resvg-wasm/index_bg.wasm",
      import.meta.url,
    );
    const response = await fetch(wasmPath);

    if (!response.ok) {
      throw new Error(`Failed to fetch WASM: ${response.statusText}`);
    }

    await resvg.initWasm(response);
  } catch (error) {
    console.error("Failed to initialize WASM:", error);
    throw error;
  }
};

// Initialize WASM on worker startup
initializeWasm().catch((error) => {
  console.error("WASM initialization failed:", error);
});

const postMessage = (message: ResvgWorkerMessageResult) => {
  self.postMessage(message);
};

self.onmessage = (e: MessageEvent<ResvgWorkerMessage>) => {
  const { svg, width, _id } = e.data;

  // Create a new Resvg instance
  const renderer = new resvg.Resvg(svg, {
    fitTo: {
      mode: "width",
      value: width,
    },
  });

  // Render
  const image = renderer.render();
  const pngBuffer = image.asPng();
  const safeBuffer = new Uint8Array(pngBuffer);

  // Generate object URL
  const url = URL.createObjectURL(
    new Blob([safeBuffer], { type: "image/png" }),
  );

  // Send result
  postMessage({ _id, url });
};
