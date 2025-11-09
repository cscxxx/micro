import { notification } from "antd";

/**
 * 全局消息提示工具
 * 使用 notification 替代 message，避免在拦截器中使用静态方法的警告
 */
export const message = {
  success: (content: string, duration = 3) => {
    notification.success({
      message: "成功",
      description: content,
      duration,
      placement: "topRight",
    });
  },
  error: (content: string, duration = 4.5) => {
    notification.error({
      message: "错误",
      description: content,
      duration,
      placement: "topRight",
    });
  },
  warning: (content: string, duration = 3) => {
    notification.warning({
      message: "警告",
      description: content,
      duration,
      placement: "topRight",
    });
  },
  info: (content: string, duration = 3) => {
    notification.info({
      message: "提示",
      description: content,
      duration,
      placement: "topRight",
    });
  },
  loading: (content: string, duration = 0) => {
    notification.info({
      message: "加载中",
      description: content,
      duration,
      placement: "topRight",
    });
  },
};
