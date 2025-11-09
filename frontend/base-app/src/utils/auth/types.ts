/**
 * 认证相关类型定义
 */

/**
 * 用户信息
 */
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;
}

/**
 * 登录响应
 */
export interface LoginResponse {
  token: string;
  user: UserInfo;
}

/**
 * 登录请求参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * postMessage 消息类型
 */
export type MessageType =
  | "GET_TOKEN_REQUEST"
  | "GET_TOKEN_RESPONSE"
  | "TOKEN_UPDATED"
  | "TOKEN_REMOVED";

/**
 * postMessage 消息数据
 */
export interface MessageData {
  type: MessageType;
  requestId?: string;
  token?: string;
  source?: string;
}
