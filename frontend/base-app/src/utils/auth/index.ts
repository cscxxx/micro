import { MessageData, MessageType } from "./types";

/**
 * Token 存储键名（统一）
 */
export const TOKEN_KEY = "micro_token";

/**
 * 用户信息存储键名
 */
export const USER_INFO_KEY = "micro_user_info";

/**
 * 获取 token
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("获取 token 失败:", error);
    return null;
  }
};

/**
 * 设置 token
 */
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
    // 通知所有子应用 token 已更新
    broadcastTokenUpdate(token);
  } catch (error) {
    console.error("设置 token 失败:", error);
  }
};

/**
 * 清除 token
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    broadcastTokenRemoved();
  } catch (error) {
    console.error("清除 token 失败:", error);
  }
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * 获取用户信息
 */
export const getUserInfo = (): any | null => {
  try {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY);
    return userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (error) {
    console.error("获取用户信息失败:", error);
    return null;
  }
};

/**
 * 设置用户信息
 */
export const setUserInfo = (userInfo: any): void => {
  try {
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error("设置用户信息失败:", error);
  }
};

/**
 * 广播 token 更新（通过 postMessage）
 */
const broadcastTokenUpdate = (token: string): void => {
  // 获取所有可能的子应用窗口（iframe 场景）
  const iframes = document.querySelectorAll("iframe");

  iframes.forEach((iframe) => {
    try {
      iframe.contentWindow?.postMessage(
        {
          type: "TOKEN_UPDATED",
          token,
          source: "host",
        } as MessageData,
        "*" // 生产环境应该指定具体域名
      );
    } catch (e) {
      // 跨域时可能无法访问 contentWindow
    }
  });

  // 通过 window.postMessage 广播（用于 Module Federation 场景）
  window.postMessage(
    {
      type: "TOKEN_UPDATED",
      token,
      source: "host",
    } as MessageData,
    "*"
  );
};

/**
 * 广播 token 移除
 */
const broadcastTokenRemoved = (): void => {
  const iframes = document.querySelectorAll("iframe");

  iframes.forEach((iframe) => {
    try {
      iframe.contentWindow?.postMessage(
        {
          type: "TOKEN_REMOVED",
          source: "host",
        } as MessageData,
        "*"
      );
    } catch (e) {
      // 忽略错误
    }
  });

  window.postMessage(
    {
      type: "TOKEN_REMOVED",
      source: "host",
    } as MessageData,
    "*"
  );
};

/**
 * 初始化 postMessage 监听器（处理子应用的 token 请求）
 */
if (typeof window !== "undefined") {
  window.addEventListener("message", (event: MessageEvent<MessageData>) => {
    // 验证消息来源（生产环境应该验证具体域名）
    const allowedOrigins = [
      "http://localhost:31220",
      "http://localhost:31230",
      // 添加允许的子应用域名
    ];

    // 开发环境允许所有来源，生产环境应该严格验证
    if (
      process.env.NODE_ENV === "production" &&
      !allowedOrigins.includes(event.origin)
    ) {
      return;
    }

    const { type, requestId } = event.data;

    if (type === "GET_TOKEN_REQUEST") {
      // 子应用请求 token
      const token = getToken();

      // 回复消息
      if (event.source && "postMessage" in event.source) {
        (event.source as Window).postMessage(
          {
            type: "GET_TOKEN_RESPONSE",
            requestId,
            token: token || undefined,
            source: "host",
          } as MessageData,
          event.origin
        );
      }
    }
  });
}
