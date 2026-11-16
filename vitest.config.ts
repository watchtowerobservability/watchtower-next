import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (p: string): string => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  // in the monorepo the sibling SDKs by source, so the tests need no built dist; the published mirror uses the devDependencies
  resolve: {
    alias: !existsSync(src("../node/src")) ? {} : {
      "@watchtowerobservability/node/next-build": src("../node/src/integrations/next-build.ts"),
      "@watchtowerobservability/node/next-tunnel": src("../node/src/integrations/next-tunnel.ts"),
      "@watchtowerobservability/node/next": src("../node/src/integrations/next.ts"),
      "@watchtowerobservability/browser/consent": src("../browser/src/consent.ts"),
      "@watchtowerobservability/browser/next": src("../browser/src/adapters/next.ts"),
      "@watchtowerobservability/browser": src("../browser/src/index.ts"),
    },
  },
  define: { __WT_VERSION__: JSON.stringify("test"), __WT_IIFE__: "false" },
  test: { environment: "happy-dom", include: ["test/**/*.test.{ts,tsx}"] },
});
