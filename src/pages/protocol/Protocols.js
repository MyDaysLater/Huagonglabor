import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Table, PageHeader, Button, message, Modal, Switch, Select, Input } from 'antd';
import Page from '../../components/Page';
import { Link } from 'react-router-dom';
import { getProtocols, deleteProtocol, startUpProtocol, getagreement_type, updateProtocol } from '../../services/protocol';

@inject('app')
@observer
class Protocols extends Component {
	state = {
		loading: true,
		dataSource: [],
		type_items: [],
		se_input: [
			{
				value: 'a',
				title: '项目'
			},
			{
				value: 'b',
				title: '人员'
			},
			{
				value: 'c',
				title: '身份'
			}
		],
		value_select: '',
		corpid: '',
		type_show: false,
		pagination: {}
	};
	constructor(props) {
		super(props);
		const { corpid } = props.match.params;
		this.state.corpid = corpid;
	}
	componentDidMount() {
		this.getData();
		this.get_type();
	}
	async getData(page = 1) {
		this.setState({ loading: true });
		const { errCode, errMsg, data } = await getProtocols({
			'filter[corp_id]': this.state.corpid
		});
		this.setState({ loading: true });
		if (errCode) {
			message.error(errMsg);
			return;
		}
		const { items = [], _meta } = data;
		this.setState({
			dataSource: items,
			pagination: {
				current: page,
				total: _meta.totalCount,
				onChange: (page) => {
					this.getData(page);
				}
			},
			loading: false
		});
	}
	async get_type() {
		const { errCode, errMsg, data } = await getagreement_type();
		if (errCode) {
			message.error(errMsg);
			return;
		}
		this.setState({
			type_items: data.items
		})
	}

	onRemove(id) {
		Modal.confirm({
			title: '提示',
			content: '确定删除该协议吗？',
			onOk: async () => {
				const { errCode, errMsg } = await deleteProtocol(id);
				if (errCode) {
					message.error(errMsg);
					return;
				}
				message.success('删除成功');
				this.getData(this.state.pagination.current);
			}
		});
	}
	onSwitchItem(index) {
		let { dataSource } = this.state;
		const item = dataSource[index];
		Modal.confirm({
			title: '提示',
			content: `是否要${item.status ? '关闭' : '启用'}此协议？`,
			onOk: async () => {
				const { errCode, errMsg } = await startUpProtocol(item.id);
				if (errCode) {
					message.error(errMsg);
					return;
				}
				const checkedItemIndex = dataSource.findIndex((item) => !!item.status);
				if (checkedItemIndex > -1 && checkedItemIndex !== index) {
					dataSource[checkedItemIndex].status = 0;
					dataSource.splice(checkedItemIndex, 1, dataSource[checkedItemIndex]);
				}
				item.status = !item.status;
				dataSource.splice(index, 1, item);
				this.setState({ dataSource });
			}
		});
	}

	async wx_show(record) {
		let { dataSource } = this.state;
		let { is_login_show, id } = record;
		const { errCode, errMsg } = await updateProtocol(id, {
			is_login_show: is_login_show === 1 ? 0 : 1
		});
		if (errCode) {
			message.error(errMsg);
			return;
		}
		this.getData();
		// const item = dataSource[index];
		// Modal.confirm({
		// 	title: '提示',
		// 	content: `是否要在小程序${item.status ? '不显示' : '显示'}？`,
		// 	onOk: async () => {
		// 		const { errCode, errMsg } = await startUpProtocol(item.id);
		// 		if (errCode) {
		// 			message.error(errMsg);
		// 			return;
		// 		}
		// 		const checkedItemIndex = dataSource.findIndex((item) => !!item.status);
		// 		if (checkedItemIndex > -1 && checkedItemIndex !== index) {
		// 			dataSource[checkedItemIndex].status = 0;
		// 			dataSource.splice(checkedItemIndex, 1, dataSource[checkedItemIndex]);
		// 		}
		// 		item.status = !item.status;
		// 		dataSource.splice(index, 1, item);
		// 		this.setState({ dataSource });
		// 	}
		// });
	}
	input_value(e) {
		console.log(e)
	}
	render() {
		const { mainPath } = this.props.app;
		const { dataSource, pagination, loading, type_items, se_input, value_select } = this.state;
		const columns = [
			{
				key: 'title',
				dataIndex: 'title',
				align: 'center',
				title: '标题',
				render: (text, record) => {
					return <Link to={`${mainPath}/protocols/detail/${record.id}`}>{text}</Link>;
				}
			},
			{
				key: 'updatedAt',
				dataIndex: 'updated_at',
				align: 'center',
				title: '最近更新'
			},
			{
				key: 'status',
				dataIndex: 'status',
				align: 'center',
				title: '状态',
				render: (text, record, index) => {
					return <Switch onClick={() => this.onSwitchItem(index)} checked={!!record.status} checkedChildren="开启" unCheckedChildren="关闭" />;
				}
			},
			{
				key: 'wx_show',
				dataIndex: 'wx_show',
				align: 'center',
				title: '是否在小程序端显示',
				render: (text, record, index) => {
					return <Switch onClick={() => this.wx_show(record)} checkedChildren="是" unCheckedChildren="否" checked={!!record.is_login_show} />;
				}
			},
			{
				key: 'actions',
				align: 'center',
				title: '操作',
				render: (text, record) => {
					return (
						<div>
							<Button type="link">
								<Link to={`${mainPath}/protocols/edit/${record.id}`}>编辑</Link>
							</Button>
							<Button type="link" onClick={() => this.onRemove(record.id)}>
								删除
							</Button>
						</div>
					);
				}
			}
		];
		return (
			<Page>
				<PageHeader title="协议管理" />
				<Page.Content>
					<Page.Content.Panel>
						<Button type="primary" style={{ marginRight: '20px' }}>
							<Link to={`${mainPath}/protocols/create`}>新增协议</Link>
						</Button>
						<Button type="primary" onClick={() => {
							this.setState({
								type_show: true
							})
						}}>
							协议分类
						</Button>
						{/* <Input.Group compact>
							<Select defaultValue={se_input[0].value} onChange={(value, option) => {
								console.log(value)
								this.setState({
									value_select: value
								})
							}}>
								{
									se_input.map(item => {
										return <Select.Option value={item.value}>{item.title}</Select.Option>
									})
								}
							</Select>
							<Input onChange={(e) => {
								this.input_value(e);
							}} style={{ width: '50%' }} placeholder="fhjashha" />
						</Input.Group> */}
					</Page.Content.Panel>
					<Page.Content.Panel style={{ marginTop: 15 }}>
						<Table
							pagination={pagination}
							loading={loading}
							bordered
							dataSource={dataSource}
							columns={columns}
							rowKey={(item) => item.id}
						/>
					</Page.Content.Panel>
					<Modal
						title="协议分类"
						visible={this.state.type_show}
						onOk={() => {
							this.setState({
								type_show: false
							})
						}}
						onCancel={() => {
							this.setState({
								type_show: false
							})
						}}
					>
						{
							type_items.map((item, index) => {
								return (
									<p key={item.id} >{index + 1 + '、'}{item.name}</p>
								)
							})
						}
					</Modal>
				</Page.Content>
			</Page >
		);
	}
}

export default Protocols;
