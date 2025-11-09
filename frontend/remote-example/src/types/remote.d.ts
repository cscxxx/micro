/**
 * Module Federation 远程模块类型定义
 */

declare module "host/Auth" {
  export const getToken: () => string | null;
  export const setToken: (token: string) => void;
  export const removeToken: () => void;
  export const isAuthenticated: () => boolean;
  export const getUserInfo: () => any | null;
  export const setUserInfo: (userInfo: any) => void;
  export const TOKEN_KEY: string;
  export const USER_INFO_KEY: string;
}
