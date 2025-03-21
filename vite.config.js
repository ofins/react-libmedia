import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@libmedia/avplayer/dist/esm/[0-9]*.avplayer.js",
          dest: "assets",
        },
      ],
    }),
  ],
  optimizeDeps: {
    exclude: ["@libmedia/avplayer"],
  },
});
