import axios from "axios";
import { message } from "antd";
import { apiConfig } from "../config/api.js";

// 创建axios实例
const api = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("请求发送:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error("请求错误:", error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log("响应接收:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.error("响应错误:", error);

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // 检查是否是token过期
          if (
            data?.error === "无效的访问令牌" ||
            data?.error === "访问令牌缺失"
          ) {
            message.error("登录已过期，请重新登录");
          } else {
            message.error("未授权，请重新登录");
          }

          // 清除本地存储的token
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("remember");
          localStorage.removeItem("tokenExpiration");

          // 跳转到登录页
          window.location.href = "/login";
          break;
        case 403:
          message.error("禁止访问");
          break;
        case 404:
          message.error("请求的资源不存在");
          break;
        case 500:
          message.error("服务器内部错误");
          break;
        default:
          message.error(data?.message || "请求失败");
      }
    } else if (error.request) {
      message.error("网络错误，请检查网络连接");
    } else {
      message.error("请求配置错误");
    }

    return Promise.reject(error);
  }
);

export { api };
