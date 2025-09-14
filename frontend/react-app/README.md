# React 微服务前端应用

基于 Vite + React + Ant Design 构建的现代化微服务前端应用，提供用户管理、产品管理、订单管理等完整的管理后台功能。

## 🚀 技术栈

- **React 19** - 用户界面库
- **Vite 7** - 构建工具和开发服务器
- **Ant Design 5** - 企业级 UI 组件库
- **React Router DOM** - 路由管理
- **Axios** - HTTP 客户端
- **JavaScript ES6+** - 编程语言

## 📁 项目结构

```
react-app/
├── public/                     # 静态资源
├── src/                        # 源代码
│   ├── components/             # 公共组件
│   │   ├── Layout.jsx         # 主布局组件
│   │   └── ProtectedRoute.jsx # 路由守卫组件
│   ├── pages/                  # 页面组件
│   │   ├── Login.jsx          # 登录页面
│   │   ├── Register.jsx       # 注册页面
│   │   ├── ForgotPassword.jsx # 忘记密码
│   │   ├── ResetPassword.jsx  # 重置密码
│   │   ├── Dashboard.jsx     # 仪表板
│   │   ├── UserManagement.jsx # 用户管理
│   │   ├── ProductManagement.jsx # 产品管理
│   │   └── OrderManagement.jsx   # 订单管理
│   ├── styles/                # CSS Modules 样式
│   │   ├── layout/            # 布局样式
│   │   │   └── Layout.module.css
│   │   └── pages/             # 页面样式
│   │       ├── Login.module.css
│   │       ├── Register.module.css
│   │       ├── Dashboard.module.css
│   │       ├── Management.module.css
│   │       └── Auth.module.css
│   ├── config/                # 配置文件
│   │   └── api.js            # API 配置
│   ├── services/              # 服务层
│   │   └── api.js            # API 服务封装
│   ├── utils/                 # 工具函数
│   │   └── axios.js          # Axios 配置
│   ├── App.jsx               # 主应用组件
│   ├── main.jsx              # 应用入口
│   └── index.css             # 全局基础样式
├── vite-proxy.config.js      # Vite 代理配置
├── vite.config.js            # Vite 配置
└── package.json              # 项目配置
```

## 🛠️ 开发指南

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:5173` 上运行。

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 🎯 功能特性

### 🔐 用户认证

- **登录/注册** - 完整的用户认证流程
- **密码强度验证** - 注册时实时密码强度检测
- **记住我功能** - 可选的长期登录状态
- **忘记密码** - 邮件重置密码流程
- **路由守卫** - 自动保护需要认证的页面

### 📊 管理功能

- **用户管理** - 用户列表、添加、编辑、删除
- **产品管理** - 产品列表、添加、编辑、删除
- **订单管理** - 订单列表、添加、编辑、删除
- **文件管理** - 文件上传、下载、删除、批量操作
- **数据统计** - 仪表板展示关键指标

### 🎨 界面特性

- **响应式设计** - 适配不同屏幕尺寸
- **现代化 UI** - 使用 Ant Design 组件库
- **CSS Modules** - 模块化样式管理，避免样式冲突
- **简洁设计** - 精简的样式，页面更加简洁
- **侧边栏折叠** - 可折叠的导航菜单
- **数据表格** - 支持分页、排序、搜索
- **表单验证** - 实时表单验证和错误提示

## 🛣️ 路由配置

| 路径               | 页面     | 说明                | 权限要求 |
| ------------------ | -------- | ------------------- | -------- |
| `/`                | 重定向   | 自动跳转到登录页    | 无       |
| `/login`           | 登录页   | 用户登录            | 无       |
| `/register`        | 注册页   | 用户注册            | 无       |
| `/forgot-password` | 忘记密码 | 密码重置请求        | 无       |
| `/reset-password`  | 重置密码 | 使用 token 重置密码 | 无       |
| `/dashboard`       | 仪表板   | 数据统计概览        | 需要登录 |
| `/users`           | 用户管理 | 用户列表和管理      | 需要登录 |
| `/products`        | 产品管理 | 产品列表和管理      | 需要登录 |
| `/orders`          | 订单管理 | 订单列表和管理      | 需要登录 |
| `/files`           | 文件管理 | 文件上传下载删除    | 需要登录 |

## 🔌 API 集成

### 微服务架构

前端通过统一的 API 接口与以下微服务通信：

- **用户服务**: `http://localhost:3001` - 用户认证和管理
- **产品服务**: `http://localhost:3002` - 产品数据管理
- **订单服务**: `http://localhost:3003` - 订单数据管理
- **文件服务**: `http://localhost:3004` - 文件上传下载管理

### API 配置

#### 开发环境

- 使用 Vite 代理转发请求
- 所有请求通过 `/api` 前缀
- 自动处理跨域问题

#### 生产环境

- 可配置具体的后端服务地址
- 支持环境变量配置
- 可配置不同的超时时间

### 代理配置

```javascript
// vite-proxy.config.js
export const proxyConfig = {
  "/api/users": {
    target: "http://localhost:3001", // 用户服务
    changeOrigin: true,
  },
  "/api/auth": {
    target: "http://localhost:3001", // 认证服务
    changeOrigin: true,
  },
  "/api/products": {
    target: "http://localhost:3002", // 产品服务
    changeOrigin: true,
  },
  "/api/orders": {
    target: "http://localhost:3003", // 订单服务
    changeOrigin: true,
  },
  "/api/files": {
    target: "http://localhost:3004", // 文件服务
    changeOrigin: true,
  },
};
```

### API 使用示例

```javascript
import { userAPI } from "../services/api.js";

// 用户登录
const response = await userAPI.login({
  username: "admin",
  password: "admin123",
});

// 获取用户列表
const users = await userAPI.getUsers();
```

## 🔧 配置说明

### 环境变量

创建 `.env.local` 文件配置环境变量：

```bash
# 生产环境 API 基础地址
VITE_API_BASE_URL=http://your-backend-server.com/api

# 其他配置
VITE_APP_TITLE=微服务管理系统
```

### Axios 配置

- 自动添加 Authorization 头
- 统一的错误处理
- 请求和响应日志
- Token 过期自动处理

## 🧪 测试账户

系统预置了以下测试账户：

| 用户名 | 密码     | 角色     | 说明     |
| ------ | -------- | -------- | -------- |
| admin  | admin123 | 管理员   | 完整权限 |
| user1  | user123  | 普通用户 | 基础权限 |

## 🚀 快速开始

1. **启动后端服务**

   ```bash
   cd ../backend
   node start.js
   ```

2. **启动前端服务**

   ```bash
   npm run dev
   ```

3. **访问应用**

   - 前端地址: http://localhost:5173
   - 登录页面: http://localhost:5173/login
   - 管理后台: http://localhost:5173/dashboard

4. **使用测试账户登录**
   - 用户名: `admin`
   - 密码: `admin123`

## 📝 开发注意事项

1. **统一前缀**: 所有 API 请求都使用 `/api` 前缀
2. **自动代理**: 开发环境下自动根据路径转发到对应服务
3. **类型安全**: 使用封装的 API 服务，减少直接使用 axios
4. **错误处理**: 统一的错误处理在 axios 拦截器中
5. **Token 管理**: 自动在请求头中添加认证 token
6. **响应式设计**: 确保在不同设备上的良好体验
7. **CSS Modules**: 使用模块化样式，避免全局样式冲突
8. **样式简洁**: 保持页面设计简洁，避免过度装饰

## 🔄 添加新功能

### 添加新页面

1. 在 `src/pages/` 中创建新页面组件
2. 在 `src/styles/pages/` 中创建对应的 CSS Module 文件
3. 在 `src/App.jsx` 中添加路由配置
4. 如需权限保护，使用 `ProtectedRoute` 包装

### CSS Modules 使用示例

```javascript
// 组件中使用 CSS Modules
import styles from "../styles/pages/MyPage.module.css";

function MyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>页面标题</h1>
      <div className={styles.content}>页面内容</div>
    </div>
  );
}
```

```css
/* MyPage.module.css */
.container {
  padding: 24px;
  background: #fff;
  border-radius: 8px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
}

.content {
  color: #666;
  line-height: 1.6;
}
```

### 添加新 API

1. 在 `src/config/api.js` 中添加新的端点
2. 在 `src/services/api.js` 中添加对应的 API 方法
3. 如需新的服务，在 `vite-proxy.config.js` 中添加代理配置

## 🐛 常见问题

### Q: 登录后页面空白？

A: 检查浏览器控制台是否有错误，确认后端服务是否正常运行。

### Q: API 请求失败？

A: 确认后端服务已启动，检查代理配置是否正确。

### Q: 样式显示异常？

A: 确认 Ant Design 样式已正确引入，检查 CSS 文件路径。

## 📄 许可证

MIT License
