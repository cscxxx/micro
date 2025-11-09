# 用户服务数据库说明

## 📊 数据库信息

- **数据库名称**: `micro_user_service_db`
- **字符集**: `utf8mb4`
- **排序规则**: `utf8mb4_unicode_ci`
- **存储引擎**: `InnoDB`

## 🗄️ 表结构

### users 表

| 字段名         | 类型                                 | 约束                        | 默认值            | 说明         |
| -------------- | ------------------------------------ | --------------------------- | ----------------- | ------------ |
| id             | INT                                  | PRIMARY KEY, AUTO_INCREMENT | -                 | 用户 ID      |
| username       | VARCHAR(50)                          | UNIQUE, NOT NULL            | -                 | 用户名       |
| email          | VARCHAR(100)                         | UNIQUE, NOT NULL            | -                 | 邮箱         |
| password_hash  | VARCHAR(255)                         | NOT NULL                    | -                 | 密码哈希     |
| full_name      | VARCHAR(100)                         | -                           | NULL              | 全名         |
| phone          | VARCHAR(20)                          | -                           | NULL              | 电话         |
| avatar_url     | VARCHAR(255)                         | -                           | NULL              | 头像 URL     |
| role           | ENUM('admin', 'user')                | -                           | 'user'            | 角色         |
| status         | ENUM('active', 'inactive', 'banned') | -                           | 'active'          | 状态         |
| email_verified | BOOLEAN                              | -                           | FALSE             | 邮箱验证状态 |
| last_login_at  | TIMESTAMP                            | -                           | NULL              | 最后登录时间 |
| created_at     | TIMESTAMP                            | -                           | CURRENT_TIMESTAMP | 创建时间     |
| updated_at     | TIMESTAMP                            | -                           | CURRENT_TIMESTAMP | 更新时间     |

### 索引

- `idx_username` - 用户名索引
- `idx_email` - 邮箱索引
- `idx_status` - 状态索引
- `idx_created_at` - 创建时间索引

## 🚀 快速操作

### 设置数据库

```bash
npm run setup:db
```

### 检查数据库

```bash
npm run check:db
```

### 强制重建数据库

```bash
npm run setup:db:force
```

## 📝 环境变量

在 `.env` 文件中配置：

```env
DB_HOST=192.168.1.2
DB_USER=root
DB_PASSWORD=Chao123456@
DB_NAME=micro_user_service_db
```

## ⚠️ 注意事项

- 确保 MySQL 服务正在运行
- 确保数据库用户有足够的权限
- 生产环境请修改默认密码
- 定期备份数据库数据
