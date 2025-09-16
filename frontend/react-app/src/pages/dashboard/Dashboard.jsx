import { Card, Row, Col, Statistic, Typography } from 'antd'
import { UserOutlined, ShoppingOutlined, FileTextOutlined, DollarOutlined, FolderOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { api } from '../../utils/axios'
import styles from '../../styles/pages/Dashboard.module.css'

const { Title } = Typography

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    orders: 0,
    files: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [usersRes, productsRes, ordersRes, filesRes] = await Promise.all([
        api.get('/users'),
        api.get('/products'),
        api.get('/orders'),
        api.get('/files')
      ])

      const users = usersRes.data.length
      const products = productsRes.data.length
      const orders = ordersRes.data.length
      const files = filesRes.data.files?.length || 0
      const totalRevenue = ordersRes.data.reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0)

      setStats({ users, products, orders, files, totalRevenue })
    } catch (error) {
      console.error('获取统计数据失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className={styles.dashboard}>
      <Title level={2} className={styles.title}>仪表板</Title>
      
      <Row gutter={[32, 32]} className={styles.statsGrid}>
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <Statistic
                title="用户总数"
                value={stats.users}
                prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                loading={loading}
                valueStyle={{ color: '#1890ff' }}
                titleStyle={{ color: '#666' }}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <Statistic
                title="产品总数"
                value={stats.products}
                prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
                loading={loading}
                valueStyle={{ color: '#52c41a' }}
                titleStyle={{ color: '#666' }}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <Statistic
                title="订单总数"
                value={stats.orders}
                prefix={<FileTextOutlined style={{ color: '#faad14' }} />}
                loading={loading}
                valueStyle={{ color: '#faad14' }}
                titleStyle={{ color: '#666' }}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <Statistic
                title="文件总数"
                value={stats.files}
                prefix={<FolderOutlined style={{ color: '#722ed1' }} />}
                loading={loading}
                valueStyle={{ color: '#722ed1' }}
                titleStyle={{ color: '#666' }}
              />
            </div>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={6} xl={6}>
          <Card className={styles.statCard}>
            <div className={styles.statContent}>
              <Statistic
                title="总收入"
                value={stats.totalRevenue}
                precision={2}
                prefix={<DollarOutlined style={{ color: '#f5222d' }} />}
                suffix="元"
                loading={loading}
                valueStyle={{ color: '#f5222d' }}
                titleStyle={{ color: '#666' }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
