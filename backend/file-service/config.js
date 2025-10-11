// 文件服务配置文件
require("dotenv").config();

const config = {
  // 环境配置
  env: process.env.NODE_ENV || "development",

  // 数据库配置
  database: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "micro_file_service_db",
    charset: "utf8mb4",
    timezone: "+08:00",
  },

  // 服务配置
  service: {
    port: process.env.PORT || 3004,
    name: "文件服务",
    baseUrl: process.env.SERVICE_URL || "http://localhost:3004",
  },

  // 文件上传配置
  upload: {
    maxFileSize: process.env.MAX_FILE_SIZE || 10 * 1024 * 1024, // 10MB
    allowedTypes: process.env.ALLOWED_FILE_TYPES
      ? process.env.ALLOWED_FILE_TYPES.split(",")
      : [
          "image/jpeg",
          "image/png",
          "image/gif",
          "application/pdf",
          "text/plain",
        ],
    uploadDir: process.env.UPLOAD_DIR || "./uploads",
  },

  // 安全配置
  security: {
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000,
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
  },
};

module.exports = config;
