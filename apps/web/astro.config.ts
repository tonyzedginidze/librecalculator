import react from "@astrojs/react";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://librecalculator.com",
  output: "static",
  trailingSlash: "ignore",
  integrations: [react()],
  build: { format: "directory" },
  server: { host: "127.0.0.1" },
  vite: {
    cacheDir:
      process.env.NODE_ENV === "production"
        ? "./node_modules/.vite/build"
        : "./node_modules/.vite/dev",
    ssr: { noExternal: [/^@open-calculators\//] },
    server: { host: "127.0.0.1" },
  },
});
