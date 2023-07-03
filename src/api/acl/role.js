import request from "@/utils/request";

/**
 * 获取角色列表
 * @param {number|string} page
 * @param {number|string} limit
 * @returns
 */
export async function getRoles(page = 1, limit = 20) {
  const res = await request.get(`/admin/acl/role/${page}/${limit}`);
  return res;
}

/**
 * 添加角色
 * @param {string} roleName
 * @returns
 */
export async function addRole(roleName) {
  const res = await request.post("/admin/acl/role/save", { roleName });
  return res;
}

/**
 * 根据id删除角色
 * @param {number|string} id
 * @returns
 */
export async function deleteRoleById(id) {
  const res = await request.delete(`/admin/acl/role/remove/${id}`);
  return res;
}

/**
 * 根据id列表批量删除角色
 * @param {number[]|string[]} ids
 * @returns
 */
export async function deleteRolesByIds(ids) {
  const res = await request.delete(`/admin/acl/role/batchRemove`, { data: ids });
  return res;
}

/**
 * 根据id修改角色
 * @param {number|string} id
 * @param {string} roleName
 * @returns
 */
export async function updateRoleById(id, roleName) {
  const res = await request.put(`/admin/acl/role/update`, { id, roleName });
  return res;
}
