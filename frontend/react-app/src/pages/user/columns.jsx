import { Button, Space, Tooltip, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

/**
 * 用户管理表格列定义
 * @param {Object} handlers - 处理函数对象
 * @param {Function} handlers.handleEdit - 编辑用户处理函数
 * @param {Function} handlers.handleDelete - 删除用户处理函数
 * @returns {Array} 表格列配置数组
 */
export const getUserColumns = (handlers) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    align: "center",
  },
  {
    title: "用户名",
    dataIndex: "username",
    key: "username",
    width: 150,
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
    width: 200,
  },
  {
    title: "角色",
    dataIndex: "role",
    key: "role",
    width: 100,
    render: (role) => {
      const roleMap = {
        admin: "管理员",
        user: "用户",
        guest: "访客",
      };
      return roleMap[role] || role;
    },
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status) => {
      const statusMap = {
        active: "活跃",
        inactive: "非活跃",
        banned: "已禁用",
      };
      return statusMap[status] || status;
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
          <Popconfirm
            title="确定要删除这个用户吗？"
            description="删除后无法恢复，请谨慎操作。"
            onConfirm={() => handlers.handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Tooltip>
      </Space>
    ),
  },
];
