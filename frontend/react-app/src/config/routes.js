// 路由配置常量
export const ROUTES = {
  // 认证相关路由
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  // 主应用路由
  DASHBOARD: "/dashboard",
  USERS: "/users",
  PRODUCTS: "/products",
  ORDERS: "/orders",

  // 文件管理路由
  FILES: "/files",
  FILES_BINARY_DOWNLOAD: "/files/binary-download",
  FILES_DOWNLOAD_GUIDE: "/files/download-guide",

  // 默认路由
  HOME: "/",
  NOT_FOUND: "*",
};

// 路由配置数组（不包含 JSX 元素）
export const routeConfig = [
  // 公开路由（无需认证）
  {
    path: ROUTES.LOGIN,
    component: "Login",
    isPublic: true,
  },
  {
    path: ROUTES.REGISTER,
    component: "Register",
    isPublic: true,
  },
  {
    path: ROUTES.FORGOT_PASSWORD,
    component: "ForgotPassword",
    isPublic: true,
  },
  {
    path: ROUTES.RESET_PASSWORD,
    component: "ResetPassword",
    isPublic: true,
  },

  // 受保护的路由（需要认证）
  {
    path: ROUTES.DASHBOARD,
    component: "Dashboard",
    isPublic: false,
  },
  {
    path: ROUTES.USERS,
    component: "UserManagement",
    isPublic: false,
  },
  {
    path: ROUTES.PRODUCTS,
    component: "ProductManagement",
    isPublic: false,
  },
  {
    path: ROUTES.ORDERS,
    component: "OrderManagement",
    isPublic: false,
  },
  {
    path: ROUTES.FILES,
    component: "FileManagement",
    isPublic: false,
  },
  {
    path: ROUTES.FILES_BINARY_DOWNLOAD,
    component: "BinaryFileDownload",
    isPublic: false,
  },
  {
    path: ROUTES.FILES_DOWNLOAD_GUIDE,
    component: "DownloadGuide",
    isPublic: false,
  },
];

// 路由元数据（用于导航菜单等）
export const routeMetadata = {
  [ROUTES.DASHBOARD]: {
    title: "仪表板",
    icon: "DashboardOutlined",
    menuKey: "dashboard",
  },
  [ROUTES.USERS]: {
    title: "用户管理",
    icon: "UserOutlined",
    menuKey: "users",
  },
  [ROUTES.PRODUCTS]: {
    title: "产品管理",
    icon: "ShoppingOutlined",
    menuKey: "products",
  },
  [ROUTES.ORDERS]: {
    title: "订单管理",
    icon: "FileTextOutlined",
    menuKey: "orders",
  },
  [ROUTES.FILES_DOWNLOAD_GUIDE]: {
    title: "下载方式说明",
    icon: "QuestionCircleOutlined",
    menuKey: "files-guide",
    parent: "files",
  },
  [ROUTES.FILES]: {
    title: "文件列表",
    icon: "FolderOutlined",
    menuKey: "files",
    parent: "files",
  },
  [ROUTES.FILES_BINARY_DOWNLOAD]: {
    title: "二进制下载",
    icon: "DownloadOutlined",
    menuKey: "files-binary",
    parent: "files",
  },
};

// 获取菜单项配置
export const getMenuItems = () => {
  const mainRoutes = Object.entries(routeMetadata)
    .filter(([_, meta]) => !meta.parent)
    .map(([path, meta]) => ({
      key: meta.menuKey,
      path,
      title: meta.title,
      icon: meta.icon,
    }));

  const fileRoutes = Object.entries(routeMetadata)
    .filter(([_, meta]) => meta.parent === "files")
    .map(([path, meta]) => ({
      key: meta.menuKey,
      path,
      title: meta.title,
      icon: meta.icon,
    }));

  return {
    main: mainRoutes,
    files: fileRoutes,
  };
};

// 根据路径获取路由元数据
export const getRouteMetadata = (pathname) => {
  return routeMetadata[pathname] || null;
};

// 检查是否为公开路由
export const isPublicRoute = (pathname) => {
  return (
    routeConfig.find((route) => route.path === pathname)?.isPublic || false
  );
};

// 获取面包屑导航数据
export const getBreadcrumbData = (pathname) => {
  const routeMeta = getRouteMetadata(pathname);
  if (!routeMeta) return [];

  const breadcrumbs = [];

  // 添加父级菜单
  if (routeMeta.parent) {
    const parentMeta = Object.values(routeMetadata).find(
      (meta) => meta.menuKey === routeMeta.parent
    );
    if (parentMeta) {
      breadcrumbs.push({
        title: parentMeta.title,
        path: Object.keys(routeMetadata).find(
          (path) => routeMetadata[path].menuKey === parentMeta.menuKey
        ),
      });
    }
  }

  // 添加当前页面
  breadcrumbs.push({
    title: routeMeta.title,
    path: pathname,
  });

  return breadcrumbs;
};

// 获取页面标题
export const getPageTitle = (pathname) => {
  const routeMeta = getRouteMetadata(pathname);
  return routeMeta ? routeMeta.title : "微服务管理系统";
};

// 路由权限检查（可扩展）
export const checkRoutePermission = (pathname, userRole) => {
  // 这里可以根据用户角色进行权限检查
  // 目前所有路由都允许访问
  return true;
};
