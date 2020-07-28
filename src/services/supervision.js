import request from './request';
const apiPath = '/snippets';
export async function getRegulations(params = {}) {
	return request({
		url: apiPath,
		params
	});
}

export async function createRegulation(data = {}) {
	return request.post(apiPath, data);
}

export async function updateRegulation(id, data) {
	return request.put(`${apiPath}/${id}`, data);
}

export async function deleteRegulation(id) {
	return request.delete(`${apiPath}/${id}`);
}

export default {
	getRegulations,
	updateRegulation,
	createRegulation,
	deleteRegulation
};
