import { InternalAxiosRequestConfig } from "axios";
import { getToken } from "@/utils/auth";

/**
 * 请求拦截器处理函数
 */
export const requestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  // 1. 添加 token 到请求头
  const token = await getToken();
  console.debug("请求拦截器 - 获取 token:", token ? "已获取" : "未获取", {
    url: config.url,
    method: config.method,
  });
  if (token) {
    debugger;
    config.headers.Authorization = `Bearer ${token}`;
    debugger;
    console.debug("请求拦截器 - 已添加 Authorization 头");
  } else {
    console.warn("请求拦截器 - 未获取到 token，请求可能失败");
  }

  // 2. 设置通用请求头
  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  // 3. 添加请求时间戳（防止缓存）
  if (config.method?.toLowerCase() === "get") {
    config.params = {
      ...config.params,
      _t: Date.now(),
    };
  }

  return config;
};

/**
 * 请求错误拦截器
 */
export const requestErrorInterceptor = (error: any) => {
  console.error("请求拦截器错误:", error);
  return Promise.reject(error);
};
