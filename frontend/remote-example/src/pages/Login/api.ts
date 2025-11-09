/**
 * 模拟登录 API（子应用独立运行使用）
 */

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    fullName?: string;
  };
}

/**
 * 模拟用户数据库
 */
const mockUsers = [
  {
    id: 101,
    username: "remote_user",
    password: "remote123",
    email: "remote@example.com",
    fullName: "远程用户",
  },
  {
    id: 102,
    username: "test",
    password: "test123",
    email: "test@example.com",
    fullName: "测试用户",
  },
];

/**
 * 登录 API
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
        const token = `remote_token_${user.id}_${Date.now()}`;

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
    }, 1000);
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
