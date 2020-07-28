import request from './request';
import { ENDPOINT_V2 } from '../config'
const apiPath = `/transfer-order`;
const apiPath_transfer = `${ENDPOINT_V2}/transfer-order/transfer`;
const apiPath2 = "/attendance";
// export async function list(params) {
// 	return await request({
// 		url: apiPath,
// 		params
// 	});
// }

export async function list(params) {
	return await request({
		url: apiPath,
		params
	});
}
export async function wages(params) {
	return await request.post(apiPath_transfer,params);
}
export async function wagesinfo(params) {
		return await request({
		url: apiPath2,
		params
	});
}
export default {
	list,
	wages,
	wagesinfo,
};