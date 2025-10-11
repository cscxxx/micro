# 微服务构建指南

本文档介绍如何构建和部署微服务后端项目。

## 🚀 快速开始

### 独立部署单个服务

```bash
# 进入服务目录
cd user-service

# 一键部署
npm run deploy
```

### 批量部署所有服务

```bash
# 在backend目录下
npm run deploy
```

### 管理服务状态

```bash
# 进入服务目录
cd user-service

# 查看状态
npm run deploy:status

# 查看日志
npm run deploy:logs

# 重启服务
npm run deploy:restart
```

## 项目结构

```
backend/
├── user-service/          # 用户管理服务 (端口: 3001)
│   ├── config.js          # 用户服务独立配置
│   ├── setup-db.js        # 用户服务数据库设置脚本
│   ├── check-db.js        # 用户服务数据库检查脚本
│   ├── env.example        # 用户服务环境变量示例
│   ├── package.sh         # 用户服务打包脚本
│   ├── deploy.sh          # 用户服务独立部署脚本
│   └── ecosystem.config.js # PM2配置文件
├── product-service/       # 产品管理服务 (端口: 3002)
│   ├── config.js          # 产品服务独立配置
│   ├── setup-db.js        # 产品服务数据库设置脚本
│   ├── check-db.js        # 产品服务数据库检查脚本
│   ├── env.example        # 产品服务环境变量示例
│   ├── package.sh         # 产品服务打包脚本
│   ├── deploy.sh          # 产品服务独立部署脚本
│   └── ecosystem.config.js # PM2配置文件
├── order-service/         # 订单管理服务 (端口: 3003)
│   ├── config.js          # 订单服务独立配置
│   ├── setup-db.js        # 订单服务数据库设置脚本
│   ├── env.example        # 订单服务环境变量示例
│   ├── package.sh         # 订单服务打包脚本
│   ├── deploy.sh          # 订单服务独立部署脚本
│   └── ecosystem.config.js # PM2配置文件
├── file-service/          # 文件管理服务 (端口: 3004)
│   ├── config.js          # 文件服务独立配置
│   ├── setup-db.js        # 文件服务数据库设置脚本
│   ├── env.example        # 文件服务环境变量示例
│   ├── package.sh         # 文件服务打包脚本
│   ├── deploy.sh          # 文件服务独立部署脚本
│   └── ecosystem.config.js # PM2配置文件
└── package.json          # 主项目配置
```

## 独立服务配置

每个微服务现在都有独立的配置和数据库管理：

### 服务独立配置

- **config.js**: 每个服务的独立配置文件
- **setup-db.js**: 每个服务的数据库设置脚本
- **check-db.js**: 每个服务的数据库检查脚本
- **env.example**: 每个服务的环境变量示例文件
- **deploy.sh**: 每个服务的独立部署脚本
- **package.sh**: 每个服务的独立打包脚本

### 独立数据库管理

每个服务可以独立管理自己的数据库：

```bash
# 设置单个服务的数据库
cd user-service
npm run setup:db

# 检查单个服务的数据库
cd user-service
npm run check:db

# 设置所有服务的数据库
npm run setup

# 检查所有服务的数据库
npm run check
```

### 独立部署管理

每个服务都有独立的部署脚本，可以单独部署和管理：

```bash
# 部署单个服务
cd user-service
npm run deploy

# 部署单个服务（开发环境）
cd user-service
npm run deploy:dev

# 仅打包服务
cd user-service
npm run deploy:package

# 仅上传服务
cd user-service
npm run deploy:upload

# 管理服务状态
cd user-service
npm run deploy:start    # 启动服务
npm run deploy:stop     # 停止服务
npm run deploy:restart  # 重启服务
npm run deploy:status   # 查看状态
npm run deploy:logs     # 查看日志

# 部署所有服务
npm run deploy
```

## 构建命令

### 1. 打包部署（推荐）

#### 打包单个服务

```bash
# 进入服务目录打包
cd user-service
npm run package

cd ../product-service
npm run package

cd ../order-service
npm run package

cd ../file-service
npm run package
```

#### 批量打包所有服务

```bash
# 在backend目录下执行
cd user-service && npm run package && cd ..
cd product-service && npm run package && cd ..
cd order-service && npm run package && cd ..
cd file-service && npm run package && cd ..
```

### 2. 本地构建

#### 构建所有服务

```bash
npm run build
```

#### 构建单个服务

```bash
npm run build:user        # 构建用户服务
npm run build:product     # 构建产品服务
npm run build:order       # 构建订单服务
npm run build:file        # 构建文件服务
```

#### 清理构建

```bash
npm run build:clean       # 清理所有服务并重新构建
```

### 2. 服务器部署

#### 上传打包文件到服务器

```bash
# 上传所有服务的打包文件
scp user-service/user-service.tar.gz user@your-server:/tmp/
scp product-service/product-service.tar.gz user@your-server:/tmp/
scp order-service/order-service.tar.gz user@your-server:/tmp/
scp file-service/file-service.tar.gz user@your-server:/tmp/

# 上传服务器部署脚本
scp server-deploy.sh user@your-server:/tmp/
```

#### 在服务器上部署

```bash
# 登录服务器
ssh user@your-server

# 执行部署
cd /tmp
chmod +x server-deploy.sh
./server-deploy.sh all deploy
./server-deploy.sh all start
```

## 环境配置

每个服务都有独立的环境配置：

### 配置步骤

1. 进入服务目录
2. 复制环境变量示例文件
3. 修改配置值

```bash
# 配置用户服务
cd user-service
cp env.example .env
# 编辑 .env 文件

# 配置产品服务
cd ../product-service
cp env.example .env
# 编辑 .env 文件

# 配置订单服务
cd ../order-service
cp env.example .env
# 编辑 .env 文件

# 配置文件服务
cd ../file-service
cp env.example .env
# 编辑 .env 文件
```

### 环境变量说明

每个服务的 `env.example` 文件包含该服务所需的所有环境变量配置，包括：

- 服务端口配置
- 数据库连接配置
- 服务特定配置（如 JWT 密钥、文件上传配置等）

## 健康检查

每个服务都包含健康检查端点：

- 用户服务: http://localhost:3001/health
- 产品服务: http://localhost:3002/health
- 订单服务: http://localhost:3003/health
- 文件服务: http://localhost:3004/health

## 部署流程

### 开发环境

1. 确保数据库已启动
2. 运行 `npm run setup` 初始化数据库
3. 运行 `npm run start` 启动所有服务

### 生产环境部署

#### 方式 1：独立部署单个服务（推荐）

```bash
# 进入服务目录
cd user-service

# 完整部署（打包+上传+部署）
npm run deploy

# 或者分步执行
npm run deploy:package  # 打包服务
npm run deploy:upload   # 上传到服务器
npm run deploy:start    # 启动服务
```

#### 方式 2：批量部署所有服务

```bash
# 在backend目录下
npm run deploy          # 部署所有服务
npm run deploy:user     # 仅部署用户服务
npm run deploy:product  # 仅部署产品服务
npm run deploy:order    # 仅部署订单服务
npm run deploy:file     # 仅部署文件服务
```

#### 方式 3：手动部署

```bash
# 1. 打包服务
cd user-service
npm run package

# 2. 上传到服务器
scp user-service.tar.gz csc@192.168.1.2:/home/csc/code/micro/backend/

# 3. 在服务器上部署
ssh csc@192.168.1.2
cd /home/csc/code/micro/backend
tar -xzf user-service.tar.gz -C user-service
cd user-service
cp env.example .env
pm2 start ecosystem.config.js --env production
```

## 故障排除

### 常见问题

1. **端口冲突**: 确保端口 3001-3004 未被占用
2. **数据库连接失败**: 检查数据库配置和网络连接
3. **PM2 服务启动失败**: 检查环境变量和依赖配置
4. **服务启动失败**: 查看 PM2 日志排查问题

### 查看服务状态

```bash
# 查看PM2进程状态
pm2 status

# 查看特定服务日志
pm2 logs user-service
pm2 logs product-service
pm2 logs order-service
pm2 logs file-service

# 查看所有服务日志
pm2 logs

# 重启特定服务
pm2 restart user-service
```

### 服务管理命令

#### 本地 PM2 管理

```bash
# 停止特定服务
pm2 stop user-service

# 删除特定服务
pm2 delete user-service

# 重新加载所有服务
pm2 reload all

# 保存PM2配置
pm2 save

# 设置PM2开机自启
pm2 startup
```

#### 远程服务管理（通过部署脚本）

```bash
# 进入服务目录
cd user-service

# 管理服务状态
npm run deploy:status   # 查看服务状态
npm run deploy:logs     # 查看服务日志
npm run deploy:start    # 启动服务
npm run deploy:stop     # 停止服务
npm run deploy:restart  # 重启服务

# 部署相关操作
npm run deploy:build    # 构建服务
npm run deploy:package  # 打包服务
npm run deploy:upload   # 上传到服务器
npm run deploy          # 完整部署
npm run deploy:dev      # 开发环境部署
```

## 性能优化

1. **PM2 集群模式**: 可在 ecosystem.config.js 中配置多实例
2. **日志管理**: 自动日志轮转和清理
3. **内存监控**: PM2 自动重启内存超限的进程
4. **健康检查**: 定期检查服务状态

## 监控和维护

### 实时监控

```bash
# 打开PM2监控面板
pm2 monit

# 查看系统资源使用
pm2 show user-service
```

### 日志管理

```bash
# 查看实时日志
pm2 logs --lines 100

# 清空日志
pm2 flush

# 设置日志轮转
pm2 install pm2-logrotate
```

### 备份和恢复

```bash
# 保存当前PM2配置
pm2 save

# 恢复PM2配置
pm2 resurrect
```

## 打包部署到 Linux 服务器

### 部署流程

1. **本地打包**: 在各个服务目录下使用 `npm run package` 打包服务
2. **上传到服务器**: 将各服务目录下的 `.tar.gz` 文件上传到服务器
3. **服务器部署**: 使用 `server-deploy.sh` 脚本在服务器上部署
4. **启动服务**: 使用 PM2 管理服务运行

### 详细步骤

#### 1. 本地打包

```bash
# 打包各个服务
cd user-service && npm run package && cd ..
cd product-service && npm run package && cd ..
cd order-service && npm run package && cd ..
cd file-service && npm run package && cd ..

# 查看打包结果
ls -lh */service-name.tar.gz
```

#### 2. 上传到服务器

```bash
# 上传各个服务的打包文件
scp user-service/user-service.tar.gz user@your-server:/tmp/
scp product-service/product-service.tar.gz user@your-server:/tmp/
scp order-service/order-service.tar.gz user@your-server:/tmp/
scp file-service/file-service.tar.gz user@your-server:/tmp/

# 上传部署脚本
scp server-deploy.sh user@your-server:/tmp/
```

#### 3. 服务器部署

```bash
# 登录服务器
ssh user@your-server

# 执行部署
cd /tmp
chmod +x server-deploy.sh
./server-deploy.sh all deploy
./server-deploy.sh all start
```

#### 4. 配置环境变量

在服务器上为每个服务配置 `.env` 文件：

```bash
# 配置用户服务
cd /opt/microservices/user-service
cp .env.example .env  # 如果存在
# 编辑 .env 文件

# 配置其他服务...
```

#### 5. 验证部署

```bash
# 查看服务状态
pm2 status

# 查看服务日志
pm2 logs

# 测试服务
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
curl http://localhost:3004/health
```

### 服务器管理命令

#### 通过独立部署脚本管理

```bash
# 管理单个服务
cd user-service
npm run deploy:status   # 查看用户服务状态
npm run deploy:start    # 启动用户服务
npm run deploy:stop     # 停止用户服务
npm run deploy:restart  # 重启用户服务
npm run deploy:logs     # 查看用户服务日志

# 批量管理所有服务
npm run deploy:user     # 部署用户服务
npm run deploy:product  # 部署产品服务
npm run deploy:order    # 部署订单服务
npm run deploy:file     # 部署文件服务
```

#### 直接在服务器上管理

```bash
# 登录服务器
ssh csc@192.168.1.2

# 进入服务目录
cd /home/csc/code/micro/backend/user-service

# 使用PM2管理
pm2 status              # 查看所有服务状态
pm2 logs user-service   # 查看用户服务日志
pm2 restart user-service # 重启用户服务
pm2 stop user-service   # 停止用户服务
pm2 start ecosystem.config.js --env production # 启动服务
```

### 更新部署

#### 方式 1：使用独立部署脚本（推荐）

```bash
# 更新单个服务
cd user-service
npm run deploy  # 自动打包、上传、部署

# 更新所有服务
npm run deploy  # 在backend目录下执行
```

#### 方式 2：手动更新

```bash
# 1. 本地重新打包各个服务
cd user-service && npm run package && cd ..
cd product-service && npm run package && cd ..
cd order-service && npm run package && cd ..
cd file-service && npm run package && cd ..

# 2. 上传新版本
scp user-service/user-service.tar.gz csc@192.168.1.2:/home/csc/code/micro/backend/
scp product-service/product-service.tar.gz csc@192.168.1.2:/home/csc/code/micro/backend/
scp order-service/order-service.tar.gz csc@192.168.1.2:/home/csc/code/micro/backend/
scp file-service/file-service.tar.gz csc@192.168.1.2:/home/csc/code/micro/backend/

# 3. 在服务器上更新
ssh csc@192.168.1.2
cd /home/csc/code/micro/backend

# 更新用户服务
tar -xzf user-service.tar.gz -C user-service
cd user-service && pm2 restart user-service && cd ..

# 更新产品服务
tar -xzf product-service.tar.gz -C product-service
cd product-service && pm2 restart product-service && cd ..

# 更新订单服务
tar -xzf order-service.tar.gz -C order-service
cd order-service && pm2 restart order-service && cd ..

# 更新文件服务
tar -xzf file-service.tar.gz -C file-service
cd file-service && pm2 restart file-service && cd ..
```

## 📋 服务器信息

### 服务器配置

- **服务器地址**: 192.168.1.2
- **用户名**: csc
- **部署目录**: /home/csc/code/micro/backend/
- **服务端口**: 3001-3004

### 服务访问地址

- 用户服务: http://192.168.1.2:3001
- 产品服务: http://192.168.1.2:3002
- 订单服务: http://192.168.1.2:3003
- 文件服务: http://192.168.1.2:3004

### 健康检查

```bash
curl http://192.168.1.2:3001/health
curl http://192.168.1.2:3002/health
curl http://192.168.1.2:3003/health
curl http://192.168.1.2:3004/health
```

## 🔧 故障排除

### 常见问题

1. **部署失败**: 检查网络连接和服务器 SSH 配置
2. **服务启动失败**: 检查环境变量配置和数据库连接
3. **端口冲突**: 确保服务器端口 3001-3004 未被占用
4. **权限问题**: 确保部署脚本有执行权限

### 调试命令

```bash
# 检查服务状态
npm run deploy:status

# 查看服务日志
npm run deploy:logs

# 检查服务器连接
ssh csc@192.168.1.2 "pm2 status"

# 检查环境配置
cat .env

# 检查端口占用
netstat -tlnp | grep :3001
```
