// Vite 代理配置文件
export const proxyConfig = {
  // 用户服务代理
  "/api/users": {
    target: "http://localhost:3001",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, "/api"),
  },

  // 认证服务代理
  "/api/auth": {
    target: "http://localhost:3001",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, "/api"),
  },

  // 产品服务代理
  "/api/products": {
    target: "http://localhost:3002",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, "/api"),
  },

  // 订单服务代理
  "/api/orders": {
    target: "http://localhost:3003",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, "/api"),
  },

  // 文件服务代理
  "/api/files": {
    target: "http://localhost:3004",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, "/api"),
  },
};

// 开发环境配置
export const devConfig = {
  server: {
    port: 5173,
    host: true,
    proxy: proxyConfig,
  },
};

// 生产环境配置（如果需要）
export const prodConfig = {
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          antd: ["antd"],
        },
      },
    },
  },
};
