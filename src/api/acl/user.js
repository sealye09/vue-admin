import request from "@/utils/request";

/**
 * 获取用户列表
 * @param {number|string} page
 * @param {number|string} limit
 * @returns
 */
export async function getUsers(page = 1, limit = 20) {
  const res = await request.get(`/admin/acl/user/${page}/${limit}`);
  return res;
}

/**
 * 根据id获取用户
 * @param {number|string} id
 * @returns
 */
export async function getUserById(id) {
  const res = await request.get(`/admin/acl/user/get/${id}`);
  return res;
}

/**
 * 新增用户
 * @param {object} data
 * @returns
 */
export async function addUser(data) {
  const res = await request.post(`/admin/acl/user/save`, data);
  return res;
}

/**
 * 删除用户
 * @param {number|string} id
 * @returns {object}
 */
export async function deleteUserById(id) {
  const res = await request.delete(`/admin/acl/user/remove/${id}`);
  return res;
}

/**
 * 批量删除用户
 * @param {number[]|string[]} idList
 * @returns {object}
 */
export async function deleteUsersByIds(idList) {
  const res = await request.delete(`/admin/acl/user/batchRemove`, {
    data: idList,
  });
  return res;
}

/**
 * 修改用户
 * @param {object} data
 * @returns {object}
 */
export async function updateUserById(data) {
  const res = await request.put(`/admin/acl/user/update`, data);
  return res;
}

/**
 * 分配角色
 * @param {object.<roleId[], userId>} data
 * @typedef {string|number} userId
 * @typedef {string|number} roleId
 */
export async function assignRole(data) {
  const res = await request.post(`/admin/acl/user/doAssignRole`, data);
}
