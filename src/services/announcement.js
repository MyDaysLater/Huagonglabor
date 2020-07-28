import request from './request';
const apiPath = '/announcement';

export function getAnnouncements(params) {
	return request({
		url: apiPath,
		params
	});
}

export function createAnnouncement(data) {
	return request.post(apiPath, data);
}

export function updateAnnouncement(id, data) {
	return request.put(`${apiPath}/${id}`, data);
}

export function removeAnnouncement(id) {
	return request.delete(`${apiPath}/${id}`);
}

export function getAnnouncement(id, params) {
	return request({
		url: `${apiPath}/${id}`,
		params
	});
}

export default {
	getAnnouncements,
	createAnnouncement,
	updateAnnouncement,
	removeAnnouncement,
	getAnnouncement
};
