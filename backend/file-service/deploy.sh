#!/bin/bash

# 文件服务独立部署脚本
# 使用方法: ./deploy.sh [环境] [操作]
# 环境: dev, prod (默认: prod)
# 操作: build, package, upload, deploy, start, stop, restart, status, logs

set -e

ENVIRONMENT=${1:-prod}
ACTION=${2:-deploy}
SERVICE_NAME="file-service"
SERVICE_DIR=$(dirname "$0")

echo "🚀 文件服务独立部署..."
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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# 构建服务
build_service() {
    log_step "构建文件服务..."
    cd "$SERVICE_DIR"
    npm ci --only=production
    log_info "✅ 文件服务构建完成"
}

# 打包服务
package_service() {
    log_step "打包文件服务..."
    cd "$SERVICE_DIR"
    npm run package
    log_info "✅ 文件服务打包完成"
}

# 上传到服务器
upload_service() {
    log_step "上传文件服务到服务器..."
    
    if [ ! -f "$SERVICE_DIR/$SERVICE_NAME.tar.gz" ]; then
        log_error "打包文件不存在，请先运行: npm run package"
        exit 1
    fi
    
    scp "$SERVICE_DIR/$SERVICE_NAME.tar.gz" csc@192.168.1.2:/home/csc/code/micro/backend/
    log_info "✅ 文件服务上传完成"
}

# 在服务器上部署
deploy_service() {
    log_step "在服务器上部署文件服务..."
    
    ssh csc@192.168.1.2 << EOF
        cd /home/csc/code/micro/backend
        
        pm2 stop $SERVICE_NAME 2>/dev/null || true
        pm2 delete $SERVICE_NAME 2>/dev/null || true
        
        if [ -f "$SERVICE_NAME.tar.gz" ]; then
            rm -rf $SERVICE_NAME
            mkdir -p $SERVICE_NAME
            tar -xzf $SERVICE_NAME.tar.gz -C $SERVICE_NAME
            chmod +x $SERVICE_NAME/start.sh
            chmod +x $SERVICE_NAME/stop.sh
            
            cd $SERVICE_NAME
            if [ ! -f ".env" ]; then
                cp env.example .env
            fi
            
            pm2 start ecosystem.config.js --env $ENVIRONMENT
            echo "✅ 文件服务部署完成"
        else
            echo "❌ 打包文件不存在"
            exit 1
        fi
EOF
}

# 启动服务
start_service() {
    ssh csc@192.168.1.2 "cd /home/csc/code/micro/backend/$SERVICE_NAME && pm2 start ecosystem.config.js --env $ENVIRONMENT"
}

# 停止服务
stop_service() {
    ssh csc@192.168.1.2 "pm2 stop $SERVICE_NAME"
}

# 重启服务
restart_service() {
    ssh csc@192.168.1.2 "pm2 restart $SERVICE_NAME"
}

# 查看服务状态
status_service() {
    ssh csc@192.168.1.2 "pm2 status $SERVICE_NAME"
}

# 查看服务日志
logs_service() {
    ssh csc@192.168.1.2 "pm2 logs $SERVICE_NAME --lines 50"
}

# 主函数
main() {
    case $ACTION in
        "build") build_service ;;
        "package") package_service ;;
        "upload") upload_service ;;
        "deploy") package_service && upload_service && deploy_service ;;
        "start") start_service ;;
        "stop") stop_service ;;
        "restart") restart_service ;;
        "status") status_service ;;
        "logs") logs_service ;;
        *)
            log_error "未知操作: $ACTION"
            echo "可用操作: build, package, upload, deploy, start, stop, restart, status, logs"
            exit 1
            ;;
    esac
}

main
