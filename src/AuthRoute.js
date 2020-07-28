import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { signIn } from './routeConfig';
import { inject, observer } from 'mobx-react';
@inject('user')
@observer
class AuthRoute extends Component {
	state = {
		r_path: '',
		jurisdiction: false
	}
	constructor(props) {
		super(props);
		const { path } = props;

	}
	componentDidMount() {
	}
	jurisdiction(path, adminlist, arr = []) {
		for (let i in adminlist) {
			// if (path === adminlist[i].name) {
			// 	console.log('找到', path, adminlist[i].name, adminlist[i].ismenu)
			// 	// this.setState({
			// 	// 	jurisdiction: adminlist[i].ismenu
			// 	// })
			// 	// jurisdiction = adminlist[i].ismenu;
			// 	return adminlist[i].ismenu;
			// }
			arr.push({
				name: adminlist[i].name,
				ismenu: adminlist[i].ismenu
			})
			if (adminlist[i].sub && adminlist[i].sub.length && adminlist[i].ismenu) {
				this.jurisdiction(path, adminlist[i].sub, arr);
			}
		}
		return arr;
	}
	render() {
		const { props } = this;
		const { component: AuthComponent, user, authKey, computedMatch, path } = props;
		// console.log(props)
		let { jurisdiction } = this.state;
		const { corpid } = computedMatch.params;
		const { hasSignined, userInfo } = user;
		const { corpLimits = {} } = userInfo;
		let currentCorpLimits = corpLimits[corpid] || {};
		let { admin_limits = [] } = currentCorpLimits;
		let a = path.split('/');
		let r_path = '';
		for (let i = 0; i < a.length; i++) {
			if (a[i].indexOf(':') === -1) {
				r_path = r_path + '/' + a[i];
			}
		}
		r_path = r_path.slice(1);
		// let arr = [];
		// admin_limits && (arr = this.jurisdiction(r_path, admin_limits));
		var c = JSON.parse(localStorage.getItem("admin_limits"));
		for (let i in c) {
			if (r_path === c[i].name) {
				jurisdiction = c[i].ismenu;
			}
		}
		let authorize = {
			role: {
				name: currentCorpLimits.name,
				type: currentCorpLimits.role,
			},
			query: true,
			mutation: false
		};

		// const authItem = admin_limits.find((item) => item.name === authKey);
		// if (authItem) {
		// 	authorize = Object.assign(authorize, authItem.authorize);
		// }
		return hasSignined ? (
			<Route
				exact={props.exact}
				path={props.path}
				render={(props) => <AuthComponent {...props} userInfo={userInfo} authorize={authorize} jurisdiction={jurisdiction || false} />}
			/>
		) : (
				<Redirect
					to={{
						pathname: signIn,
						state: { from: props.location }
					}}
				/>
			);
	}
}
export default AuthRoute;
