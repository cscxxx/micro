import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "./api";
import { useAuthStore } from "@/stores";
import type { AuthStore } from "@/stores/types";

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  // 使用 store 的登录方法
  const loginAction = useAuthStore((state: AuthStore) => state.login);

  // 获取重定向路径
  const from = (location.state as any)?.from?.pathname || "/";

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values);

      // 使用 store 保存 token 和用户信息
      loginAction(response.token, response.user);

      message.success("登录成功");

      // 跳转到原页面或首页
      navigate(from, { replace: true });
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "登录失败，请重试"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <Card
        title="主应用登录"
        style={{ width: 400 }}
        headStyle={{
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 16, textAlign: "center", color: "#999" }}>
          <p>测试账号：</p>
          <p>admin / admin123</p>
          <p>user / user123</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
