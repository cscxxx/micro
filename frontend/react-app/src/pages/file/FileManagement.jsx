import { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Table, 
  message, 
  Modal, 
  Space,
  Popconfirm,
  Typography,
  Upload,
  Input,
  Form,
  Tag,
  Tooltip
} from 'antd'
import { 
  UploadOutlined, 
  DownloadOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FileOutlined,
  EyeOutlined
} from '@ant-design/icons'
import { api } from '../../utils/axios'
import { getMimeTypeFromFilename, getFileTypeIcon, formatFileSize } from '../../utils/mimetype'
import styles from '../../styles/pages/Management.module.css'

const { Title } = Typography
const { Dragger } = Upload

const FileManagement = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [uploadModalVisible, setUploadModalVisible] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })
  const [form] = Form.useForm()

  // 获取文件列表
  const fetchFiles = async (page = 1, limit = 10, search = '') => {
    try {
      setLoading(true)
      const response = await api.get('/files', {
        params: { page, limit, search }
      })
      
      setFiles(response.data.files)
      setPagination({
        current: response.data.pagination.page,
        pageSize: response.data.pagination.limit,
        total: response.data.pagination.total
      })
    } catch (error) {
      console.error('获取文件列表失败:', error)
      message.error('获取文件列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 文件上传
  const handleUpload = async (file, description = '') => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('description', description)

      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      message.success('文件上传成功')
      setUploadModalVisible(false)
      form.resetFields()
      fetchFiles(pagination.current, pagination.pageSize, searchText)
      return false
    } catch (error) {
      message.error('文件上传失败: ' + (error.response?.data?.error || error.message))
      return false
    }
  }

  // 文件下载
  const handleDownload = (fileId, filename) => {
    const base = (api.defaults?.baseURL || '').replace(/\/$/, '')
    const downloadUrl = `${base}/files/download/${fileId}`
    console.log('downloadUrl',downloadUrl)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    message.success('文件下载已开始')
  }

  // 删除文件
  const handleDelete = async (fileId) => {
    try {
      await api.delete(`/files/${fileId}`)
      message.success('文件删除成功')
      fetchFiles(pagination.current, pagination.pageSize, searchText)
    } catch (error) {
      console.error('文件删除失败:', error)
      message.error('文件删除失败')
    }
  }

  // 批量删除
  const handleBatchDelete = async (fileIds) => {
    try {
      await api.delete('/files/batch', { data: { ids: fileIds } })
      message.success(`成功删除 ${fileIds.length} 个文件`)
      fetchFiles(pagination.current, pagination.pageSize, searchText)
    } catch (error) {
      console.error('批量删除失败:', error)
      message.error('批量删除失败')
    }
  }

  // 获取文件类型图标（优先使用文件名，回退到 mimetype）
  const getFileIcon = (filename, mimetype) => {
    // 优先根据文件名获取图标
    if (filename) {
      return getFileTypeIcon(filename)
    }
    
    // 回退到基于 mimetype 的判断
    if (mimetype && mimetype.startsWith('image/')) return '🖼️'
    if (mimetype && mimetype.includes('pdf')) return '📄'
    if (mimetype && mimetype.includes('word')) return '📝'
    if (mimetype && mimetype.includes('excel')) return '📊'
    if (mimetype && mimetype.includes('powerpoint')) return '📈'
    if (mimetype && (mimetype.includes('zip') || mimetype.includes('rar'))) return '📦'
    return '📁'
  }

  // 格式化时间
  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleString('zh-CN')
  }

  // 表格列定义
  const columns = [
    {
      title: '文件名',
      dataIndex: 'originalname',
      key: 'originalname',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>{getFileIcon(record.originalname, record.mimetype)}</span>
          <Tooltip title={text}>
            <span style={{ 
              maxWidth: 200, 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {text}
            </span>
          </Tooltip>
        </div>
      )
    },
    {
      title: '类型',
      dataIndex: 'mimetype',
      key: 'mimetype',
      width: 120,
      render: (mimetype, record) => {
        // 如果后端没有提供有效的 mimetype，则根据文件名获取
        const actualMimetype = mimetype && mimetype !== 'application/octet-stream' 
          ? mimetype 
          : getMimeTypeFromFilename(record.originalname)
        
        return (
          <Tag color="blue">
            {actualMimetype.split('/')[1]?.toUpperCase() || 'UNKNOWN'}
          </Tag>
        )
      }
    },
    {
      title: '大小',
      dataIndex: 'size',
      key: 'size',
      width: 100,
      render: (size) => formatFileSize(size)
    },
    {
      title: '上传时间',
      dataIndex: 'upload_time',
      key: 'upload_time',
      width: 160,
      render: (time) => formatTime(time)
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <Tooltip title={text}>
          <span style={{ 
            maxWidth: 150, 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            display: 'inline-block'
          }}>
            {text || '-'}
          </span>
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Tooltip title="下载">
            <Button
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record.id, record.originalname)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个文件吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ]

  // 搜索处理
  const handleSearch = (value) => {
    setSearchText(value)
    fetchFiles(1, pagination.pageSize, value)
  }

  // 分页处理
  const handleTableChange = (paginationInfo) => {
    fetchFiles(paginationInfo.current, paginationInfo.pageSize, searchText)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <div className={styles.management}>
      <div className={styles.header}>
        <Title level={4} className={styles.title}>文件管理</Title>
        <Button 
          type="primary" 
          icon={<UploadOutlined />}
          onClick={() => setUploadModalVisible(true)}
          className={styles.addButton}
        >
          上传文件
        </Button>
      </div>

      <Card className={styles.tableCard}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索文件名或描述"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
        </div>
        
        <Table 
          columns={columns} 
          dataSource={files} 
          rowKey="id"
          loading={loading}
          className={styles.table}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            className: styles.pagination
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              if (selectedRowKeys.length > 0) {
                Modal.confirm({
                  title: '批量删除',
                  content: `确定要删除选中的 ${selectedRowKeys.length} 个文件吗？`,
                  onOk: () => handleBatchDelete(selectedRowKeys),
                })
              }
            }
          }}
        />
      </Card>

      {/* 上传文件模态框 */}
      <Modal
        title="上传文件"
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form 
          form={form} 
          layout="vertical"
          style={{ marginTop: 20 }}
        >
          <Form.Item 
            name="description" 
            label="文件描述"
          >
            <Input.TextArea 
              placeholder="请输入文件描述（可选）"
              rows={3}
            />
          </Form.Item>

          <Form.Item label="选择文件">
            <Dragger
              beforeUpload={(file) => {
                const description = form.getFieldValue('description') || ''
                return handleUpload(file, description)
              }}
              showUploadList={false}
              accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
              <p className="ant-upload-hint">
                支持单个文件上传，文件大小不超过50MB
              </p>
            </Dragger>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default FileManagement
