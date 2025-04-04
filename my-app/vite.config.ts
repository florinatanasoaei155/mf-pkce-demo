import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "host_app",
      remotes: {
        remote_app: "http://localhost:5001/assets/remoteEntry.js",
      },
      shared: {
        react: { requiredVersion: "^18.2.0" },
        "react-dom": { requiredVersion: "^18.2.0" },
        tailwindcss: { requiredVersion: "^4.0.5" },
        "react-router-dom": { requiredVersion: "^7.1.5" },
      },
    }),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  preview: {
    port: 3000,
    strictPort: true,
    cors: true,
  },
  server: {
    port: 3000,
    strictPort: true,
  },
});
