import { useState, useEffect } from 'react'
import { Layout, Menu, Button, Dropdown, Avatar, message } from 'antd'
import { 
  UserOutlined, 
  ShoppingOutlined, 
  FileTextOutlined, 
  DashboardOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  FolderOutlined
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from '../styles/layout/Layout.module.css'

const { Header, Content, Sider } = Layout

const AppLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKey, setSelectedKey] = useState('dashboard')
  const navigate = useNavigate()
  const location = useLocation()

  // 根据当前路径设置选中的菜单项
  useEffect(() => {
    const path = location.pathname
    if (path.includes('/users')) {
      setSelectedKey('users')
    } else if (path.includes('/products')) {
      setSelectedKey('products')
    } else if (path.includes('/orders')) {
      setSelectedKey('orders')
    } else if (path.includes('/files')) {
      setSelectedKey('files')
    } else {
      setSelectedKey('dashboard')
    }
  }, [location.pathname])

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: 'products',
      icon: <ShoppingOutlined />,
      label: '产品管理',
    },
    {
      key: 'orders',
      icon: <FileTextOutlined />,
      label: '订单管理',
    },
    {
      key: 'files',
      icon: <FolderOutlined />,
      label: '文件管理',
    },
  ]

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key)
    switch (key) {
      case 'dashboard':
        navigate('/dashboard')
        break
      case 'users':
        navigate('/users')
        break
      case 'products':
        navigate('/products')
        break
      case 'orders':
        navigate('/orders')
        break
      case 'files':
        navigate('/files')
        break
      default:
        break
    }
  }

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
