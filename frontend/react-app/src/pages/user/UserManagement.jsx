import { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Form, 
  Input, 
  Table, 
  message, 
  Modal, 
  Space,
  Popconfirm,
  Typography 
} from 'antd'
import { 
  UserOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  PlusOutlined 
} from '@ant-design/icons'
import { api } from '../../utils/axios'
import { getUserColumns } from './columns.jsx'
import styles from '../../styles/pages/Management.module.css'

const { Title } = Typography

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [form] = Form.useForm()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      message.error('获取用户数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (values) => {
    try {
      setLoading(true)
      await api.post('/users/register', values)
      message.success('用户添加成功')
      setModalVisible(false)
      form.resetFields()
      fetchUsers()
    } catch (error) {
      message.error('用户添加失败')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    form.setFieldsValue({
      username: user.username,
      email: user.email
    })
    setModalVisible(true)
  }

  const handleUpdateUser = async (values) => {
    try {
      setLoading(true)
      const response = await api.put(`/users/${editingUser.id}`, values)
      
      if (response.data && response.data.message) {
        message.success(response.data.message)
      } else {
        message.success('用户更新成功')
      }
      
      setModalVisible(false)
      setEditingUser(null)
      form.resetFields()
      fetchUsers()
    } catch (error) {
      console.error('更新用户失败:', error)
      
      // 根据不同的错误状态码显示不同的错误信息
      if (error.response) {
        const { status, data } = error.response
        switch (status) {
          case 400:
            message.error(data.error || '输入信息有误')
            break
          case 401:
            message.error('未授权，请重新登录')
            break
          case 403:
            message.error('权限不足')
            break
          case 404:
            message.error('用户不存在')
            break
          case 500:
            message.error('服务器错误，请稍后重试')
            break
          default:
            message.error(data.error || '更新用户失败')
        }
      } else if (error.request) {
        message.error('网络错误，请检查网络连接')
      } else {
        message.error('更新用户失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    try {
      setLoading(true)
      const response = await api.delete(`/users/${userId}`)
      
      if (response.data && response.data.message) {
        message.success(response.data.message)
      } else {
        message.success('用户删除成功')
      }
      
      fetchUsers()
    } catch (error) {
      console.error('删除用户失败:', error)
      
      // 根据不同的错误状态码显示不同的错误信息
      if (error.response) {
        const { status, data } = error.response
        switch (status) {
          case 400:
            message.error(data.error || '无法删除该用户')
            break
          case 401:
            message.error('未授权，请重新登录')
            break
          case 403:
            message.error('权限不足')
            break
          case 404:
            message.error('用户不存在')
            break
          case 500:
            message.error('服务器错误，请稍后重试')
            break
          default:
            message.error(data.error || '删除用户失败')
        }
      } else if (error.request) {
        message.error('网络错误，请检查网络连接')
      } else {
        message.error('删除用户失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (values) => {
    if (editingUser) {
      handleUpdateUser(values)
    } else {
      handleAddUser(values)
    }
  }

  const handleCancel = () => {
    setModalVisible(false)
    setEditingUser(null)
    form.resetFields()
  }

  // 处理函数对象
  const handlers = {
    handleEdit,
    handleDelete,
  };

  // 获取表格列定义
  const userColumns = getUserColumns(handlers);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  )

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className={styles.management}>
      <div className={styles.header}>
        <Title level={4} className={styles.title}>用户管理</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => setModalVisible(true)}
          className={styles.addButton}
        >
          添加用户
        </Button>
      </div>

      <Card className={styles.tableCard}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索用户名或邮箱"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
            allowClear
          />
        </div>
        
        <Table 
          columns={userColumns} 
          dataSource={filteredUsers} 
          rowKey="id"
          loading={loading}
          className={styles.table}
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            className: styles.pagination
          }}
          scroll={{ x: 'max-content' }}
        />
      </Card>

      <Modal
        title={editingUser ? '编辑用户' : '添加用户'}
        open={modalVisible}
        onCancel={handleCancel}
        footer={null}
        width={500}
      >
        <Form 
          form={form} 
          onFinish={handleSubmit} 
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item 
            name="username" 
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" prefix={<UserOutlined />} />
          </Form.Item>
          
          <Form.Item 
            name="email" 
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
            ]}
          >
            <Input placeholder="请输入邮箱" type="email" />
          </Form.Item>

          {!editingUser && (
            <Form.Item 
              name="password" 
              label="密码"
              rules={[{ required: true, message: '请输入密码' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingUser ? '更新' : '添加'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default UserManagement