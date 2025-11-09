# 微前端基座应用

基于 Module Federation 和 Rspack 构建的微前端基座项目。

## 技术栈

- **React 19** - UI 框架
- **TypeScript** - 类型系统
- **Rspack** - 构建工具
- **Module Federation** - 模块联邦
- **Ant Design** - UI 组件库
- **React Router v7** - 路由管理
- **pnpm** - 包管理器

## 项目结构

```
base-app/
├── package.json              # 主应用配置
├── rspack.config.ts          # Rspack 配置（Module Federation）
├── tsconfig.json             # TypeScript 配置
├── index.html                # HTML 入口
├── src/
│   ├── main.tsx             # 应用入口
│   ├── App.tsx              # 主应用组件
│   ├── router/              # 路由配置
│   ├── components/         # 组件
│   ├── pages/              # 页面
│   ├── types/              # 类型定义
│   └── styles/             # 样式
└── remote-example/          # 示例子应用
    ├── package.json
    ├── rspack.config.ts
    └── src/
        └── components/
            └── ExampleComponent.tsx
```

## 快速开始

### 安装依赖

```bash
# 在主应用目录
cd frontend/base-app
pnpm install

# 在子应用目录
cd remote-example
pnpm install
```

### 启动开发服务器

需要同时启动主应用和子应用：

**终端 1 - 启动主应用：**

```bash
cd frontend/base-app
pnpm dev
```

主应用将在 http://localhost:31213 运行

**终端 2 - 启动子应用：**

```bash
cd frontend/remote-example
pnpm dev
```

子应用将在 http://localhost:31220 运行

### 访问应用

打开浏览器访问 http://localhost:31213

- 首页：http://localhost:31213/
- 远程模块示例：http://localhost:31213/remote-example

## 构建生产版本

### 构建主应用

```bash
cd frontend/base-app
pnpm build
```

### 构建子应用

```bash
cd frontend/remote-example
pnpm build
```

## Module Federation 配置

### 主应用配置

在 `rspack.config.ts` 中配置远程应用：

```typescript
new ModuleFederationPlugin({
  name: "host",
  remotes: {
    remoteExample: "remoteExample@http://localhost:31220/remoteEntry.js",
  },
  shared: {
    react: { singleton: true, requiredVersion: "^19.0.0" },
    "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
    "react-router-dom": { singleton: true },
    antd: { singleton: true },
  },
});
```

### 子应用配置

在 `remote-example/rspack.config.ts` 中配置暴露的模块：

```typescript
new ModuleFederationPlugin({
  name: "remoteExample",
  filename: "remoteEntry.js",
  exposes: {
    "./ExampleComponent": "./src/components/ExampleComponent.tsx",
  },
  shared: {
    // 与主应用保持一致
  },
});
```

## 添加新的远程应用

1. 创建新的子应用目录
2. 配置 `rspack.config.ts`，设置 `name` 和 `exposes`
3. 在主应用的 `rspack.config.ts` 中添加 `remotes` 配置
4. 在主应用的 `src/types/remote.d.ts` 中添加类型定义
5. 在路由中使用 `lazy(() => import('remoteName/Component'))` 加载

## 注意事项

1. **共享模块版本**：主应用和子应用的 `shared` 配置必须完全一致
2. **CORS 配置**：开发环境需要配置 CORS 头
3. **端口配置**：确保主应用和子应用使用不同的端口
4. **类型定义**：为远程模块添加 TypeScript 类型定义

## 开发建议

- 使用 pnpm 管理依赖，确保版本一致性
- 开发时同时启动主应用和所有子应用
- 使用 TypeScript 确保类型安全
- 遵循共享模块配置规范

## 故障排除

### 远程模块加载失败

1. 检查子应用是否正在运行
2. 检查 `remoteEntry.js` 路径是否正确
3. 检查 CORS 配置
4. 检查浏览器控制台错误信息

### 共享模块版本冲突

1. 确保主应用和子应用的 `shared` 配置一致
2. 检查 `package.json` 中的依赖版本
3. 使用 `requiredVersion` 限制版本范围
