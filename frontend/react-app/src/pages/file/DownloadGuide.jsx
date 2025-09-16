import { Card, Typography, Table, Alert, Space, Tag, Divider } from 'antd'
import { 
  InfoCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  DownloadOutlined,
  CodeOutlined
} from '@ant-design/icons'
import styles from '../../styles/pages/Management.module.css'

const { Title, Paragraph, Text } = Typography

const DownloadGuide = () => {
  // 两种下载方式的对比数据
  const comparisonData = [
    {
      key: '1',
      feature: '实现方式',
      traditional: '使用 res.download() 直接返回文件流',
      binary: '读取文件二进制数据，创建 Blob 对象下载'
    },
    {
      key: '2',
      feature: 'API 接口',
      traditional: 'GET /api/files/download/:id',
      binary: 'GET /api/files/binary/:id'
    },
    {
      key: '3',
      feature: '前端处理',
      traditional: '创建 <a> 标签触发下载',
      binary: '使用 axios 获取 Blob，创建 Blob 对象'
    },
    {
      key: '4',
      feature: '进度显示',
      traditional: '❌ 不支持',
      binary: '✅ 支持下载进度显示'
    },
    {
      key: '5',
      feature: '错误处理',
      traditional: '基础错误处理',
      binary: '详细的错误处理和状态管理'
    },
    {
      key: '6',
      feature: '大文件支持',
      traditional: '✅ 浏览器自动处理',
      binary: '⚠️ 需要特殊处理，可能占用内存'
    },
    {
      key: '7',
      feature: '内存使用',
      traditional: '低内存使用',
      binary: '较高内存使用（文件完全加载到内存）'
    },
    {
      key: '8',
      feature: '浏览器兼容性',
      traditional: '✅ 所有现代浏览器',
      binary: '✅ 所有现代浏览器'
    },
    {
      key: '9',
      feature: '下载速度',
      traditional: '快速，直接流式传输',
      binary: '较慢，需要先下载到内存'
    },
    {
      key: '10',
      feature: '适用场景',
      traditional: '一般文件下载，简单场景',
      binary: '需要进度显示，复杂下载逻辑'
    }
  ]

  const columns = [
    {
      title: '特性',
      dataIndex: 'feature',
      key: 'feature',
      width: 120,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: '传统下载方式',
      dataIndex: 'traditional',
      key: 'traditional',
      render: (text) => (
        <Text code style={{ fontSize: '12px' }}>
          {text}
        </Text>
      )
    },
    {
      title: '二进制下载方式',
      dataIndex: 'binary',
      key: 'binary',
      render: (text) => (
        <Text code style={{ fontSize: '12px' }}>
          {text}
        </Text>
      )
    }
  ]

  // 注意事项数据
  const considerations = [
    {
      type: 'success',
      title: '传统下载方式的优势',
      items: [
        '实现简单，代码量少',
        '内存使用效率高，适合大文件',
        '浏览器原生支持，下载速度快',
        '无需额外的前端处理逻辑',
        '适合批量下载场景'
      ]
    },
    {
      type: 'info',
      title: '二进制下载方式的优势',
      items: [
        '可以显示下载进度',
        '更好的错误处理和用户反馈',
        '可以添加下载前的验证逻辑',
        '支持下载状态管理',
        '可以自定义下载文件名和路径'
      ]
    },
    {
      type: 'warning',
      title: '二进制下载方式的注意事项',
      items: [
        '大文件会占用较多内存，可能导致浏览器卡顿',
        '文件需要完全下载到内存后才能开始保存',
        '不适合同时下载多个大文件',
        '需要处理内存不足的情况',
        '网络中断时可能丢失已下载的数据'
      ]
    }
  ]

  // 使用建议
  const recommendations = [
    {
      scenario: '小文件下载（< 10MB）',
      recommendation: '两种方式都可以，二进制方式提供更好的用户体验',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      scenario: '大文件下载（> 50MB）',
      recommendation: '推荐使用传统下载方式，避免内存问题',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />
    },
    {
      scenario: '需要进度显示',
      recommendation: '使用二进制下载方式，可以实时显示下载进度',
      icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />
    },
    {
      scenario: '批量下载',
      recommendation: '推荐使用传统下载方式，避免内存溢出',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />
    },
    {
      scenario: '移动端应用',
      recommendation: '推荐使用传统下载方式，移动设备内存有限',
      icon: <ExclamationCircleOutlined style={{ color: '#faad14' }} />
    }
  ]

  return (
    <div className={styles.management}>
      <div className={styles.header}>
        <Title level={4} className={styles.title}>文件下载方式说明</Title>
      </div>

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 概述 */}
        <Card title="概述" extra={<InfoCircleOutlined />}>
          <Paragraph>
            本系统提供了两种文件下载方式，每种方式都有其特定的使用场景和优缺点。
            选择合适的下载方式可以提升用户体验并避免潜在问题。
          </Paragraph>
        </Card>

        {/* 详细对比 */}
        <Card title="详细对比" extra={<CodeOutlined />}>
          <Table
            columns={columns}
            dataSource={comparisonData}
            pagination={false}
            size="small"
            bordered
            scroll={{ x: 'max-content' }}
          />
        </Card>

        {/* 注意事项 */}
        {considerations.map((consideration, index) => (
          <Alert
            key={index}
            message={consideration.title}
            type={consideration.type}
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                {consideration.items.map((item, itemIndex) => (
                  <li key={itemIndex} style={{ marginBottom: 4 }}>
                    {item}
                  </li>
                ))}
              </ul>
            }
            showIcon
          />
        ))}

        {/* 使用建议 */}
        <Card title="使用建议" extra={<DownloadOutlined />}>
          <Space direction="vertical" style={{ width: '100%' }}>
            {recommendations.map((rec, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '8px 0',
                borderBottom: index < recommendations.length - 1 ? '1px solid #f0f0f0' : 'none'
              }}>
                <Space>
                  {rec.icon}
                  <Text strong style={{ minWidth: '200px' }}>{rec.scenario}</Text>
                  <Text>{rec.recommendation}</Text>
                </Space>
              </div>
            ))}
          </Space>
        </Card>

        {/* 技术实现细节 */}
        <Card title="技术实现细节">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={5}>传统下载方式</Title>
              <Paragraph>
                <Text code>res.download(filePath, filename)</Text> 方法会设置适当的响应头，
                让浏览器直接处理文件下载。这种方式简单高效，适合大多数场景。
              </Paragraph>
            </div>

            <Divider />

            <div>
              <Title level={5}>二进制下载方式</Title>
              <Paragraph>
                使用 <Text code>fs.readFileSync()</Text> 读取文件到内存，
                然后通过 <Text code>res.send(buffer)</Text> 发送给前端。
                前端使用 <Text code>responseType: 'blob'</Text> 接收数据，
                创建 Blob 对象进行下载。
              </Paragraph>
            </div>
          </Space>
        </Card>

        {/* 性能对比 */}
        <Card title="性能对比">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <Title level={5}>传统下载方式</Title>
              <Space direction="vertical">
                <div><Tag color="green">内存使用: 低</Tag></div>
                <div><Tag color="green">下载速度: 快</Tag></div>
                <div><Tag color="green">实现复杂度: 简单</Tag></div>
                <div><Tag color="orange">用户体验: 基础</Tag></div>
              </Space>
            </div>
            <div>
              <Title level={5}>二进制下载方式</Title>
              <Space direction="vertical">
                <div><Tag color="orange">内存使用: 高</Tag></div>
                <div><Tag color="orange">下载速度: 中等</Tag></div>
                <div><Tag color="red">实现复杂度: 复杂</Tag></div>
                <div><Tag color="green">用户体验: 丰富</Tag></div>
              </Space>
            </div>
          </div>
        </Card>
      </Space>
    </div>
  )
}

export default DownloadGuide
