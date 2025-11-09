import React from "react";
import { Layout as AntLayout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: "/",
      label: <Link to="/">首页</Link>,
    },
    {
      key: "/remote-example",
      label: <Link to="/remote-example">远程模块示例</Link>,
    },
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            color: "white",
            fontSize: "18px",
            fontWeight: "bold",
            marginRight: "24px",
          }}
        >
          微前端基座
        </div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: "24px", background: "#fff" }}>
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;
