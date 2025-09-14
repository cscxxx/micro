#!/usr/bin/env node

const axios = require("axios");
const config = require("./config");

const BASE_URL = "http://localhost:3001/api";
const TEST_USER = {
  username: "testuser_" + Date.now(),
  email: `testuser_${Date.now()}@example.com`,
  password: "Test123456",
};

console.log("🧪 测试认证系统...\n");

// 测试函数
async function test(name, testFn) {
  try {
    console.log(`🔍 ${name}...`);
    const result = await testFn();
    console.log(`✅ ${name} 成功`);
    return result;
  } catch (error) {
    console.log(
      `❌ ${name} 失败:`,
      error.response?.data?.error || error.message
    );
    return null;
  }
}

// 运行测试
async function runTests() {
  console.log("📋 测试用户信息:");
  console.log(`   用户名: ${TEST_USER.username}`);
  console.log(`   邮箱: ${TEST_USER.email}\n`);

  const results = [];

  // 1. 测试注册
  const registerResult = await test("用户注册", async () => {
    const response = await axios.post(`${BASE_URL}/users/register`, TEST_USER);
    return response.data;
  });
  results.push({ test: "注册", success: !!registerResult });

  if (!registerResult) {
    console.log("\n❌ 注册失败，跳过后续测试");
    return;
  }

  // 2. 测试登录
  const loginResult = await test("用户登录", async () => {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: TEST_USER.username,
      password: TEST_USER.password,
    });
    return response.data;
  });
  results.push({ test: "登录", success: !!loginResult });

  if (!loginResult) {
    console.log("\n❌ 登录失败，跳过后续测试");
    return;
  }

  // 3. 测试获取用户信息
  const userInfoResult = await test("获取用户信息", async () => {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${loginResult.token}` },
    });
    return response.data;
  });
  results.push({ test: "获取用户信息", success: !!userInfoResult });

  // 4. 测试忘记密码
  const forgotPasswordResult = await test("忘记密码", async () => {
    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, {
      email: TEST_USER.email,
    });
    return response.data;
  });
  results.push({ test: "忘记密码", success: !!forgotPasswordResult });

  // 5. 测试无效token
  const invalidTokenResult = await test("无效token验证", async () => {
    try {
      await axios.get(`${BASE_URL}/auth/me`, {
        headers: { Authorization: "Bearer invalid_token" },
      });
      throw new Error("应该失败但成功了");
    } catch (error) {
      if (error.response?.status === 403) {
        return true;
      }
      throw error;
    }
  });
  results.push({ test: "无效token验证", success: !!invalidTokenResult });

  // 输出结果
  console.log("\n📊 测试结果:");
  console.log("=".repeat(40));
  results.forEach((result) => {
    const status = result.success ? "✅ 通过" : "❌ 失败";
    console.log(`${result.test.padEnd(15)} ${status}`);
  });

  const passed = results.filter((r) => r.success).length;
  const total = results.length;
  console.log("=".repeat(40));
  console.log(`总计: ${passed}/${total} 测试通过`);

  if (passed === total) {
    console.log("\n🎉 所有测试通过！认证系统工作正常。");
  } else {
    console.log("\n⚠️  部分测试失败，请检查系统配置。");
  }
}

// 启动测试
runTests().catch((error) => {
  console.error("❌ 测试过程中发生错误:", error.message);
  process.exit(1);
});
