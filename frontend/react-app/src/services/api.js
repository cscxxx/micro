import { api } from "../utils/axios.js";
import { endpoints } from "../config/api.js";

// 用户相关API
export const userAPI = {
  // 用户注册
  register: (userData) => api.post(endpoints.users.register, userData),

  // 用户登录
  login: (credentials) => api.post(endpoints.users.login, credentials),

  // 获取当前用户信息
  getMe: () => api.get(endpoints.users.me),

  // 忘记密码
  forgotPassword: (email) =>
    api.post(endpoints.users.forgotPassword, { email }),

  // 重置密码
  resetPassword: (token, newPassword) =>
    api.post(endpoints.users.resetPassword, { token, newPassword }),

  // 获取用户列表
  getUsers: (params) => api.get(endpoints.users.list, { params }),

  // 创建用户
  createUser: (userData) => api.post(endpoints.users.create, userData),

  // 更新用户
  updateUser: (id, userData) => api.put(endpoints.users.update(id), userData),

  // 删除用户
  deleteUser: (id) => api.delete(endpoints.users.delete(id)),
};

// 产品相关API
export const productAPI = {
  // 获取产品列表
  getProducts: (params) => api.get(endpoints.products.list, { params }),

  // 创建产品
  createProduct: (productData) =>
    api.post(endpoints.products.create, productData),

  // 更新产品
  updateProduct: (id, productData) =>
    api.put(endpoints.products.update(id), productData),

  // 删除产品
  deleteProduct: (id) => api.delete(endpoints.products.delete(id)),
};

// 订单相关API
export const orderAPI = {
  // 获取订单列表
  getOrders: (params) => api.get(endpoints.orders.list, { params }),

  // 创建订单
  createOrder: (orderData) => api.post(endpoints.orders.create, orderData),

  // 更新订单
  updateOrder: (id, orderData) =>
    api.put(endpoints.orders.update(id), orderData),

  // 删除订单
  deleteOrder: (id) => api.delete(endpoints.orders.delete(id)),
};

// 文件相关API
export const fileAPI = {
  // 获取文件列表
  getFiles: (params) => api.get(endpoints.files.list, { params }),

  // 上传文件
  uploadFile: (formData) =>
    api.post(endpoints.files.upload, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  // 下载文件
  downloadFile: (id) =>
    api.get(endpoints.files.download(id), {
      responseType: "blob",
    }),

  // 删除文件
  deleteFile: (id) => api.delete(endpoints.files.delete(id)),

  // 批量删除文件
  batchDeleteFiles: (ids) =>
    api.delete(endpoints.files.batchDelete, { data: { ids } }),

  // 获取文件信息
  getFileInfo: (id) => api.get(endpoints.files.info(id)),
};

// 导出所有API
export default {
  user: userAPI,
  product: productAPI,
  order: orderAPI,
  file: fileAPI,
};
