import { observable, action, flow } from 'mobx';
import { user } from '../services';
import { setLocalUserInfo, removeLocalToken, setLocalToken, getLocalToken, removeLocalUserInfo } from '../utils/localStoreCommon';
const PENDING = { pending: true };
class UserStore {
	@observable signupResult;
	@observable signinResult;
	@observable hasSignined;
	@observable forgotResult;
	@observable resetPasswordResult;
	@observable userInfo;
	/**
   * 设置登录状态
   */
	@action setSignin = (value) => {
		this.hasSignined = value;
		if (!value) {
			removeLocalToken();
			removeLocalUserInfo();
			this.userInfo = {};
		} else {
			setLocalToken(this.userInfo.token);
		}
	};

	@action setUserInfo = (data) => {
		this.userInfo = data;
		setLocalUserInfo(data);
	};
	/**
   * 用户注册
   */
	userSignup = flow(function* (data) {
		this.signupResult = PENDING;
		const res = yield user.signup(data);
		this.signupResult = res;
	});
	/**
   * 用户登录
   */
	userSignin = flow(function* (data) {
		this.signinResult = PENDING;
		const res = yield user.signin(data);
		this.userInfo = res;

		this.signinResult = res;
	});
	/**
   * 用户忘记密码
   */
	userForgotPassword = flow(function* (params) {
		this.forgotResult = PENDING;
		const res = yield user.forgotPassword(params);
		this.forgotResult = res;
	});
	/**
   * 用户重置密码
   */
	userResetPassword = flow(function* (data) {
		this.resetPasswordResult = PENDING;
		const res = yield user.resetPassword(data);
		this.resetPasswordResult = res;
	});
	fetchUserInfo = flow(function* (userid) {
		const { errCode, data } = yield user.detail(userid || this.userInfo.id);
		if (!errCode) {
			this.userInfo = data;
			setLocalUserInfo(data);
		}
	})
	constructor() {
		this.hasSignined = getLocalToken()
		this.userInfo = {};
	}
}
export default new UserStore();
