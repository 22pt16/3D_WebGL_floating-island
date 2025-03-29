// vite.config.js
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "url";

export default defineConfig({
  base: "./", //  Correct for GitHub Pages & Vercel
  build: {
    outDir: "dist", // 🔥 Build output to dist/
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)), // 🚀 Correct way for Vite
    },
  },
});
