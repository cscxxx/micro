import { useState, useEffect } from 'react'
import { Form, Input, Button, Card, message, Divider } from 'antd'
import { LockOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { api } from '../../utils/axios'
import styles from '../../styles/pages/Auth.module.css'

const ResetPassword = () => {
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState('')

  useEffect(() => {
    const tokenParam = searchParams.get('token')
    if (!tokenParam) {
      message.error('无效的重置链接')
      navigate('/forgot-password')
      return
    }
    setToken(tokenParam)
  }, [searchParams, navigate])

  const handleResetPassword = async (values) => {
    try {
      setLoading(true)
      // 调用后端重置密码接口
      const response = await api.post('/auth/reset-password', {
        token: token,
        newPassword: values.newPassword
      })
      
      if (response.data && response.data.message) {
        message.success('密码重置成功，请使用新密码登录')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } else {
        message.error('重置失败，请重试')
      }
    } catch (error) {
      console.error('重置密码错误:', error)
      
      // 处理具体的错误信息
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error)
      } else {
        message.error('重置失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authContainer}>
      <Card className={styles.authCard}>
        <h1 className={styles.title}>重置密码</h1>
        
        <p className={styles.description}>
          请输入您的新密码
        </p>

        <Form
          form={form}
          name="reset-password"
          onFinish={handleResetPassword}
          layout="vertical"
          className={styles.form}
        >
          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码!' },
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
              placeholder="新密码"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
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
              placeholder="确认新密码"
              className={styles.input}
            />
          </Form.Item>

          <Form.Item className={styles.formItem}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.submitButton}
            >
              重置密码
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div className={styles.backLink}>
          <Link to="/login">
            <ArrowLeftOutlined /> 返回登录
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default ResetPassword
