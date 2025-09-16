import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Dashboard,
  UserManagement,
  ProductManagement,
  OrderManagement,
  FileManagement,
  BinaryFileDownload,
  DownloadGuide,
} from "./pages";
import AppLayout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTES } from "./config/routes";

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Routes>
          {/* 公开路由 */}
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          
          {/* 重定向路由 */}
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          
          {/* 受保护的路由 */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.USERS}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <UserManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.PRODUCTS}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ProductManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.ORDERS}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <OrderManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FILES}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <FileManagement />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FILES_BINARY_DOWNLOAD}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <BinaryFileDownload />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.FILES_DOWNLOAD_GUIDE}
            element={
              <ProtectedRoute>
                <AppLayout>
                  <DownloadGuide />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          
          {/* 404 重定向 */}
          <Route path={ROUTES.NOT_FOUND} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App