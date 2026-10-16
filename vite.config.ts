import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
export default defineConfig({
 plugins: [react(), tailwindcss()],
 resolve: { alias: Object.fromEntries(["", "app", "assets", "config", "features", "pages", "routes", "services", "shared"].map(name => ["@" + name, resolve(__dirname, "src", name)])) },
 define: { global: "globalThis" },
 server: { port: 3000, host: "localhost" },
});
