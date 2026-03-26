import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { compression } from "vite-plugin-compression2";

// Get repository name for GitHub Pages base path
const repo =
  process.env.GITHUB_REPOSITORY?.split("/")[1] || "sanjeev-portfolio";

export default defineConfig({
  base: process.env.NODE_ENV === "production" ? `/${repo}/` : "/",
  assetsInclude: ["**/*.gltf", "**/*.glb", "**/*.pdf"],
  plugins: [
    react(),
    compression({ algorithms: ["gzip", "brotliCompress"], threshold: 1024 }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom"],
          "vendor-three": ["three", "@react-three/fiber", "@react-three/drei"],
          "vendor-postprocessing": [
            "@react-three/postprocessing",
            "postprocessing",
          ],
          "vendor-i18n": [
            "i18next",
            "react-i18next",
            "i18next-http-backend",
            "i18next-browser-languagedetector",
          ],
        },
      },
    },
  },
});
