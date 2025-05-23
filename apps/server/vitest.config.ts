import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "istanbul", // or 'v8',
      exclude: [
        "**/index.ts",
        "src/config.ts",
        "src/interfaces/routers",
        "dist",
      ],
    },
  },
});
