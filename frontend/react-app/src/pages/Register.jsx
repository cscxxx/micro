import { useState } from 'react'
import { Form, Input, Button, Card, message, Divider, Progress } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../utils/axios'
import styles from '../styles/pages/Register.module.css'

const Register = () => {
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  // 密码强度检查函数
  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 6) strength += 20
    if (password.length >= 8) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[A-Z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 10
    if (/[^A-Za-z0-9]/.test(password)) strength += 10
    return strength
  }

  // 获取密码强度颜色
  const getPasswordStrengthColor = (strength) => {
    if (strength < 40) return '#ff4d4f'
    if (strength < 70) return '#faad14'
    return '#52c41a'
  }

  // 获取密码强度文本
  const getPasswordStrengthText = (strength) => {
    if (strength < 40) return '弱'
    if (strength < 70) return '中等'
    return '强'
  }

  const handleRegister = async (values) => {
    try {
      setLoading(true)
      // 调用后端注册接口
      const response = await api.post('/users/register', {
        username: values.username,
        email: values.email,
        password: values.password
      })
      if (response.data && response.data.message) {
        message.success('注册成功，请登录')
        
        // 延迟一下再跳转到登录页
        setTimeout(() => {
          navigate('/login')
        }, 1000)
      } else {
        message.error('注册响应格式错误')
      }
    } catch (error) {
      console.error('注册错误:', error)
      
      // 处理具体的错误信息
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error)
      } else {
        message.error('注册失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.registerContainer}>
      <Card className={styles.registerCard}>
        <h1 className={styles.title}>用户注册</h1>
        
        <Form
          form={form}
          name="register"
          onFinish={handleRegister}
          layout="vertical"
          className={styles.form}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名!' },
              { min: 3, message: '用户名至少3个字符!' },
              { max: 20, message: '用户名最多20个字符!' }
            ]}
            className={styles.formItem}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' }
            ]}
            className={styles.formItem}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="邮箱"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
              { min: 6, message: '密码至少6个字符!' },
              { 
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: '密码必须包含大小写字母和数字!'
              }
            ]}
            className={styles.formItem}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              className={styles.input}
              onChange={(e) => {
                const strength = checkPasswordStrength(e.target.value)
                setPasswordStrength(strength)
              }}
            />
          </Form.Item>

          {passwordStrength > 0 && (
            <div className={styles.passwordStrength}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '12px', color: '#666' }}>密码强度</span>
                <span style={{ fontSize: '12px', color: getPasswordStrengthColor(passwordStrength) }}>
                  {getPasswordStrengthText(passwordStrength)}
                </span>
              </div>
              <Progress
                percent={passwordStrength}
                strokeColor={getPasswordStrengthColor(passwordStrength)}
                showInfo={false}
                size="small"
              />
            </div>
          )}

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致!'));
                },
              }),
            ]}
            className={styles.formItem}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="确认密码"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item className={styles.formItem}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.registerButton}
            >
              注册
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div className={styles.loginLink}>
          <span>已有账户？</span>
          <Link to="/login">立即登录</Link>
        </div>
      </Card>
    </div>
  )
}

export default Register
