import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ConfigProvider, App as AntdApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import Layout from "./components/Layout";
import AppRouter from "./router";

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  if (isLoginPage) {
    return <AppRouter />;
  }

  return (
    <Layout>
      <AppRouter />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={zhCN}
      // React 19 兼容性配置
      theme={{
        cssVar: {
          prefix: "ant",
        },
      }}
    >
      <AntdApp>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
