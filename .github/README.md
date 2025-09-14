# 🚀 微服务管理系统

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![MySQL Version](https://img.shields.io/badge/mysql-%3E%3D5.7-blue)](https://www.mysql.com/)

一个现代化的微服务架构项目，包含完整的后端服务和前端应用，支持用户管理、产品管理、订单管理和文件管理等功能。

## ✨ 项目特性

- 🏗️ **微服务架构** - 独立部署的服务，易于扩展和维护
- 🔐 **JWT 认证** - 安全的用户认证和授权机制
- 📁 **文件管理** - 支持文件上传、下载和管理
- 🎨 **现代前端** - 基于 React + Vite 的响应式界面
- 🗄️ **数据库分离** - 每个服务独立的数据库
- ⚙️ **配置管理** - 统一的配置管理和环境变量支持
- 🛠️ **开发工具** - 完善的数据库管理和检查工具

## 🚀 快速开始

### 一键启动

```bash
# 1. 克隆项目
git clone <repository-url>
cd micro

# 2. 检查数据库
cd backend
npm run check:verbose

# 3. 设置数据库（首次运行）
npm run setup

# 4. 启动所有服务
npm start

# 5. 启动前端（新终端）
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

## 📚 文档

- [快速开始指南](docs/getting-started/quick-start.md)
- [API 文档](docs/api/reference.md)
- [认证系统](docs/features/authentication.md)
- [开发指南](docs/development/guide.md)
- [故障排除](docs/getting-started/troubleshooting.md)

## 🛠️ 技术栈

### 后端

- Node.js + Express.js
- MySQL 数据库
- JWT 认证
- bcryptjs 密码加密

### 前端

- React 18 + Vite
- Axios HTTP 客户端
- CSS Modules

## 📁 项目结构

```
micro/
├── backend/                   # 后端微服务
│   ├── user-service/         # 用户管理服务
│   ├── product-service/      # 产品管理服务
│   ├── order-service/        # 订单管理服务
│   ├── file-service/         # 文件管理服务
│   └── ...
├── frontend/                 # 前端应用
│   └── react-app/           # React 主应用
└── docs/                     # 项目文档
```

## 🤝 贡献

欢迎贡献代码！请查看 [贡献指南](docs/development/guide.md#贡献指南) 了解如何参与项目开发。

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 支持

如有问题，请：

1. 查看 [故障排除指南](docs/getting-started/troubleshooting.md)
2. 创建 Issue 描述问题
3. 联系开发团队

---

**开始使用**: [快速开始指南](docs/getting-started/quick-start.md) | **API 文档**: [API 参考](docs/api/reference.md) | **开发指南**: [开发文档](docs/development/guide.md)
