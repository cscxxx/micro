import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { devConfig, prodConfig } from "./vite-proxy.config.js";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const baseConfig = {
    plugins: [react()],
  };

  // 开发环境配置
  if (command === "serve") {
    return {
      ...baseConfig,
      ...devConfig,
    };
  }

  // 生产环境配置
  return {
    ...baseConfig,
    ...prodConfig,
  };
});
