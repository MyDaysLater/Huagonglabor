import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Card, Input, Form, Icon, Button, Alert } from 'antd';
import styles from './Forgot.module.less';
import { forgotPassword } from '../services/user';

@inject('user')
@observer
class ForgotForm extends Component {
	state = {
		submitLoading: false,
		submitStatus: {}
	};
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				this.setState({ submitLoading: true });
				const { errCode, errMsg } = await forgotPassword(values);
				if(errCode) {
					this.setState({ submitLoading: false, submitStatus: { errCode, errMsg } });
					return;
				}
				this.setState({ submitLoading: false, submitStatus: { errCode: 0, errMsg: '邮件已发送到邮箱' } });
			}
		});
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const { submitLoading, submitStatus } = this.state;
		return (
			<Form layout="vertical" onSubmit={this.handleSubmit}>
				{submitStatus.errMsg && (
					<Form.Item>
						<Alert
							message={submitStatus.errMsg}
							type={submitStatus.errCode ? 'error' : 'success'}
							showIcon
						/>
					</Form.Item>
				)}

				<Form.Item>
					{getFieldDecorator('email', {
						rules: [ { required: true, message: '请输入邮箱地址' } ]
					})(
						<Input
							prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="email"
							placeholder="电子邮箱"
						/>
					)}
				</Form.Item>
				<Form.Item>
					<Button type="primary" loading={submitLoading} block htmlType="submit">
						提交
					</Button>
				</Form.Item>
				<Form.Item style={{ marginBottom: 0 }}>
					或者<Link to="/signin"> 去登录</Link>
				</Form.Item>
			</Form>
		);
	}
}
const WrappedForgotForm = Form.create({ name: 'signForm' })(ForgotForm);
class Forgot extends Component {
	render() {
		return (
			<Card title="找回密码" className={styles.container}>
				<WrappedForgotForm />
			</Card>
		);
	}
}
export default Forgot;
