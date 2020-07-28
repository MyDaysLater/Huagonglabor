import React, { Component } from 'react';
import { Form, Modal, Input } from 'antd';

class ModifyPasswordForm extends Component {
	state = {
		confirmDirty: false
	};
	handleConfirmBlur(e) {
		const { value } = e.target;
		this.setState({ confirmDirty: this.state.confirmDirty || !!value });
	}
	compareToFirstPassword(rule, value, callback) {
		const { form } = this.props;
		if (value && value !== form.getFieldValue('new-password')) {
			callback('两次输入的密码不一样');
		} else {
			callback();
		}
	}
	validateToNextPassword = (rule, value, callback) => {
		const { form } = this.props;
		if (value && this.state.confirmDirty) {
			form.validateFields([ 'new-password-confirm' ], { force: true });
		}
		callback();
	};
	render() {
		const { form, visible, onCancel, onSubmit, confirmLoading } = this.props;
		const { getFieldDecorator } = form;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
				md: { span: 5 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
				md: { span: 17 }
			}
		};
		return (
			<Modal visible={visible} onCancel={onCancel} onOk={onSubmit} confirmLoading={confirmLoading}>
				<Form {...formItemLayout}>
					<Form.Item label="原密码">
						{getFieldDecorator('password', {
							rules: [ { min: 6, message: '密码长度必须大于6个字符' }, { required: true, message: '请输入原密码' } ]
						})(<Input.Password />)}
					</Form.Item>
					<Form.Item label="新密码" hasFeedback>
						{getFieldDecorator('new-password', {
							rules: [
								{ min: 6, message: '密码长度必须大于6个字符' },
								{ required: true, message: '请输入新密码' },
								{ validator: this.validateToNextPassword.bind(this) }
							]
						})(<Input.Password />)}
					</Form.Item>
					<Form.Item label="确认新密码" hasFeedback>
						{getFieldDecorator('new-password-confirm', {
							rules: [
								{ required: true, message: '请输入新密码' },
								{ validator: this.compareToFirstPassword.bind(this) }
							]
						})(<Input.Password onBlur={this.handleConfirmBlur.bind(this)} />)}
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default Form.create({ name: 'modifyPasswordForm' })(ModifyPasswordForm);
