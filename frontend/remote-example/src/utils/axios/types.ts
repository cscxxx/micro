import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * 扩展的请求配置类型
 */
export interface RequestConfig extends AxiosRequestConfig {}

/**
 * 标准响应数据格式
 */
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
  success?: boolean;
}

/**
 * 错误响应类型
 */
export interface ErrorResponse {
  code: number;
  message: string;
  data?: any;
}

/**
 * HTTP 状态码枚举
 */
export enum HttpStatusCode {
  OK = 200,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
