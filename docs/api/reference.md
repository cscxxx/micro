# 📚 API 参考文档

## 概述

微服务系统提供四个独立的服务，每个服务负责特定的业务功能。所有服务都使用 RESTful API 设计。

## 🔗 服务端点

| 服务     | 端口 | 基础 URL              | 描述           |
| -------- | ---- | --------------------- | -------------- |
| 用户服务 | 3001 | http://localhost:3001 | 用户认证和管理 |
| 产品服务 | 3002 | http://localhost:3002 | 产品信息管理   |
| 订单服务 | 3003 | http://localhost:3003 | 订单处理和管理 |
| 文件服务 | 3004 | http://localhost:3004 | 文件上传和下载 |

## 🔐 认证

大部分 API 需要 JWT Token 认证。在请求头中添加：

```http
Authorization: Bearer <your-jwt-token>
```

## 👤 用户服务 API

### 用户注册

```http
POST /api/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**响应**:

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
  "username": "string",
  "password": "string"
}
```

**响应**:

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

### 更新用户信息

```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "email": "string"
}
```

### 获取用户列表

```http
GET /api/users
Authorization: Bearer <token>
```

### 忘记密码

```http
POST /api/forgot-password
Content-Type: application/json

{
  "email": "string"
}
```

### 重置密码

```http
POST /api/reset-password
Content-Type: application/json

{
  "token": "string",
  "password": "string"
}
```

## 📦 产品服务 API

### 获取产品列表

```http
GET /api/products
Authorization: Bearer <token>
```

**查询参数**:

- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10
- `search` (可选): 搜索关键词

### 创建产品

```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "stock": "number"
}
```

### 获取产品详情

```http
GET /api/products/:id
Authorization: Bearer <token>
```

### 更新产品

```http
PUT /api/products/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "stock": "number"
}
```

### 删除产品

```http
DELETE /api/products/:id
Authorization: Bearer <token>
```

## 🛒 订单服务 API

### 获取订单列表

```http
GET /api/orders
Authorization: Bearer <token>
```

**查询参数**:

- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10
- `status` (可选): 订单状态筛选

### 创建订单

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "product_id": "number",
  "quantity": "number",
  "total_amount": "number",
  "shipping_address": "string"
}
```

### 获取订单详情

```http
GET /api/orders/:id
Authorization: Bearer <token>
```

### 更新订单状态

```http
PUT /api/orders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "pending|processing|shipped|delivered|cancelled"
}
```

### 删除订单

```http
DELETE /api/orders/:id
Authorization: Bearer <token>
```

## 📁 文件服务 API

### 获取文件列表

```http
GET /api/files
Authorization: Bearer <token>
```

**查询参数**:

- `page` (可选): 页码，默认 1
- `limit` (可选): 每页数量，默认 10
- `type` (可选): 文件类型筛选

### 上传文件

```http
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
description: "string" (可选)
```

**响应**:

```json
{
  "message": "文件上传成功",
  "file": {
    "id": 1,
    "filename": "example.txt",
    "originalname": "example.txt",
    "mimetype": "text/plain",
    "size": 1024,
    "path": "/files/example.txt"
  }
}
```

### 下载文件

```http
GET /api/files/:id
Authorization: Bearer <token>
```

### 删除文件

```http
DELETE /api/files/:id
Authorization: Bearer <token>
```

### 批量删除文件

```http
POST /api/files/batch-delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "file_ids": [1, 2, 3]
}
```

## 📊 通用响应格式

### 成功响应

```json
{
  "message": "操作成功",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 错误响应

```json
{
  "error": "错误信息",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔍 状态码

| 状态码 | 描述           |
| ------ | -------------- |
| 200    | 成功           |
| 201    | 创建成功       |
| 400    | 请求参数错误   |
| 401    | 未授权         |
| 403    | 禁止访问       |
| 404    | 资源不存在     |
| 500    | 服务器内部错误 |

## 🛠️ 开发工具

### API 测试

使用 curl 测试 API：

```bash
# 测试登录
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 测试获取产品列表
curl -X GET http://localhost:3002/api/products \
  -H "Authorization: Bearer <your-token>"
```

### Postman 集合

可以导入以下 Postman 集合进行 API 测试：

```json
{
  "info": {
    "name": "微服务系统 API",
    "description": "微服务系统的完整 API 集合"
  },
  "item": [
    {
      "name": "用户服务",
      "item": [
        {
          "name": "用户注册",
          "request": {
            "method": "POST",
            "url": "http://localhost:3001/api/register"
          }
        }
      ]
    }
  ]
}
```

## 📝 注意事项

1. **认证**: 大部分 API 需要 JWT Token 认证
2. **内容类型**: 根据请求类型设置正确的 Content-Type
3. **错误处理**: 检查响应状态码和错误信息
4. **分页**: 列表 API 支持分页查询
5. **文件上传**: 使用 multipart/form-data 格式
6. **CORS**: 已配置跨域资源共享

## 🔄 版本控制

当前 API 版本: v1.0

版本更新时会在响应头中包含版本信息：

```http
API-Version: 1.0
```
