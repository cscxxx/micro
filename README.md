# 🚀 微服务管理系统

一个现代化的微服务架构项目，包含完整的后端服务和前端应用，支持用户管理、产品管理、订单管理和文件管理等功能。

## ✨ 项目特性

- 🏗️ **微服务架构** - 独立部署的服务，易于扩展和维护
- 🔐 **JWT 认证** - 安全的用户认证和授权机制
- 📁 **文件管理** - 支持文件上传、下载和管理
- 🎨 **现代前端** - 基于 React + Vite 的响应式界面
- 🗄️ **数据库分离** - 每个服务独立的数据库
- ⚙️ **配置管理** - 统一的配置管理和环境变量支持
- 🛠️ **开发工具** - 完善的数据库管理和检查工具

## 📚 文档导航

### 🏃‍♂️ 快速开始

- [快速开始指南](docs/getting-started/quick-start.md) - 一键启动和基本使用
- [故障排除指南](docs/getting-started/troubleshooting.md) - 常见问题解决方案

### 🎯 功能特性

- [认证系统](docs/features/authentication.md) - 用户认证和授权详细说明
- [API 文档](docs/api/reference.md) - 完整的 API 接口参考

### 🛠️ 开发相关

- [开发指南](docs/development/guide.md) - 开发环境设置和代码规范
- [贡献指南](docs/development/guide.md#贡献指南) - 如何参与项目开发

## 📁 项目结构

```
micro/
├── backend/                   # 后端微服务
│   ├── user-service/         # 用户管理服务 (端口 3001)
│   ├── product-service/      # 产品管理服务 (端口 3002)
│   ├── order-service/        # 订单管理服务 (端口 3003)
│   ├── file-service/         # 文件管理服务 (端口 3004)
│   ├── config.js             # 统一配置文件
│   ├── check-db.js           # 数据库检查工具
│   ├── setup-db.js           # 数据库设置工具
│   ├── start.js              # 服务启动脚本
│   └── stop.js               # 服务停止脚本
├── frontend/                 # 前端应用
│   ├── react-app/           # React 主应用 (端口 5173)
│   ├── mobile-app/          # 移动应用 (预留)
│   └── admin-dashboard/     # 管理后台 (预留)
├── docs/                     # 项目文档
│   ├── getting-started/     # 快速开始指南
│   ├── features/            # 功能特性说明
│   ├── development/         # 开发相关文档
│   └── api/                 # API 文档
└── README.md               # 项目说明文档
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

## 🚀 快速开始

### 一键启动

```bash
# 1. 检查数据库
cd backend
npm run check:verbose

# 2. 设置数据库（首次运行）
npm run setup

# 3. 启动所有服务
npm start

# 4. 启动前端（新终端）
cd ../frontend/react-app
npm run dev
```

### 访问地址

- **前端应用**: http://localhost:5173
- **用户服务**: http://localhost:3001
- **产品服务**: http://localhost:3002
- **订单服务**: http://localhost:3003
- **文件服务**: http://localhost:3004

### 测试账户

| 角色     | 用户名 | 密码     | 邮箱              |
| -------- | ------ | -------- | ----------------- |
| 管理员   | admin  | admin123 | admin@example.com |
| 普通用户 | user1  | user123  | user1@example.com |

> 📖 详细安装步骤和故障排除请查看 [快速开始指南](docs/getting-started/quick-start.md)

## 🗄️ 数据库配置

每个微服务使用独立的 MySQL 数据库：

| 服务     | 数据库名                   | 端口 | 主要表     |
| -------- | -------------------------- | ---- | ---------- |
| 用户服务 | `micro_user_service_db`    | 3001 | `users`    |
| 产品服务 | `micro_product_service_db` | 3002 | `products` |
| 订单服务 | `micro_order_service_db`   | 3003 | `orders`   |
| 文件服务 | `micro_file_service_db`    | 3004 | `files`    |

> 📖 详细的数据库管理和 API 文档请查看 [API 文档](docs/api/reference.md)

## 🛠️ 开发工具

### 常用命令

```bash
# 数据库管理
npm run check:verbose    # 详细检查数据库
npm run check:tables     # 检查表结构
npm run setup            # 设置数据库
npm run setup:force      # 强制重新创建

# 服务管理
npm start                # 启动所有服务
npm run stop             # 停止所有服务
npm run dev              # 开发模式启动
```

> 📖 详细的开发指南和故障排除请查看 [开发指南](docs/development/guide.md)

## 📈 未来规划

- 📱 **移动应用** - 在 `frontend/mobile-app/` 开发移动端
- 🎛️ **管理后台** - 在 `frontend/admin-dashboard/` 开发管理界面
- 🔍 **监控系统** - 添加服务监控和日志管理
- 🧪 **测试覆盖** - 完善单元测试和集成测试
- 📊 **性能优化** - 数据库优化和缓存机制
- 🔒 **安全加固** - 增强安全防护和权限控制

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
