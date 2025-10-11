#!/usr/bin/env node

const mysql = require("mysql2");
const config = require("./config");

// 命令行参数处理
const args = process.argv.slice(2);
const showHelp = args.includes("--help") || args.includes("-h");
const verbose = args.includes("--verbose") || args.includes("-v");
const force = args.includes("--force") || args.includes("-f");
const dropFirst = args.includes("--drop") || args.includes("-d");

if (showHelp) {
  console.log(`
🔧 用户服务数据库设置工具

用法: node setup-db.js [选项]

选项:
  -h, --help         显示帮助信息
  -v, --verbose      显示详细信息
  -f, --force        强制重新创建（即使已存在）
  -d, --drop         先删除现有数据库再创建
  --version          显示版本信息

示例:
  node setup-db.js                    # 基本设置
  node setup-db.js --verbose          # 详细设置
  node setup-db.js --force            # 强制重新创建
  node setup-db.js --drop             # 删除后重新创建
  node setup-db.js --help             # 显示帮助

⚠️  警告: --drop 选项会删除现有数据！
`);
  process.exit(0);
}

if (args.includes("--version")) {
  console.log("用户服务数据库设置工具 v1.0.0");
  process.exit(0);
}

console.log("🔧 设置用户服务数据库和表结构...");
if (verbose) {
  console.log(`📡 连接信息: ${config.database.host}:3306`);
  console.log(`👤 用户: ${config.database.user}`);
  console.log(`🗄️  数据库: ${config.database.database}`);
  if (dropFirst) {
    console.log("⚠️  将删除现有数据库");
  }
}

// 创建数据库连接（不指定数据库）
const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  charset: config.database.charset,
  timezone: config.database.timezone,
});

// 连接数据库
connection.connect((err) => {
  if (err) {
    console.error("❌ 数据库连接失败:", err.message);
    process.exit(1);
  }
  console.log("✅ 数据库连接成功");

  // 检查数据库是否存在
  const dbName = config.database.database;
  connection.query(
    `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
    [dbName],
    (err, results) => {
      if (err) {
        console.error("❌ 检查数据库失败:", err.message);
        connection.end();
        process.exit(1);
      }

      const dbExists = results.length > 0;

      if (dbExists && !force && !dropFirst) {
        console.log(`✅ 数据库 '${dbName}' 已存在`);
        if (verbose) {
          console.log("💡 使用 --force 或 --drop 选项重新创建数据库");
        }
        connection.end();
        return;
      }

      if (dbExists && dropFirst) {
        console.log(`🗑️  删除现有数据库 '${dbName}'...`);
        connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``, (err) => {
          if (err) {
            console.error("❌ 删除数据库失败:", err.message);
            connection.end();
            process.exit(1);
          }
          console.log("✅ 数据库删除成功");
          createDatabase();
        });
      } else {
        createDatabase();
      }
    }
  );
});

function createDatabase() {
  const dbName = config.database.database;
  console.log(`🏗️  创建数据库 '${dbName}'...`);

  connection.query(
    `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    (err) => {
      if (err) {
        console.error("❌ 创建数据库失败:", err.message);
        connection.end();
        process.exit(1);
      }
      console.log("✅ 数据库创建成功");

      // 选择数据库
      connection.query(`USE \`${dbName}\``, (err) => {
        if (err) {
          console.error("❌ 选择数据库失败:", err.message);
          connection.end();
          process.exit(1);
        }

        // 创建用户表
        createUsersTable();
      });
    }
  );
}

function createUsersTable() {
  console.log("🏗️  创建用户表...");

  const createUsersTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(100),
      phone VARCHAR(20),
      avatar_url VARCHAR(255),
      role ENUM('admin', 'user') DEFAULT 'user',
      status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
      email_verified BOOLEAN DEFAULT FALSE,
      last_login_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_username (username),
      INDEX idx_email (email),
      INDEX idx_status (status),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  connection.query(createUsersTableSQL, (err) => {
    if (err) {
      console.error("❌ 创建用户表失败:", err.message);
      connection.end();
      process.exit(1);
    }
    console.log("✅ 用户表创建成功");

    // 创建用户会话表
    createUserSessionsTable();
  });
}

function createUserSessionsTable() {
  console.log("🏗️  创建用户会话表...");

  const createUserSessionsTableSQL = `
    CREATE TABLE IF NOT EXISTS user_sessions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      token VARCHAR(500) NOT NULL,
      refresh_token VARCHAR(500),
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_token (token),
      INDEX idx_expires_at (expires_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  connection.query(createUserSessionsTableSQL, (err) => {
    if (err) {
      console.error("❌ 创建用户会话表失败:", err.message);
      connection.end();
      process.exit(1);
    }
    console.log("✅ 用户会话表创建成功");

    // 插入测试数据
    insertTestData();
  });
}

function insertTestData() {
  console.log("🌱 插入测试数据...");

  const bcrypt = require("bcryptjs");
  const hashedPassword = bcrypt.hashSync(
    "admin123",
    config.security.bcryptRounds
  );

  const insertTestUserSQL = `
    INSERT IGNORE INTO users (username, email, password_hash, full_name, role, status, email_verified)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const testUser = [
    "admin",
    "admin@example.com",
    hashedPassword,
    "系统管理员",
    "admin",
    "active",
    true,
  ];

  connection.query(insertTestUserSQL, testUser, (err) => {
    if (err) {
      console.error("❌ 插入测试用户失败:", err.message);
      connection.end();
      process.exit(1);
    }
    console.log("✅ 测试用户创建成功");

    // 显示数据库信息
    showDatabaseInfo();
  });
}

function showDatabaseInfo() {
  console.log("\n📊 数据库设置完成！");
  console.log(`🗄️  数据库名称: ${config.database.database}`);
  console.log(`📡 连接地址: ${config.database.host}:3306`);
  console.log(`👤 用户名: ${config.database.user}`);
  console.log("\n🔑 测试账户:");
  console.log("   用户名: admin");
  console.log("   密码: admin123");
  console.log("   邮箱: admin@example.com");
  console.log("\n💡 提示:");
  console.log("   - 使用 node check-db.js 检查数据库状态");
  console.log("   - 使用 node server.js 启动服务");
  console.log("   - 使用 --help 查看更多选项");

  connection.end();
}
