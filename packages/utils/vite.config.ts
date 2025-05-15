/// <reference types="vitest" />

import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8", // Ensure V8 is used
      include: ["src"],
      exclude: ["src/index.ts", "src/**.js"],
    },
  },
});
