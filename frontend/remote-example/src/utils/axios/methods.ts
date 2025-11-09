import request from "./request";
import { RequestConfig, ResponseData } from "./types";

/**
 * GET 请求
 */
export const get = <T = any>(
  url: string,
  config?: RequestConfig
): Promise<T> => {
  return request.get<ResponseData<T>, T>(url, config);
};

/**
 * POST 请求
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
 */
export const deleteRequest = <T = any>(
  url: string,
  config?: RequestConfig
): Promise<T> => {
  return request.delete<ResponseData<T>, T>(url, config);
};

/**
 * PATCH 请求
 */
export const patch = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return request.patch<ResponseData<T>, T>(url, data, config);
};
