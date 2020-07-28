import request from './request';
import queryString from 'querystring';
import { ApiBaseUrl, ENDPOINT_V2 } from '../config'
const apiPath = '/attendance';
const transfer = `${ENDPOINT_V2}/transfer-order/submit-order`
export function list(params) {
	return request({
		url: apiPath,
		params
	});
}

export function p_transfer(params) {
	return request.post(transfer, params);
}

export function downloadUrl(params = {}) {
	const pString = queryString.stringify(params);
	return `${ApiBaseUrl}${apiPath}?${pString}`
}
export function exportTplurl(params = '') {
	return `${ApiBaseUrl}${apiPath}?${params}`
}
export function exportTpl(params = {}) {
	return request({
		url: `/attendance`,
		params
	});
}

export default {
	list,
	p_transfer,
	exportTpl,
	exportTplurl,
	downloadUrl
};
