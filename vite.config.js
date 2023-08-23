// vite.config.ts
import { join } from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const config = loadEnv(mode, "./");
  console.log("🚀 ~ file: vite.config.js:12 ~ defineConfig ~ config:", config);

  return {
    resolve: {
      alias: {
        "@": join(__dirname, "src"),
      },
    },
    plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),

      // 本地 mock
      viteMockServe({
        mockPath: "./src/api/mock",
        localEnabled: true,
      }),
    ],
    server: {
      proxy: {
        "/api": {
          target: config.VITE_SERVE,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
