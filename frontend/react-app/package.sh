#!/bin/bash

# React前端应用打包脚本
# 使用方法: ./package.sh

set -e

APP_NAME="react-app"
PACKAGE_NAME="${APP_NAME}.tar.gz"

echo "📦 打包React前端应用..."

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

# 构建生产版本
build_production() {
    log_step "构建生产版本..."
    
    # 检查是否存在dist目录
    if [ -d "dist" ]; then
        log_info "发现现有dist目录，清理..."
        rm -rf dist
    fi
    
    # 构建生产版本
    npm run build
    
    # 检查构建是否成功
    if [ ! -d "dist" ]; then
        log_error "构建失败，dist目录不存在"
        exit 1
    fi
    
    log_info "✅ 生产版本构建完成"
}

# 复制构建文件
copy_build_files() {
    log_step "复制构建文件..."
    cp -r dist/* temp-build/
    
    # 复制必要的配置文件
    if [ -f "package.json" ]; then
        cp package.json temp-build/
    fi
    
    # 复制nginx配置文件
    if [ -f "nginx-react-app.conf" ]; then
        cp nginx-react-app.conf temp-build/
    fi
    
    log_info "✅ 构建文件复制完成"
}

# 创建部署文件
create_deploy_files() {
    log_step "创建部署文件..."
    
    # 复制部署说明文档
    if [ -f "nginx.md" ]; then
        cp nginx.md temp-build/DEPLOY.md
        log_info "✅ 复制nginx.md为DEPLOY.md"
    else
        log_warn "⚠️  nginx.md文件不存在，跳过复制"
    fi

    # 创建启动脚本
    cat > temp-build/start.sh << 'EOF'
#!/bin/bash

echo "🚀 启动React前端应用..."

echo "请执行以下命令："
echo "sudo systemctl start nginx"
echo "sudo systemctl enable nginx"
echo ""
echo "访问地址: http://192.168.1.2/"
EOF

    chmod +x temp-build/start.sh
    
    # 创建停止脚本
    cat > temp-build/stop.sh << 'EOF'
#!/bin/bash

echo "🛑 停止React前端应用..."
echo "sudo systemctl stop nginx"
EOF

    chmod +x temp-build/stop.sh
    
    # 创建重启脚本
    cat > temp-build/restart.sh << 'EOF'
#!/bin/bash

echo "🔄 重启React前端应用..."
echo "sudo systemctl restart nginx"
EOF

    chmod +x temp-build/restart.sh
}

# 压缩打包
create_package() {
    log_step "压缩打包..."
    cd temp-build
    tar -czf "../$PACKAGE_NAME" .
    cd ..
    
    # 计算文件大小
    local file_size=$(du -h "$PACKAGE_NAME" | cut -f1)
    log_info "React前端应用打包完成 (大小: $file_size)"
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
    echo "3. 配置Nginx服务器"
    echo "4. 运行 ./start.sh 启动服务"
    echo ""
    log_info "服务器信息:"
    echo "- 服务器地址: 192.168.1.2"
    echo "- 部署目录: /home/csc/code/micro/frontend/"
    echo "- 访问地址: http://192.168.1.2/"
}

# 主函数
main() {
    cleanup
    create_temp_build
    build_production
    copy_build_files
    create_deploy_files
    create_package
    cleanup_temp
    show_result
    
    log_info "React前端应用打包完成!"
}

# 运行主函数
main
