import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { PageHeader, Form, Button, Input, List, Tag, Avatar, Modal, message, Popover, Icon } from 'antd';
import Page from '../../components/Page';
import { staffService } from '../../services';
import { ROLES } from '../../constants';
const IconFont = Icon.createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_1945915_2xopsfhm2ch.js',
});
@inject('app')
@inject('staff')
@inject('user')
@observer
class Staffs extends Component {
	state = {
		page: 1,
		edit_password: false,
		password: '',
		edit_id: ''
	};
	constructor(props) {
		super(props);
		const { page } = props.match.params;
		this.state.page = page || 1;
	}
	componentDidMount() {
		this.getStaffList();
	}
	onDeleteStaff(item) {
		if (item.memberProject.length > 0) {
			Modal.info({
				title: '提示',
				content: '该员工在项目中担任了管理角色，请在项目中删除该员工。'
			});
			return;
		}
		Modal.confirm({
			title: '提示',
			content: `确定删除员工【${item.userInfo.name}】吗?`,
			onOk: async () => {
				const { errCode } = await staffService.remove(item.id);
				if (errCode) {
					message.error('删除失败');
					return;
				}
				message.success('删除成功');
				this.getStaffList();
			}
		});
	}
	onEditStaff(item) {
		const { mainPath } = this.props.app;
		this.props.history.push(`${mainPath}/staffs/edit/${item.id}`);
	}
	onTransfer(item) {
		const { mainPath } = this.props.app;
		this.props.history.push(`${mainPath}/staffs/transfer/${item.user_id}`);
	}
	getStaffList() {
		const { page } = this.state;
		this.props.staff.list({
			'filter[corp_id]': this.props.app.currentCorp.id,
			'filter[role][neq]': ROLES.contractor,
			expand: 'memberProject,userInfo,corpRole,projects',
			page
		});
	}
	onPageChange(page) {
		this.setState({ page });
		this.getStaffList();
	}
	onSearchInputChange(e) {
		this.setState({ keyword: e.currentTarget.value });
	}
	onSearch() {
		const { keyword } = this.state;
		this.setState({ page: 1 });
		if (keyword) {
			this.props.staff.list({
				a: 'search',
				'filter[corp_id]': this.props.app.currentCorp.id,
				'filter[role][neq]': ROLES.contractor,
				expand: 'memberProject,userInfo.projects,corpRole',
				keyword
			});
		} else {
			this.getStaffList();
		}

	}
	renderActions(item) {
		const { authorize, jurisdiction } = this.props;
		let actions = [];
		if (jurisdiction) {
			if (item.role !== 'master') {
				actions.push(
					<Button onClick={() => {
						this.setState({
							edit_password: true,
							edit_id: item.id
						})
					}} type="link" key="list-edit">
						修改密码
					</Button>,
					<Button onClick={() => this.onEditStaff(item)} type="link" key="list-edit">
						编辑
					</Button>,
					<Button onClick={() => this.onDeleteStaff(item)} type="link" key="list-remove">
						删除
					</Button>
				);
			} else if (authorize.role.type === 'master') {
				actions.push(
					<Button onClick={() => this.onTransfer(item)} type="link" key="list-edit">
						超管移交
					</Button>
				);
			}
		}
		return actions;
	}
	async onok(id) {
		let isStrongPassword = true;
		var patrn = /^(\w){6,20}$/;
		if (!patrn.exec(this.state.password)) {
			isStrongPassword = false;
			message.error('密码格式错误');
		} else {
			const { errCode, data } = await staffService.update(id, {
				password: this.state.password
			});
			if (errCode) {
				message.error(data.message);
				return;
			}
			this.setState({
				edit_password: false
			})
			this.props.user.fetchUserInfo();
			message.success('提交成功');
		}
	}
	pass(e) {
		this.setState({
			password: e.currentTarget.value
		})
	}
	render() {
		const { staff, app, authorize, jurisdiction } = this.props;
		const { listResult } = staff;
		const { mainPath } = app;
		return (
			<Page>
				<PageHeader title="员工管理" />
				<Page.Content>
					<Page.Content.Panel>
						<Form layout="inline">
							{jurisdiction && (
								<Form.Item>
									<Button type="primary">
										<Link to={`${mainPath}/staffs/create`}>添加员工</Link>
									</Button>
								</Form.Item>
							)}
							<Form.Item>
								<Input allowClear onChange={this.onSearchInputChange.bind(this)} placeholder="姓名" />
							</Form.Item>
							<Form.Item>
								<Button onClick={this.onSearch.bind(this)}>搜索</Button>
							</Form.Item>
							{jurisdiction && (
								<Form.Item style={{ float: "right" }}>
									<Button type="primary">
										<IconFont type='iconshezhi' />
										<Link to={`${mainPath}/roles`} style={{ color: 'white', marginLeft: '5px' }}>添加角色</Link>
									</Button>
								</Form.Item>
							)}
						</Form>
					</Page.Content.Panel>
					<Modal
						title="修改密码"
						visible={this.state.edit_password}
						onOk={() => { this.onok(this.state.edit_id) }}
						onCancel={() => {
							this.setState({
								edit_password: false
							})
						}}
					>
						<Input onChange={this.pass.bind(this)} placeholder="输入密码" />
					</Modal>
					<Page.Content.Panel style={{ marginTop: 15 }}>
						<List
							loading={listResult.pending || false}
							itemLayout="horizontal"
							pagination={{
								onChange: this.onPageChange.bind(this),
								pageSize: listResult.data._meta.perPage || 20
							}}
							dataSource={listResult.data.items}
							renderItem={(item) => (
								<List.Item actions={this.renderActions(item)}>
									<List.Item.Meta
										avatar={<Avatar icon="user" src={item.userInfo.avatar || ''} />}
										title={item.userInfo.name || item.userInfo.email}
										description={
											<div>
												<Tag color="green">{item.corpRole.name}</Tag>
												{item.memberProject && item.memberProject.length > 0 && (
													<Popover
														title="所在项目"
														content={
															<ul style={{ marginTop: 10, paddingLeft: 20 }}>
																{item.memberProject.map((p) => {
																	if (p.status === 10) {
																		return '';
																	}
																	return (
																		<li key={p.id}>
																			<Link
																				to={`${mainPath}/projects/detail/${p
																					.id}#2`}
																			>
																				{p.name}
																			</Link>
																			<span style={{ marginLeft: 10 }}>
																				{p.projectRole.name}
																			</span>
																		</li>
																	);
																})}
															</ul>
														}
													>
														<Button type="link" style={{ marginLeft: 20 }}>
															{item.memberProject.length}个项目
														</Button>
													</Popover>
												)}
											</div>
										}
									/>
								</List.Item>
							)}
						/>
					</Page.Content.Panel>
				</Page.Content>
			</Page>
		);
	}
}

export default Staffs;
