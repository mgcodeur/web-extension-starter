import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  modules: ["@wxt-dev/module-vue"],
  manifest: {
    name: "Web Extension Starter",
  },
  imports: {
    eslintrc: { enabled: 9 },
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
