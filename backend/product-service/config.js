// 产品服务配置文件
require("dotenv").config();

const config = {
  // 环境配置
  env: process.env.NODE_ENV || "development",

  // 数据库配置
  database: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "micro_product_service_db",
    charset: "utf8mb4",
    timezone: "+08:00",
  },

  // 服务配置
  service: {
    port: process.env.PORT || 3002,
    name: "产品服务",
    baseUrl: process.env.SERVICE_URL || "http://localhost:3002",
  },

  // 安全配置
  security: {
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15分钟
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 每窗口期最大请求数
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
  },
};

module.exports = config;
