import request from "@/utils/request";

// 获取用户列表
export async function getUsers(page = 1, limit = 20) {
  const res = await request.get(`/admin/acl/user/${page}/${limit}`);
  return res;
}

// 根据id获取用户
export async function getUserById(id) {
  const res = await request.get(`/admin/acl/user/get/${id}`);
  return res;
}

// 新增用户
export async function addUser(data) {
  const res = await request.post(`/admin/acl/user/save`, data);
  return res;
}

// 删除用户
export async function deleteUserById(id) {
  const res = await request.delete(`/admin/acl/user/remove/${id}`);
  return res;
}
