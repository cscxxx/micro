import { useState, useEffect } from 'react'
import { Card, Button, Form, Input, Table, message } from 'antd'
import { api } from '../../utils/axios'

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const orderColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: '用户ID',
      dataIndex: 'user_id',
      key: 'user_id',
      width: 100,
      align: 'center',
    },
    {
      title: '产品ID',
      dataIndex: 'product_id',
      key: 'product_id',
      width: 100,
      align: 'center',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center',
    },
    {
      title: '总金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      width: 120,
      align: 'right',
      render: (text) => text ? `¥${parseFloat(text).toFixed(2)}` : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text) => text ? new Date(text).toLocaleString('zh-CN') : '-',
    },
  ]

  const handleAddOrder = async (values) => {
    try {
      setLoading(true)
      await api.post('/orders', values)
      message.success('订单添加成功')
      form.resetFields()
      fetchOrders()
    } catch (error) {
      message.error('订单添加失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/orders')
      setOrders(response.data)
    } catch (error) {
      message.error('获取订单数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <Card 
        title="添加订单" 
        style={{ 
          marginBottom: 24,
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        headStyle={{
          fontSize: '16px',
          fontWeight: 600,
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <Form 
          form={form} 
          onFinish={handleAddOrder} 
          layout="vertical"
          style={{ maxWidth: '900px' }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Form.Item 
              name="user_id" 
              rules={[{ required: true, message: '请输入用户ID' }]}
              style={{ flex: '1', minWidth: '150px' }}
            >
              <Input placeholder="用户ID" type="number" size="large" />
            </Form.Item>
            <Form.Item 
              name="product_id" 
              rules={[{ required: true, message: '请输入产品ID' }]}
              style={{ flex: '1', minWidth: '150px' }}
            >
              <Input placeholder="产品ID" type="number" size="large" />
            </Form.Item>
            <Form.Item 
              name="quantity" 
              rules={[{ required: true, message: '请输入数量' }]}
              style={{ flex: '1', minWidth: '150px' }}
            >
              <Input placeholder="数量" type="number" size="large" />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <Form.Item 
              name="total_amount" 
              rules={[{ required: true, message: '请输入总金额' }]}
              style={{ flex: '1', minWidth: '200px' }}
            >
              <Input placeholder="总金额" type="number" size="large" addonAfter="元" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                添加订单
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
      <Card 
        title="订单列表"
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
        headStyle={{
          fontSize: '16px',
          fontWeight: 600,
          borderBottom: '1px solid #f0f0f0'
        }}
        extra={
          <Button onClick={fetchOrders} type="default" icon={<span>🔄</span>} loading={loading}>
            刷新数据
          </Button>
        }
      >
        <Table 
          columns={orderColumns} 
          dataSource={orders} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 'max-content' }}
          style={{ width: '100%' }}
          tableLayout="auto"
        />
      </Card>
    </div>
  )
}

export default OrderManagement
