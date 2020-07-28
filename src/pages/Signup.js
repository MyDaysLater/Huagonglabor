import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Form, Icon, Input, Button, Card, Alert } from 'antd';
import styles from './Sign.module.less';
import userService from '../services/user';
@inject('user')
@observer
class SignupForm extends Component {
	state = {
		confirmDirty: false,
		submitLoading: false,
		signupError: {}
	};
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				if (values.password === values.cpassword) {
					this.setState({ submitLoading: true });
					const { errCode, errMsg, data } = await userService.signup({
						email: values.email,
						password: values.password
					});
					this.setState({ submitLoading: false });
					if (errCode) {
						this.setState({ signupError: { errCode, errMsg } });
						return;
					}
					this.props.history.push(`/signup/result`);
				}
			}
		});
	};
	handleConfirmBlur = (e) => {
		const { value } = e.target;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	};
	compareToFirstPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('password')) {
			callback('两次输入的密码不一致');
		} else {
			callback();
		}
	};

	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && this.state.confirmDirty) {
			form.validateFields(['cpassword'], { force: true });
		}
		callback();
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const { signupError, submitLoading } = this.state;
		return (
			<Form onSubmit={this.handleSubmit} className={styles.signForm}>
				{signupError.errMsg && (
					<Form.Item>
						<Alert showIcon message={signupError.errMsg} type={signupError.errCode ? 'error' : 'success'} />
					</Form.Item>
				)}
				<Form.Item hasFeedback>
					{getFieldDecorator('email', {
						rules: [
							{ required: true, message: '请输入邮箱地址' },
							{
								type: 'email',
								message: '请输入正确的电子邮箱地址'
							}
						]
					})(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="电子邮箱" />)}
				</Form.Item>
				<Form.Item hasFeedback>
					{getFieldDecorator('password', {
						rules: [
							{ required: true, message: '请输入密码' },
							{ min: 6, message: '密码长度必须大于等于6个字符' },
							{ validator: this.validateToNextPassword }
						]
					})(
						<Input.Password
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="密码"
						/>
					)}
				</Form.Item>
				<Form.Item hasFeedback>
					{getFieldDecorator('cpassword', {
						rules: [
							{ required: true, message: '请输入与上面一致的密码' },
							{ validator: this.compareToFirstPassword }
						]
					})(
						<Input.Password
							onBlur={this.handleConfirmBlur}
							prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
							placeholder="再次输入密码"
						/>
					)}
				</Form.Item>
				<Form.Item>
					<Button loading={submitLoading} type="primary" htmlType="submit" block>
						注 册
					</Button>
					或者 <Link to="/signin">马上登录</Link>
				</Form.Item>
			</Form>
		);
	}
}

const WrappedSignupForm = Form.create({ name: 'signForm' })(withRouter(SignupForm));

class Signup extends Component {
	render() {
		return (
			<Card title="注册华工劳务工管理系统" className={styles.signContainer}>
				<WrappedSignupForm />
			</Card>
		);
	}
}

export default Signup;
