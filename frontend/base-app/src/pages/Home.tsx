import React from "react";
import { Card, Typography, Space } from "antd";
import { Link } from "react-router-dom";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Title level={2}>微前端基座应用</Title>
          <Paragraph>
            这是一个基于 Module Federation 和 Rspack 构建的微前端基座应用。
          </Paragraph>
          <Title level={4}>功能特性：</Title>
          <ul>
            <li>基于 Module Federation 的模块联邦</li>
            <li>使用 Rspack 构建，性能优异</li>
            <li>React 19 + TypeScript</li>
            <li>Ant Design UI 组件库</li>
            <li>支持远程模块动态加载</li>
          </ul>
          <Title level={4}>示例：</Title>
          <Link to="/remote-example">查看远程模块示例</Link>
        </Space>
      </Card>
    </div>
  );
};

export default Home;
