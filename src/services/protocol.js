import request from './request';
import { ENDPOINT_V2, ApiBaseUrl } from '../config';
const apiPath = `${ApiBaseUrl}/agreement`;

export function getProtocol(id) {
	return request.get(`${apiPath}/${id}`);
}

export function createProtocol(data = {}) {
	return request.post(`${apiPath}`, data);
}

export function updateProtocol(id, data = {}) {
	return request.put(`${apiPath}/${id}`, data);
}

export function deleteProtocol(id) {
	return request.delete(`${apiPath}/${id}`);
}

export function getProtocols(params = {}) {
	return request.get('/agreement', {
		params
	});
}

export function getagreement_type() {
	return request.get('/agreement-type');
}
export function putagreement_type(id, params) {
	return request.put(`/agreement-type/${id}`, params);
}
export function startUpProtocol(id) {
	return request.get(`${ApiBaseUrl}/agreement/active?id=${id}`);
}

export function getProtocolTemplates(params = {}) {
	return request.get(`${ApiBaseUrl}/agreement-template`, {
		params
	});
}

export default {
	getProtocol,
	createProtocol,
	updateProtocol,
	deleteProtocol,
	getProtocols,
	startUpProtocol,
	putagreement_type,
	getProtocolTemplates
};
