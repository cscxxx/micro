import request from "./request";
import { RequestConfig, ResponseData } from "./types";

/**
 * 封装的 HTTP 请求方法
 * 提供统一的接口和类型支持
 */

/**
 * GET 请求
 * @template T 响应数据的类型
 * @param url 请求 URL
 * @param config 请求配置
 * @returns Promise<T> 响应数据
 */
export const get = <T = any>(
  url: string,
  config?: RequestConfig
): Promise<T> => {
  return request.get<ResponseData<T>, T>(url, config);
};

/**
 * POST 请求
 * @template T 响应数据的类型
 * @param url 请求 URL
 * @param data 请求体数据
 * @param config 请求配置
 * @returns Promise<T> 响应数据
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return request.post<ResponseData<T>, T>(url, data, config);
};

/**
 * PUT 请求
 * @template T 响应数据的类型
 * @param url 请求 URL
 * @param data 请求体数据
 * @param config 请求配置
 * @returns Promise<T> 响应数据
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return request.put<ResponseData<T>, T>(url, data, config);
};

/**
 * DELETE 请求
 * @template T 响应数据的类型
 * @param url 请求 URL
 * @param config 请求配置
 * @returns Promise<T> 响应数据
 */
export const deleteRequest = <T = any>(
  url: string,
  config?: RequestConfig
): Promise<T> => {
  return request.delete<ResponseData<T>, T>(url, config);
};

/**
 * PATCH 请求
 * @template T 响应数据的类型
 * @param url 请求 URL
 * @param data 请求体数据
 * @param config 请求配置
 * @returns Promise<T> 响应数据
 */
export const patch = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return request.patch<ResponseData<T>, T>(url, data, config);
};
