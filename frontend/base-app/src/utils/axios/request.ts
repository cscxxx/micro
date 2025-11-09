import axios, { AxiosInstance } from "axios";
import { BASE_URL, TIMEOUT } from "./config";
import {
  requestInterceptor,
  requestErrorInterceptor,
} from "./requestInterceptor";
import {
  responseInterceptor,
  responseErrorInterceptor,
} from "./responseInterceptor";

/**
 * 创建 axios 实例
 * 配置基础选项并注册拦截器
 */
const request: AxiosInstance = axios.create({
  baseURL: BASE_URL, // 基础 URL
  timeout: TIMEOUT, // 请求超时时间
  headers: {
    "Content-Type": "application/json",
  },
});

// 注册请求拦截器
request.interceptors.request.use(requestInterceptor, requestErrorInterceptor);

// 注册响应拦截器
request.interceptors.response.use(
  responseInterceptor,
  responseErrorInterceptor
);

export default request;
