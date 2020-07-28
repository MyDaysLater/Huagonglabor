import request from './request';
const apiPath = '/corp-member';
const apiV2Path = `/v2${apiPath}`;
export async function list(params) {
	return await request({
		url: apiPath,
		params
	});
}

export async function detail(id, params) {
	// return await request.get(`${apiPath}/${id}`, params);
	return await request({
		url: `${apiPath}/${id}`,
		params
	});
}

export async function create(data) {
	return await request.post(apiPath, data);
}

export async function update(id, data) {
	return await request.put(`${apiPath}/${id}`, data);
}

export async function remove(id) {
	return await request.delete(`${apiPath}/${id}`);
}
export async function transfer(data) {
	return await request.post(`${apiV2Path}/deliver`, data);
}
export async function getUserCorpRole(params) {
	return await request({
		url: apiPath,
		params
	})
}

export default {
	list,
	detail,
	create,
	update,
	remove,
	getUserCorpRole,
	transfer
};
