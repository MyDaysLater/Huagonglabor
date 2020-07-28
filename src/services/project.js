import request from './request';
import { ROLES } from '../constants';
const apiPath = '/corp-project';
const projectMemberPath = `${apiPath}-member`;
export async function list(params) {
	return await request({
		url: apiPath,
		params
	});
}
export async function detail(id) {
	return await request.get(`${apiPath}/${id}`);
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

export async function getManagers(params) {
	params.expand = 'userInfo';
	const { errCode, data } = await request({
		url: projectMemberPath,
		params
	});
	if (!errCode) {
		const flatItems = [].concat(data.items);
		let pms = data.items.filter((item) => item.role === ROLES.pm);
		pms = pms.map((item) => {
			item.children = data.items.filter((elm) => elm.role === ROLES.subpm && elm.group_id === item.user_id);
			return item;
		});
		return { errCode, data: { items: pms, flatItems } };
	}
	return { errCode, data };
}

export async function getMembers(params) {
	if (params.expand === 'memberList,userInfo') {
		const { errCode, data } = await request({
			url: `${projectMemberPath}/${params.id}`,
			params
		});
		return { errCode, data: { items: data.memberList } };
	}
	return await request({
		url: projectMemberPath,
		params
	});
}

export async function setManagers(data) {
	return await request.post(projectMemberPath, data);
}

export async function removeManager(id, params) {
	return await request({
		url: `${projectMemberPath}/${id}`,
		method: 'DELETE',
		params
	});
}

export async function changeManager(id, data) {
	return await request.put(`${projectMemberPath}/${id}`, data);
}

export async function audit(id, data) {
	return await request.put(`${projectMemberPath}/${id}`, data);
}

export async function getSubordinate(params) {
	return await request({
		url: projectMemberPath,
		params
	});
}

export async function addMember(data) {
	return await request.post(projectMemberPath, data);
}

export async function updateMember(id, data) {
	return await request.put(`${projectMemberPath}/${id}`, data);
}

export async function removeMember(id, data) {
	return await request.put(`${projectMemberPath}/${id}`, data);
}

export default {
	list,
	detail,
	create,
	update,
	remove,
	getManagers,
	setManagers,
	removeManager,
	changeManager,
	getSubordinate,
	getMembers,
	addMember,
	removeMember,
	updateMember
};
