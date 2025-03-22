/// <reference types="vitest" />

import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
});
