import { create } from "zustand";
import type { AuthStore } from "./types";
import {
  getToken as getTokenFromStorage,
  setToken as setTokenToStorage,
  removeToken as removeTokenFromStorage,
  getUserInfo as getUserInfoFromStorage,
  setUserInfo as setUserInfoToStorage,
  isAuthenticated as checkAuthenticated,
} from "@/utils/auth";
import type { UserInfo } from "@/utils/auth/types";

/**
 * 用户认证 Store
 * 整合现有认证逻辑，提供全局状态管理
 */
export const useAuthStore = create<AuthStore>((set, get) => {
  // 初始化：从 localStorage 恢复状态（同步执行，确保刷新后立即恢复状态）
  const initializeState = () => {
    const token = getTokenFromStorage();
    const userInfo = getUserInfoFromStorage();
    const authenticated = checkAuthenticated();

    return {
      token,
      userInfo,
      isAuthenticated: authenticated,
    };
  };

  // 在 store 创建时立即初始化状态
  const initialState = initializeState();

  return {
    // 初始状态（从 localStorage 恢复）
    ...initialState,

    // 初始化：从 localStorage 恢复状态（用于手动刷新）
    initialize: () => {
      const state = initializeState();
      set(state);
    },

    // 登录
    login: (token: string, userInfo: UserInfo) => {
      // 保存到 localStorage（通过认证模块，保持兼容性）
      setTokenToStorage(token);
      setUserInfoToStorage(userInfo);

      // 更新 store 状态
      set({
        token,
        userInfo,
        isAuthenticated: true,
      });
    },

    // 登出
    logout: () => {
      // 清除 localStorage（通过认证模块，保持兼容性）
      removeTokenFromStorage();

      // 更新 store 状态
      set({
        token: null,
        userInfo: null,
        isAuthenticated: false,
      });
    },

    // 更新用户信息
    updateUserInfo: (userInfo: Partial<UserInfo>) => {
      const currentUserInfo = get().userInfo;
      if (!currentUserInfo) {
        console.warn("无法更新用户信息：用户未登录");
        return;
      }

      const updatedUserInfo: UserInfo = {
        ...currentUserInfo,
        ...userInfo,
      };

      // 更新 localStorage
      setUserInfoToStorage(updatedUserInfo);

      // 更新 store 状态
      set({
        userInfo: updatedUserInfo,
      });
    },
  };
});
