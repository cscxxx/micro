import { Button, Space, Tooltip, Tag } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";

/**
 * 订单管理表格列定义
 * @param {Object} handlers - 处理函数对象
 * @param {Function} handlers.handleEdit - 编辑订单处理函数
 * @param {Function} handlers.handleDelete - 删除订单处理函数
 * @param {Function} handlers.handleView - 查看订单处理函数
 * @returns {Array} 表格列配置数组
 */
export const getOrderColumns = (handlers) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    align: "center",
  },
  {
    title: "用户ID",
    dataIndex: "user_id",
    key: "user_id",
    width: 100,
    align: "center",
  },
  {
    title: "产品ID",
    dataIndex: "product_id",
    key: "product_id",
    width: 100,
    align: "center",
  },
  {
    title: "数量",
    dataIndex: "quantity",
    key: "quantity",
    width: 80,
    align: "center",
  },
  {
    title: "总价",
    dataIndex: "total_price",
    key: "total_price",
    width: 120,
    align: "right",
    render: (price) => `¥${price || 0}`,
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status) => {
      const statusMap = {
        pending: { text: "待处理", color: "orange" },
        processing: { text: "处理中", color: "blue" },
        shipped: { text: "已发货", color: "cyan" },
        delivered: { text: "已送达", color: "green" },
        cancelled: { text: "已取消", color: "red" },
        returned: { text: "已退货", color: "purple" },
      };
      const statusInfo = statusMap[status] || {
        text: status,
        color: "default",
      };
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    },
  },
  {
    title: "支付状态",
    dataIndex: "payment_status",
    key: "payment_status",
    width: 120,
    render: (status) => {
      const paymentStatusMap = {
        unpaid: { text: "未支付", color: "red" },
        paid: { text: "已支付", color: "green" },
        refunded: { text: "已退款", color: "orange" },
        partial_refund: { text: "部分退款", color: "yellow" },
      };
      const statusInfo = paymentStatusMap[status] || {
        text: status,
        color: "default",
      };
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    },
  },
  {
    title: "支付方式",
    dataIndex: "payment_method",
    key: "payment_method",
    width: 120,
    render: (method) => {
      const methodMap = {
        alipay: "支付宝",
        wechat: "微信支付",
        bank: "银行卡",
        cash: "现金",
        other: "其他",
      };
      return methodMap[method] || method || "-";
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
    width: 150,
    render: (_, record) => (
      <Space>
        <Tooltip title="查看">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handlers.handleView(record)}
          />
        </Tooltip>
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
