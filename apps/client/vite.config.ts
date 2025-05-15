/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // Ensure V8 is used
      include: ["src/components", "src/utils", "src/hooks", "src/context"],
      exclude: ["**/index.ts", "**/*Container.tsx", "src/hooks/api"],
    },

    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.ts",
    css: true,
  },
  resolve: {
    alias: {
      "@kanban/utils": path.resolve(__dirname, "../../packages/utils/src"),
    },
  },
  plugins: [react(), tailwindcss()],
});
