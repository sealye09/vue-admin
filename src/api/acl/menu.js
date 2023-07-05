import request from "@/utils/request";

/**
 * 获取权限列表
 * @returns {object}
 */
export async function getPermissions() {
  const res = await request.get("/admin/acl/permission");
  return res;
}

/**
 * 根据roleID获取权限列表
 * @param {number} roleId
 * @returns {object}
 */
export async function getPermissionById(roleId) {
  const res = await request.get(`/admin/acl/permission/${roleId}`);
  return res;
}

/**
 * 为角色分配权限
 * {
 * "permissionIdList": [
 * 0
 * ],
 * "roleId": 0
 * }
 * @param {*} data
 * @returns {object}
 */
export async function assignAcl(data) {
  const res = await request.post("/admin/acl/permission/doAssignAcl", data);
  return res;
}

/**
 * 删除权限
 * @param {number} id
 * @returns {object}
 */
export async function removePermissionById(id) {
  const res = await request.delete(`/admin/acl/permission/remove/${id}`);
  return res;
}

/**
 * 添加权限
 * @todo 未完成
 * @param {*} data
 * @returns {object}
 */
export async function addPermission(data) {
  const res = await request.post(`/admin/acl/permission/save`, data);
  return res;
}

/**
 * @todo 未完成
 * @param {*} data
 * @returns {object}
 */
export async function updatePermission(data) {
  const res = await request.put(`/admin/acl/permission/update`, data);
  return res;
}
