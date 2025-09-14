#!/usr/bin/env node

const mysql = require("mysql2");
const config = require("./config");

// 命令行参数处理
const args = process.argv.slice(2);
const showHelp = args.includes("--help") || args.includes("-h");
const verbose = args.includes("--verbose") || args.includes("-v");
const checkTables = args.includes("--tables") || args.includes("-t");

if (showHelp) {
  console.log(`
🔍 数据库检查工具

用法: node check-db.js [选项]

选项:
  -h, --help     显示帮助信息
  -v, --verbose  显示详细信息
  -t, --tables   检查表结构
  --version      显示版本信息

示例:
  node check-db.js              # 基本检查
  node check-db.js --verbose    # 详细检查
  node check-db.js --tables     # 检查表结构
  node check-db.js --help       # 显示帮助
`);
  process.exit(0);
}

if (args.includes("--version")) {
  console.log("数据库检查工具 v1.0.0");
  process.exit(0);
}

console.log("🔍 检查数据库连接...");
if (verbose) {
  console.log(`📡 连接信息: ${config.database.host}:3306`);
  console.log(`👤 用户: ${config.database.user}`);
}

// 创建数据库连接
const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  charset: config.database.charset,
  timezone: config.database.timezone,
});

// 检查连接
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

  // 检查数据库
  checkDatabases();
});

function checkDatabases() {
  connection.query("SHOW DATABASES", (err, results) => {
    if (err) {
      console.error("❌ 查询数据库失败:", err.message);
      connection.end();
      process.exit(1);
    }

    const dbNames = results.map((row) => row.Database);
    const requiredDbs = Object.values(config.database.databases);
    const missingDbs = requiredDbs.filter((db) => !dbNames.includes(db));
    const existingDbs = requiredDbs.filter((db) => dbNames.includes(db));

    console.log(`📋 需要检查的数据库: ${requiredDbs.length} 个`);

    if (verbose) {
      console.log("📊 数据库状态:");
      requiredDbs.forEach((db) => {
        const status = dbNames.includes(db) ? "✅ 存在" : "❌ 缺失";
        console.log(`  ${status} ${db}`);
      });
    }

    if (missingDbs.length > 0) {
      console.log("⚠️  缺少数据库:", missingDbs.join(", "));
      console.log("💡 请运行: node setup-db.js 创建数据库");
      connection.end();
      process.exit(1);
    }

    console.log("✅ 所有数据库存在");

    if (checkTables) {
      checkTablesInDatabases(existingDbs);
    } else {
      console.log("🎉 数据库检查完成！");
      if (verbose) {
        console.log("💡 使用 --tables 参数检查表结构");
      }
      connection.end();
    }
  });
}

function checkTablesInDatabases(databases) {
  console.log("🔍 检查表结构...");
  let completed = 0;
  let totalTables = 0;
  let existingTables = 0;

  databases.forEach((dbName) => {
    const dbConnection = mysql.createConnection({
      host: config.database.host,
      user: config.database.user,
      password: config.database.password,
      database: dbName,
      charset: config.database.charset,
      timezone: config.database.timezone,
    });

    dbConnection.query("SHOW TABLES", (err, results) => {
      if (err) {
        console.error(`❌ 查询 ${dbName} 表失败:`, err.message);
        dbConnection.end();
        return;
      }

      const tables = results.map((row) => Object.values(row)[0]);
      const expectedTable = getExpectedTableName(dbName);

      if (verbose) {
        console.log(`📊 ${dbName}: ${tables.length} 个表`);
        tables.forEach((table) => {
          const status = table === expectedTable ? "✅" : "⚠️";
          console.log(`  ${status} ${table}`);
        });
      }

      if (tables.includes(expectedTable)) {
        existingTables++;
        console.log(`✅ ${dbName}: ${expectedTable} 表存在`);
      } else {
        console.log(`❌ ${dbName}: 缺少 ${expectedTable} 表`);
      }

      totalTables++;
      completed++;

      dbConnection.end();

      if (completed === databases.length) {
        console.log(
          `📊 表检查完成: ${existingTables}/${totalTables} 个数据库有正确的表`
        );
        if (existingTables === totalTables) {
          console.log("🎉 所有表结构正确！");
        } else {
          console.log("💡 请运行: node setup-db.js 创建缺失的表");
        }
        connection.end();
      }
    });
  });
}

function getExpectedTableName(dbName) {
  const tableMap = {
    micro_user_service_db: "users",
    micro_product_service_db: "products",
    micro_order_service_db: "orders",
    micro_file_service_db: "files",
  };
  return tableMap[dbName] || "unknown";
}
