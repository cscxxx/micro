#!/usr/bin/env node

const { spawn } = require("child_process");

console.log("🛑 停止所有微服务...");

// 停止所有Node.js服务
const pkill = spawn("pkill", ["-f", "server.js"]);

pkill.on("close", (code) => {
  if (code === 0) {
    console.log("✅ 所有服务已停止");
  } else {
    console.log("⚠️  没有找到运行中的服务");
  }
});

pkill.on("error", (err) => {
  console.error("❌ 停止服务失败:", err.message);
});
