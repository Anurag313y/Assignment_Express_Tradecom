import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/** Same behaviour as production Nginx: `/api/*` → Flask on port 5000 */
const apiProxy = {
  "/api": {
    target: "http://127.0.0.1:5000",
    changeOrigin: true,
    rewrite: (p) => p.replace(/^\/api/, "") || "/",
  },
};

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 5173,
    hmr: {
      overlay: false,
    },
    proxy: apiProxy,
  },
  preview: {
    proxy: apiProxy,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
