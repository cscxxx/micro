import { AxiosError, AxiosResponse } from "axios";
import { ResponseData, ErrorResponse, HttpStatusCode } from "./types";
import { TOKEN_KEY, TOKEN_STORAGE, LOGIN_PATH } from "./config";
import { message } from "./message";

/**
 * 响应拦截器
 * 处理响应数据、错误状态码、token 过期等
 */

/**
 * 清除 token
 */
const clearToken = (): void => {
  try {
    if (TOKEN_STORAGE === "localStorage") {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    console.error("清除 token 失败:", error);
  }
};

/**
 * 跳转到登录页
 */
const redirectToLogin = (): void => {
  clearToken();
  // 使用 window.location 跳转，避免依赖 react-router
  window.location.href = LOGIN_PATH;
};

/**
 * 处理错误响应
 * @param error 错误对象
 * @returns Promise.reject(error)
 */
const handleError = (error: ErrorResponse, statusCode: number): void => {
  const errorMessage = error.message || "请求失败，请稍后重试";

  switch (statusCode) {
    case HttpStatusCode.UNAUTHORIZED:
      // 401: 未授权，token 过期或无效
      message.error("登录已过期，请重新登录");
      redirectToLogin();
      break;

    case HttpStatusCode.FORBIDDEN:
      // 403: 禁止访问
      message.error("没有权限访问该资源");
      break;

    case HttpStatusCode.NOT_FOUND:
      // 404: 资源不存在
      message.error("请求的资源不存在");
      break;

    case HttpStatusCode.INTERNAL_SERVER_ERROR:
      // 500: 服务器内部错误
      message.error("服务器错误，请稍后重试");
      break;

    case HttpStatusCode.BAD_GATEWAY:
      // 502: 网关错误
      message.error("网关错误，请稍后重试");
      break;

    case HttpStatusCode.SERVICE_UNAVAILABLE:
      // 503: 服务不可用
      message.error("服务暂时不可用，请稍后重试");
      break;

    default:
      // 其他错误
      message.error(errorMessage);
      break;
  }
};

/**
 * 响应成功拦截器
 * @param response 响应对象
 * @returns 处理后的响应数据
 */
export const responseInterceptor = <T = any>(
  response: AxiosResponse<ResponseData<T>>
): T => {
  const { data } = response;

  // 检查响应格式是否符合标准
  if (typeof data === "object" && "code" in data) {
    // 标准响应格式：{ code, message, data }
    if (data.code === 0 || data.success === true) {
      // 成功：返回 data 字段
      return data.data;
    } else {
      // 业务错误：显示错误消息并抛出错误
      const error: ErrorResponse = {
        code: data.code,
        message: data.message || "请求失败",
        data: data.data,
      };
      message.error(error.message);
      throw error;
    }
  }

  // 非标准格式：直接返回整个响应数据
  return data as T;
};

/**
 * 响应错误拦截器
 * @param error 错误对象
 * @returns Promise.reject(error)
 */
export const responseErrorInterceptor = (
  error: AxiosError<ResponseData>
): Promise<ErrorResponse> => {
  // 网络错误（无响应）
  if (!error.response) {
    const errorMessage = error.message || "";
    const errorCode = error.code || "";

    if (errorCode === "ECONNABORTED" || errorMessage.includes("timeout")) {
      message.error("请求超时，请稍后重试");
    } else if (
      errorMessage === "Network Error" ||
      errorMessage.includes("ERR_CONNECTION_REFUSED") ||
      errorMessage.includes("ERR_CONNECTION") ||
      errorCode === "ERR_NETWORK" ||
      errorCode === "ECONNREFUSED"
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

  // HTTP 错误响应
  const { status, data } = error.response;
  const errorResponse: ErrorResponse = {
    code: data?.code || status,
    message: data?.message || error.message || "请求失败",
    data: data?.data,
  };

  // 处理不同状态码
  handleError(errorResponse, status);

  return Promise.reject(errorResponse);
};
