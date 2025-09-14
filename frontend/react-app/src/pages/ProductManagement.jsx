import { useState, useEffect } from 'react'
import { Card, Button, Form, Input, Table, message } from 'antd'
import { api } from '../utils/axios'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const productColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: '产品名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      align: 'right',
      render: (text) => text ? `¥${parseFloat(text).toFixed(2)}` : '-',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (text) => text ? new Date(text).toLocaleString('zh-CN') : '-',
    },
  ]

  const handleAddProduct = async (values) => {
    try {
      setLoading(true)
      await api.post('/products', values)
      message.success('产品添加成功')
      form.resetFields()
      fetchProducts()
    } catch (error) {
      message.error('产品添加失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/products')
      setProducts(response.data)
    } catch (error) {
      message.error('获取产品数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <Card 
        title="添加产品" 
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
          onFinish={handleAddProduct} 
          layout="vertical"
          style={{ maxWidth: '800px' }}
        >
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <Form.Item 
              name="name" 
              rules={[{ required: true, message: '请输入产品名称' }]}
              style={{ flex: '1', minWidth: '200px' }}
            >
              <Input placeholder="请输入产品名称" size="large" />
            </Form.Item>
            <Form.Item 
              name="price" 
              rules={[{ required: true, message: '请输入价格' }]}
              style={{ flex: '1', minWidth: '150px' }}
            >
              <Input placeholder="请输入价格" type="number" size="large" addonAfter="元" />
            </Form.Item>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
            <Form.Item 
              name="description"
              style={{ flex: '1', minWidth: '300px' }}
            >
              <Input placeholder="请输入产品描述" size="large" />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                添加产品
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
      <Card 
        title="产品列表"
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
          <Button onClick={fetchProducts} type="default" icon={<span>🔄</span>} loading={loading}>
            刷新数据
          </Button>
        }
      >
        <Table 
          columns={productColumns} 
          dataSource={products} 
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

export default ProductManagement
