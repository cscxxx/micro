import { defineConfig } from "@rspack/cli";
import { container, HtmlRspackPlugin } from "@rspack/core";
import pluginReact from "@rspack/plugin-react-refresh";
import path from "path";
import { fileURLToPath } from "url";

const { ModuleFederationPlugin } = container;

// ES 模块中获取 __dirname 的替代方案
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  // 应用入口文件
  entry: "./src/main.tsx",

  // 实验性功能配置
  experiments: {
    css: true, // 启用 CSS 模块支持
  },

  // 模块解析配置
  resolve: {
    // 文件扩展名解析顺序，按顺序尝试解析
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    // 路径别名配置：使用 @ 作为 src 目录的别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // 模块处理规则
  module: {
    rules: [
      {
        // TypeScript/TSX 文件处理规则
        test: /\.tsx?$/,
        use: {
          loader: "builtin:swc-loader", // 使用内置的 SWC loader（Rust 实现，性能优秀）
          options: {
            jsc: {
              parser: {
                syntax: "typescript", // 解析 TypeScript 语法
                tsx: true, // 支持 TSX（TypeScript + JSX）
              },
              transform: {
                react: {
                  runtime: "automatic", // 使用 React 17+ 的自动 JSX 运行时
                },
              },
            },
          },
        },
        type: "javascript/auto", // 输出类型为 JavaScript
      },
      {
        // CSS 文件处理规则
        test: /\.css$/,
        type: "css", // 使用 Rspack 内置的 CSS 处理
      },
    ],
  },

  // 插件配置
  plugins: [
    // HTML 模板插件：自动生成 HTML 文件并注入构建后的脚本
    new HtmlRspackPlugin({
      template: "./index.html", // 使用 index.html 作为模板
    }),

    // React 热更新插件：支持组件热替换（HMR）
    new pluginReact(),

    // Module Federation 插件：实现微前端模块联邦
    new ModuleFederationPlugin({
      name: "host", // 主应用名称，必须唯一
      remotes: {
        // 远程应用配置：定义可以从哪些远程应用加载模块
        // 格式：remoteName: "remoteName@远程应用URL/remoteEntry.js"
        remoteExample: "remoteExample@http://localhost:31220/remoteEntry.js",
      },
      exposes: {
        // 暴露认证模块：子应用可以通过 host/Auth 访问
        "./Auth": "./src/utils/auth/index.ts",
      },
      shared: {
        // 共享模块配置：定义主应用和子应用共享的依赖
        // singleton: true - 确保整个应用只有一个实例
        // requiredVersion: "^19.0.0" - 版本要求
        // eager: true - 立即加载，避免异步加载问题
        react: {
          singleton: true, // 单例模式，避免多个 React 实例
          requiredVersion: "^19.0.0", // 版本要求
          eager: true, // 立即加载
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.0.0",
          eager: true,
        },
        "react-router-dom": {
          singleton: true,
          eager: true,
        },
        antd: {
          singleton: true,
          eager: true,
        },
        "@ant-design/icons": {
          singleton: true,
          requiredVersion: "^5.4.0",
          eager: true,
          strictVersion: false, // 允许版本不匹配时使用降级处理
        },
      },
    }),
  ],

  // 开发服务器配置
  devServer: {
    port: 31213, // 开发服务器端口
    headers: {
      // CORS 配置：允许跨域请求（微前端需要）
      "Access-Control-Allow-Origin": "*",
    },
    allowedHosts: "all", // 允许所有主机访问
    historyApiFallback: true, // 支持 HTML5 History API 路由
  },

  // 输出配置
  output: {
    publicPath: "/", // 公共路径，用于加载静态资源
  },
});
