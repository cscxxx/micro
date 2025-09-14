# 微服务配置说明

## 环境变量配置

创建 `.env` 文件在 `backend` 目录下，包含以下配置：

```bash
# 环境配置
NODE_ENV=development

# 数据库配置
DB_HOST=192.168.1.2
DB_USER=root
DB_PASSWORD=Chao123456@
DB_NAME_USER=micro_user_service_db
DB_NAME_PRODUCT=micro_product_service_db
DB_NAME_ORDER=micro_order_service_db
DB_NAME_FILE=micro_file_service_db

# 服务端口配置
USER_SERVICE_PORT=3001
PRODUCT_SERVICE_PORT=3002
ORDER_SERVICE_PORT=3003
FILE_SERVICE_PORT=3004

# 服务URL配置
USER_SERVICE_URL=http://localhost:3001
PRODUCT_SERVICE_URL=http://localhost:3002
ORDER_SERVICE_URL=http://localhost:3003
FILE_SERVICE_URL=http://localhost:3004

# JWT配置
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
JWT_ISSUER=micro-service-system

# 文件上传配置
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf,text/plain
UPLOAD_DIR=./files

# CORS配置
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# 测试账户配置
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@example.com
USER1_USERNAME=user1
USER1_PASSWORD=user123
USER1_EMAIL=user1@example.com

# 日志配置
LOG_LEVEL=info
LOG_FORMAT=combined

# 安全配置
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

## 配置使用说明

### 1. 数据库配置

```javascript
const config = require("./config");
const dbConfig = config.getDatabaseConfig("user"); // 获取用户服务数据库配置
```

### 2. 服务配置

```javascript
const config = require("./config");
const serviceConfig = config.getServiceConfig("user"); // 获取用户服务配置
```

### 3. 直接访问配置

```javascript
const config = require("./config");
console.log(config.database.host); // 数据库主机
console.log(config.services.user.port); // 用户服务端口
console.log(config.jwt.secret); // JWT密钥
```

## 配置特性

- ✅ 环境变量支持
- ✅ 默认值配置
- ✅ 类型转换
- ✅ 服务特定配置获取
- ✅ 统一的配置管理
- ✅ 开发和生产环境分离
