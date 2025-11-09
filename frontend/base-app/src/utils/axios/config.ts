/**
 * Axios 配置文件
 * 定义基础配置，如 baseURL、超时时间等
 */

/**
 * API 基础 URL
 * 根据实际后端服务地址修改
 */
export const BASE_URL = "http://localhost:3000";

/**
 * 请求超时时间（毫秒）
 */
export const TIMEOUT = 10000;

/**
 * Token 存储键名
 */
export const TOKEN_KEY = "token";

/**
 * Token 存储位置
 * 'localStorage' | 'sessionStorage'
 */
export const TOKEN_STORAGE: "localStorage" | "sessionStorage" = "localStorage";

/**
 * 登录页面路径
 * 用于 token 过期时跳转
 */
export const LOGIN_PATH = "/login";
