# 用户服务

使用 Express.js 和 MySQL 的用户管理微服务。

## 安装配置

1. 安装依赖包：

```bash
npm install
```

2. 创建 `.env` 文件，包含以下变量：

```
PORT=3001
DB_HOST=192.168.1.2
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=micro_user_service_db
```

3. 创建数据库和用户表：

```sql
CREATE DATABASE micro_user_service_db;
USE micro_user_service_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

4. 启动服务：

```bash
npm start
# 或者开发模式
npm run dev
```

服务将在端口 3001 上运行。
