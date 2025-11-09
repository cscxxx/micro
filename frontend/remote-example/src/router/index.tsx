import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import ProtectedRoute from "@/components/ProtectedRoute";

// 路由组件
const Login = lazy(() => import("../pages/Login"));
const ExampleComponent = lazy(() => import("../components/ExampleComponent"));

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
              <ExampleComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
