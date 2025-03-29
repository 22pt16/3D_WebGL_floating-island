// vite.config.js
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "./", //  For GitHub Pages, change if repo name is different
  build: {
    outDir: "dist", // Build output folder
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), //  Shortcut to /src
    },
  },
});
