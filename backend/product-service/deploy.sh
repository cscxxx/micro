#!/bin/bash

# 产品服务独立部署脚本
# 使用方法: ./deploy.sh [环境] [操作]
# 环境: dev, prod (默认: prod)
# 操作: build, package, upload, deploy, start, stop, restart, status, logs

set -e

ENVIRONMENT=${1:-prod}
ACTION=${2:-deploy}
SERVICE_NAME="product-service"
SERVICE_DIR=$(dirname "$0")
PROJECT_ROOT=$(dirname "$SERVICE_DIR")

echo "🚀 产品服务独立部署..."
echo "环境: $ENVIRONMENT"
echo "操作: $ACTION"

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

# 构建服务
build_service() {
    log_step "构建产品服务..."
    cd "$SERVICE_DIR"
    npm ci --only=production
    log_info "✅ 产品服务构建完成"
}

# 打包服务
package_service() {
    log_step "打包产品服务..."
    cd "$SERVICE_DIR"
    npm run package
    log_info "✅ 产品服务打包完成"
}

# 上传到服务器
upload_service() {
    log_step "上传产品服务到服务器..."
    
    # 检查打包文件是否存在
    if [ ! -f "$SERVICE_DIR/$SERVICE_NAME.tar.gz" ]; then
        log_error "打包文件不存在，请先运行: npm run package"
        exit 1
    fi
    
    # 上传到服务器
    scp "$SERVICE_DIR/$SERVICE_NAME.tar.gz" csc@192.168.1.2:/home/csc/code/micro/backend/
    log_info "✅ 产品服务上传完成"
}

# 在服务器上部署
deploy_service() {
    log_step "在服务器上部署产品服务..."
    
    ssh csc@192.168.1.2 << EOF
        cd /home/csc/code/micro/backend
        
        # 停止现有服务
        pm2 stop $SERVICE_NAME 2>/dev/null || true
        pm2 delete $SERVICE_NAME 2>/dev/null || true
        
        # 解压新版本
        if [ -f "$SERVICE_NAME.tar.gz" ]; then
            rm -rf $SERVICE_NAME
            mkdir -p $SERVICE_NAME
            tar -xzf $SERVICE_NAME.tar.gz -C $SERVICE_NAME
            chmod +x $SERVICE_NAME/start.sh
            chmod +x $SERVICE_NAME/stop.sh
            echo "✅ 产品服务解压完成"
        else
            echo "❌ 打包文件不存在"
            exit 1
        fi
        
        # 配置环境变量
        cd $SERVICE_NAME
        if [ ! -f ".env" ]; then
            cp env.example .env
            echo "✅ 创建环境配置文件"
        fi
        
        # 启动服务
        pm2 start ecosystem.config.js --env $ENVIRONMENT
        echo "✅ 产品服务启动完成"
EOF
    
    log_info "✅ 产品服务部署完成"
}

# 启动服务
start_service() {
    log_step "启动产品服务..."
    
    ssh csc@192.168.1.2 << EOF
        cd /home/csc/code/micro/backend/$SERVICE_NAME
        pm2 start ecosystem.config.js --env $ENVIRONMENT
        echo "✅ 产品服务启动完成"
EOF
}

# 停止服务
stop_service() {
    log_step "停止产品服务..."
    
    ssh csc@192.168.1.2 << EOF
        pm2 stop $SERVICE_NAME
        echo "✅ 产品服务停止完成"
EOF
}

# 重启服务
restart_service() {
    log_step "重启产品服务..."
    
    ssh csc@192.168.1.2 << EOF
        pm2 restart $SERVICE_NAME
        echo "✅ 产品服务重启完成"
EOF
}

# 查看服务状态
status_service() {
    log_step "查看产品服务状态..."
    
    ssh csc@192.168.1.2 << EOF
        pm2 status $SERVICE_NAME
EOF
}

# 查看服务日志
logs_service() {
    log_step "查看产品服务日志..."
    
    ssh csc@192.168.1.2 << EOF
        pm2 logs $SERVICE_NAME --lines 50
EOF
}

# 主函数
main() {
    case $ACTION in
        "build")
            build_service
            ;;
        "package")
            package_service
            ;;
        "upload")
            upload_service
            ;;
        "deploy")
            package_service
            upload_service
            deploy_service
            ;;
        "start")
            start_service
            ;;
        "stop")
            stop_service
            ;;
        "restart")
            restart_service
            ;;
        "status")
            status_service
            ;;
        "logs")
            logs_service
            ;;
        *)
            log_error "未知操作: $ACTION"
            echo "可用操作: build, package, upload, deploy, start, stop, restart, status, logs"
            exit 1
            ;;
    esac
}

# 运行主函数
main
