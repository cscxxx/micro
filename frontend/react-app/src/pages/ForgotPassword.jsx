import { useState } from 'react'
import { Form, Input, Button, Card, message, Divider } from 'antd'
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { api } from '../utils/axios'
import styles from '../styles/pages/Auth.module.css'

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [form] = Form.useForm()

  const handleForgotPassword = async (values) => {
    try {
      setLoading(true)
      // 调用后端忘记密码接口
      const response = await api.post('/auth/forgot-password', {
        email: values.email
      })
      
      if (response.data && response.data.message) {
        setEmailSent(true)
        message.success('重置密码邮件已发送，请检查您的邮箱')
      } else {
        message.error('发送失败，请重试')
      }
    } catch (error) {
      console.error('忘记密码错误:', error)
      
      // 处理具体的错误信息
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error)
      } else {
        message.error('发送失败，请重试')
      }
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className={styles.authContainer}>
        <Card className={styles.authCard}>
          <h1 className={styles.title}>邮件已发送</h1>
          
          <div style={{ padding: '20px 0', textAlign: 'center' }}>
            <MailOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
            <p style={{ fontSize: '16px', marginBottom: '16px' }}>
              我们已向您的邮箱发送了密码重置链接
            </p>
            <p className={styles.description}>
              请检查您的邮箱并点击链接来重置密码
            </p>
            <Button type="primary" onClick={() => setEmailSent(false)} className={styles.submitButton}>
              重新发送
            </Button>
          </div>

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

  return (
    <div className={styles.authContainer}>
      <Card className={styles.authCard}>
        <h1 className={styles.title}>忘记密码</h1>
        
        <p className={styles.description}>
          请输入您的邮箱地址，我们将发送密码重置链接给您
        </p>

        <Form
          form={form}
          name="forgot-password"
          onFinish={handleForgotPassword}
          layout="vertical"
          className={styles.form}
        >
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
              placeholder="邮箱地址"
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
              发送重置链接
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

export default ForgotPassword
