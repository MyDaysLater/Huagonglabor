import request from './request';
import queryString from 'querystring';
import { ApiBaseUrl } from '../config'
const apiPath = '/attendance-verify-define';
const verifyPath = '/v2/attendance-verify/batch-do-verify';
const memberPath = '/corp-member';
export async function list(params) {
	return await request({
		url: apiPath,
		params
	});
}
export async function userlist(params) {
	return await request({
		url: memberPath,
		params
	});
}


export function create(params) {
	return request.post(apiPath, params);
}

export function update(id,params) {
	return request.put(`${apiPath}/${id}`, params);
}

export function downloadUrl(params={}) {
	const pString = queryString.stringify(params);
	return `${ApiBaseUrl}${apiPath}?${pString}`
}


export function updateverify(params) {
	return request.post(`${verifyPath}`, params);
}
export default {
	list,
	userlist,
	downloadUrl,
	create,
	update,
	updateverify,
};
