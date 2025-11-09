import { InternalAxiosRequestConfig } from "axios";
import { getToken } from "@/utils/auth";

/**
 * 请求拦截器
 * 在请求发送前进行处理，如添加 token、设置请求头等
 */

/**
 * 请求拦截器处理函数
 * @param config 请求配置对象
 * @returns 处理后的请求配置
 */
export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // 1. 添加 token 到请求头
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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

  // 4. 处理请求参数（如果需要特殊处理）
  // 例如：序列化数组、处理特殊字符等
  if (config.data && typeof config.data === "object") {
    // 可以在这里添加参数处理逻辑
    // 例如：移除空值、格式化日期等
  }

  return config;
};

/**
 * 请求错误拦截器
 * @param error 错误对象
 * @returns Promise.reject(error)
 */
export const requestErrorInterceptor = (error: any) => {
  console.error("请求拦截器错误:", error);
  return Promise.reject(error);
};
