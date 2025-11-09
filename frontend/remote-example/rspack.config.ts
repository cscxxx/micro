import { defineConfig } from "@rspack/cli";
import { container, HtmlRspackPlugin } from "@rspack/core";
import pluginReact from "@rspack/plugin-react-refresh";

const { ModuleFederationPlugin } = container;

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
      name: "remoteExample", // 子应用名称，必须唯一
      filename: "remoteEntry.js", // 远程入口文件名，主应用通过此文件加载子应用
      exposes: {
        // 暴露的模块：定义子应用对外提供的组件/模块
        // 格式："./模块路径": "./实际文件路径"
        "./ExampleComponent": "./src/components/ExampleComponent.tsx",
      },
      shared: {
        // 共享模块配置：定义主应用和子应用共享的依赖
        // 必须与主应用的 shared 配置完全一致
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
          eager: true,
        },
      },
    }),
  ],

  // 开发服务器配置
  devServer: {
    port: 31220, // 开发服务器端口（与主应用不同）
    headers: {
      // CORS 配置：允许跨域请求（微前端需要）
      "Access-Control-Allow-Origin": "*",
    },
    allowedHosts: "all", // 允许所有主机访问
    historyApiFallback: true, // 支持 HTML5 History API 路由
  },

  // 输出配置
  output: {
    // 公共路径：必须指向子应用自己的服务器地址
    // 这样主应用才能正确加载子应用的资源文件
    publicPath: "http://localhost:31220/",
  },
});
