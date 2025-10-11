#!/bin/bash

# 产品服务打包脚本
# 使用方法: ./package.sh

set -e

SERVICE_NAME="product-service"
PACKAGE_NAME="${SERVICE_NAME}.tar.gz"

echo "📦 打包产品服务..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 清理旧的打包文件
cleanup() {
    log_info "清理旧的打包文件..."
    rm -f $PACKAGE_NAME
    rm -rf temp-build
}

# 创建临时构建目录
create_temp_build() {
    log_step "创建临时构建目录..."
    mkdir -p temp-build
}

# 复制服务文件
copy_files() {
    log_step "复制服务文件..."
    cp -r . temp-build/ 2>/dev/null || true
    rm -rf temp-build/node_modules
    rm -rf temp-build/logs
    rm -rf temp-build/temp-build
    rm -f temp-build/*.tar.gz
}

# 构建生产依赖
build_dependencies() {
    log_step "构建生产依赖..."
    cd temp-build
    npm ci --only=production --silent
    cd ..
}

# 创建部署文件
create_deploy_files() {
    log_step "创建部署文件..."
    
    # 创建部署说明
    cat > temp-build/DEPLOY.md << 'EOF'
# 产品服务部署说明

## 部署步骤

1. 解压文件到目标目录
2. 配置环境变量文件 .env
3. 使用PM2启动服务

## 启动命令

```bash
# 启动服务
pm2 start ecosystem.config.js --env production

# 查看状态
pm2 status

# 查看日志
pm2 logs product-service
```

## 环境配置

请确保创建 .env 文件并配置以下变量：

- PORT=3002
- DB_HOST=your_db_host
- DB_USER=your_db_user
- DB_PASSWORD=your_db_password
- DB_NAME=product_db

## 服务管理

```bash
# 启动服务
./start.sh

# 停止服务
./stop.sh

# 重启服务
pm2 restart product-service

# 查看状态
pm2 status product-service
```
EOF

    # 创建启动脚本
    cat > temp-build/start.sh << 'EOF'
#!/bin/bash

# 产品服务启动脚本

echo "🚀 启动产品服务..."

# 检查.env文件
if [ ! -f ".env" ]; then
    echo "❌ 错误: .env 文件不存在"
    echo "请创建 .env 文件并配置环境变量"
    echo "参考 DEPLOY.md 文件"
    exit 1
fi

# 创建必要目录
mkdir -p logs

# 启动服务
pm2 start ecosystem.config.js --env production

echo "✅ 产品服务启动完成"
echo "查看状态: pm2 status"
echo "查看日志: pm2 logs product-service"
EOF

    chmod +x temp-build/start.sh
    
    # 创建停止脚本
    cat > temp-build/stop.sh << 'EOF'
#!/bin/bash

# 产品服务停止脚本

echo "🛑 停止产品服务..."

pm2 stop product-service 2>/dev/null || true
pm2 delete product-service 2>/dev/null || true

echo "✅ 产品服务停止完成"
EOF

    chmod +x temp-build/stop.sh
}

# 压缩打包
create_package() {
    log_step "压缩打包..."
    cd temp-build
    tar -czf "../$PACKAGE_NAME" .
    cd ..
    
    # 计算文件大小
    local file_size=$(du -h "$PACKAGE_NAME" | cut -f1)
    log_info "产品服务打包完成 (大小: $file_size)"
}

# 清理临时文件
cleanup_temp() {
    log_info "清理临时文件..."
    rm -rf temp-build
}

# 显示结果
show_result() {
    echo ""
    log_step "打包结果:"
    ls -lh $PACKAGE_NAME
    
    echo ""
    log_info "部署说明:"
    echo "1. 将 $PACKAGE_NAME 文件上传到服务器"
    echo "2. 在服务器上解压: tar -xzf $PACKAGE_NAME"
    echo "3. 配置 .env 文件"
    echo "4. 运行 ./start.sh 启动服务"
}

# 主函数
main() {
    cleanup
    create_temp_build
    copy_files
    build_dependencies
    create_deploy_files
    create_package
    cleanup_temp
    show_result
    
    log_info "产品服务打包完成!"
}

# 运行主函数
main
