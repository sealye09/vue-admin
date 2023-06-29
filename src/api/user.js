//统一管理咱们项目用户相关的接口
import request from "@/utils/request";

//登录接口
export async function login(username, password) {
  const res = await request.post("/admin/acl/index/login", {
    username: username,
    password: password,
  });
  return res;
}

//退出登录
export function logout() {
  request.post("/admin/acl/index/logout");
}

//获取用户信息
export async function getUserInfo() {
  const res = await request.get("/admin/acl/index/info");
  return res;
}
