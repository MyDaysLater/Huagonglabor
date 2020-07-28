import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import SigninedLayout from './SigninedLayout';
import NormalLayout from './NormalLayout';
import { dashboardPath } from './routeConfig';
import { getLocalUserInfo } from './utils/localStoreCommon';
const pathReg = new RegExp(`${dashboardPath}|corps|ucenter`);
@inject('user')
@observer
class App extends Component {
	render() {
		const localUserInfo = getLocalUserInfo();
		if (localUserInfo) {
			this.props.user.setUserInfo(localUserInfo);
		}
		const { pathname } = this.props.location;
		return pathReg.test(pathname) ? <SigninedLayout /> : <NormalLayout />;
	}
}

export default withRouter(App);
