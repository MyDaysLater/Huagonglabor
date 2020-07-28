import request from './request';
const apiPath = '/corp-role';
const roleTypeApi = '/role';
const modulePath = '/limit';
export async function getRoles(params) {
	return await request({
		url: apiPath,
		params
	});
}

export async function getRoleTypes(params) {
	return await request({
		url: roleTypeApi,
		params
	});
}

export async function createRole(data = {}) {
	return await request.post(`${apiPath}`, data);
}

export async function updateRole(id, data = {}) {
	return await request.put(`${apiPath}/${id}`, data);
}

export async function deleteRole(id, data) {
	return await request.delete(`${apiPath}/${id}`, data);
}

export async function getRole(id) {
	return await request.get(`${apiPath}/${id}`);
}

// export async function getModules(params = {}) {
// 	return await request({
// 		url: modulePath,
// 		params
// 	});
// }
export async function getModules(params = {}) {
	return await request({
		url: 'corp-config',
		params
	});
}

export default {
	getRoles,
	getRoleTypes,
	getModules,
	getRole,
	createRole,
	updateRole,
	deleteRole
};