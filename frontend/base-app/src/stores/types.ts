import { UserInfo } from "@/utils/auth/types";

/**
 * Store 类型定义
 */

/**
 * 用户认证状态
 */
export interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
}

/**
 * 用户认证 Actions
 */
export interface AuthActions {
  // 登录
  login: (token: string, userInfo: UserInfo) => void;
  // 登出
  logout: () => void;
  // 更新用户信息
  updateUserInfo: (userInfo: Partial<UserInfo>) => void;
  // 初始化（从 localStorage 恢复状态）
  initialize: () => void;
}

/**
 * 用户认证 Store 类型
 */
export type AuthStore = AuthState & AuthActions;

/**
 * UI 状态
 */
export interface UIState {
  // 主题：light | dark
  theme: "light" | "dark";
  // 侧边栏折叠状态
  sidebarCollapsed: boolean;
  // 加载状态
  loading: boolean;
}

/**
 * UI Actions
 */
export interface UIActions {
  // 切换主题
  toggleTheme: () => void;
  // 设置主题
  setTheme: (theme: "light" | "dark") => void;
  // 切换侧边栏
  toggleSidebar: () => void;
  // 设置侧边栏状态
  setSidebarCollapsed: (collapsed: boolean) => void;
  // 设置加载状态
  setLoading: (loading: boolean) => void;
}

/**
 * UI Store 类型
 */
export type UIStore = UIState & UIActions;
