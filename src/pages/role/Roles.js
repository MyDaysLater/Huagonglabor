import React, { Component } from 'react';
import Page from '../../components/Page';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { PageHeader, Button, Table, message, Modal } from 'antd';
import { getRoles, deleteRole } from '../../services/role';
@inject('app')
@observer
class Roles extends Component {
	state = {
		loading: true,
		dataSource: [],
		deleteConfirmLoading: false,
		pagination: {}
	};
	constructor(props) {
		super(props);
		const { corpid } = props.match.params;
		this.state.corpid = corpid;
	}
	componentDidMount() {
		this.getRolesData();
	}
	async getRolesData(page = 1) {
		const { corpid } = this.state;
		this.setState({ loading: true });
		const { errCode, errMsg, data } = await getRoles({ 'filter[corp_id]': corpid, 'filter[role][neq]': 'normal', page });
		this.setState({ loading: false });
		if (errCode) {
			message.error(errMsg);
			return;
		}
		let { items, _meta } = data;
		const pagination = { current: _meta.currentPage, pageSize: _meta.perPage, total: _meta.totalCount };
		items = items.map((item) => {
			item.key = item.id;
			return item;
		});
		this.setState({
			dataSource: items.filter(item => item.role !== 'master'),
			pagination
		});
	}
	onDelete(item) {
		const { deleteConfirmLoading } = this.state;
		Modal.confirm({
			title: '提示',
			content: '是否删除该角色？',
			confirmLoading: deleteConfirmLoading,
			onOk: async () => {
				// 删除
				this.setState({ deleteConfirmLoading: true });
				const { errCode } = await deleteRole({ ids: item.id });
				this.setState({ deleteConfirmLoading: false });
				if (errCode) {
					message.error('删除失败');
					return;
				}
				const { _meta } = this.state;
				message.success('删除成功');
				this.getRolesData(_meta.currentPage);
			}
		});
	}
	render() {
		const { mainPath } = this.props.app;
		const { authorize, jurisdiction } = this.props;
		console.log(this.props);
		const { dataSource, pagination, loading } = this.state;
		const columns = [
			{
				key: 'name',
				dataIndex: 'name',
				title: '角色名称'
			}
		];
		if (jurisdiction) {
			columns.push({
				key: 'actions',
				title: '操作',
				width: 180,
				render: (record) => {
					return (
						<div>
							<Link style={{ marginRight: 10 }} to={`${mainPath}/roles/edit/${record.id}`}>
								编辑
							</Link>
							<Button onClick={() => this.onDelete(record)} type="link">
								删除
							</Button>
						</div>
					);
				}
			});
		}
		return (
			<Page>
				<PageHeader
					onBack={() => this.props.history.goBack()}
					title="角色管理" />
				<Page.Content>
					<Page.Content.Panel>
						<Table
							title={
								jurisdiction ?
									(() => (
										<Button type="primary">
											<Link to={`${mainPath}/roles/create`}>新增角色</Link>
										</Button>
									)) : (() => {

									})
							}
							loading={loading}
							pagination={pagination}
							bordered
							dataSource={dataSource}
							columns={columns}
						/>
					</Page.Content.Panel>
				</Page.Content>
			</Page>
		);
	}
}

export default Roles;
