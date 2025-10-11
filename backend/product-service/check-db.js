#!/usr/bin/env node

const mysql = require("mysql2");
const config = require("./config");

// 命令行参数处理
const args = process.argv.slice(2);
const showHelp = args.includes("--help") || args.includes("-h");
const verbose = args.includes("--verbose") || args.includes("-v");
const showTables = args.includes("--tables") || args.includes("-t");

if (showHelp) {
  console.log(`
🔍 产品服务数据库检查工具

用法: node check-db.js [选项]

选项:
  -h, --help         显示帮助信息
  -v, --verbose      显示详细信息
  -t, --tables       显示表结构信息
  --version          显示版本信息

示例:
  node check-db.js                    # 基本检查
  node check-db.js --verbose          # 详细检查
  node check-db.js --tables           # 显示表结构
  node check-db.js --help             # 显示帮助
`);
  process.exit(0);
}

if (args.includes("--version")) {
  console.log("产品服务数据库检查工具 v1.0.0");
  process.exit(0);
}

console.log("🔍 检查产品服务数据库状态...");

// 创建数据库连接
const connection = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
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

  // 检查数据库信息
  checkDatabaseInfo();
});

function checkDatabaseInfo() {
  console.log("\n📊 数据库信息:");
  console.log(`🗄️  数据库名称: ${config.database.database}`);
  console.log(`📡 连接地址: ${config.database.host}:3306`);
  console.log(`👤 用户名: ${config.database.user}`);

  // 检查表是否存在
  connection.query("SHOW TABLES", (err, results) => {
    if (err) {
      console.error("❌ 获取表列表失败:", err.message);
      connection.end();
      process.exit(1);
    }

    if (results.length === 0) {
      console.log("⚠️  数据库中没有表");
      console.log("💡 运行 node setup-db.js 创建数据库和表");
      connection.end();
      return;
    }

    console.log(`\n📋 数据库表 (${results.length}个):`);
    results.forEach((row, index) => {
      const tableName = Object.values(row)[0];
      console.log(`   ${index + 1}. ${tableName}`);
    });

    if (showTables) {
      showTableStructures();
    } else {
      showTableStats();
    }
  });
}

function showTableStructures() {
  console.log("\n🏗️  表结构详情:");

  // 获取所有表名
  connection.query("SHOW TABLES", (err, results) => {
    if (err) {
      console.error("❌ 获取表列表失败:", err.message);
      connection.end();
      process.exit(1);
    }

    let completed = 0;
    const totalTables = results.length;

    results.forEach((row) => {
      const tableName = Object.values(row)[0];

      // 获取表结构
      connection.query(`DESCRIBE \`${tableName}\``, (err, columns) => {
        if (err) {
          console.error(`❌ 获取表 ${tableName} 结构失败:`, err.message);
          return;
        }

        console.log(`\n📋 表: ${tableName}`);
        console.log(
          "┌─────────────┬─────────────┬─────────┬─────────┬─────────┬─────────┐"
        );
        console.log(
          "│ 字段名      │ 类型        │ 空值    │ 键      │ 默认值  │ 额外    │"
        );
        console.log(
          "├─────────────┼─────────────┼─────────┼─────────┼─────────┼─────────┤"
        );

        columns.forEach((column) => {
          const field = column.Field.padEnd(11);
          const type = column.Type.padEnd(11);
          const null_ = column.Null.padEnd(7);
          const key = column.Key.padEnd(7);
          const default_ = (column.Default || "").toString().padEnd(7);
          const extra = (column.Extra || "").toString().padEnd(7);
          console.log(
            `│ ${field} │ ${type} │ ${null_} │ ${key} │ ${default_} │ ${extra} │`
          );
        });

        console.log(
          "└─────────────┴─────────────┴─────────┴─────────┴─────────┴─────────┘"
        );

        completed++;
        if (completed === totalTables) {
          showTableStats();
        }
      });
    });
  });
}

function showTableStats() {
  console.log("\n📈 表统计信息:");

  // 获取所有表名
  connection.query("SHOW TABLES", (err, results) => {
    if (err) {
      console.error("❌ 获取表列表失败:", err.message);
      connection.end();
      process.exit(1);
    }

    let completed = 0;
    const totalTables = results.length;

    if (totalTables === 0) {
      connection.end();
      return;
    }

    results.forEach((row) => {
      const tableName = Object.values(row)[0];

      // 获取表记录数
      connection.query(
        `SELECT COUNT(*) as count FROM \`${tableName}\``,
        (err, countResult) => {
          if (err) {
            console.error(`❌ 获取表 ${tableName} 记录数失败:`, err.message);
            return;
          }

          const count = countResult[0].count;
          console.log(`   ${tableName}: ${count} 条记录`);

          completed++;
          if (completed === totalTables) {
            showProductsInfo();
          }
        }
      );
    });
  });
}

function showProductsInfo() {
  console.log("\n📦 产品信息:");

  // 获取产品统计
  connection.query(
    `
    SELECT 
      COUNT(*) as total_products,
      SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_products,
      SUM(CASE WHEN stock_quantity > 0 THEN 1 ELSE 0 END) as in_stock_products,
      AVG(price) as avg_price
    FROM products
  `,
    (err, results) => {
      if (err) {
        console.error("❌ 获取产品统计失败:", err.message);
        connection.end();
        process.exit(1);
      }

      const stats = results[0];
      console.log(`   总产品数: ${stats.total_products}`);
      console.log(`   活跃产品: ${stats.active_products}`);
      console.log(`   有库存产品: ${stats.in_stock_products}`);
      console.log(
        `   平均价格: ¥${parseFloat(stats.avg_price || 0).toFixed(2)}`
      );

      if (verbose) {
        showRecentProducts();
      } else {
        connection.end();
      }
    }
  );
}

function showRecentProducts() {
  console.log("\n🕒 最近添加的产品:");

  connection.query(
    `
    SELECT name, price, category, brand, stock_quantity, status, created_at
    FROM products
    ORDER BY created_at DESC
    LIMIT 5
  `,
    (err, results) => {
      if (err) {
        console.error("❌ 获取最近产品失败:", err.message);
        connection.end();
        process.exit(1);
      }

      if (results.length === 0) {
        console.log("   暂无产品数据");
      } else {
        results.forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name} - ¥${product.price}`);
          console.log(
            `      分类: ${product.category} | 品牌: ${product.brand} | 库存: ${product.stock_quantity}`
          );
          console.log(
            `      状态: ${product.status} | 添加时间: ${product.created_at}`
          );
        });
      }

      connection.end();
    }
  );
}
