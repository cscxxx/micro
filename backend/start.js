#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");
const config = require("./config");

console.log("🚀 启动微服务系统...\n");

// 检查服务是否已运行
function isServiceRunning(port) {
  return new Promise((resolve) => {
    const netstat = spawn("lsof", ["-ti", `:${port}`]);
    netstat.on("close", (code) => {
      resolve(code === 0);
    });
  });
}

// 启动单个服务
async function startService(serviceName, serviceConfig) {
  const isRunning = await isServiceRunning(serviceConfig.port);

  if (isRunning) {
    console.log(
      `⚠️  ${serviceConfig.name} (端口 ${serviceConfig.port}) 已在运行`
    );
    return;
  }

  console.log(`🔄 启动${serviceConfig.name}...`);

  const servicePath = path.join(__dirname, `${serviceName}-service`);
  const child = spawn("npm", ["start"], {
    cwd: servicePath,
    stdio: "inherit",
  });

  child.on("error", (err) => {
    console.error(`❌ 启动${serviceConfig.name}失败:`, err.message);
  });

  // 等待服务启动
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

// 启动所有服务
async function startAllServices() {
  try {
    // 检查数据库
    console.log("🔍 检查数据库连接...");
    const checkDb = spawn("node", ["check-db.js"], { stdio: "inherit" });

    await new Promise((resolve, reject) => {
      checkDb.on("close", (code) => {
        if (code === 0) resolve();
        else reject(new Error("数据库检查失败"));
      });
    });

    console.log("✅ 数据库连接正常\n");

    // 启动服务
    for (const [serviceName, serviceConfig] of Object.entries(
      config.services
    )) {
      await startService(serviceName, serviceConfig);
    }

    console.log("\n🎉 所有服务启动完成！");
    console.log("\n📊 服务信息:");
    for (const [serviceName, serviceConfig] of Object.entries(
      config.services
    )) {
      console.log(
        `- ${serviceConfig.name}: http://localhost:${serviceConfig.port}`
      );
    }
    console.log("- 前端应用: http://localhost:5173");

    console.log("\n👤 测试账户:");
    for (const [accountName, account] of Object.entries(config.testAccounts)) {
      console.log(
        `- ${accountName}: ${account.username} / ${account.password}`
      );
    }

    console.log("\n🔗 访问地址:");
    console.log("- 登录页面: http://localhost:5173/login");
    console.log("- 注册页面: http://localhost:5173/register");
    console.log("- 管理后台: http://localhost:5173/dashboard");

    console.log("\n💡 使用 Ctrl+C 停止所有服务");
  } catch (error) {
    console.error("❌ 启动失败:", error.message);
    process.exit(1);
  }
}

// 处理退出信号
process.on("SIGINT", () => {
  console.log("\n🛑 正在停止服务...");
  process.exit(0);
});

// 启动服务
startAllServices();
