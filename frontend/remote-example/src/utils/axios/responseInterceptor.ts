import { AxiosError, AxiosResponse } from "axios";
import { ResponseData, ErrorResponse, HttpStatusCode } from "./types";
import { removeToken } from "@/utils/auth";
import { message } from "./message";

/**
 * 登录页面路径
 */
const LOGIN_PATH = "/login";

/**
 * 清除 token 并跳转登录
 */
const redirectToLogin = async (): Promise<void> => {
  await removeToken();
  window.location.href = LOGIN_PATH;
};

/**
 * 处理错误响应
 */
const handleError = (error: ErrorResponse, statusCode: number): void => {
  const errorMessage = error.message || "请求失败，请稍后重试";

  switch (statusCode) {
    case HttpStatusCode.UNAUTHORIZED:
      message.error("登录已过期，请重新登录");
      redirectToLogin();
      break;
    case HttpStatusCode.FORBIDDEN:
      message.error("没有权限访问该资源");
      break;
    case HttpStatusCode.NOT_FOUND:
      message.error("请求的资源不存在");
      break;
    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      message.error("服务器错误，请稍后重试");
      break;
    default:
      message.error(errorMessage);
      break;
  }
};

/**
 * 响应成功拦截器
 */
export const responseInterceptor = <T = any>(
  response: AxiosResponse<ResponseData<T>>
): T => {
  const { data } = response;

  if (typeof data === "object" && "code" in data) {
    if (data.code === 0 || data.success === true) {
      return data.data;
    } else {
      const error: ErrorResponse = {
        code: data.code,
        message: data.message || "请求失败",
        data: data.data,
      };
      message.error(error.message);
      throw error;
    }
  }

  return data as T;
};

/**
 * 响应错误拦截器
 */
export const responseErrorInterceptor = (
  error: AxiosError<ResponseData>
): Promise<ErrorResponse> => {
  if (!error.response) {
    const errorMessage = error.message || "";
    const errorCode = error.code || "";

    if (errorCode === "ECONNABORTED" || errorMessage.includes("timeout")) {
      message.error("请求超时，请稍后重试");
    } else if (
      errorMessage === "Network Error" ||
      errorMessage.includes("ERR_CONNECTION_REFUSED") ||
      errorCode === "ERR_NETWORK"
    ) {
      message.error("无法连接到服务器，请检查网络连接或确认服务是否启动");
    } else {
      message.error("请求失败，请稍后重试");
    }

    const networkError: ErrorResponse = {
      code: -1,
      message: errorMessage || "网络错误",
    };
    return Promise.reject(networkError);
  }

  const { status, data } = error.response;
  const errorResponse: ErrorResponse = {
    code: data?.code || status,
    message: data?.message || error.message || "请求失败",
    data: data?.data,
  };

  handleError(errorResponse, status);
  return Promise.reject(errorResponse);
};
