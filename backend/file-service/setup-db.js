#!/usr/bin/env node

const mysql = require("mysql2");
const config = require("./config");

console.log("🔧 设置文件服务数据库...");

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

        // 创建文件表
        const createFilesTableSQL = `
        CREATE TABLE IF NOT EXISTS files (
          id INT AUTO_INCREMENT PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size INT NOT NULL,
          mime_type VARCHAR(100) NOT NULL,
          user_id INT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_filename (filename),
          INDEX idx_user_id (user_id),
          INDEX idx_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `;

        connection.query(createFilesTableSQL, (err) => {
          if (err) {
            console.error("❌ 创建文件表失败:", err.message);
            connection.end();
            process.exit(1);
          }
          console.log("✅ 文件服务数据库设置完成");
          connection.end();
        });
      });
    }
  );
});
