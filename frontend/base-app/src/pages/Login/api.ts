import { LoginParams, LoginResponse } from "@/utils/auth/types";

/**
 * 模拟登录 API
 * 使用 setTimeout 模拟网络延迟
 */

/**
 * 模拟用户数据库
 */
const mockUsers = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    email: "admin@example.com",
    fullName: "管理员",
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    email: "user@example.com",
    fullName: "普通用户",
  },
];

/**
 * 登录 API
 * @param params 登录参数
 * @returns Promise<LoginResponse>
 */
export const login = async (params: LoginParams): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      const { username, password } = params;

      // 查找用户
      const user = mockUsers.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        // 生成模拟 token
        const token = `mock_token_${user.id}_${Date.now()}`;

        resolve({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
          },
        });
      } else {
        reject(new Error("用户名或密码错误"));
      }
    }, 1000); // 模拟 1 秒延迟
  });
};

/**
 * 登出 API（模拟）
 */
export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
};
