import { Button } from "antd";
import { searchUsers } from "./server";

export const Demo = () => {
  const handleClick = async () => {
    try {
      const users = await searchUsers("张三");
      console.log(users);
    } catch (error) {
      // 错误已经被拦截器处理并显示提示，这里只需要记录日志
      console.error("请求失败:", error);
    }
  };
  return (
    <div>
      <Button type="primary" onClick={handleClick}>
        点击
      </Button>
    </div>
  );
};
