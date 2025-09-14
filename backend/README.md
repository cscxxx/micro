# 微服务后端系统

简化的微服务后端管理系统，包含用户、产品、订单和文件服务。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 设置数据库

```bash
npm run setup
```

### 3. 检查数据库连接

```bash
npm run check
```

### 4. 启动所有服务

```bash
npm start
```

### 5. 运行测试

```bash
npm test
```

### 6. 停止服务

```bash
npm stop
```

## 📋 可用命令

| 命令            | 说明               |
| --------------- | ------------------ |
| `npm run setup` | 创建数据库和表结构 |
| `npm run check` | 检查数据库连接     |
| `npm start`     | 启动所有微服务     |
| `npm test`      | 运行认证系统测试   |
| `npm stop`      | 停止所有服务       |

## 🔧 服务信息

- **用户服务**: http://localhost:3001
- **产品服务**: http://localhost:3002
- **订单服务**: http://localhost:3003
- **文件服务**: http://localhost:3004
- **前端应用**: http://localhost:5173

## 👤 测试账户

- **管理员**: admin / admin123
- **普通用户**: user1 / user123

## 🔗 访问地址

- **登录页面**: http://localhost:5173/login
- **注册页面**: http://localhost:5173/register
- **管理后台**: http://localhost:5173/dashboard

## 📁 文件说明

- `config.js` - 统一配置文件
- `setup-db.js` - 数据库设置脚本
- `check-db.js` - 数据库检查脚本
- `start.js` - 服务启动脚本
- `test.js` - 测试脚本
- `stop.js` - 服务停止脚本
- `file-service/` - 文件服务目录
- `files/` - 文件存储目录
