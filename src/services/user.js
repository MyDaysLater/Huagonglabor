import request from './request';
const apiPath = '/user';
const authApiPath = '/auth';
export async function signup(data) {
	return await request.post(`${authApiPath}/sign-up`, data);
}

export async function verifyEmail(code) {
	return request({
		url: `${authApiPath}/verify-email`,
		params: { code }
	});
}

export async function modifyPassword(data) {
	return request.post(`${authApiPath}/modify-password`, data);
}

export async function setPassword(data) {
	return request.post(`${authApiPath}/set-password`, data);
}

export async function signin(data) {
	return await request.post(`${authApiPath}/login`, data);
}
export async function forgotPassword(data = {}) {
	return await request.post(`${authApiPath}/find-password`, data );
}
export async function resetPassword(data) {
	return await request.post(apiPath, data);
}

export async function detail(userId) {
	return await request.get(`${apiPath}/${userId}`);
}

export async function update(id, data) {
	return await request.put(`${apiPath}/${id}`, data);
}

export async function resendEmail(id) {
	return await request({
		url: `${authApiPath}/resend-email`,
		params: { id }
	});
}

export async function checkSignup(id) {
	return await request({
		url: `${authApiPath}/check-verify`,
		params: { id }
	});
}

export default {
	signup,
	signin,
	forgotPassword,
	resetPassword,
	detail,
	verifyEmail,
	update,
	modifyPassword,
	resendEmail,
	checkSignup,
	setPassword
};
