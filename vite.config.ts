import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// Wrap the configuration in a function that receives the command
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    // Remove console logs and debugger statements in production build
    // 'command' is now accessible here
    drop: command === "build" ? ["console", "debugger"] : [],
  },
}));
