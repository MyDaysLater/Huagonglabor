import request from './request';
const apiPath = '/corp';
/**
 * 获取企业/组织列表
 */
export async function list() {
  return await request.get(apiPath);
}
export async function git_list(params) {
  return await request(apiPath, params);
}
/**
 * 获取单个企业/组织信息
 * @param {string} corpid 企业ID
 */
export async function detail(corpid) {
  return await request.get(`${apiPath}/${corpid}`);
}
/**
 * 创建企业/组织
 * @param {object} data 
 */
export async function create(data) {
  return await request.post(apiPath, data);
}
/**
 * 更新企业/组织信息
 * @param {object} data 
 */
export async function update(id, data) {
  return await request.put(`${apiPath}/${id}`, data);
}

export async function remove(corpid) {
  return await request.delete(`${apiPath}/${corpid}`);
}

export async function dashboardInfo(params) {
  return await request({
    url: `report/dashboard`,
    params
  })
}

export default {
  list,
  detail,
  create,
  update,
  remove,
  dashboardInfo
}