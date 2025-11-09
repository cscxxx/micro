import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Demo } from "@/pages/Demo";

// 主应用路由
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));

// 远程模块路由 - 直接使用 lazy 加载远程模块
const RemoteExample = lazy(() => import("remoteExample/ExampleComponent"));

const AppRouter: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Spin size="large" style={{ display: "block", margin: "50px auto" }} />
      }
    >
      <Routes>
        {/* 登录页面（不需要认证） */}
        <Route path="/login" element={<Login />} />

        {/* 需要认证的路由 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/remote-example"
          element={
            <ProtectedRoute>
              <RemoteExample />
            </ProtectedRoute>
          }
        />
        <Route
          path="/demo"
          element={
            <ProtectedRoute>
              <Demo />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
