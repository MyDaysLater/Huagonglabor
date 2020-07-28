import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Form, Icon, Input, Button, Card, Alert } from 'antd';
import styles from './Sign.module.less';
import UserService from '../services/user';
import { get_dict_list } from '../services/dict';
@inject('user')
@observer
class SigninForm extends React.Component {
	state = {
		loading: false,
		signError: {}
	};
	constructor(props) {
		super(props)
	}
	jurisdiction(adminlist, arr = []) {
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
				this.jurisdiction(adminlist[i].sub, arr);
			}
		}
		return arr;
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				this.setState({ loading: true });
				const { errCode, errMsg, data } = await UserService.signin(values);
				this.setState({ loading: false, signError: { errCode, errMsg } });
				if (errCode) {
					return;
				}
				const { user, history, location } = this.props;
				// console.log(data)
				// console.log(this.props)
				const { setSignin, setUserInfo } = user;
				const { state } = location;
				const { corpLimits } = data;
				let id = '';
				for (let item in corpLimits) {
					id = item
				}
				let currentCorpLimits = corpLimits[id] || {};
				let { admin_limits = [] } = currentCorpLimits;
				let arr = [];
				admin_limits && (arr = this.jurisdiction(admin_limits));
				localStorage.setItem('admin_limits', JSON.stringify(arr));
				if (data.token) {
					setUserInfo(data);
					setSignin(true);
					let route = `/dashboard/${id}`;
					if (state && state.from) {
						route = state.from.pathname;
					}
					history.replace(route);
				}
				this.get_dict();
			}
		});
	};
	async get_dict() {
		const { errCode, data } = await get_dict_list();
		if (errCode) {
			return -1;
		}
		localStorage.setItem('dict', JSON.stringify(data.items));

	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { loading, signError } = this.state;
		return (
			<Form onSubmit={this.handleSubmit} className={styles.signForm}>
				{signError.errCode && (
					<Form.Item>
						<Alert showIcon message={signError.errMsg} type="error" />
					</Form.Item>
				)}
				<Form.Item>
					{getFieldDecorator('username', {
						rules: [{ required: true, message: '请输入账号' }]
					})(
						<Input
							prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="账号"
						/>
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: '请输入密码' }]
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="密码"
						/>
					)}
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading} block>
						登 录
					</Button>
					{/* 或者 <Link to="/signup">马上注册!</Link> */}
					<Link className={styles.signFormForgot} to="/forgot">
						忘记密码
					</Link>
				</Form.Item>
			</Form>
		);
	}
}

const WrappedSigninForm = Form.create({ name: 'signForm' })(withRouter(SigninForm));

class Signin extends Component {
	render() {
		return (
			<Card className={styles.signContainer} title="登录华工劳务工管理系统">
				<WrappedSigninForm />
			</Card>
		);
	}
}

export default Signin;
