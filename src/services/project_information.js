import request from './request';
import queryString from 'querystring';
import { ApiBaseUrl } from '../config'
const apiPath = '/corp-base';
export function list(params) {

	return request({
		url: apiPath,
		params
	});
}

export function onelist(id) {
	return request.get(`${apiPath}/${id}`);
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

export default {
	list,
	onelist,
	downloadUrl,
	create,
	update,
};
