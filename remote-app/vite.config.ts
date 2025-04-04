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
      name: "remote_app",
      filename: "remoteEntry.js",
      exposes: {
        "./ChildComponent": "./src/components/ChildComponent",
      },
      shared: {
        react: { requiredVersion: "^18.2.0" },
        "react-dom": { requiredVersion: "^18.2.0" },
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
    port: 5001,
    strictPort: true,
    cors: true,
  },
});
