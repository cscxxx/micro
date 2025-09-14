# 🔐 认证系统

## 功能概述

微服务系统提供完整的用户认证功能，包括用户注册、登录、密码重置等核心功能。

## ✨ 核心功能

- ✅ **用户注册** - 支持用户名、邮箱注册
- ✅ **用户登录** - JWT Token 认证
- ✅ **密码加密** - bcryptjs 安全加密
- ✅ **路由保护** - 前端路由权限控制
- ✅ **记住我** - 可选的长期登录状态
- ✅ **忘记密码** - 邮箱重置密码功能
- ✅ **密码强度** - 实时密码强度检测

## 🛠️ 技术栈

### 后端技术

- **Express.js** - Web 框架
- **MySQL** - 数据库存储
- **bcryptjs** - 密码加密
- **jsonwebtoken** - JWT Token 生成和验证

### 前端技术

- **React** - 前端框架
- **Ant Design** - UI 组件库
- **Axios** - HTTP 客户端
- **React Router** - 路由管理

## 🚀 快速使用

### 启动系统

```bash
# 启动后端服务
cd backend
npm start

# 启动前端应用
cd frontend/react-app
npm run dev
```

### 访问地址

- **前端应用**: http://localhost:5173
- **登录页面**: http://localhost:5173/login
- **注册页面**: http://localhost:5173/register
- **管理后台**: http://localhost:5173/dashboard

### 测试账户

| 用户名 | 密码     | 邮箱              | 角色     |
| ------ | -------- | ----------------- | -------- |
| admin  | admin123 | admin@example.com | 管理员   |
| user1  | user123  | user1@example.com | 普通用户 |

## 📚 API 接口

### 用户注册

```http
POST /api/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**响应示例**:

```json
{
  "message": "注册成功",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

### 用户登录

```http
POST /api/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**响应示例**:

```json
{
  "message": "登录成功",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

### 获取用户信息

```http
GET /api/profile
Authorization: Bearer <token>
```

### 忘记密码

```http
POST /api/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### 重置密码

```http
POST /api/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "password": "newpassword123"
}
```

## 🗄️ 数据库结构

### 用户表 (users)

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔒 安全特性

### 1. 密码安全

- **加密存储**: 使用 bcryptjs 进行密码哈希
- **强度验证**: 要求包含大小写字母和数字
- **实时检测**: 注册时显示密码强度指示器

### 2. Token 安全

- **JWT 认证**: 使用 JSON Web Token 进行身份验证
- **过期时间**: 默认 24 小时，记住我功能可延长至 7 天
- **自动清理**: 过期 token 自动清除

### 3. 重置安全

- **重置链接**: 密码重置链接 1 小时有效期
- **邮箱验证**: 通过注册邮箱发送重置链接
- **一次性使用**: 重置链接使用后立即失效

### 4. 路由保护

- **权限控制**: 使用 ProtectedRoute 组件保护需要认证的页面
- **自动重定向**: 未认证用户自动重定向到登录页
- **状态管理**: 自动处理登录状态和 token 过期

## 📁 文件结构

```
backend/
├── user-service/
│   └── server.js              # 用户服务主文件（包含认证逻辑）
└── config.js                  # 统一配置文件

frontend/react-app/src/
├── pages/
│   ├── Login.jsx              # 登录页面
│   ├── Register.jsx           # 注册页面
│   ├── ForgotPassword.jsx     # 忘记密码页面
│   └── ResetPassword.jsx      # 重置密码页面
├── components/
│   └── ProtectedRoute.jsx     # 路由保护组件
└── utils/
    └── axios.js               # HTTP客户端配置
```

## 🛠️ 开发指南

### 添加新的受保护路由

1. 在 `App.jsx` 中添加新路由
2. 使用 `ProtectedRoute` 组件包装需要认证的页面
3. 在 `axios.js` 中配置对应的 API baseURL

```jsx
// 示例：添加受保护的管理页面
<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  }
/>
```

### 自定义认证逻辑

1. 修改 `user-service/server.js` 中的认证中间件
2. 调整 JWT secret 和过期时间
3. 更新前端 token 处理逻辑

```javascript
// 示例：自定义 JWT 配置
const jwtConfig = {
  secret: process.env.JWT_SECRET || "your-secret-key",
  expiresIn: process.env.JWT_EXPIRES_IN || "24h",
};
```

### 添加新的用户角色

1. 更新数据库表结构
2. 修改注册和登录逻辑
3. 在前端添加角色权限控制

## 🧪 测试

### 运行认证测试

```bash
cd backend
node test.js
```

### 测试覆盖

- ✅ 用户注册
- ✅ 用户登录
- ✅ 获取用户信息
- ✅ 忘记密码
- ✅ 密码重置
- ✅ Token 验证
- ✅ 路由保护

## 🚨 故障排除

### 常见问题

1. **数据库连接失败**

   - 检查 MySQL 服务是否运行
   - 确认数据库配置信息正确

2. **登录失败**

   - 检查用户名和密码是否正确
   - 查看浏览器控制台错误信息

3. **Token 验证失败**

   - 检查 JWT_SECRET 配置
   - 确认 Token 未过期

4. **密码重置失败**
   - 检查邮箱配置
   - 确认重置链接未过期

### 日志查看

- **后端日志**: 查看终端输出
- **前端日志**: 打开浏览器开发者工具

## 📈 未来规划

- [ ] 添加用户角色权限管理
- [ ] 实现多设备登录管理
- [ ] 添加登录日志记录
- [ ] 实现验证码功能
- [ ] 添加社交登录支持
- [ ] 实现双因素认证
