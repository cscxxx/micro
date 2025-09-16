import { useState } from 'react'
import { Form, Input, Button, Card, message, Divider, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../../utils/axios'
import styles from '../../styles/pages/Login.module.css'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const handleLogin = async (values) => {
    try {
      setLoading(true)
      console.log('开始登录，用户名:', values.username)
      // 调用后端登录接口
      const response = await api.post('/auth/login', {
        username: values.username,
        password: values.password
      })
      console.log('登录响应:', response.data)
      if (response.data && response.data.token) {
        const { token, user } = response.data
        
        // 存储token和用户信息到localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        // 如果选择了"记住我"，设置更长的过期时间
        if (values.remember) {
          localStorage.setItem('remember', 'true')
          // 设置token过期时间为7天
          const expirationTime = Date.now() + 7 * 24 * 60 * 60 * 1000
          localStorage.setItem('tokenExpiration', expirationTime.toString())
        } else {
          localStorage.removeItem('remember')
          localStorage.removeItem('tokenExpiration')
        }
        
        console.log('登录成功，存储的token:', token)
        console.log('存储的用户信息:', user)
        
        message.success('登录成功')
        
        // 延迟一下再跳转，让用户看到成功消息
        setTimeout(() => {
          console.log('准备跳转到dashboard')
          navigate('/dashboard')
        }, 500)
      } else {
        message.error('登录响应格式错误')
      }
    } catch (error) {
      console.error('登录错误:', error)
      
      // 处理具体的错误信息
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error)
      } else {
        message.error('登录失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>
      <Card className={styles.loginCard}>
        <h1 className={styles.title}>微服务管理系统</h1>
        
        <Form
          form={form}
          name="login"
          onFinish={handleLogin}
          layout="vertical"
          className={styles.form}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
            className={styles.formItem}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
            className={styles.formItem}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item className={styles.formItem}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Form.Item name="remember" valuePropName="checked" style={{ marginBottom: 0 }}>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className={styles.forgotPassword}>
                忘记密码？
              </Link>
            </div>
          </Form.Item>

          <Form.Item className={styles.formItem}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.loginButton}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div className={styles.registerLink}>
          <span>还没有账户？</span>
          <Link to="/register">立即注册</Link>
        </div>
      </Card>
    </div>
  )
}

export default Login
