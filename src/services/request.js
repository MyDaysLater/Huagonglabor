import { ApiBaseUrl } from '../config';
import Axios from 'axios';
import { message } from 'antd';
import { signIn } from '../routeConfig';
import { getLocalToken, removeLocalToken, removeLocalUserInfo } from '../utils/localStoreCommon';
const axios = Axios.create({
	baseURL: ApiBaseUrl,
	timeout: 20 * 1000,
	headers: { 'content-type': 'application/json' }
});

axios.interceptors.response.use(
	function(response) {
		const { data, errCode } = response.data;
		if (errCode) {
			switch (data.status) {
				case 401:
					removeLocalToken();
					removeLocalUserInfo();
					window.location = signIn;
					break;
				case 403:
					message.error('访问被拒绝');
					break;
				case 404:
					message.error('未找到资源，请稍候再试');
					break;
				case 500:
					message.error(data.message);
					break;
				default:
					break;
			}
			return { errCode, errMsg: data.message || `网络请求错误（${data.status}）`, data };
		}
		return { errCode, data};
	}
);
axios.interceptors.request.use(function(request) {
	request.headers['X-Api-Token'] = getLocalToken()
	return request;
});

export default axios;
