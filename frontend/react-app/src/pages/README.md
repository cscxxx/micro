# 页面文件夹结构说明

本目录按照功能模块对页面进行了重新组织，便于维护和扩展。

## 文件夹结构

```
pages/
├── auth/                    # 认证相关页面
│   ├── Login.jsx           # 登录页面
│   ├── Register.jsx        # 注册页面
│   ├── ForgotPassword.jsx  # 忘记密码页面
│   ├── ResetPassword.jsx   # 重置密码页面
│   └── index.js            # 统一导出
├── dashboard/              # 仪表板页面
│   ├── Dashboard.jsx       # 主仪表板
│   └── index.js            # 统一导出
├── user/                   # 用户管理页面
│   ├── UserManagement.jsx  # 用户管理
│   └── index.js            # 统一导出
├── product/                # 产品管理页面
│   ├── ProductManagement.jsx # 产品管理
│   └── index.js            # 统一导出
├── order/                  # 订单管理页面
│   ├── OrderManagement.jsx # 订单管理
│   └── index.js            # 统一导出
├── file/                   # 文件管理页面
│   ├── FileManagement.jsx  # 文件列表管理
│   ├── BinaryFileDownload.jsx # 二进制下载页面
│   ├── DownloadGuide.jsx   # 下载方式说明页面
│   └── index.js            # 统一导出
└── index.js                # 所有页面统一导出
```

## 导入方式

### 方式一：从具体文件夹导入

```javascript
import { Login, Register } from "./pages/auth";
import { Dashboard } from "./pages/dashboard";
import { FileManagement, BinaryFileDownload } from "./pages/file";
```

### 方式二：从总入口导入（推荐）

```javascript
import {
  Login,
  Register,
  Dashboard,
  FileManagement,
  BinaryFileDownload,
} from "./pages";
```

## 优势

1. **模块化**: 按功能分类，便于维护
2. **可扩展**: 每个模块可以独立添加新页面
3. **清晰**: 文件夹结构一目了然
4. **统一**: 通过 index.js 统一导出，导入更简洁

## 添加新页面

1. 在对应功能文件夹中创建新页面
2. 在文件夹的 index.js 中添加导出
3. 在总 index.js 中添加导出（可选）
4. 在 App.jsx 中添加路由配置
