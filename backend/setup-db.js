#!/usr/bin/env node

const mysql = require("mysql2");
const config = require("./config");

// 命令行参数处理
const args = process.argv.slice(2);
const showHelp = args.includes("--help") || args.includes("-h");
const verbose = args.includes("--verbose") || args.includes("-v");
const force = args.includes("--force") || args.includes("-f");
const dropFirst = args.includes("--drop") || args.includes("-d");
const specificDb = args.find((arg) => arg.startsWith("--db="))?.split("=")[1];

if (showHelp) {
  console.log(`
🔧 数据库设置工具

用法: node setup-db.js [选项]

选项:
  -h, --help         显示帮助信息
  -v, --verbose      显示详细信息
  -f, --force        强制重新创建（即使已存在）
  -d, --drop         先删除现有数据库再创建
  --db=数据库名       只设置指定的数据库
  --version          显示版本信息

示例:
  node setup-db.js                    # 基本设置
  node setup-db.js --verbose          # 详细设置
  node setup-db.js --force            # 强制重新创建
  node setup-db.js --drop             # 删除后重新创建
  node setup-db.js --db=user          # 只设置用户数据库
  node setup-db.js --help             # 显示帮助

⚠️  警告: --drop 选项会删除现有数据！
`);
  process.exit(0);
}

if (args.includes("--version")) {
  console.log("数据库设置工具 v1.0.0");
  process.exit(0);
}

console.log("🔧 设置数据库和表结构...");
if (verbose) {
  console.log(`📡 连接信息: ${config.database.host}:3306`);
  console.log(`👤 用户: ${config.database.user}`);
  if (dropFirst) {
    console.log("⚠️  将删除现有数据库！");
  }
  if (force) {
    console.log("🔄 强制重新创建模式");
  }
}

// 创建数据库连接
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
    if (verbose) {
      console.error("🔧 请检查:");
      console.error("  - MySQL服务是否运行");
      console.error("  - 主机地址是否正确");
      console.error("  - 用户名和密码是否正确");
      console.error("  - 网络连接是否正常");
    }
    process.exit(1);
  }

  console.log("✅ 成功连接到MySQL数据库服务器");
  if (verbose) {
    console.log(`📊 MySQL版本: ${connection.serverVersion}`);
  }

  setupDatabases();
});

function setupDatabases() {
  let databases = Object.values(config.database.databases);

  // 如果指定了特定数据库，只处理该数据库
  if (specificDb) {
    const dbKey = Object.keys(config.database.databases).find(
      (key) =>
        key === specificDb || config.database.databases[key] === specificDb
    );
    if (dbKey) {
      databases = [config.database.databases[dbKey]];
      console.log(
        `🎯 只设置数据库: ${config.database.databases[dbKey]} (${dbKey})`
      );
    } else {
      console.error(`❌ 未找到数据库: ${specificDb}`);
      console.log(
        `📋 可用的数据库键: ${Object.keys(config.database.databases).join(
          ", "
        )}`
      );
      console.log(
        `📋 可用的数据库名: ${Object.values(config.database.databases).join(
          ", "
        )}`
      );
      process.exit(1);
    }
  }

  let completed = 0;
  let totalDatabases = databases.length;

  console.log(`📋 将设置 ${totalDatabases} 个数据库`);

  const finishSetup = () => {
    completed++;
    if (completed === totalDatabases) {
      console.log("🎉 数据库设置完成！");
      if (verbose) {
        console.log("💡 使用 node check-db.js --tables 检查表结构");
      }
      connection.end();
    }
  };

  databases.forEach((dbName) => {
    if (dropFirst) {
      // 先删除数据库
      connection.query(`DROP DATABASE IF EXISTS \`${dbName}\``, (err) => {
        if (err) {
          console.error(`❌ 删除数据库 ${dbName} 失败:`, err.message);
          return;
        }
        if (verbose) {
          console.log(`🗑️  数据库 ${dbName} 已删除`);
        }
        createDatabase(dbName);
      });
    } else {
      createDatabase(dbName);
    }
  });

  function createDatabase(dbName) {
    // 创建数据库
    connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err) => {
      if (err) {
        console.error(`❌ 创建数据库 ${dbName} 失败:`, err.message);
        finishSetup();
        return;
      }
      console.log(`✅ 数据库 ${dbName} 已创建`);

      // 创建表结构
      setupTables(dbName, finishSetup);
    });
  }
}

function setupTables(dbName, finishSetup) {
  const dbConnection = mysql.createConnection({
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    database: dbName,
    charset: config.database.charset,
    timezone: config.database.timezone,
  });

  const tableConfig = getTableConfig(dbName);

  if (!tableConfig) {
    console.log(`⚠️  未知的数据库: ${dbName}`);
    dbConnection.end();
    finishSetup();
    return;
  }

  if (verbose) {
    console.log(`🔧 为 ${dbName} 创建表: ${tableConfig.tableName}`);
  }

  // 如果强制模式，先删除表
  if (force) {
    dbConnection.query(
      `DROP TABLE IF EXISTS \`${tableConfig.tableName}\``,
      (err) => {
        if (err) {
          console.error(
            `❌ 删除表 ${tableConfig.tableName} 失败:`,
            err.message
          );
          dbConnection.end();
          finishSetup();
          return;
        }
        if (verbose) {
          console.log(`🗑️  表 ${tableConfig.tableName} 已删除`);
        }
        createTable();
      }
    );
  } else {
    createTable();
  }

  function createTable() {
    dbConnection.query(tableConfig.createSQL, (err) => {
      if (err) {
        console.error(`❌ 创建表 ${tableConfig.tableName} 失败:`, err.message);
        if (verbose) {
          console.error("🔧 请检查:");
          console.error("  - 表结构SQL是否正确");
          console.error("  - 数据库权限是否足够");
          console.error("  - 表名是否冲突");
        }
      } else {
        console.log(`✅ 表 ${tableConfig.tableName} 已创建 (${dbName})`);
        if (verbose) {
          console.log(`📊 表结构: ${tableConfig.description}`);
        }
      }

      dbConnection.end();
      finishSetup();
    });
  }
}

function getTableConfig(dbName) {
  const tableConfigs = {
    micro_user_service_db: {
      tableName: "users",
      description: "用户表 - 存储用户信息",
      createSQL: `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(100),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
    },
    micro_product_service_db: {
      tableName: "products",
      description: "产品表 - 存储产品信息",
      createSQL: `
        CREATE TABLE IF NOT EXISTS products (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(200) NOT NULL,
          price DECIMAL(10,2) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
    },
    micro_order_service_db: {
      tableName: "orders",
      description: "订单表 - 存储订单信息",
      createSQL: `
        CREATE TABLE IF NOT EXISTS orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          product_id INT NOT NULL,
          quantity INT NOT NULL,
          total_amount DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
    },
    micro_file_service_db: {
      tableName: "files",
      description: "文件表 - 存储文件信息",
      createSQL: `
        CREATE TABLE IF NOT EXISTS files (
          id INT AUTO_INCREMENT PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          originalname VARCHAR(255) NOT NULL,
          mimetype VARCHAR(100),
          size INT,
          path VARCHAR(500) NOT NULL,
          description TEXT,
          upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
    },
  };

  return tableConfigs[dbName] || null;
}
