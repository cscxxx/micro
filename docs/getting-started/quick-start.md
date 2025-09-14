# 🚀 快速开始指南

## 一键启动

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

## 访问地址

- **前端应用**: http://localhost:5173
- **用户服务**: http://localhost:3001
- **产品服务**: http://localhost:3002
- **订单服务**: http://localhost:3003
- **文件服务**: http://localhost:3004

## 测试账户

| 角色     | 用户名 | 密码     | 邮箱              |
| -------- | ------ | -------- | ----------------- |
| 管理员   | admin  | admin123 | admin@example.com |
| 普通用户 | user1  | user123  | user1@example.com |

## 常用命令

```bash
# 数据库管理
npm run check:verbose    # 详细检查数据库
npm run check:tables     # 检查表结构
npm run setup            # 设置数据库
npm run setup:force      # 强制重新创建
npm run help:db          # 显示数据库工具帮助

# 服务管理
npm start                # 启动所有服务
npm run stop             # 停止所有服务
npm run dev              # 开发模式启动

# 开发工具
npm test                 # 运行测试
```

## 故障排除

### 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3001
lsof -i :3002
lsof -i :3003
lsof -i :3004

# 杀死进程
kill -9 <PID>
```

### 数据库连接失败

```bash
# 检查数据库状态
npm run check:verbose

# 重新设置数据库
npm run setup:force
```

### 服务启动失败

```bash
# 检查依赖
npm install

# 检查配置
cat backend/.env
```

## 环境要求

- Node.js >= 16.0.0
- MySQL >= 5.7
- npm >= 8.0.0

## 详细安装步骤

### 1. 克隆项目

```bash
git clone <repository-url>
cd micro
```

### 2. 数据库设置

1. 确保 MySQL 服务器运行在 `192.168.1.2:3306`
2. 创建数据库用户（可选，默认使用 root）

```bash
cd backend
# 检查数据库连接
node check-db.js --verbose

# 设置数据库和表结构
node setup-db.js --verbose
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

### 4. 启动服务

#### 方式一：一键启动（推荐）

```bash
# 启动所有后端服务
cd backend
npm start

# 启动前端应用（新终端）
cd frontend/react-app
npm run dev
```

#### 方式二：单独启动

```bash
# 启动后端服务
cd backend
node start.js

# 或单独启动各服务
cd user-service && npm start     # 端口 3001
cd product-service && npm start  # 端口 3002
cd order-service && npm start    # 端口 3003
cd file-service && npm start     # 端口 3004

# 启动前端应用
cd frontend/react-app
npm run dev                      # 端口 5173
```
