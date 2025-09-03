import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // Base URL của app, thay đổi nếu deploy ở subpath
  preview: {
    host: "0.0.0.0",
    port: 3000,
    allowedHosts: ["notesummerize.onrender.com"],
  },
});
