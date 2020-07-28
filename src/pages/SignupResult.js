import React, { Component } from 'react';
import { Result, Button, Spin, message } from 'antd';
import userService from '../services/user';
import { signIn } from '../routeConfig';
export default class SignupResult extends Component {
	state = {
		loading: true,
		id: '',
    data: {},
    sendLoading: false
	};
	constructor(props) {
		super(props);
		const { id } = props.match.params;
		this.state.id = id;
	}
	async componentDidMount() {
		const { id } = this.state;
		if (id) {
			const { errCode, errMsg , data } = await userService.checkSignup(id);
			if (errCode) {
				message.error(errMsg);
				return;
			}
			this.setState({ loading: false });
			if (data.status !== 1) {
				this.props.history.replace(signIn);
				return;
			}
			this.setState({ data });
		}
	}
	async onResendEmail() {
		const { id } = this.state;
		this.setState({ sendLoading: true });
		const { errCode, data } = userService.resendEmail(id);
    
    if(errCode) {
      message.error(data.message);
      return;
    }
    setTimeout(()=>{
      this.setState({ sendLoading: false });
    }, 1000);
    message.success('邮件已发送，注意查收');
	}
	render() {
		const { loading, data, sendLoading } = this.state;
		let resultProps = {};
		if (loading) {
			resultProps = {
				icon: <Spin spinning={loading} />,
				status: 'success',
				title: '正在加载'
			};
		} else if (data.status === 1) {
			resultProps = {
				status: 'success',
				title: '注册成功',
				subTitle: '请登录您的邮箱查看邮件并通过验证。',
				extra: (
					<Button loading={sendLoading} onClick={this.onResendEmail.bind(this)} type="primary" key="console">
						未收到邮件？重新发送
					</Button>
				)
			};
		}
		return <Result {...resultProps} />;
	}
}
