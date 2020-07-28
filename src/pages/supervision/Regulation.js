import React, { Component } from 'react';
import Page from '../../components/Page';
import { PageHeader, Table, Button, Modal, Form, Input, Checkbox, InputNumber, message, Select } from 'antd';
import { getRegulations, createRegulation, updateRegulation, deleteRegulation } from '../../services/supervision';

export default class Regulations extends Component {
	state = {
		editContent: '',
		editIsFine: false,
		editPenalty: 0,
		editType: 0,
		showEditModal: false,
		confirmLoading: false,
		dataLoading: true,
		items: [],
		isContentRequire: false,
		dataSource: [],
		_meta: {}
	};
	constructor(props) {
		super(props);
		const { corpid } = props.match.params;
		this.state.corpid = corpid;
	}
	componentDidMount() {
		this.getData();
	}
	async getData(page = 1) {
		const { corpid } = this.state;
		this.setState({ dataLoading: true });
		const { errCode, errMsg, data } = await getRegulations({
			'filter[corp_id]': corpid,
			page
		});
		if (errCode) {
			message.error(errMsg);
			return;
		}
		const { _meta, items } = data;
		const dataSource = items.map((item) => ({
			key: item.id,
			id: item.id,
			type: item.type,
			content: item.content,
			penalty: item.total,
			fine: item.fine
		}));
		const pagination = { current: _meta.currentPage, pageSize: _meta.perPage, total: _meta.totalCount, onChange: (page) => this.getData(page) };
		this.setState({ dataLoading: false, dataSource, pagination });
	}
	async onSave() {
		const { editContent, editIsFine, editPenalty, editType, corpid, isModify, editItemId } = this.state;
		const contentReg = /[\w\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29\u{20000}-\u{2A6D6}\u{2A700}-\u{2B734}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}]/u;
		if (!contentReg.test(editContent)) {
			this.setState({ isContentRequire: true });
			return;
		}
		const params = {
			corp_id: corpid,
			content: editContent,
			fine: editIsFine,
			total: editPenalty,
			type: editType // 0：惩罚，1：表扬
		};
		this.setState({ confirmLoading: true });
		const { errCode, errMsg } = await (isModify ? updateRegulation(editItemId, params) : createRegulation(params));
		this.setState({ confirmLoading: false });
		if (errCode) {
			message.error(errMsg);
			return;
		}
		this.setState({ showEditModal: false, editContent: '', editIsFine: false, editPenalty: 0, editType: 0 });
		this.getData();
	}
	onEdit(item) {
		this.setState({
			editItemId: item.id,
			editContent: item.content,
			editIsFine: item.fine,
			editType: item.type,
			editPenalty: item.penalty,
			showEditModal: true,
			isModify: true
		});
	}
	onDelete(item) {
		Modal.confirm({
			title: '提示',
			content: '确定要删除吗？',
			onOk: async () => {
				const { errCode } = await deleteRegulation(item.id);
				if (errCode) {
					message.error('删除失败');
					return;
				}
				this.getData();
			}
		});
	}
	closeModel() {
		this.setState({
			showEditModal: false,
			editIsFine: false,
			editContent: '',
			editPenalty: 0,
			editType: 0,
			confirmLoading: false
		});
	}
	render() {
		const {
			editIsFine,
			showEditModal,
			editContent,
			editPenalty,
			editType,
			confirmLoading,
			dataLoading,
			dataSource,
			isContentRequire,
			pagination
		} = this.state;
		const { authorize, jurisdiction } = this.props;
		const columns = [
			{
				title: '规章',
				dataIndex: 'content',
				key: 'content'
			},
			{
				title: '类型',
				dataIndex: 'type',
				key: 'type',
				render: (v) => v === 0 ? '处罚' : '表扬'
			},
			{
				title: '处罚 / 奖励',
				dataIndex: 'penalty',
				key: 'penalty'
			}
		];
		if (jurisdiction) {
			columns.push({
				title: '操作',
				key: 'actions',
				width: 200,
				render: (record) => {
					return (
						<div>
							<Button type="link" onClick={() => this.onEdit(record)} style={{ marginRight: 10 }}>
								编辑
							</Button>
							<Button type="link" onClick={() => this.onDelete(record)} style={{ color: 'red' }}>
								删除
							</Button>
						</div>
					);
				}
			})
		}
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 19 }
			}
		};
		const contentRequireError = isContentRequire
			? {
				validateStatus: 'error',
				help: '请输入内容'
			}
			: {};
		return (
			<Page>
				<PageHeader title="奖惩设置" />
				<Page.Content>
					<Page.Content.Panel>
						<Table
							title={jurisdiction && (() => (
								<Button
									type="primary"
									onClick={() => this.setState({ showEditModal: true, isModify: false })}
								>
									添加
								</Button>
							))}
							pagination={pagination}
							loading={dataLoading}
							dataSource={dataSource}
							columns={columns}
							bordered
						/>
					</Page.Content.Panel>
				</Page.Content>
				<Modal
					title="添加"
					maskClosable={false}
					visible={showEditModal}
					onCancel={this.closeModel.bind(this)}
					confirmLoading={confirmLoading}
					onOk={this.onSave.bind(this)}
				>
					<Form {...formItemLayout}>
						<Form.Item label="规章内容" {...contentRequireError} hasFeedback>
							<Input
								value={editContent}
								onChange={(e) => this.setState({ editContent: e.currentTarget.value })}
							/>
						</Form.Item>
						<Form.Item label="类型">
							<Select value={editType} onChange={(v) => this.setState({ editType: v })}>
								<Select.Option value={0}>处罚</Select.Option>
								<Select.Option value={1}>表扬</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item label={editType === 0 ? '罚款' : '奖励'}>
							<Checkbox
								checked={editIsFine}
								onChange={(e) => this.setState({ editIsFine: e.target.checked })}
							>
								是否{editType === 0 ? '罚款' : '奖励'}
							</Checkbox>
						</Form.Item>
						{editIsFine && (
							<Form.Item label={`${editType === 0 ? '罚款' : '奖励'}金额`}>
								<InputNumber
									defaultValue={editPenalty}
									onChange={(value) => this.setState({ editPenalty: value })}
									formatter={(value) => `${value}元`}
									min={0}
								/>
							</Form.Item>
						)}
					</Form>
				</Modal>
			</Page>
		);
	}
}
