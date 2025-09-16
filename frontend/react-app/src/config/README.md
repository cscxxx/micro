# 路由配置说明

本目录包含应用的路由配置文件，实现了路由的集中管理和动态生成。

## 文件结构

```
config/
├── routes.js          # 路由配置文件
└── README.md          # 说明文档
```

## 路由配置文件 (routes.js)

### 主要功能

1. **路由常量定义**: 统一管理所有路由路径
2. **路由配置数组**: 定义路由的基本信息
3. **菜单配置**: 为导航菜单提供配置数据
4. **路由元数据**: 提供路由的额外信息
5. **面包屑导航**: 自动生成面包屑数据
6. **页面标题管理**: 根据路由获取页面标题
7. **权限检查**: 可扩展的路由权限控制

### 核心导出

#### 1. 路由常量 (ROUTES)

```javascript
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  // ... 更多路由
};
```

#### 2. 路由配置数组 (routeConfig)

```javascript
export const routeConfig = [
  {
    path: ROUTES.LOGIN,
    component: "Login",
    isPublic: true, // 是否为公开路由
  },
  // ... 更多路由配置
];
```

#### 3. 菜单配置 (getMenuItems)

```javascript
export const getMenuItems = () => {
  return {
    main: [...],    // 主菜单项
    files: [...],   // 文件管理子菜单
  };
};
```

#### 4. 面包屑导航 (getBreadcrumbData)

```javascript
export const getBreadcrumbData = (pathname) => {
  // 根据当前路径生成面包屑数据
};
```

#### 5. 页面标题 (getPageTitle)

```javascript
export const getPageTitle = (pathname) => {
  // 根据路径获取页面标题
};
```

## 使用方式

### 在 App.jsx 中使用

```javascript
import { ROUTES } from "./config/routes";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        {/* 更多路由... */}
      </Routes>
    </Router>
  );
}
```

### 在 Layout.jsx 中使用

```javascript
import { getMenuItems, getRouteMetadata } from "../config/routes";

// 获取菜单配置
const menuConfig = getMenuItems();

// 根据路径获取路由元数据
const routeMeta = getRouteMetadata(location.pathname);
```

## 添加新路由

### 1. 添加路由常量

```javascript
export const ROUTES = {
  // 现有路由...
  NEW_PAGE: "/new-page",
};
```

### 2. 添加路由配置

```javascript
export const routeConfig = [
  // 现有配置...
  {
    path: ROUTES.NEW_PAGE,
    element: <NewPage />,
    isPublic: false, // 或 true
  },
];
```

### 3. 添加路由元数据（可选）

```javascript
export const routeMetadata = {
  // 现有元数据...
  [ROUTES.NEW_PAGE]: {
    title: "新页面",
    icon: "NewIconOutlined",
    menuKey: "new-page",
  },
};
```

## 优势

1. **集中管理**: 所有路由配置集中在一个文件中
2. **类型安全**: 使用常量避免路径拼写错误
3. **动态生成**: 自动处理路由和菜单的生成
4. **易于维护**: 新增路由只需修改配置文件
5. **元数据支持**: 提供丰富的路由元数据
6. **菜单集成**: 自动生成导航菜单配置

## 注意事项

1. 路由路径必须以 `/` 开头
2. 受保护的路由需要设置 `isPublic: false`
3. 菜单项需要提供 `menuKey` 用于导航
4. 图标名称需要与 Ant Design 图标组件对应
5. 子菜单需要设置 `parent` 属性

## 扩展功能

- 路由权限控制
- 面包屑导航
- 页面标题管理
- 路由懒加载
- 路由缓存
