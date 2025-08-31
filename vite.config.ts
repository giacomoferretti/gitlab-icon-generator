// import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
// import { FontaineTransform, type FontaineTransformOptions } from "fontaine";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// const options: FontaineTransformOptions = {
//   // You can specify fallbacks as an array (applies to all fonts)
//   fallbacks: [
//     "BlinkMacSystemFont",
//     "Segoe UI",
//     "Helvetica Neue",
//     "Arial",
//     "Noto Sans",
//   ],

//   // Or as an object to configure specific fallbacks per font family
//   // fallbacks: {
//   //   Poppins: ['Helvetica Neue'],
//   //   'JetBrains Mono': ['Courier New']
//   // },

//   // You may need to resolve assets like `/fonts/Roboto.woff2` to a particular directory
//   resolvePath: (id) => {
//     return new URL(
//       path.join(path.dirname(import.meta.url), "node_modules", id),
//     );
//   },
//   // overrideName: (originalName) => `${name} override`
//   // sourcemap: false
//   // skipFontFaceGeneration: (fallbackName) => fallbackName === 'Roboto override'
// };

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    // FontaineTransform.vite(options),
  ],
  // optimizeDeps: {
  //   exclude: ["@resvg/resvg-js", "satori"],
  // },
  define: {
    "process.env": {},
  },
});
