import { notification } from "antd";

/**
 * 全局消息提示工具
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
};
