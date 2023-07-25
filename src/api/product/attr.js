import request from "@/utils/request";

/**
 * 获取一级分类的接口方法
 * @returns {object}
 */
export async function getCat1() {
  const res = await request.get("/admin/product/getCategory1");
  return res;
}

/**
 * 获取二级分类的接口方法
 * @param {number | string} cat1Id
 * @returns {object}
 */
export async function getCat2(cat1Id) {
  const res = await request.get(`/admin/product/getCategory2/${cat1Id}`);
  return res;
}

/**
 * 获取三级分类的接口方法
 * @param {number | string} cat2Id
 * @returns {object}
 */
export async function getCat3(cat2Id) {
  const res = await request.get(`/admin/product/getCategory3/${cat2Id}`);
  return res;
}

/**
 * 获取对应分类下已有的属性与属性值接口
 * @param {number | string} cat1Id
 * @param {number | string} cat2Id
 * @param {number | string} cat3Id
 * @returns {object}
 */
export async function getAttr(cat1Id, cat2Id, cat3Id) {
  const res = await request.get(`/admin/product/attrInfoList/${cat1Id}/${cat2Id}/${cat3Id}`);
  return res;
}

/**
 * 新增或者修改已有的属性接口
 * @param {object} data
 * @returns {object}
 */
export async function addOrUpdateAttr(data) {
  const res = await request.post("/admin/product/saveAttrInfo", data);
  return res;
}

/**
 * 删除某一个已有的属性业务
 * @param {number | string} attrId
 * @returns {object}
 */
export async function reqRemoveAttr(attrId) {
  request.delete("/admin/product/deleteAttr/" + attrId);
  return res;
}
