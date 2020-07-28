import React, { Component } from 'react';
import { Form, Input, Button, message, Select, Spin } from 'antd';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import staffService from '../../services/staff';
@inject('app')
@inject('staff')
@inject('user')
@inject('role')
@observer
class EditForm extends Component {
	state = {
		corps: [],
		isCreate: true,
		editLoading: false,
		staffInfo: {
			userInfo: {}
		},
		submitLoading: false
	};
	constructor(props) {
		super(props);
		this.state.isCreate = !props.id;
		const { corpid } = props.match.params;
		if (props.id) {
			this.state.editLoading = true;
		}
		props.role.list({
			'filter[corp_id]': corpid,
			'filter[order][lt]': 100
		});
	}
	async componentDidMount() {
		const { id } = this.props;
		if (id) {
			const { errCode, data } = await staffService.detail(id, {
				expand: 'userInfo',
			});
			if (errCode) {
				message.error(data.message);
				return;
			}
			this.setState({ staffInfo: data, editLoading: false });
		}
	}
	onSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const { currentCorp } = this.props.app;
				const { listResult = {} } = this.props.role;
				const roleItem = listResult.data.items.find((item) => item.id === values.corp_role_id);
				const { id } = this.props;
				this.setState({ submitLoading: true });
				if (roleItem) {
					values.role = roleItem.role;
				}
				const { errCode, data } = id
					? await staffService.update(id, values)
					: await staffService.create(Object.assign({ corp_id: currentCorp.id }, values));
				this.setState({ submitLoading: false });
				if (errCode) {
					message.error(data.message);
					return;
				}
				this.props.user.fetchUserInfo();
				message.success('提交成功');
				this.props.history.goBack();
			}
		});
	}
	render() {
		const { id, authorize, jurisdiction } = this.props;
		const { getFieldDecorator } = this.props.form;
		const { staffInfo, editLoading, submitLoading } = this.state;
		const { listResult = {} } = this.props.role;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
				md: { span: 8 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
				md: { span: 10 }
			}
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0
				},
				sm: {
					span: 16,
					offset: 8
				}
			}
		};
		return (
			<Spin spinning={editLoading}>
				<Form {...formItemLayout} onSubmit={this.onSubmit.bind(this)}>
					<Form.Item label="姓名">
						{getFieldDecorator('name', {
							initialValue: staffInfo.userInfo.name,
							rules: [
								{
									required: true,
									message: '请输入项目名称'
								}
							]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="手机号码">
						{getFieldDecorator('mobile', {
							initialValue: staffInfo.userInfo.mobile,
							rules: [
								{
									required: true,
									message: '请输入手机号码'
								}
							]
						})(<Input disabled={id && staffInfo.userInfo.mobile !== ''} />)}
					</Form.Item>
					{/* <Form.Item label="电子邮箱">
						{getFieldDecorator('email', {
							initialValue: staffInfo.userInfo.email,
							rules: [
								{
									required: true,
									type: 'email',
									message: '请输入电子邮箱地址'
								}
							]
						})(<Input disabled={id && staffInfo.userInfo.email !== ''} />)}
					</Form.Item> */}
					<Form.Item label="用户名">
						{getFieldDecorator('username', {
							initialValue: staffInfo.userInfo.username,
							rules: [
								{
									required: true,
									message: '请输入用户名'
								}
							]
						})(<Input />)}
					</Form.Item>
					{/* <Form.Item label="密码">
						{getFieldDecorator('password', {
							initialValue: staffInfo.userInfo.password,
							rules: [
								{
									required: true,
									message: '请输入密码'
								}
							]
						})(<Input />)}
					</Form.Item> */}
					<Form.Item label="角色">
						{getFieldDecorator('corp_role_id', {
							initialValue: staffInfo.corp_role_id,
							rules: [
								{
									required: true,
									message: '请选择角色'
								}
							]
						})(
							<Select placeholder="选择角色" disabled={staffInfo.role === 'master'} loading={listResult.pending} allowClear>
								{listResult.data.items.map((item) => (
									<Select.Option key={item.id} value={item.id}>
										{item.name}
									</Select.Option>
								))}
							</Select>
						)}
					</Form.Item>
					{(
						<Form.Item {...tailFormItemLayout}>
							<Button type="primary" loading={submitLoading} htmlType="submit">
								提交
							</Button>
						</Form.Item>
					)}
				</Form>
			</Spin>
		);
	}
}

export default Form.create({ name: 'editStaffForm' })(withRouter(EditForm));
