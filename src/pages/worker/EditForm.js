import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Modal, Form, InputNumber, Select, Checkbox, Input } from 'antd';
import { ROLES } from '../../constants';
@inject('app')
@inject('project')
@inject('user')
@inject('staff')
@observer
class EditForm extends Component {
	state = {
		isTeamLeader: false,
		projectId: ''
	};
	constructor(props) {
		super(props);
		this.state.projectId = props.projectId;
	}
	onTeamLeaderChange() {}
	componentDidMount() {
		const { staffCorpRoleResult } = this.props.staff;
		if (staffCorpRoleResult.role === ROLES.contractor) {
			this.getWorkerLeader();
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
	render() {
		const {
			visible,
			onCancel,
			onEditSave,
			form,
			staff,
			project,
			user,
			confirmLoading,
			memberData = {}
		} = this.props;
		if (!memberData.userInfo) {
			return <div />;
		}
		const { staffCorpRoleResult } = staff;
		const { managersResult, workerLeadersResult } = project;
		const isContractor = staffCorpRoleResult.role === ROLES.contractor;
		const { getFieldDecorator } = form;
		const { isTeamLeader } = this.state;
		const selectOptions = isContractor
			? [].concat([ { user_id: user.userInfo.id, userInfo: user.userInfo } ], workerLeadersResult.data.items)
			: managersResult.data.flatItems;
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
				visible={visible}
				onCancel={onCancel}
				onOk={onEditSave}
				confirmLoading={confirmLoading}
				title={`编辑 ${memberData.userInfo && memberData.userInfo.name}`}
			>
				<Form {...formItemLayout}>
					<Form.Item label={isContractor ? '班组' : '指派给'}>
						{getFieldDecorator('group_id', {
							initialValue: memberData.group_id,
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
									initialValue: memberData.day_cost,
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
									initialValue: memberData.salary,
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
								<Checkbox
									checked={memberData.role === ROLES.teamleader}
									onChange={this.onTeamLeaderChange.bind(this)}
								>
									设置为班组长
								</Checkbox>
								{getFieldDecorator('role', {
									initialValue: role
								})(<Input hidden />)}
							</Form.Item>
						</React.Fragment>
					)}
				</Form>
			</Modal>
		);
	}
}
export default Form.create({ name: 'editMemberForm' })(EditForm);
