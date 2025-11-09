import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * 扩展的请求配置类型
 * 继承自 AxiosRequestConfig，可添加自定义配置
 */
export interface RequestConfig extends AxiosRequestConfig {
  // 可以添加自定义配置项
  // 例如：skipAuth?: boolean; // 跳过认证
}

/**
 * 标准响应数据格式
 * @template T 响应数据的类型
 */
export interface ResponseData<T = any> {
  code: number; // 状态码，0 表示成功
  message: string; // 响应消息
  data: T; // 响应数据
  success?: boolean; // 是否成功（可选）
}

/**
 * 错误响应类型
 */
export interface ErrorResponse {
  code: number; // 错误码
  message: string; // 错误消息
  data?: any; // 错误数据（可选）
}

/**
 * Axios 响应类型（带泛型）
 */
export type AxiosResponseData<T = any> = AxiosResponse<ResponseData<T>>;

/**
 * HTTP 状态码枚举
 */
export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}
