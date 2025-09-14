// 统一配置文件
require("dotenv").config();

const config = {
  // 环境配置
  env: process.env.NODE_ENV || "development",

  // 数据库配置
  database: {
    host: process.env.DB_HOST || "192.168.1.2",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Chao123456@",
    charset: "utf8mb4",
    timezone: "+08:00",
    databases: {
      user: process.env.DB_NAME_USER || "micro_user_service_db",
      product: process.env.DB_NAME_PRODUCT || "micro_product_service_db",
      order: process.env.DB_NAME_ORDER || "micro_order_service_db",
      file: process.env.DB_NAME_FILE || "micro_file_service_db",
    },
  },

  // 服务配置
  services: {
    user: {
      port: process.env.USER_SERVICE_PORT || 3001,
      name: "用户服务",
      baseUrl: process.env.USER_SERVICE_URL || "http://localhost:3001",
    },
    product: {
      port: process.env.PRODUCT_SERVICE_PORT || 3002,
      name: "产品服务",
      baseUrl: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
    },
    order: {
      port: process.env.ORDER_SERVICE_PORT || 3003,
      name: "订单服务",
      baseUrl: process.env.ORDER_SERVICE_URL || "http://localhost:3003",
    },
    file: {
      port: process.env.FILE_SERVICE_PORT || 3004,
      name: "文件服务",
      baseUrl: process.env.FILE_SERVICE_URL || "http://localhost:3004",
    },
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    issuer: process.env.JWT_ISSUER || "micro-service-system",
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
    uploadDir: process.env.UPLOAD_DIR || "./files",
  },

  // CORS配置
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(",")
      : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  },

  // 测试账户
  testAccounts: {
    admin: {
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin123",
      email: process.env.ADMIN_EMAIL || "admin@example.com",
    },
    user1: {
      username: process.env.USER1_USERNAME || "user1",
      password: process.env.USER1_PASSWORD || "user123",
      email: process.env.USER1_EMAIL || "user1@example.com",
    },
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || "info",
    format: process.env.LOG_FORMAT || "combined",
  },

  // 安全配置
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 15 * 60 * 1000, // 15分钟
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100, // 每窗口期最大请求数
  },
};

// 获取特定服务的数据库配置
config.getDatabaseConfig = function (serviceName) {
  const dbName = this.database.databases[serviceName];
  if (!dbName) {
    throw new Error(`Unknown service: ${serviceName}`);
  }

  return {
    host: this.database.host,
    user: this.database.user,
    password: this.database.password,
    database: dbName,
    charset: this.database.charset,
    timezone: this.database.timezone,
  };
};

// 获取服务配置
config.getServiceConfig = function (serviceName) {
  const service = this.services[serviceName];
  if (!service) {
    throw new Error(`Unknown service: ${serviceName}`);
  }
  return service;
};

module.exports = config;
