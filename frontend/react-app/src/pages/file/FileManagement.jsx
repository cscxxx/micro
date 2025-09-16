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
import { getFileColumns } from './columns.jsx'
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

  // 处理函数对象
  const handlers = {
    handleDownload,
    handleDelete,
    handleView: () => {}, // 暂时空实现
  };

  // 获取表格列定义
  const columns = getFileColumns(handlers);

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
