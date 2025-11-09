import React from "react";
import { Card, Typography, Space, Tag, Button, App } from "antd";
import { CheckCircleOutlined, RocketOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const ExampleComponent: React.FC = () => {
  const { message } = App.useApp();

  const handleClick = () => {
    message.success("这是一个来自远程模块的组件！");
  };

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div>
            <Tag color="success" icon={<CheckCircleOutlined />}>
              远程模块
            </Tag>
            <Tag color="processing" icon={<RocketOutlined />}>
              Module Federation
            </Tag>
          </div>

          <Title level={2}>远程模块示例组件</Title>

          <Paragraph>
            这是一个通过 Module Federation 从远程应用加载的组件。
            它运行在独立的子应用中，但可以无缝集成到主应用中。
          </Paragraph>

          <Title level={4}>技术特性：</Title>
          <ul>
            <li>使用 Rspack 构建</li>
            <li>React 19 + TypeScript</li>
            <li>Ant Design UI 组件</li>
            <li>共享依赖（React、Antd）</li>
            <li>独立部署和更新</li>
          </ul>

          <Button type="primary" size="large" onClick={handleClick}>
            测试交互
          </Button>
        </Space>
      </Card>
    </div>
  );
};

export default ExampleComponent;
