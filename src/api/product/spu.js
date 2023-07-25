import request from "@/utils/request";

/**
 * 获取某一个三级分类下已有的SPU数据
 * @param {number} page
 * @param {number} limit
 * @param {number | string} category3Id
 * @returns
 */
export async function reqHasSpu(page, limit, category3Id) {
  const res = request.get(`/admin/product/` + `${page}/${limit}?category3Id${category3Id}`);
  return res;
}

/**
 * 获取全部的SPU的品牌的数据
 * @returns
 */
export async function reqAllTradeMark() {
  const res = request.get(`/admin/product/baseTrademark/getTrademarkList`);
  return res;
}

/**
 * 获取某一个已有的SPU下全部商品的图片地址
 * @param {number | string} spuId
 * @returns
 */
export async function reqSpuImageList(spuId) {
  const res = request.get(`/admin/product/spuImageList/` + spuId);
  return res;
}

/**
 * 获取某一个已有的SPU拥有多少个销售属性
 * @param {number | string} spuId
 * @returns
 */
export async function reqSpuHasSaleAttr(spuId) {
  const res = request.get(`/admin/product/spuSaleAttrList/` + spuId);
  return res;
}

/**
 * 获取全部的销售属性
 * @returns
 */
export async function reqAllSaleAttr() {
  const res = request.get(`/admin/product/baseSaleAttrList`);
  return res;
}

/**
 * 添加一个新的SPU的; 更新已有的SPU接口
 * @param {object} data 新增的SPU 或者已有的SPU对象
 * @returns
 */
export async function reqAddOrUpdateSpu(data) {
  //如果SPU对象拥有ID,更新已有的SPU
  if (data.id) {
    return request.post(`/admin/product/updateSpuInfo`, data);
  } else {
    return request.post(`/admin/product/saveSpuInfo`, data);
  }
}

/**
 * 添加SKU的请求方法
 * @param {object} data
 * @returns
 */
export async function reqAddSku(data) {
  request.post(`/admin/product/saveSkuInfo`, data);
  return res;
}

/**
 * 获取SKU数据
 * @param {number | string} spuId
 * @returns
 */
export async function reqSkuList(spuId) {
  const res = request.get(`/admin/product/findBySpuId/` + spuId);
  return res;
}

/**
 * 删除已有的SPU
 * @param {number | string} spuId 
 * @returns 
 */
export async function reqRemoveSpu(spuId) {
  const res = request.delete(`/admin/product/deleteSpu/` + spuId);
  return res;
}
