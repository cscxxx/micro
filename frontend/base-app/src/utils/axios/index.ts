/**
 * Axios 工具主入口
 * 导出 axios 实例和所有请求方法
 */

// 导出 axios 实例
export { default as request } from "./request";

// 导出所有请求方法
export { get, post, put, deleteRequest as delete, patch } from "./methods";

// 导出类型定义
export type {
  RequestConfig,
  ResponseData,
  ErrorResponse,
  AxiosResponseData,
} from "./types";

export { HttpStatusCode } from "./types";

// 导出配置（可选，用于外部修改配置）
export {
  BASE_URL,
  TIMEOUT,
  TOKEN_KEY,
  TOKEN_STORAGE,
  LOGIN_PATH,
} from "./config";

// 导出 token 相关工具函数（从认证模块导出）
export { getToken } from "@/utils/auth";
