import { Button, Space, Tooltip, Tag } from "antd";
import { 
  DownloadOutlined, 
  DeleteOutlined, 
  EyeOutlined 
} from "@ant-design/icons";
import { getMimeTypeFromFilename, getFileTypeIcon, formatFileSize } from "../../utils/mimetype";

/**
 * 文件管理表格列定义
 * @param {Object} handlers - 处理函数对象
 * @param {Function} handlers.handleDownload - 下载文件处理函数
 * @param {Function} handlers.handleDelete - 删除文件处理函数
 * @param {Function} handlers.handleView - 查看文件处理函数
 * @returns {Array} 表格列配置数组
 */
export const getFileColumns = (handlers) => [
  {
    title: "文件名",
    dataIndex: "originalname",
    key: "originalname",
    render: (text, record) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: 8 }}>
          {getFileTypeIcon(record.originalname, record.mimetype)}
        </span>
        <Tooltip title={text}>
          <span
            style={{
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        </Tooltip>
      </div>
    ),
  },
  {
    title: "类型",
    dataIndex: "mimetype",
    key: "mimetype",
    width: 120,
    render: (mimetype, record) => {
      // 如果后端没有提供有效的 mimetype，则根据文件名获取
      const actualMimetype = mimetype && mimetype !== "application/octet-stream" 
        ? mimetype 
        : getMimeTypeFromFilename(record.originalname);
      
      return (
        <Tag color="blue">
          {actualMimetype.split("/")[1]?.toUpperCase() || "UNKNOWN"}
        </Tag>
      );
    },
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
    width: 100,
    render: (size) => formatFileSize(size),
  },
  {
    title: "上传时间",
    dataIndex: "upload_time",
    key: "upload_time",
    width: 160,
    render: (time) => new Date(time).toLocaleString("zh-CN"),
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    render: (text) => (
      <Tooltip title={text}>
        <span
          style={{
            maxWidth: 150,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "inline-block",
          }}
        >
          {text || "-"}
        </span>
      </Tooltip>
    ),
  },
  {
    title: "操作",
    key: "action",
    width: 150,
    render: (_, record) => (
      <Space>
        <Tooltip title="下载">
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => handlers.handleDownload(record.id, record.originalname)}
          />
        </Tooltip>
        <Tooltip title="查看">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlers.handleView(record)}
          />
        </Tooltip>
        <Tooltip title="删除">
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handlers.handleDelete(record.id)}
          />
        </Tooltip>
      </Space>
    ),
  },
];

/**
 * 二进制下载页面表格列定义
 * @param {Object} handlers - 处理函数对象
 * @param {Function} handlers.handleBinaryDownload - 二进制下载处理函数
 * @returns {Array} 表格列配置数组
 */
export const getBinaryDownloadColumns = (handlers) => [
  {
    title: "文件名",
    dataIndex: "originalname",
    key: "originalname",
    render: (text, record) => (
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: 8 }}>
          {getFileTypeIcon(record.originalname, record.mimetype)}
        </span>
        <Tooltip title={text}>
          <span
            style={{
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        </Tooltip>
      </div>
    ),
  },
  {
    title: "类型",
    dataIndex: "mimetype",
    key: "mimetype",
    width: 120,
    render: (mimetype, record) => {
      // 如果后端没有提供有效的 mimetype，则根据文件名获取
      const actualMimetype = mimetype && mimetype !== "application/octet-stream" 
        ? mimetype 
        : getMimeTypeFromFilename(record.originalname);
      
      return (
        <Tag color="blue">
          {actualMimetype.split("/")[1]?.toUpperCase() || "UNKNOWN"}
        </Tag>
      );
    },
  },
  {
    title: "大小",
    dataIndex: "size",
    key: "size",
    width: 100,
    render: (size) => formatFileSize(size),
  },
  {
    title: "上传时间",
    dataIndex: "upload_time",
    key: "upload_time",
    width: 160,
    render: (time) => new Date(time).toLocaleString("zh-CN"),
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    render: (text) => (
      <Tooltip title={text}>
        <span
          style={{
            maxWidth: 150,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "inline-block",
          }}
        >
          {text || "-"}
        </span>
      </Tooltip>
    ),
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    render: (_, record) => (
      <Space>
        <Tooltip title="二进制下载">
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            loading={handlers.downloading && handlers.downloading[record.id]}
            onClick={() => handlers.handleBinaryDownload(record.id, record.originalname, record.mimetype)}
          >
            {handlers.downloading && handlers.downloading[record.id] ? "下载中..." : "下载"}
          </Button>
        </Tooltip>
      </Space>
    ),
  },
];

/**
 * 下载方式说明页面表格列定义
 * @returns {Array} 表格列配置数组
 */
export const getDownloadGuideColumns = () => [
  {
    title: "特性",
    dataIndex: "feature",
    key: "feature",
    width: 120,
    render: (text) => <span style={{ fontWeight: "bold" }}>{text}</span>,
  },
  {
    title: "传统下载方式",
    dataIndex: "traditional",
    key: "traditional",
    render: (text) => (
      <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
        {text}
      </span>
    ),
  },
  {
    title: "二进制下载方式",
    dataIndex: "binary",
    key: "binary",
    render: (text) => (
      <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
        {text}
      </span>
    ),
  },
];
