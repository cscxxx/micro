# 订单服务

使用 Express.js 和 MySQL 的订单管理微服务。

## 安装配置

1. 安装依赖包：

```bash
npm install
```

2. 创建 `.env` 文件，包含以下变量：

```
PORT=3003
DB_HOST=192.168.1.2
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=micro_order_service_db
```

3. 创建数据库和订单表：

```sql
CREATE DATABASE micro_order_service_db;
USE micro_order_service_db;
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. 启动服务：

```bash
npm start
# 或者开发模式
npm run dev
```

服务将在端口 3003 上运行。
