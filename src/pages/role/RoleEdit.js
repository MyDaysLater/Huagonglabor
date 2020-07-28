import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject } from 'mobx-react';
import {
	Form,
	Input,
	PageHeader,
	Checkbox,
	Collapse,
	Button,
	Select,
	Descriptions,
	message,
	Empty,
	Skeleton,
	Tree
} from 'antd';
import Page from '../../components/Page';
import CheckboxGroup from 'antd/lib/checkbox/Group';
import { getModules, createRole, updateRole, getRoleTypes, getRole } from '../../services/role';
const { TreeNode } = Tree;
@inject('user')
class RoleForm extends Component {
	state = {
		saving: false,
		moduleLoading: true,
		dashboardAuthorize: {},
		dashboardModules: [],
		clientModules: [],
		clientAuthorize: {},
		typeLoading: true,
		roleTypes: [],
		editData: {},
		treeData: [],
		checkedKeys: [],
		checkedKeysResult: [],
	};
	constructor(props) {
		super(props);
		const { id, corpid } = props.match.params;
		this.state.id = id;
		this.state.corpid = corpid;
	}
	async componentDidMount() {
		const { id } = this.state;
		const { errCode, data } = await getRoleTypes();
		this.setState({ typeLoading: false });
		if (!errCode) {
			this.setState({ roleTypes: data.items.filter((item) => item.role !== 'master') });
		}
		this.getModuesData();
		if (id) {
			this.getRoleData();
		}
	}
	async getRoleData() {
		const { id } = this.state;
		const { errCode, errMsg, data } = await getRole(id);
		if (errCode) {
			message.error(errMsg);
			return;
		}
		const dashboardAuthorize = {};
		const { admin_limits = [] } = data;

		this.setState({
			editData: data,
			dashboardAuthorize: admin_limits,
		}, () => {
			this.get_checkedKeys(admin_limits);
		});
	}
	async getModuesData() {
		const { id: isModify } = this.state;
		this.setState({ moduleLoading: true });
		const { errCode, errMsg, data } = await getModules({
			key: 'per_item'
		});
		if (errCode) {
			message.error(errMsg);
			return;
		}
		const dashboardAuthorize = {};
		const dashboardModules = data;
		const clientModules = [];
		this.setState({ dashboardModules, clientModules, moduleLoading: false }, () => {
			this.setState({
				treeData: this.get_treeData(data)
			})
		});
	}
	onSave() {
		this.props.form.validateFieldsAndScroll(async (err, values) => {
			if (!err) {
				let { checkedKeysResult, dashboardModules } = this.state;
				let admin_limits = this.string_limits(checkedKeysResult, dashboardModules);
				this.setState({ saving: true });
				const { dashboardAuthorize, id, corpid } = this.state;
				const { name, role } = values;
				const dashboardAuthorizes = [];
				const clientAuthorizes = [];
				let params = {
					name,
					role,
					admin_limits
				};
				if (!id) {
					params.corp_id = corpid;
				}
				const { errCode, errMsg } = await (id
					? updateRole(id, params)
					: createRole(params));
				if (errCode) {
					message.error(errMsg);
					return;
				}
				this.props.user.fetchUserInfo();
				message.success(`${id ? '编辑' : '添加'}成功`);
				this.props.history.goBack();
			}
		});
	}
	string_limits(checkedKeys, dashboardModules) {
		for (let item in dashboardModules) {
			for (let item_c in checkedKeys) {
				if (dashboardModules[item].name === checkedKeys[item_c]) dashboardModules[item].ismenu = true;
			}
			if (dashboardModules[item].sub) {
				dashboardModules[item].sub = this.string_limits(checkedKeys, dashboardModules[item].sub);
			}
		}
		return dashboardModules;
	}
	get_treeData(admin_limits, treeData = [], index = 0) {
		for (let item in admin_limits) {
			treeData.push(
				{
					title: admin_limits[item].text,
					key: admin_limits[item].name,
					children: [],
				}
			)
			if (admin_limits[item].sub) {
				treeData[item].children = this.get_treeData(admin_limits[item].sub, treeData[item].children);
			}
		}
		return treeData;
	}
	get_checkedKeys(admin_limits, length = 0, name) {
		let checkedKeys = this.state.checkedKeys;
		let checkedKeys_length = 0;
		for (let item in admin_limits) {
			if (admin_limits[item].sub && admin_limits[item].ismenu) {
				++checkedKeys_length;
				length === checkedKeys_length && checkedKeys.push(name);
				this.setState({
					checkedKeys,
				})
				this.get_checkedKeys(admin_limits[item].sub, admin_limits[item].sub.length, admin_limits[item].name);
			} else if (!admin_limits[item].sub) {
				if (admin_limits[item].ismenu) {
					++checkedKeys_length;
					length === checkedKeys_length && checkedKeys.push(name);
					checkedKeys.push(admin_limits[item].name)
				}
				this.setState({
					checkedKeys,
				})
			}
		}
		return checkedKeys;
	}
	tree_check(checkedKeys, e) {
		console.log(checkedKeys, e);
		const checkedKeysResult = [...checkedKeys, ...e.halfCheckedKeys]
		this.setState({
			checkedKeys,
			checkedKeysResult
		})
	}
	renderTreeNodes = data =>
		data.map(item => {
			if (item.children) {
				return (
					<TreeNode title={item.title} key={item.key} dataRef={item}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode key={item.key} {...item} />;
		});
	render() {
		const { getFieldDecorator } = this.props.form;
		const {
			saving,
			dashboardModules,
			clientModules,
			dashboardAuthorize,
			typeLoading,
			roleTypes,
			editData,
			moduleLoading,
			treeData
		} = this.state;
		const { authorize, jurisdiction } = this.props;

		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 }
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
					offset: 4
				}
			}
		};
		return (
			<Form {...formItemLayout}>
				<Form.Item label="角色名称">
					{getFieldDecorator('name', {
						initialValue: editData.name,
						rules: [
							{
								required: true,
								message: '请输入角色名称'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="角色类型">
					{getFieldDecorator('role', {
						initialValue: editData.role,
						rules: [
							{
								required: true,
								message: '请选择角色类型'
							}
						]
					})(
						<Select placeholder="请选择" loading={typeLoading}>
							{roleTypes.map((item, i) => (
								<Select.Option key={i} value={item.role}>
									{item.name}
								</Select.Option>
							))}
						</Select>
					)}
				</Form.Item>
				<Form.Item label="角色权限" validateStatus="">
					<Collapse defaultActiveKey={['dashboard']}>
						<Collapse.Panel key="dashboard" header="管理后台权限">
							<Skeleton loading={moduleLoading}>
								{dashboardModules.length > 0 ?
									<Tree
										checkable
										checkedKeys={this.state.checkedKeys}
										onCheck={(checkedKeys, e) => {
											this.tree_check(checkedKeys, e);
										}}
									>
										{this.renderTreeNodes(treeData)}
									</Tree>
									: (
										<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
									)}
							</Skeleton>
						</Collapse.Panel>
					</Collapse>
				</Form.Item>
				{
					<Form.Item {...tailFormItemLayout}>
						<Button loading={saving} onClick={this.onSave.bind(this)} type="primary">
							提交
						</Button>
					</Form.Item>
				}
			</Form>
		);
	}
}

const RoleFormWrapper = Form.create({ name: 'roleEditForm' })(withRouter(RoleForm));

class RoleEdit extends Component {
	render() {
		const { id } = this.props.match.params;
		return (
			<Page>
				<PageHeader onBack={() => this.props.history.goBack()} title={`${id ? '编辑' : '新增'}角色`} />
				<Page.Content>
					<Page.Content.Panel>
						<RoleFormWrapper authorize={this.props.authorize} />
					</Page.Content.Panel>
				</Page.Content>
			</Page>
		);
	}
}

export default RoleEdit;
