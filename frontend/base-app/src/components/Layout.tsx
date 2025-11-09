import React from "react";
import { Layout as AntLayout, Menu, Button, Dropdown, Space } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { removeToken, getUserInfo } from "@/utils/auth";

const { Header, Content } = AntLayout;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const userInfo = getUserInfo();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/",
      label: <Link to="/">首页</Link>,
    },
    {
      key: "/remote-example",
      label: <Link to="/remote-example">远程模块示例</Link>,
    },
    {
      key: "/demo",
      label: <Link to="/demo">Demo</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "logout",
      label: "退出登录",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
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
        <Space>
          <span style={{ color: "white" }}>
            {userInfo?.fullName || userInfo?.username || "用户"}
          </span>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button
              type="text"
              icon={<UserOutlined />}
              style={{ color: "white" }}
            />
          </Dropdown>
        </Space>
      </Header>
      <Content style={{ padding: "24px", background: "#fff" }}>
        {children}
      </Content>
    </AntLayout>
  );
};

export default Layout;
