import request from "@/utils/request";

/**
 * 获取已有品牌
 * @param {number} page
 * @param {number} limit
 * @returns
 */
export async function getTrademarks(page = 1, limit = 10) {
  const res = await request.get(`/admin/product/baseTrademark/${page}/${limit}`);
  return res;
}

/**
 * 根据keyword获取已有品牌
 * @param {string} keyword
 * @returns
 */
export async function getTrademarksByKeyword(keyword) {
  const res = await request.get(
    `/admin/product/baseTrademark/findBaseTrademarkByKeyword/${keyword} `,
  );
  return res;
}

/**
 * 修改已有品牌的数据
 * @param {object} data
 * @returns
 */
export async function updateTrademark(data) {
  const res = await request.put("/admin/product/baseTrademark/update", data);
  return res;
}

/**
 * 新增品牌
 * @param {*} data
 * @returns
 */
export async function addTrademark(data) {
  const res = await request.post("/admin/product/baseTrademark/save", data);
  return res;
}

/**
 * 删除某一个已有品牌的数据
 * @param {object} id
 * @returns
 */
export async function removeTrademark(id) {
  const res = await request.delete(`/admin/product/baseTrademark/remove/${id}`);
  return res;
}
