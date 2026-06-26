// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Split large, rarely-changing vendor libraries into their own chunks so they
  // stay cached across deploys instead of being re-downloaded inside the main
  // app bundle on every release. (three.js already ships in the lazy-loaded
  // GrapheneVolumetric chunk, so it is intentionally not listed here.)
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes("node_modules")) {
              if (id.includes("framer-motion") || id.includes("motion-dom") || id.includes("motion-utils"))
                return "vendor-motion";
              if (id.includes("/gsap/")) return "vendor-gsap";
            }
          },
        },
      },
    },
  },
});
