import { create } from "zustand";
import { UIStore } from "./types";

/**
 * UI 状态 Store
 * 管理主题、侧边栏等 UI 状态
 */
export const useUIStore = create<UIStore>((set, get) => ({
  // 初始状态
  theme: "light",
  sidebarCollapsed: false,
  loading: false,

  // 切换主题
  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";
    set({ theme: newTheme });

    // 保存到 localStorage
    try {
      localStorage.setItem("app_theme", newTheme);
    } catch (error) {
      console.error("保存主题失败:", error);
    }
  },

  // 设置主题
  setTheme: (theme: "light" | "dark") => {
    set({ theme });

    // 保存到 localStorage
    try {
      localStorage.setItem("app_theme", theme);
    } catch (error) {
      console.error("保存主题失败:", error);
    }
  },

  // 切换侧边栏
  toggleSidebar: () => {
    const currentCollapsed = get().sidebarCollapsed;
    set({ sidebarCollapsed: !currentCollapsed });
  },

  // 设置侧边栏状态
  setSidebarCollapsed: (collapsed: boolean) => {
    set({ sidebarCollapsed: collapsed });
  },

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ loading });
  },
}));

// 初始化：从 localStorage 恢复主题
if (typeof window !== "undefined") {
  try {
    const savedTheme = localStorage.getItem("app_theme") as
      | "light"
      | "dark"
      | null;
    if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
      useUIStore.getState().setTheme(savedTheme);
    }
  } catch (error) {
    console.error("恢复主题失败:", error);
  }
}
