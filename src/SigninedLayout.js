import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import Notfound from './pages/NotFound';
import AuthRoute from './AuthRoute';
import AppLayout from './AppLayout';
import { observer, inject } from 'mobx-react';
import AppWithoutSiderLayout from './AppWithoutSiderLayout';
import { Route, Switch, withRouter } from 'react-router-dom';
import { getLocalUserInfo } from './utils/localStoreCommon';
import { signIn } from './routeConfig';

@inject('user')
@observer
class SigninedLayout extends Component {
	constructor(props) {
		super(props);
		const localUserInfo = getLocalUserInfo();
		if (localUserInfo) {
			props.user.setUserInfo(localUserInfo);
		} else {
			props.history.replace(signIn);
		}
	}
	render() {
		return (
			<ConfigProvider locale={zhCN}>
				<Switch>
					<AuthRoute path="/(corps|ucenter)" component={AppWithoutSiderLayout} />
					<AuthRoute path="/dashboard/:corpid" component={AppLayout} />
					<Route path="/*">
						<Notfound />
					</Route>
				</Switch>
			</ConfigProvider>
		);
	}
}

export default withRouter(SigninedLayout);
