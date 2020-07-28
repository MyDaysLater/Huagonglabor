import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Form, Input, Select, Checkbox, Modal, InputNumber } from 'antd';
import { ROLES } from '../../constants';
@inject('app')
@inject('project')
@inject('user')
@inject('staff')
@observer
class CreateForm extends Component {
	state = {
		isTeamLeader: false,
		projectId: ''
	};
	constructor(props) {
		super(props);
		this.state.projectId = props.projectId;
	}
	componentDidMount() {
		const { staffCorpRoleResult } = this.props.staff;
		if (staffCorpRoleResult.role === ROLES.contractor) {
			this.getWorkerLeader();
		}
	}
	componentDidUpdate(prevProps) {
		const { visible } = this.props;
		if (!visible && prevProps.visible !== visible) {
			this.props.form.resetFields();
		}
	}
	getWorkerLeader() {
		const { projectId } = this.state;
		this.props.project.workerLeaders({
			'filter[corp_project_id]': projectId,
			'filter[user_id]': this.props.user.userInfo.id,
			'filter[role]': ROLES.teamleader
		});
	}

	onTeamLeaderChange() {
		const { isTeamLeader } = this.state;
		this.setState({ isTeamLeader: !isTeamLeader });
	}
	render() {
		const { visible, onCancel, onCreate, form, staff, project, user, confirmLoading } = this.props;
		// console.log(onCreate)
		const { staffCorpRoleResult } = staff;
		const { managersResult, workerLeadersResult } = project;
		const isContractor = staffCorpRoleResult.role === ROLES.contractor;
		const selectOptions = isContractor
			? [].concat([{ user_id: user.userInfo.id, userInfo: user.userInfo }], workerLeadersResult.data.items)
			: managersResult.data.flatItems;
		const selectDefaultValue = selectOptions.length ? selectOptions[0].user_id : '';
		const { getFieldDecorator } = form;
		const { isTeamLeader } = this.state;
		const role = isContractor ? (isTeamLeader ? ROLES.teamleader : ROLES.worker) : ROLES.contractor;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 5 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 17 }
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
					offset: 5
				}
			}
		};
		return (
			<Modal
				confirmLoading={confirmLoading}
				maskClosable={false}
				title="添加人员"
				visible={visible}
				onCancel={onCancel}
				onOk={onCreate}
			>
				<Form {...formItemLayout}>
					<Form.Item label="姓名">
						{getFieldDecorator('name', {
							rules: [
								{
									required: true,
									message: '请填写姓名'
								}
							]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="手机号">
						{getFieldDecorator('mobile', {
							rules: [
								{
									required: true,
									message: '请填写电话号码'
								}
							]
						})(<Input />)}
					</Form.Item>
					{/* {!isContractor && (
						<Form.Item label="电子邮箱">
							{getFieldDecorator('email', {
								rules: [
									{
										type: 'email',
										message: '请填写正确的邮箱地址'
									},
									{
										required: true,
										message: '请填写邮箱地址'
									}
								]
							})(<Input />)}
						</Form.Item>
					)} */}
					<Form.Item label={isContractor ? '班组' : '指派给'}>
						{getFieldDecorator('group_id', {
							initialValue: selectDefaultValue,
							rules: [
								{
									required: true,
									message: '请选择班组'
								}
							]
						})(
							<Select placeholder="请选择" disabled={isTeamLeader}>
								{selectOptions.map((item) => (
									<Select.Option key={item.user_id} value={item.user_id}>
										{item.userInfo.name}
									</Select.Option>
								))}
							</Select>
						)}
					</Form.Item>
					{isContractor && (
						<React.Fragment>
							<Form.Item label="每日生活费">
								{getFieldDecorator('day_cost', {
									initialValue: 0,
									rules: [
										{
											required: true,
											message: '请输入每日生活费'
										},
										{
											type: 'number',
											message: '请输入数字'
										}
									]
								})(<InputNumber min={0} />)}
								<label style={{ marginLeft: 8 }}>元</label>
							</Form.Item>
							<Form.Item label="每日工资">
								{getFieldDecorator('salary', {
									initialValue: 0,
									rules: [
										{
											required: true,
											message: '请输入每日工资'
										},
										{
											type: 'number',
											message: '请输入数字'
										}
									]
								})(<InputNumber min={0} />)}
								<label style={{ marginLeft: 8 }}>元</label>
							</Form.Item>
							<Form.Item {...tailFormItemLayout}>
								<Checkbox onChange={this.onTeamLeaderChange.bind(this)}> 设置为班组长</Checkbox>
							</Form.Item>
						</React.Fragment>
					)}
					{getFieldDecorator('role', {
						initialValue: role
					})(<Input hidden />)}
				</Form>
			</Modal>
		);
	}
}

export default Form.create({ name: 'createMemberForm' })(CreateForm);
