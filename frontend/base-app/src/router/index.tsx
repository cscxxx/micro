import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";

// 主应用路由
const Home = lazy(() => import("../pages/Home"));

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
        <Route path="/" element={<Home />} />
        <Route path="/remote-example" element={<RemoteExample />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
