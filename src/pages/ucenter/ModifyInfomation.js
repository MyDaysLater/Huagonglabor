import React, { Component } from 'react';
import { Form, Modal, Input } from 'antd';
import { inject, observer } from 'mobx-react';
@inject('user')
@observer
class ModifyInfomationForm extends Component {
	render() {
		const { form, visible, onCancel, onSubmit, confirmLoading, user } = this.props;
		const { getFieldDecorator } = form;
		const { userInfo = {} } = user;
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
			<Modal
				maskClosable={false}
				closable={false}
				cancelButtonProps={{ disabled: userInfo.id && !userInfo.name }}
				visible={visible}
				onCancel={onCancel}
				onOk={onSubmit}
				confirmLoading={confirmLoading}
				title="基本信息"
			>
				<Form {...formItemLayout}>
					<Form.Item label="姓名">
						{getFieldDecorator('name', {
							initialValue: userInfo.name,
							rules: [
								{
									required: true,
									message: '请填写姓名'
								}
							]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="手机号码">
						{getFieldDecorator('mobile', {
							initialValue: userInfo.mobile,
							rules: [
								{
									required: true,
									message: '请填写手机号码'
								}
							]
						})(<Input />)}
					</Form.Item>
				</Form>
			</Modal>
		);
	}
}

export default Form.create({ name: 'modifyInfomationForm' })(ModifyInfomationForm);
