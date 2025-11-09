/**
 * 智能认证客户端
 * 支持三种模式：
 * 1. Module Federation 模式（集成运行）
 * 2. postMessage 模式（跨域通信）
 * 3. 本地模式（独立运行）
 */

/**
 * 本地 token 存储键名（独立运行使用）
 */
const LOCAL_TOKEN_KEY = "remote_example_token";
const LOCAL_USER_INFO_KEY = "remote_example_user_info";

/**
 * Token 缓存（避免频繁请求）
 */
let cachedToken: string | null = null;
let tokenCacheTime = 0;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5分钟

/**
 * 检测是否在集成模式（运行在主应用中）
 */
const isIntegratedMode = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  // 方法1: 检查是否有父窗口（iframe 场景）
  if (window.parent !== window) {
    return true;
  }

  // 方法2: 检查环境变量
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("mode") === "integrated") {
    return true;
  }

  // 方法3: 检查全局标识
  if ((window as any).__MICRO_MODE__ === "integrated") {
    return true;
  }

  return false;
};

/**
 * 获取主应用 origin
 */
const getHostOrigin = (): string => {
  if (typeof window === "undefined") {
    return "http://localhost:31213";
  }

  const urlParams = new URLSearchParams(window.location.search);
  const hostOrigin = urlParams.get("hostOrigin");

  if (hostOrigin) {
    return hostOrigin;
  }

  // 默认主应用地址
  // 在浏览器环境中，使用 window.location.origin 判断
  // 如果是子应用自己的地址，返回主应用地址
  if (window.location.origin === "http://localhost:31220") {
    return "http://localhost:31213";
  }

  // 其他情况返回当前 origin（可能是独立运行）
  return window.location.origin;
};

/**
 * 通过 Module Federation 获取主应用的认证模块
 */
let hostAuthModule: any = null;

const getHostAuthModule = async () => {
  if (hostAuthModule) {
    return hostAuthModule;
  }

  try {
    // 动态导入主应用的认证模块
    hostAuthModule = await import("host/Auth");
    console.debug("成功加载主应用认证模块:", hostAuthModule);
    return hostAuthModule;
  } catch (error) {
    // Module Federation 加载失败，可能是独立运行
    console.debug("Module Federation 加载主应用认证模块失败:", error);
    return null;
  }
};

/**
 * 通过 postMessage 获取 token（跨域场景）
 */
const getTokenViaPostMessage = (): Promise<string | null> => {
  return new Promise((resolve) => {
    const requestId = Date.now().toString();
    const hostOrigin = getHostOrigin();

    const handler = (event: MessageEvent) => {
      // 验证消息来源
      if (event.origin !== hostOrigin) {
        return;
      }

      if (
        event.data.type === "GET_TOKEN_RESPONSE" &&
        event.data.requestId === requestId
      ) {
        window.removeEventListener("message", handler);
        resolve(event.data.token || null);
      }
    };

    window.addEventListener("message", handler);

    // 发送请求
    if (window.parent && window.parent !== window) {
      window.parent.postMessage(
        {
          type: "GET_TOKEN_REQUEST",
          requestId,
        },
        hostOrigin
      );
    } else {
      // 没有父窗口，直接 resolve null
      window.removeEventListener("message", handler);
      resolve(null);
    }

    // 超时处理
    setTimeout(() => {
      window.removeEventListener("message", handler);
      resolve(null);
    }, 5000);
  });
};

/**
 * 本地 token 存储（独立运行模式）
 */
const getLocalToken = (): string | null => {
  try {
    return localStorage.getItem(LOCAL_TOKEN_KEY);
  } catch (error) {
    console.error("获取本地 token 失败:", error);
    return null;
  }
};

const setLocalToken = (token: string): void => {
  try {
    localStorage.setItem(LOCAL_TOKEN_KEY, token);
  } catch (error) {
    console.error("设置本地 token 失败:", error);
  }
};

const removeLocalToken = (): void => {
  try {
    localStorage.removeItem(LOCAL_TOKEN_KEY);
    localStorage.removeItem(LOCAL_USER_INFO_KEY);
  } catch (error) {
    console.error("清除本地 token 失败:", error);
  }
};

/**
 * 统一的 token 获取接口
 */
export const getToken = async (): Promise<string | null> => {
  // 检查缓存
  if (cachedToken && Date.now() - tokenCacheTime < TOKEN_CACHE_DURATION) {
    return cachedToken;
  }

  // 优先尝试通过 Module Federation 获取主应用的 token
  // 无论是否检测到集成模式，都先尝试（因为 Module Federation 可能可用）
  try {
    const hostAuth = await getHostAuthModule();
    if (hostAuth && typeof hostAuth.getToken === "function") {
      const token = hostAuth.getToken();
      console.debug("从主应用获取到 token:", token ? "已获取" : "未获取");
      if (token) {
        cachedToken = token;
        tokenCacheTime = Date.now();
        return token;
      }
    } else {
      console.debug("主应用认证模块不可用或 getToken 方法不存在");
    }
  } catch (error) {
    // Module Federation 加载失败，继续尝试其他方式
    console.debug("Module Federation 加载失败，尝试其他方式:", error);
  }

  const isIntegrated = isIntegratedMode();

  if (isIntegrated) {
    // 集成模式：尝试通过 postMessage 获取（跨域场景）
    const postMessageToken = await getTokenViaPostMessage();
    if (postMessageToken) {
      cachedToken = postMessageToken;
      tokenCacheTime = Date.now();
      // 同时缓存到本地（可选）
      setLocalToken(postMessageToken);
      return postMessageToken;
    }
  }

  // 回退到本地 token（独立运行模式）
  const localToken = getLocalToken();
  if (localToken) {
    cachedToken = localToken;
    tokenCacheTime = Date.now();
    return localToken;
  }

  return null;
};

/**
 * 同步版本的 getToken（用于同步场景）
 */
export const getTokenSync = (): string | null => {
  // 优先使用缓存
  if (cachedToken && Date.now() - tokenCacheTime < TOKEN_CACHE_DURATION) {
    return cachedToken;
  }

  // 回退到本地存储
  return getLocalToken();
};

/**
 * 统一的 token 设置接口
 */
export const setToken = async (token: string): Promise<void> => {
  cachedToken = token;
  tokenCacheTime = Date.now();

  const isIntegrated = isIntegratedMode();

  if (isIntegrated) {
    // 尝试设置到主应用
    try {
      const hostAuth = await getHostAuthModule();
      if (hostAuth && typeof hostAuth.setToken === "function") {
        hostAuth.setToken(token);
        return;
      }
    } catch (error) {
      // 继续使用本地存储
    }
  }

  // 回退到本地存储
  setLocalToken(token);
};

/**
 * 统一的 token 清除接口
 */
export const removeToken = async (): Promise<void> => {
  cachedToken = null;
  tokenCacheTime = 0;

  const isIntegrated = isIntegratedMode();

  if (isIntegrated) {
    try {
      const hostAuth = await getHostAuthModule();
      if (hostAuth && typeof hostAuth.removeToken === "function") {
        hostAuth.removeToken();
        return;
      }
    } catch (error) {
      // 继续清除本地
    }
  }

  removeLocalToken();
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};

/**
 * 同步版本的 isAuthenticated
 */
export const isAuthenticatedSync = (): boolean => {
  return !!getTokenSync();
};

/**
 * 获取用户信息
 */
export const getUserInfo = (): any | null => {
  try {
    const userInfoStr = localStorage.getItem(LOCAL_USER_INFO_KEY);
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
    localStorage.setItem(LOCAL_USER_INFO_KEY, JSON.stringify(userInfo));
  } catch (error) {
    console.error("设置用户信息失败:", error);
  }
};

/**
 * 监听 token 更新事件
 */
if (typeof window !== "undefined") {
  window.addEventListener("message", (event) => {
    const hostOrigin = getHostOrigin();

    if (event.origin !== hostOrigin) {
      return;
    }

    const { type, token } = event.data;

    if (type === "TOKEN_UPDATED") {
      // 更新缓存
      cachedToken = token;
      tokenCacheTime = Date.now();

      // 触发自定义事件
      window.dispatchEvent(
        new CustomEvent("token-updated", { detail: { token } })
      );
    } else if (type === "TOKEN_REMOVED") {
      // 清除缓存
      cachedToken = null;
      tokenCacheTime = 0;
      removeLocalToken();

      window.dispatchEvent(new CustomEvent("token-removed"));
    }
  });
}
