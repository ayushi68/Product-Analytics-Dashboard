import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const port = Number(process.env.PORT) || 5173;

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port,
    allowedHosts: ["product-analytics-dashboard-1-7onx.onrender.com"]
  },
  preview: {
    host: "0.0.0.0",
    port
  }
});
