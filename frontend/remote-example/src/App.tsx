import React from "react";
import { ConfigProvider, App as AntdApp } from "antd";
import zhCN from "antd/locale/zh_CN";
import ExampleComponent from "./components/ExampleComponent";

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
        <ExampleComponent />
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
