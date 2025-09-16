import { useState, useEffect } from "react";
import { Layout, Menu, Button, Dropdown, Avatar, message } from "antd";
import {
  UserOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { getMenuItems, getRouteMetadata } from "../config/routes";
import styles from "../styles/layout/Layout.module.css";

const { Header, Content, Sider } = Layout

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState('dashboard')
  const navigate = useNavigate()
  const location = useLocation()

  // 根据当前路径设置选中的菜单项
  useEffect(() => {
    const routeMeta = getRouteMetadata(location.pathname);
    if (routeMeta) {
      setSelectedKey(routeMeta.menuKey);
    } else {
      setSelectedKey("dashboard");
    }
  }, [location.pathname]);

  // 动态生成菜单项
  const menuConfig = getMenuItems();
  
  const menuItems = [
    ...menuConfig.main.map((item) => ({
      key: item.key,
      icon: getIconComponent(item.icon),
      label: item.title,
    })),
    {
      key: "files",
      icon: <FolderOutlined />,
      label: "文件管理",
      children: menuConfig.files.map((item) => ({
        key: item.key,
        icon: getIconComponent(item.icon),
        label: item.title,
      })),
    },
  ];

  // 图标组件映射
  function getIconComponent(iconName) {
    const iconMap = {
      DashboardOutlined: <DashboardOutlined />,
      UserOutlined: <UserOutlined />,
      ShoppingOutlined: <ShoppingOutlined />,
      FileTextOutlined: <FileTextOutlined />,
      FolderOutlined: <FolderOutlined />,
      DownloadOutlined: <DownloadOutlined />,
      QuestionCircleOutlined: <QuestionCircleOutlined />,
    };
    return iconMap[iconName] || <FolderOutlined />;
  }

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    
    // 查找对应的路径
    const allMenuItems = [...menuConfig.main, ...menuConfig.files];
    const menuItem = allMenuItems.find((item) => item.key === key);
    
    if (menuItem) {
      navigate(menuItem.path);
    } else if (key === "files") {
      // 文件管理主菜单，导航到文件列表
      navigate("/files");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    message.success('已退出登录')
    navigate('/login')
  }

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ]

  const getUserInfo = () => {
    try {
      const user = localStorage.getItem('user')
      return user ? JSON.parse(user) : { username: '用户' }
    } catch {
      return { username: '用户' }
    }
  }

  const userInfo = getUserInfo()

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: '16px', width: 64, height: 64 }}
          />
          <h1 className={styles.logo}>微服务管理系统</h1>
        </div>
        
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
        >
          <div className={styles.userInfo}>
            <Avatar 
              size="small" 
              icon={<UserOutlined />} 
              style={{ marginRight: 8 }}
            />
            <span className={styles.userName}>{userInfo.username}</span>
          </div>
        </Dropdown>
      </Header>
      
      <Layout>
        <Sider 
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={200}
          collapsedWidth={60}
          className={styles.sider}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ 
              height: '100%', 
              borderRight: 0,
              paddingTop: '16px'
            }}
          />
        </Sider>
        
        <Layout className={styles.content}>
          <Content className={styles.contentInner}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default AppLayout
