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
🔧 产品服务数据库设置工具

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
  console.log("产品服务数据库设置工具 v1.0.0");
  process.exit(0);
}

console.log("🔧 设置产品服务数据库和表结构...");
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

        // 创建产品表
        createProductsTable();
      });
    }
  );
}

function createProductsTable() {
  console.log("🏗️  创建产品表...");

  const createProductsTableSQL = `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      description TEXT,
      price DECIMAL(10,2) NOT NULL,
      category VARCHAR(100),
      brand VARCHAR(100),
      sku VARCHAR(100) UNIQUE,
      stock_quantity INT DEFAULT 0,
      image_url VARCHAR(500),
      status ENUM('active', 'inactive', 'discontinued') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_name (name),
      INDEX idx_category (category),
      INDEX idx_brand (brand),
      INDEX idx_sku (sku),
      INDEX idx_status (status),
      INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  connection.query(createProductsTableSQL, (err) => {
    if (err) {
      console.error("❌ 创建产品表失败:", err.message);
      connection.end();
      process.exit(1);
    }
    console.log("✅ 产品表创建成功");

    // 创建产品分类表
    createCategoriesTable();
  });
}

function createCategoriesTable() {
  console.log("🏗️  创建产品分类表...");

  const createCategoriesTableSQL = `
    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      parent_id INT NULL,
      sort_order INT DEFAULT 0,
      status ENUM('active', 'inactive') DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
      INDEX idx_name (name),
      INDEX idx_parent_id (parent_id),
      INDEX idx_status (status),
      INDEX idx_sort_order (sort_order)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `;

  connection.query(createCategoriesTableSQL, (err) => {
    if (err) {
      console.error("❌ 创建产品分类表失败:", err.message);
      connection.end();
      process.exit(1);
    }
    console.log("✅ 产品分类表创建成功");

    // 插入测试数据
    insertTestData();
  });
}

function insertTestData() {
  console.log("🌱 插入测试数据...");

  // 插入测试分类
  const insertCategoriesSQL = `
    INSERT IGNORE INTO categories (name, description, sort_order)
    VALUES 
      ('电子产品', '各类电子设备和配件', 1),
      ('服装鞋帽', '服装、鞋子、帽子等', 2),
      ('家居用品', '家具、装饰品、日用品等', 3),
      ('图书文具', '图书、文具、办公用品等', 4)
  `;

  connection.query(insertCategoriesSQL, (err) => {
    if (err) {
      console.error("❌ 插入测试分类失败:", err.message);
      connection.end();
      process.exit(1);
    }
    console.log("✅ 测试分类创建成功");

    // 插入测试产品
    insertTestProducts();
  });
}

function insertTestProducts() {
  const insertProductsSQL = `
    INSERT IGNORE INTO products (name, description, price, category, brand, sku, stock_quantity, status)
    VALUES 
      ('iPhone 15', '苹果最新款智能手机', 7999.00, '电子产品', 'Apple', 'IPHONE15-128', 50, 'active'),
      ('MacBook Pro', '苹果专业笔记本电脑', 12999.00, '电子产品', 'Apple', 'MBP-14-512', 20, 'active'),
      ('Nike运动鞋', '舒适透气的运动鞋', 599.00, '服装鞋帽', 'Nike', 'NIKE-AIR-42', 100, 'active'),
      ('咖啡机', '全自动咖啡机', 2999.00, '家居用品', 'Philips', 'PHILIPS-3200', 15, 'active'),
      ('编程书籍', 'JavaScript高级程序设计', 89.00, '图书文具', '人民邮电出版社', 'JS-BOOK-001', 200, 'active')
  `;

  connection.query(insertProductsSQL, (err) => {
    if (err) {
      console.error("❌ 插入测试产品失败:", err.message);
      connection.end();
      process.exit(1);
    }
    console.log("✅ 测试产品创建成功");

    // 显示数据库信息
    showDatabaseInfo();
  });
}

function showDatabaseInfo() {
  console.log("\n📊 数据库设置完成！");
  console.log(`🗄️  数据库名称: ${config.database.database}`);
  console.log(`📡 连接地址: ${config.database.host}:3306`);
  console.log(`👤 用户名: ${config.database.user}`);
  console.log("\n💡 提示:");
  console.log("   - 使用 node check-db.js 检查数据库状态");
  console.log("   - 使用 node server.js 启动服务");
  console.log("   - 使用 --help 查看更多选项");

  connection.end();
}
