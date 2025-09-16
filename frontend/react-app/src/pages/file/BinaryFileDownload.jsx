import { useState, useEffect } from 'react'
import { 
  Card, 
  Button, 
  Table, 
  message, 
  Space,
  Typography,
  Input,
  Tag,
  Tooltip,
  Progress,
  Alert
} from 'antd'
import { 
  DownloadOutlined, 
  SearchOutlined,
  FileOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { api } from '../../utils/axios'
import { getBinaryDownloadColumns } from './columns.jsx'
import styles from '../../styles/pages/Management.module.css'

const { Title } = Typography

const BinaryFileDownload = () => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState({})
  const [searchText, setSearchText] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  })

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

  // 二进制数据下载
  const handleBinaryDownload = async (fileId, filename, originalMimetype) => {
    try {
      setDownloading(prev => ({ ...prev, [fileId]: true }))
      
      const response = await api.get(`/files/binary/${fileId}`, {
        responseType: 'blob'
      })
      
      // 如果后端没有提供 mimetype 或 mimetype 无效，则根据文件名获取
      const mimetype = originalMimetype && originalMimetype !== 'application/octet-stream' 
        ? originalMimetype 
        : getMimeTypeFromFilename(filename)
      
      // 创建 Blob 对象
      const blob = new Blob([response.data], { type: mimetype })
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.style.display = 'none'
      
      // 触发下载
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // 清理 URL 对象
      window.URL.revokeObjectURL(url)
      
      message.success('文件下载成功')
    } catch (error) {
      console.error('文件下载失败:', error)
      message.error('文件下载失败: ' + (error.response?.data?.error || error.message))
    } finally {
      setDownloading(prev => ({ ...prev, [fileId]: false }))
    }
  }

  // 处理函数对象
  const handlers = {
    handleBinaryDownload,
    downloading,
  };

  // 获取表格列定义
  const columns = getBinaryDownloadColumns(handlers);

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
        <Title level={4} className={styles.title}>二进制文件下载</Title>
      </div>

      <Alert
        message="二进制下载方式"
        description="此页面使用二进制数据下载方式，通过API获取文件的二进制数据，然后在前端创建Blob对象进行下载。这种方式可以更好地控制下载过程，支持进度显示和错误处理。"
        type="info"
        icon={<InfoCircleOutlined />}
        style={{ marginBottom: 16 }}
        showIcon
      />

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
        />
      </Card>
    </div>
  )
}

export default BinaryFileDownload
