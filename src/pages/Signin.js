import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';
import { Form, Icon, Input, Button, Card, Alert } from 'antd';
import styles from './Sign.module.less';
import UserService from '../services/user';
import { get_dict_list } from '../services/dict';
import Qianwang from "../images/loginImg/qianwang-icon.png";
import  "./worker/index.module.less";
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
			<div className="form">
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
						<Input id = "userChange"
							prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="请输入电子邮箱"
						/>
					)}
				</Form.Item>
				<Form.Item>
					{getFieldDecorator('password', {
						rules: [{ required: true, message: '请输入密码' }]
					})(
						<Input.Password id="lockChange"
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="请输入密码"
						/>
					)}
				</Form.Item>
				<Form.Item>
					<Button type="primary" htmlType="submit" loading={loading} block>
						登 录
					</Button>
					{/* 或者 <Link to="/signup">马上注册!</Link> */}
				
				</Form.Item>
			</Form>
			</div>
		);
	}
}
class Signinleft extends React.Component {
	render() {
		return (
			<div className={styles.loginLeft}>
			   <div className={styles.loginLeft_bg}>
				   <span className={styles.loginLeft_font}>WELCOME</span>
				   <span className={styles.loginLeft_a}>欢迎登录华工劳务通管理系统</span>
				   <span className={styles.loginLeft_b}>工人安薪企业放心</span>
				   <img src={Qianwang} className={styles.loginLeft_icon}></img>
				   {/* <link to="/signup" >去注册</link> */}
				   <a href="/signup" className={styles.loginLeft_login}>去注册</a>
			   </div>
			</div>
		);
	}
}


class Card1 extends React.Component {
	render() {
		return (
			<div className={styles.loginTitle}>
				<span className={styles.loginTitle_left}>登陆系统</span>
				<Link className={styles.loginTitle_right} to="/forgot">
						忘记密码
					</Link>
			</div>
		);
 
}
}
const WrappedSigninForm = Form.create({ name: 'signForm' })(withRouter(SigninForm));

class Signin extends Component {
	render() {
		return (
			<div className={styles.app1}>

<div className={styles.login}>
				<Signinleft/>
			<div className={styles.loginRight}>
			<Card className={styles.signContainer}>
				<Card1></Card1>
				<WrappedSigninForm />
			</Card>
			</div>
			</div>
			</div>
		);
	}
}

export default Signin;