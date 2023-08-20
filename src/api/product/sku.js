//SKU模块接口管理
import request from "@/utils/request";

/**
 * 获取商品SKU的接口
 * @param {number} page
 * @param {number} limit
 */
export async function getSkuList(page = 1, limit = 10) {
  const res = await request.get(`/admin/product/list/${page}/${limit}`);
  return res;
}

/**
 * 已有商品上架的请求
 * @param {number | string} skuId
 * @returns
 */
export async function getSaleSku(skuId) {
  const res = await request.get(`/admin/product/onSale/${skuId}`);
  return res;
}

/**
 * 下架的请求
 * @param {number | string} skuId
 * @returns
 */
export async function cancelSale(skuId) {
  const res = await request.get(`/admin/product/cancelSale/${skuId}`);
  return res;
}

/**
 * 获取商品详情的接口
 * @param {number | string} skuId
 * @returns
 */
export async function getSkuInfo(skuId) {
  const res = await request.get(`/admin/product/getSkuInfo${skuId}/`);
  return res;
}

/**
 * 删除某一个已有的商品
 * @param {number | string} skuId
 * @returns
 */
export async function removeSku(skuId) {
  const res = await request.delete(`/admin/product/deleteSku/${skuId}`);
  return res;
}
