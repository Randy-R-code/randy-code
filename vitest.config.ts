import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@infralens-lib": path.resolve(__dirname, "./src/infralens/lib"),
      "@infralens-components": path.resolve(
        __dirname,
        "./src/infralens/components",
      ),
      "@infralens-config": path.resolve(__dirname, "./src/infralens/config"),
      "@infralens-hooks": path.resolve(__dirname, "./src/infralens/hooks"),
      "@infralens": path.resolve(__dirname, "./src/infralens"),
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    exclude: ["**/node_modules/**", "e2e/**"],
  },
});
