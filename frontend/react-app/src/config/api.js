// API配置文件

// 环境配置
const ENV = {
  development: {
    // 开发环境使用vite代理，所有请求都通过 /api 前缀
    baseURL: "/api",
    timeout: 10000,
  },
  production: {
    // 生产环境直接指向后端服务
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
    timeout: 10000,
  },
};

// 当前环境配置
const currentEnv = import.meta.env.MODE || "development";
export const apiConfig = ENV[currentEnv] || ENV.development;

// 服务端点配置
export const endpoints = {
  // 用户服务
  users: {
    register: "/users/register",
    login: "/auth/login",
    me: "/auth/me",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    list: "/users",
    create: "/users",
    update: (id) => `/users/${id}`,
    delete: (id) => `/users/${id}`,
  },

  // 产品服务
  products: {
    list: "/products",
    create: "/products",
    update: (id) => `/products/${id}`,
    delete: (id) => `/products/${id}`,
  },

  // 订单服务
  orders: {
    list: "/orders",
    create: "/orders",
    update: (id) => `/orders/${id}`,
    delete: (id) => `/orders/${id}`,
  },

  // 文件服务
  files: {
    list: "/files",
    upload: "/files/upload",
    download: (id) => `/files/download/${id}`,
    delete: (id) => `/files/${id}`,
    batchDelete: "/files/batch",
    info: (id) => `/files/${id}`,
  },
};

// 导出默认配置
export default apiConfig;
