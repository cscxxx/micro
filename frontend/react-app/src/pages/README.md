# 页面组件结构说明

本目录包含所有页面组件，按功能模块进行了重新组织，并提取了表格列定义到单独文件中。

## 文件夹结构

```
pages/
├── auth/                    # 认证相关页面
│   ├── Login.jsx           # 登录页面
│   ├── Register.jsx        # 注册页面
│   ├── ForgotPassword.jsx  # 忘记密码页面
│   ├── ResetPassword.jsx   # 重置密码页面
│   ├── columns.jsx         # 认证页面表格列定义（如有）
│   └── index.js            # 统一导出
├── dashboard/              # 仪表板页面
│   ├── Dashboard.jsx       # 主仪表板
│   ├── columns.jsx         # 仪表板表格列定义（如有）
│   └── index.js            # 统一导出
├── user/                   # 用户管理页面
│   ├── UserManagement.jsx  # 用户管理
│   ├── columns.jsx         # 用户管理表格列定义
│   └── index.js            # 统一导出
├── product/                # 产品管理页面
│   ├── ProductManagement.jsx # 产品管理
│   ├── columns.jsx         # 产品管理表格列定义
│   └── index.js            # 统一导出
├── order/                  # 订单管理页面
│   ├── OrderManagement.jsx # 订单管理
│   ├── columns.jsx         # 订单管理表格列定义
│   └── index.js            # 统一导出
├── file/                   # 文件管理页面
│   ├── FileManagement.jsx  # 文件列表管理
│   ├── BinaryFileDownload.jsx # 二进制下载页面
│   ├── DownloadGuide.jsx   # 下载方式说明页面
│   ├── columns.jsx         # 文件管理表格列定义
│   └── index.js            # 统一导出
├── index.js                # 所有页面统一导出
└── README.md               # 说明文档
```

## 表格列定义文件 (columns.jsx)

### 设计理念

将表格列定义提取到单独的文件中，具有以下优势：

1. **代码分离**: 将 UI 逻辑与业务逻辑分离
2. **易于维护**: 列定义集中管理，便于修改
3. **可复用**: 列定义可以在多个组件中复用
4. **文件简洁**: 主组件文件更加简洁易读

### 文件命名规范

- 文件名: `columns.jsx`
- 位置: 各功能模块文件夹下
- 导出: 使用具名导出，如 `getUserColumns`

### 列定义函数设计

每个列定义文件都导出函数，接收处理函数作为参数：

```javascript
// 示例：用户管理列定义
export const getUserColumns = (handlers) => [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 80,
    align: "center",
  },
  {
    title: "操作",
    key: "action",
    width: 120,
    render: (_, record) => (
      <Space>
        <Button onClick={() => handlers.handleEdit(record)}>编辑</Button>
        <Button onClick={() => handlers.handleDelete(record.id)}>删除</Button>
      </Space>
    ),
  },
];
```

### 使用方式

在组件中使用列定义：

```javascript
import { getUserColumns } from "./columns.jsx";

const UserManagement = () => {
  // 处理函数对象
  const handlers = {
    handleEdit,
    handleDelete,
  };

  // 获取表格列定义
  const userColumns = getUserColumns(handlers);

  return (
    <Table
      columns={userColumns}
      dataSource={users}
      // ... 其他属性
    />
  );
};
```

## 各模块列定义说明

### 用户管理 (user/columns.jsx)

**导出函数**: `getUserColumns(handlers)`

**列定义**:

- ID: 用户 ID
- 用户名: 用户名称
- 邮箱: 用户邮箱
- 角色: 用户角色（管理员/用户/访客）
- 状态: 用户状态（活跃/非活跃/已禁用）
- 创建时间: 用户创建时间
- 操作: 编辑/删除按钮

**处理函数**:

- `handleEdit`: 编辑用户
- `handleDelete`: 删除用户

### 产品管理 (product/columns.jsx)

**导出函数**: `getProductColumns(handlers)`

**列定义**:

- ID: 产品 ID
- 产品名称: 产品名称
- 描述: 产品描述（带省略号）
- 价格: 产品价格（格式化显示）
- 库存: 库存数量（带状态标签）
- 分类: 产品分类
- 状态: 产品状态（上架/下架/草稿）
- 创建时间: 产品创建时间
- 操作: 编辑/删除按钮

**处理函数**:

- `handleEdit`: 编辑产品
- `handleDelete`: 删除产品

### 订单管理 (order/columns.jsx)

**导出函数**: `getOrderColumns(handlers)`

**列定义**:

- ID: 订单 ID
- 用户 ID: 下单用户 ID
- 产品 ID: 产品 ID
- 数量: 订单数量
- 总价: 订单总金额
- 状态: 订单状态（待处理/处理中/已发货/已送达/已取消/已退货）
- 支付状态: 支付状态（未支付/已支付/已退款/部分退款）
- 支付方式: 支付方式（支付宝/微信支付/银行卡/现金/其他）
- 创建时间: 订单创建时间
- 操作: 查看/编辑/删除按钮

**处理函数**:

- `handleEdit`: 编辑订单
- `handleDelete`: 删除订单
- `handleView`: 查看订单详情

### 文件管理 (file/columns.jsx)

**导出函数**:

- `getFileColumns(handlers)`: 文件列表管理列定义
- `getBinaryDownloadColumns(handlers)`: 二进制下载页面列定义
- `getDownloadGuideColumns()`: 下载方式说明页面列定义

**文件列表列定义**:

- 文件名: 文件名称（带图标和省略号）
- 类型: 文件类型（智能识别 MIME 类型）
- 大小: 文件大小（格式化显示）
- 上传时间: 文件上传时间
- 描述: 文件描述（带省略号）
- 操作: 下载/查看/删除按钮

**二进制下载列定义**:

- 文件名: 文件名称（带图标和省略号）
- 类型: 文件类型（智能识别 MIME 类型）
- 大小: 文件大小（格式化显示）
- 上传时间: 文件上传时间
- 描述: 文件描述（带省略号）
- 操作: 二进制下载按钮（带加载状态）

**下载说明列定义**:

- 特性: 功能特性名称
- 传统下载方式: 传统下载实现方式
- 二进制下载方式: 二进制下载实现方式

## 优势总结

### 1. 代码组织

- **模块化**: 按功能分类，便于维护
- **分离关注点**: UI 逻辑与业务逻辑分离
- **文件简洁**: 主组件文件更加简洁

### 2. 维护性

- **集中管理**: 列定义集中在一个文件中
- **易于修改**: 修改列定义只需修改一个文件
- **类型安全**: 使用函数参数确保类型安全

### 3. 可扩展性

- **参数化**: 通过参数传递处理函数
- **可复用**: 列定义可以在多个组件中复用
- **灵活配置**: 可以根据不同需求配置不同的列

### 4. 开发体验

- **代码提示**: IDE 可以提供更好的代码提示
- **错误检查**: 更容易发现和修复错误
- **团队协作**: 不同开发者可以独立维护不同模块

## 添加新列定义

### 1. 创建列定义文件

```javascript
// pages/newModule/columns.jsx
import { Button, Space, Tooltip } from "antd";

export const getNewModuleColumns = (handlers) => [
  {
    title: "列名",
    dataIndex: "field",
    key: "field",
    render: (text, record) => (
      // 渲染逻辑
    ),
  },
  // 更多列定义...
];
```

### 2. 在组件中使用

```javascript
import { getNewModuleColumns } from "./columns.jsx";

const NewModule = () => {
  const handlers = {
    handleAction: () => {},
  };

  const columns = getNewModuleColumns(handlers);

  return <Table columns={columns} />;
};
```

### 3. 更新导出文件

```javascript
// pages/newModule/index.js
export { default as NewModule } from "./NewModule";
export { getNewModuleColumns } from "./columns.jsx";
```

这种设计模式使得代码更加模块化、可维护和可扩展，是现代 React 应用的最佳实践。
