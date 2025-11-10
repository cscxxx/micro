import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores";
import type { AuthStore } from "@/stores/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * 路由守卫组件
 * 自动检测登录状态，未登录时跳转到登录页
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  // 使用 store 获取认证状态
  const isAuthenticated = useAuthStore(
    (state: AuthStore) => state.isAuthenticated
  );

  if (!isAuthenticated) {
    // 未登录，跳转到登录页，并保存当前路径用于登录后重定向
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
