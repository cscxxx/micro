# 🔧 故障排除指南

## 常见问题

### 1. 端口被占用

**问题**: 启动服务时提示端口已被占用

**解决方案**:

```bash
# 查找占用端口的进程
lsof -i :3001
lsof -i :3002
lsof -i :3003
lsof -i :3004

# 杀死进程
kill -9 <PID>

# 或者使用 pkill
pkill -f "node.*server.js"
```

### 2. 数据库连接失败

**问题**: 无法连接到 MySQL 数据库

**解决方案**:

```bash
# 检查数据库状态
npm run check:verbose

# 检查 MySQL 服务是否运行
brew services list | grep mysql
# 或
systemctl status mysql

# 启动 MySQL 服务
brew services start mysql
# 或
systemctl start mysql

# 重新设置数据库
npm run setup:force
```

**检查项目**:

- MySQL 服务是否运行
- 数据库配置是否正确
- 网络连接是否正常
- 防火墙设置

### 3. 服务启动失败

**问题**: 服务无法正常启动

**解决方案**:

```bash
# 检查依赖是否安装完整
npm install

# 检查 Node.js 版本
node --version  # 需要 >= 16.0.0

# 检查配置文件
cat backend/.env

# 查看详细错误信息
npm start --verbose
```

### 4. 前端无法连接后端

**问题**: 前端应用无法访问后端 API

**解决方案**:

```bash
# 检查后端服务是否运行
curl http://localhost:3001
curl http://localhost:3002
curl http://localhost:3003
curl http://localhost:3004

# 检查 CORS 配置
# 查看 backend/config.js 中的 CORS 设置

# 检查代理配置
# 查看 frontend/react-app/vite.config.js
```

### 5. 认证失败

**问题**: 用户登录或 Token 验证失败

**解决方案**:

```bash
# 检查 JWT 配置
grep JWT_SECRET backend/.env

# 重新生成 JWT Secret
# 在 backend/.env 中设置新的 JWT_SECRET

# 清除浏览器存储
# 在浏览器开发者工具中清除 localStorage 和 sessionStorage
```

### 6. 文件上传失败

**问题**: 文件上传功能不工作

**解决方案**:

```bash
# 检查文件服务是否运行
curl http://localhost:3004/api/files

# 检查文件目录权限
ls -la backend/files/

# 创建文件目录
mkdir -p backend/files

# 设置目录权限
chmod 755 backend/files
```

## 环境问题

### Node.js 版本问题

**问题**: Node.js 版本过低

**解决方案**:

```bash
# 使用 nvm 管理 Node.js 版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 或使用 Homebrew
brew install node@18
```

### MySQL 连接问题

**问题**: MySQL 连接超时或拒绝连接

**解决方案**:

```bash
# 检查 MySQL 配置
mysql -u root -p -e "SHOW VARIABLES LIKE 'bind_address';"

# 修改 MySQL 配置允许远程连接
# 编辑 /etc/mysql/mysql.conf.d/mysqld.cnf
# 设置 bind-address = 0.0.0.0

# 重启 MySQL 服务
brew services restart mysql
# 或
systemctl restart mysql
```

### 权限问题

**问题**: 文件权限不足

**解决方案**:

```bash
# 设置正确的文件权限
chmod -R 755 backend/
chmod -R 755 frontend/

# 设置文件上传目录权限
chmod 777 backend/files/
```

## 性能问题

### 内存不足

**问题**: 服务运行缓慢或崩溃

**解决方案**:

```bash
# 检查内存使用情况
top -p $(pgrep node)

# 增加 Node.js 内存限制
node --max-old-space-size=4096 start.js

# 使用 PM2 管理进程
npm install -g pm2
pm2 start start.js --name "micro-backend"
```

### 数据库性能

**问题**: 数据库查询缓慢

**解决方案**:

```bash
# 检查数据库性能
mysql -u root -p -e "SHOW PROCESSLIST;"

# 优化查询
# 添加适当的索引
# 使用 EXPLAIN 分析查询计划
```

## 日志分析

### 后端日志

```bash
# 查看服务日志
npm start 2>&1 | tee backend.log

# 查看特定服务日志
cd user-service && node server.js 2>&1 | tee user-service.log
```

### 前端日志

1. 打开浏览器开发者工具 (F12)
2. 查看 Console 标签页
3. 查看 Network 标签页检查 API 请求
4. 查看 Application 标签页检查存储

### 数据库日志

```bash
# 查看 MySQL 错误日志
tail -f /usr/local/var/mysql/*.err

# 或
tail -f /var/log/mysql/error.log
```

## 调试技巧

### 启用详细日志

```bash
# 后端调试
DEBUG=* npm start

# 前端调试
npm run dev -- --verbose
```

### 使用调试器

```bash
# 使用 Node.js 调试器
node --inspect start.js

# 在 Chrome 中打开 chrome://inspect
# 点击 "Open dedicated DevTools for Node"
```

### 网络调试

```bash
# 使用 curl 测试 API
curl -v http://localhost:3001/api/users

# 使用 Postman 或 Insomnia 测试 API
# 导入 API 集合进行测试
```

## 重置环境

### 完全重置

```bash
# 停止所有服务
npm run stop

# 清理 node_modules
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/react-app/node_modules

# 清理数据库
mysql -u root -p -e "DROP DATABASE IF EXISTS micro_user_service_db;"
mysql -u root -p -e "DROP DATABASE IF EXISTS micro_product_service_db;"
mysql -u root -p -e "DROP DATABASE IF EXISTS micro_order_service_db;"
mysql -u root -p -e "DROP DATABASE IF EXISTS micro_file_service_db;"

# 重新安装和设置
npm install
cd backend && npm install
cd ../frontend/react-app && npm install
cd ../../backend && npm run setup
```

### 部分重置

```bash
# 只重置数据库
npm run setup:force

# 只重置特定服务
npm run setup:user
```

## 获取帮助

### 检查系统状态

```bash
# 系统信息
uname -a
node --version
npm --version
mysql --version

# 服务状态
ps aux | grep node
lsof -i :3001-3004
```

### 收集日志

```bash
# 创建日志收集脚本
cat > collect_logs.sh << 'EOF'
#!/bin/bash
echo "=== 系统信息 ===" > debug.log
uname -a >> debug.log
node --version >> debug.log
npm --version >> debug.log
mysql --version >> debug.log

echo "=== 进程信息 ===" >> debug.log
ps aux | grep node >> debug.log

echo "=== 端口信息 ===" >> debug.log
lsof -i :3001-3004 >> debug.log

echo "=== 配置文件 ===" >> debug.log
cat backend/.env >> debug.log
EOF

chmod +x collect_logs.sh
./collect_logs.sh
```

### 联系支持

如果问题仍然存在，请提供以下信息：

1. 操作系统和版本
2. Node.js 和 npm 版本
3. MySQL 版本
4. 错误日志
5. 重现步骤
6. 系统状态信息

创建 Issue 时请包含这些信息，以便快速定位和解决问题。
