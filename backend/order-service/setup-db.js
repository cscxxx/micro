#!/usr/bin/env node

const mysql = require("mysql2");
const config = require("./config");

console.log("🔧 设置订单服务数据库...");

const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  charset: config.database.charset,
  timezone: config.database.timezone,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ 数据库连接失败:", err.message);
    process.exit(1);
  }

  const dbName = config.database.database;
  connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    (err) => {
      if (err) {
        console.error("❌ 创建数据库失败:", err.message);
        connection.end();
        process.exit(1);
      }

      connection.query(`USE \`${dbName}\``, (err) => {
        if (err) {
          console.error("❌ 选择数据库失败:", err.message);
          connection.end();
          process.exit(1);
        }

        // 创建订单表
        const createOrdersTableSQL = `
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          order_number VARCHAR(50) UNIQUE NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          status ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_user_id (user_id),
          INDEX idx_order_number (order_number),
          INDEX idx_status (status)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;

        connection.query(createOrdersTableSQL, (err) => {
          if (err) {
            console.error("❌ 创建订单表失败:", err.message);
            connection.end();
            process.exit(1);
          }
          console.log("✅ 订单服务数据库设置完成");
          connection.end();
        });
      });
    }
  );
});
