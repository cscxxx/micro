# 🛠️ 开发指南

## 项目架构

### 微服务架构

本项目采用微服务架构，每个服务独立部署和扩展：

```
micro/
├── backend/                   # 后端微服务
│   ├── user-service/         # 用户管理服务
│   ├── product-service/      # 产品管理服务
│   ├── order-service/        # 订单管理服务
│   ├── file-service/         # 文件管理服务
│   ├── config.js             # 统一配置文件
│   ├── check-db.js           # 数据库检查工具
│   ├── setup-db.js           # 数据库设置工具
│   ├── start.js              # 服务启动脚本
│   └── stop.js               # 服务停止脚本
├── frontend/                 # 前端应用
│   └── react-app/           # React 主应用
└── docs/                     # 项目文档
```

## 🛠️ 技术栈

### 后端技术

- **Node.js** - JavaScript 运行时
- **Express.js** - Web 应用框架
- **MySQL** - 关系型数据库
- **JWT** - JSON Web Token 认证
- **bcryptjs** - 密码加密
- **multer** - 文件上传处理
- **CORS** - 跨域资源共享
- **dotenv** - 环境变量管理

### 前端技术

- **React 18** - 用户界面库
- **Vite** - 快速构建工具
- **Axios** - HTTP 客户端
- **CSS Modules** - 样式模块化

## 🚀 开发环境设置

### 1. 环境要求

- Node.js >= 16.0.0
- MySQL >= 5.7
- npm >= 8.0.0

### 2. 克隆项目

```bash
git clone <repository-url>
cd micro
```

### 3. 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装各服务依赖
cd user-service && npm install
cd ../product-service && npm install
cd ../order-service && npm install
cd ../file-service && npm install

# 安装前端依赖
cd ../../frontend/react-app
npm install
```

### 4. 数据库设置

```bash
cd backend
# 检查数据库连接
npm run check:verbose

# 设置数据库和表结构
npm run setup
```

### 5. 启动开发环境

```bash
# 启动所有后端服务
cd backend
npm start

# 启动前端应用（新终端）
cd frontend/react-app
npm run dev
```

## 📁 代码结构

### 后端服务结构

每个微服务都遵循相同的结构：

```
service-name/
├── server.js              # 服务主文件
├── package.json           # 依赖配置
└── README.md             # 服务说明
```

### 前端应用结构

```
frontend/react-app/src/
├── components/            # 可复用组件
│   ├── Layout.jsx        # 布局组件
│   └── ProtectedRoute.jsx # 路由保护组件
├── pages/                # 页面组件
│   ├── Login.jsx         # 登录页面
│   ├── Register.jsx      # 注册页面
│   ├── Dashboard.jsx     # 仪表板
│   └── ...
├── services/             # API 服务
│   └── api.js           # API 调用封装
├── utils/                # 工具函数
│   └── axios.js         # HTTP 客户端配置
├── styles/               # 样式文件
└── config/               # 配置文件
```

## 🔧 开发工具

### 数据库管理

```bash
# 检查数据库状态
npm run check                    # 基本检查
npm run check:verbose           # 详细检查
npm run check:tables            # 检查表结构

# 设置数据库
npm run setup                   # 基本设置
npm run setup:force            # 强制重新创建
npm run setup:user             # 只设置用户数据库

# 查看帮助
npm run help:db                 # 显示数据库工具帮助
```

### 服务管理

```bash
# 启动和停止
npm start                       # 启动所有服务
npm run stop                    # 停止所有服务
npm run dev                     # 开发模式启动

# 测试
npm test                        # 运行测试
```

## 🗄️ 数据库设计

### 数据库分离

每个微服务使用独立的数据库：

| 服务     | 数据库名                   | 主要表     |
| -------- | -------------------------- | ---------- |
| 用户服务 | `micro_user_service_db`    | `users`    |
| 产品服务 | `micro_product_service_db` | `products` |
| 订单服务 | `micro_order_service_db`   | `orders`   |
| 文件服务 | `micro_file_service_db`    | `files`    |

### 表结构设计

#### 用户表 (users)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 产品表 (products)

```sql
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 订单表 (orders)

```sql
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 文件表 (files)

```sql
CREATE TABLE files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  originalname VARCHAR(255) NOT NULL,
  mimetype VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  path VARCHAR(500) NOT NULL,
  description TEXT,
  upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔐 认证和授权

### JWT Token 配置

```javascript
const jwtConfig = {
  secret: process.env.JWT_SECRET || "your-secret-key",
  expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  issuer: process.env.JWT_ISSUER || "micro-service-system",
};
```

### 中间件使用

```javascript
// 认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "访问令牌缺失" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "访问令牌无效" });
    }
    req.user = user;
    next();
  });
};
```

## 🧪 测试

### 运行测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- --grep "用户认证"
```

### 测试覆盖

- ✅ 用户注册和登录
- ✅ API 接口测试
- ✅ 数据库连接测试
- ✅ 文件上传测试

## 📝 代码规范

### JavaScript 规范

- 使用 ES6+ 语法
- 使用 const/let 替代 var
- 使用箭头函数
- 使用模板字符串
- 使用解构赋值

### 文件命名

- 组件文件使用 PascalCase: `UserProfile.jsx`
- 工具文件使用 camelCase: `apiUtils.js`
- 常量文件使用 UPPER_SNAKE_CASE: `API_CONSTANTS.js`

### 注释规范

```javascript
/**
 * 用户认证中间件
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 * @param {Function} next - 下一个中间件
 */
const authenticateToken = (req, res, next) => {
  // 实现逻辑
};
```

## 🚀 部署

### 生产环境配置

1. 设置环境变量
2. 配置数据库连接
3. 使用 PM2 管理进程
4. 配置 Nginx 反向代理
5. 设置 SSL 证书

### Docker 部署

```dockerfile
# Dockerfile 示例
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3001-3004

CMD ["npm", "start"]
```

## 🔍 调试

### 后端调试

```bash
# 启用调试模式
DEBUG=* npm start

# 查看特定服务日志
npm start 2>&1 | grep "用户服务"
```

### 前端调试

```bash
# 启用详细日志
npm run dev -- --verbose

# 使用浏览器开发者工具
# 打开 http://localhost:5173
# 按 F12 打开开发者工具
```

## 📊 性能优化

### 数据库优化

- 使用索引优化查询
- 分页查询大量数据
- 使用连接池管理连接

### 前端优化

- 使用 React.memo 优化组件渲染
- 使用 useMemo 和 useCallback 优化计算
- 代码分割和懒加载

## 🤝 贡献指南

### 开发流程

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -m 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建过程或辅助工具的变动
```

## 📞 支持

如有问题，请：

1. 查看 [故障排除指南](getting-started/troubleshooting.md)
2. 查看 [API 文档](api/reference.md)
3. 创建 Issue 描述问题
4. 联系开发团队
