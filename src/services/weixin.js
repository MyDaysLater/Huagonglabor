
import request from './request';
const apiUrl = '/wx'
const apiUrl2 = '/wx/stream-swipe'
const apiUrl3 = '/payment'
// const apiUrl_upload = 'wx/upload-cart'
export function bindMiniProgram(params) {
  return request({
    url: `${apiUrl}/open-auth`,
    params
  });
}
export async function wxlist(params) {
  return await request({
    url: apiUrl3,
    params,
  });
}
export async function wx_payment_info(id) {
  return await request.get(`${apiUrl3}/${id}`)
}
export async function detail(params) {
  return await request({
    url: '/corp-agent',
    params,
  });
}
export async function wxpayment(params) {
  return await request.post(apiUrl2, params);
}

export async function wx_update(id, params) {
  return await request.put(`/corp-agent/${id}`, params);
}
export async function corp_wxpaylist(params) {
  return await request.get(`/corp-wxpay-config`, { params });
}

export async function corp_wxpay_cre(params) {
  return await request.post(`/corp-wxpay-config`, params);
}
export async function corp_wxpay_text(params) {
  return await request.post(`/wx/upload-cart-text`, params);
}
export async function corp_wxpay_update(id, params) {
  return await request.put(`/corp-wxpay-config/${id}`, params);
}


export async function payment_plan_cre(params) {
  return await request.post('/payment-plan', params);
}

export async function payment_plan_list(params) {
  return await request({
    url: '/payment-plan',
    params,
  });
}

export async function payment_v2(params) {
  return await request.post('/v2/payment/payment', params);
}



// 小程序设置
export async function corp_config(params) {
  return await request.get(`/corp-config?key=mini_config`);
}
export async function corp_config_put(id, params) {
  return await request.put(`/corp-config/${id}`, params);
}
export async function corp_config_post(params) {
  return await request.post(`/corp-config`, params);
}
export default {
  bindMiniProgram,
  wxlist,
  wx_update,
  detail,
  corp_wxpaylist,
  wxpayment,
  corp_wxpay_update,
  corp_wxpay_cre,
  payment_plan_cre,
  payment_plan_list,
  payment_v2,
  corp_wxpay_text,
  wx_payment_info,
  corp_config,
}