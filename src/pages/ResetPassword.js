import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import userService from '../services/user';
import { withRouter } from 'react-router-dom';
import { Form, Icon, Input, Button, Card, Alert, message } from 'antd';
import styles from './Sign.module.less';
import { signIn } from '../routeConfig';
import { removeLocalToken } from '../utils/localStoreCommon';
@inject('user')
@observer
class ResetPasswordForm extends Component {
	state = {
		code: '',
		submitStatus: {},
		hasSumbited: false
	};
	constructor(props) {
		super(props);
		const { code } = props.match.params;
		this.state.code = code;
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				if (values.password === values.cpassword) {
					const { code } = this.state;
					this.setState({ submitLoading: true });
					const { errCode, errMsg } = await userService.setPassword({ code, password: values.password });
					this.setState({ submitLoading: false, hasSumbited: true });
					if (errCode) {
						this.setState({ submitStatus: { errCode, errMsg } });
						return;
					}
					message.success('密码设置成功');
					removeLocalToken();
					this.props.history.replace(signIn);
				}
			}
		});
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
			form.validateFields([ 'confirm' ], { force: true });
		}
		callback();
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const { submitLoading, submitStatus, hasSumbited } = this.state;
		return (
			<React.Fragment>
				<Form onSubmit={this.handleSubmit} className={styles.signForm}>
					{hasSumbited && (
						<Form.Item>
							{!submitStatus.errCode ? (
								<Alert
									message="更新成功"
									description="密码已经更新，需要重新登录。"
									type="success"
								/>
							) : (
								<Alert message={submitStatus.errMsg || '更新失败'} type="error" />
							)}
						</Form.Item>
					)}
					<Form.Item>
						{getFieldDecorator('password', {
							rules: [ { required: true, message: '请输入密码' }, { validator: this.validateToNextPassword } ]
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
								prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="再次输入密码"
							/>
						)}
					</Form.Item>
					<Form.Item>
						<Button loading={submitLoading} type="primary" htmlType="submit" block>
							提 交
						</Button>
					</Form.Item>
				</Form>
			</React.Fragment>
		);
	}
}

const WrappedResetPasswordForm = Form.create({ name: 'signForm' })(withRouter(ResetPasswordForm));

class ResetPassword extends Component {
	render() {
		return (
			<Card title="设置新密码" className={styles.signContainer}>
				<WrappedResetPasswordForm />
			</Card>
		);
	}
}

export default ResetPassword;
