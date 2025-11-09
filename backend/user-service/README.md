# 用户服务

使用 Express.js 和 MySQL 的用户管理微服务。

## 安装配置

1. 安装依赖包：

```bash
npm install
```

2. 创建 `.env` 文件，参考 `env.example` 文件：

```bash
cp env.example .env
# 编辑 .env 文件，配置数据库连接信息
```

3. 启动服务：

```bash
npm start
# 或者开发模式
npm run dev
```

服务将在端口 3001 上运行。

## 数据库说明

详细的数据库结构和使用说明请参考 [DATABASE.md](./DATABASE.md)。

## 部署

```bash
# 打包服务
npm run package

# 部署到服务器
npm run deploy
```
