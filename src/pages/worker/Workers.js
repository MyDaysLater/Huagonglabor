import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Button, Table, Tree, Modal, Divider, Spin, message, Tag, Descriptions } from 'antd';
import { ROLES, ROLELABEL } from '../../constants';
import projectService from '../../services/project';
import styles from './Workers.module.less';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
@inject('app')
@inject('project')
@inject('user')
@inject('staff')
@observer
class Workers extends Component {
	state = {
		projectId: '',
		workerList: {
			items: []
		},
		memberDetail: { userInfo: {} },
		detailModalVisible: false,
		treeNodeLoading: true,
		treeSelectedKeys: ['0-0'],
		defaultExpandedKeys: ['0-0'],
		createMemberFormVisible: false,
		createMemberFormConfirmLoading: false,
		removeConfirmLoading: false,
		selectedGroup: '',
		editMemberFormVisible: false,
		editMemberFormConfirmLoading: false,
		editMemberData: ''
	};
	constructor(props) {
		super(props);
		const { id } = props.match.params;
		this.state.projectId = id;
		this.getMembersTree();
	}
	componentDidMount() {
		this.getTreeNodeMembers();
	}
	getMembersTree() {
		const { projectId } = this.state;
		const { corpRole = {} } = this.props.staff.staffCorpRoleResult;
		this.props.project.membersTree({
			'filter[corp_project_id]': projectId,
			role: corpRole.role === ROLES.contractor ? corpRole.role : ROLES.master,
			expand: 'teamMembers,userInfo'
		});
	}

	async getTreeNodeMembers() {
		const { projectId, selectedGroup } = this.state;
		this.setState({ treeNodeLoading: true });
		let params = {
			'filter[corp_project_id]': projectId,
			'filter[role][in][0]': ROLES.contractor,
			'filter[role][in][1]': ROLES.teamleader,
			'filter[role][in][2]': ROLES.worker,
			'filter[status][nin][0]': 7,
			'filter[status][nin][1]': 9,
			expand: 'userInfo',
		};
		if (selectedGroup) {
			params = Object.assign(params, { expand: 'memberList,userInfo', id: selectedGroup });
		}
		const { errCode, errMsg, data } = await projectService.getMembers(params);
		if (errCode) {
			message.error(errMsg);
			return;
		}
		this.setState({ treeNodeLoading: false, workerList: data });
	}
	async onMembersTreeSelected(pos, { node }) {
		this.setState({ treeSelectedKeys: pos, selectedGroup: node.props.id }, () => {
			this.getTreeNodeMembers();
		});
	}
	onClickAddMember() {
		this.setState({ createMemberFormVisible: true });
	}
	onMemberCreate() {
		this.createSaveFormRef.props.form.validateFields(async (err, values) => {
			if (!err) {
				const { currentCorp } = this.props.app;
				this.setState({ createMemberFormConfirmLoading: true });
				const { errCode, errMsg } = await projectService.addMember(
					Object.assign(values, {
						a: 'addMember',
						corp_id: currentCorp.id,
						corp_project_id: this.state.projectId
					})
				);
				this.setState({ createMemberFormConfirmLoading: false });
				if (errCode) {
					message.error(errMsg);
					return;
				}
				message.success('添加成功');
				this.getTreeNodeMembers();
				this.setState({ createMemberFormVisible: false });
			}
		});
	}
	onMemberCreateCancel() {
		this.setState({ createMemberFormVisible: false });
	}
	createFormRef(formRef) {
		this.createSaveFormRef = formRef;
	}
	onViewDetail(record) {
		const { workerList } = this.state;
		this.setState({
			detailModalVisible: true,
			memberDetail: workerList.items.find((item) => item.user_id === record.key)
		});
	}
	onViewDetailClose() {
		this.setState({ detailModalVisible: false });
	}
	onEditMember(record) {
		const { workerList } = this.state;
		this.setState({
			editMemberFormVisible: true,
			editMemberData: workerList.items.find((item) => item.user_id === record.key)
		});
	}
	editFormRef(formRef) {
		this.editSaveFormRef = formRef;
	}
	onMemberEditSave() {
		this.editSaveFormRef.props.form.validateFields(async (err, values) => {
			if (!err) {
				const { editMemberData } = this.state;
				const { currentCorp } = this.props.app;
				this.setState({ editMemberFormConfirmLoading: true });
				const { errCode, errMsg } = await projectService.updateMember(
					editMemberData.id,
					Object.assign(values, {
						corp_id: currentCorp.id,
						corp_project_id: this.state.projectId
					})
				);
				this.setState({ editMemberFormConfirmLoading: false });
				if (errCode) {
					message.error(errMsg);
					return;
				}
				message.success('修改成功');
				this.getMembersTree();
				this.setState({ editMemberFormVisible: false, editMemberData: '' });
			}
		});
	}
	onMemberEditFormCancel() {
		this.setState({ editMemberFormVisible: false, editMemberData: '' });
	}
	onRemoveMember(record) {
		const { removeConfirmLoading } = this.state;
		const removeModal = Modal.confirm({
			title: '删除',
			content: `您是否要删除【${record.name}】?`,
			okButtonProps: {
				loading: removeConfirmLoading
			},
			onOk: async () => {
				this.setState({ removeConfirmLoading: true });
				//离职
				const { errCode, errMsg } = await projectService.removeMember(record.id, { status: 7 });
				if (errCode) {
					message.error(errMsg);
					return;
				}
				message.success('删除成功');
				this.getTreeNodeMembers();
				this.setState({ removeConfirmLoading: false });
				removeModal.destroy();
			}
		});
	}
	renderActions() {
		const { authorize, jurisdiction } = this.props;
		const { staffCorpRoleResult } = this.props.staff;
		const { data } = this.props.project.managersResult;
		const { userInfo } = this.props.user;
		const isProjectManager = data.flatItems.find((item) => item.user_id === userInfo.id);
		if (jurisdiction && ([ROLES.master, ROLES.submaster].includes(staffCorpRoleResult.role) || isProjectManager)) {
			return (
				<div className={styles.actions}>
					<Button onClick={this.onClickAddMember.bind(this)} type="primary">
						添加人员
					</Button>
					{/* <Button>从Excel导入</Button> */}
				</div>
			);
		}
		return <span />;
	}
	render() {
		const { authorize, jurisdiction } = this.props;
		const { membersTreeResult } = this.props.project;
		const { staffCorpRoleResult } = this.props.staff;
		const {
			workerList,
			treeNodeLoading,
			treeSelectedKeys,
			defaultExpandedKeys,
			createMemberFormVisible,
			projectId,
			detailModalVisible,
			createMemberFormConfirmLoading,
			memberDetail,
			editMemberFormVisible,
			editMemberFormConfirmLoading,
			editMemberData
		} = this.state;
		const treeData = [{ title: '全部', value: 0, children: membersTreeResult.data.items }];
		const tableDataSource = workerList.items.map((item) => {
			let { userInfo = {} } = item;
			if (!userInfo) userInfo = {};
			return {
				key: item.user_id,
				id: item.id,
				name: userInfo.name,
				work_no: item.work_no,
				mobile: userInfo.mobile,
				role: item.role
			}
		});
		const tableColumns = [
			{
				title: '工号',
				dataIndex: 'work_no',
				key: 'work_no'
			},
			{
				title: '姓名',
				dataIndex: 'name',
				key: 'name',
				render: (text, record) => {
					return (
						<span>
							<label style={{ marginRight: 8 }}>{text}</label>
							<Tag>{ROLELABEL[record.role]}</Tag>
						</span>
					);
				}
			},
			{
				title: '电话',
				dataIndex: 'mobile',
				key: 'mobile'
			},
			{
				title: '操作',
				key: 'action',
				render: (text, record) => {
					const { role, user_id } = staffCorpRoleResult;
					let canMutation = false;
					if (record.role === ROLES.worker && role === ROLES.contractor) {
						canMutation = true;
					} else if (record.role === ROLES.contractor) {
						if ([ROLES.pm, ROLES.subpm].includes(role) && record.group_id === user_id) {
							canMutation = true;
						} else if ([ROLES.master, ROLES.submaster].includes(role)) {
							canMutation = true;
						}
					}
					return (
						<span>
							<Button type="link" onClick={() => this.onViewDetail(record)}>
								详情
							</Button>
							{jurisdiction && canMutation && (
								<React.Fragment>
									<Button type="link" onClick={() => this.onEditMember(record)}>
										编辑
									</Button>
									<Button type="link" onClick={() => this.onRemoveMember(record)}>
										删除
									</Button>
								</React.Fragment>
							)}
						</span>
					);
				}
			}
		];
		return (
			<Card
				title="成员组织架构"
				className={styles.cardPanel}
				extra={!membersTreeResult.pending && membersTreeResult.data.items.length ? this.renderActions() : ''}
			>
				<Spin spinning={membersTreeResult.pending || false}>
					<div className={styles.layout}>
						<div className={styles.sider}>
							<Tree.DirectoryTree
								blockNode={true}
								defaultExpandedKeys={defaultExpandedKeys}
								selectedKeys={treeSelectedKeys}
								onSelect={this.onMembersTreeSelected.bind(this)}
								treeData={treeData}
							/>
						</div>
						<div className={styles.content}>
							<Table
								columns={tableColumns}
								dataSource={tableDataSource}
								loading={treeNodeLoading && !membersTreeResult.pending}
							/>
						</div>
					</div>
				</Spin>
				<CreateForm
					projectId={projectId}
					confirmLoading={createMemberFormConfirmLoading}
					wrappedComponentRef={this.createFormRef.bind(this)}
					visible={createMemberFormVisible}
					onCreate={this.onMemberCreate.bind(this)}
					onCancel={this.onMemberCreateCancel.bind(this)}
				/>
				<EditForm
					projectId={projectId}
					memberData={editMemberData}
					visible={editMemberFormVisible}
					confirmLoading={editMemberFormConfirmLoading}
					wrappedComponentRef={this.editFormRef.bind(this)}
					onEditSave={this.onMemberEditSave.bind(this)}
					onCancel={this.onMemberEditFormCancel.bind(this)}
				/>
				<Modal
					footer={[
						<Button type="primary" onClick={this.onViewDetailClose.bind(this)}>
							确定
						</Button>
					]}
					style={{ top: 30 }}
					onCancel={this.onViewDetailClose.bind(this)}
					onOk={this.onViewDetailClose.bind(this)}
					visible={detailModalVisible}
					title={memberDetail.userInfo.name}
				>
					<Descriptions title="基本信息" column={2}>
						<Descriptions.Item label="姓名">{memberDetail.userInfo.name}</Descriptions.Item>
						<Descriptions.Item label="手机号码">{memberDetail.userInfo.mobile}</Descriptions.Item>
						<Descriptions.Item label="角色">{ROLELABEL[memberDetail.role]}</Descriptions.Item>
						{memberDetail.userInfo.email && (
							<Descriptions.Item label="邮箱">{memberDetail.userInfo.email}</Descriptions.Item>
						)}
						<Descriptions.Item label="每日生活费">{memberDetail.day_cost} 元</Descriptions.Item>
						<Descriptions.Item label="每日工资">{memberDetail.salary} 元</Descriptions.Item>
						<Descriptions.Item label="状态">{memberDetail.status_label}</Descriptions.Item>
					</Descriptions>
					<Divider dashed />
					<h3>紧急联系人</h3>
					<Table
						bordered
						size="small"
						columns={[
							{ title: '姓名', dataIndex: 'name' },
							{ title: '关系', dataIndex: 'relation' },
							{ title: '电话号码', dataIndex: 'mobile' }
						]}
						dataSource={memberDetail.userInfo.contacts}
					/>
				</Modal>
			</Card>
		);
	}
}
export default Workers;
