import { get } from "@/utils/axios";

// 示例 1: 简单查询
export const searchUsers = async (name: string) => {
  const users = await get<any>("/api/users", {
    params: {
      name: name,
    },
  });
  return users;
};
