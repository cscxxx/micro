import { Button, Space, Tooltip, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

/**
 * 产品管理表格列定义
 * @param {Object} handlers - 处理函数对象
 * @param {Function} handlers.handleEdit - 编辑产品处理函数
 * @param {Function} handlers.handleDelete - 删除产品处理函数
 * @returns {Array} 表格列配置数组
 */
export const getProductColumns = (handlers) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    align: "center",
  },
  {
    title: "产品名称",
    dataIndex: "name",
    key: "name",
    width: 200,
  },
  {
    title: "描述",
    dataIndex: "description",
    key: "description",
    width: 300,
    render: (text) => (
      <Tooltip title={text}>
        <span
          style={{
            maxWidth: 200,
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
    title: "价格",
    dataIndex: "price",
    key: "price",
    width: 100,
    align: "right",
    render: (price) => `¥${price || 0}`,
  },
  {
    title: "库存",
    dataIndex: "stock",
    key: "stock",
    width: 80,
    align: "center",
    render: (stock) => {
      const stockNum = parseInt(stock) || 0;
      const color = stockNum > 10 ? "green" : stockNum > 0 ? "orange" : "red";
      return <Tag color={color}>{stockNum}</Tag>;
    },
  },
  {
    title: "分类",
    dataIndex: "category",
    key: "category",
    width: 120,
    render: (category) => {
      const categoryMap = {
        electronics: "电子产品",
        clothing: "服装",
        books: "图书",
        home: "家居",
        sports: "运动",
        other: "其他",
      };
      return categoryMap[category] || category || "-";
    },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status) => {
      const statusMap = {
        active: { text: "上架", color: "green" },
        inactive: { text: "下架", color: "red" },
        draft: { text: "草稿", color: "orange" },
      };
      const statusInfo = statusMap[status] || { text: status, color: "default" };
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    },
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
    key: "created_at",
    width: 160,
    render: (time) => {
      return time ? new Date(time).toLocaleString("zh-CN") : "-";
    },
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    render: (_, record) => (
      <Space>
        <Tooltip title="编辑">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handlers.handleEdit(record)}
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
