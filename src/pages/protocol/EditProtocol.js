import React, { Component } from 'react';
import BraftEditor from 'braft-editor';
import Page from '../../components/Page';
import { PageHeader, Form, Input, Button, message, List, Modal, Radio, Select, Switch } from 'antd';
import { updateProtocol, createProtocol, getProtocol, getProtocolTemplates, getagreement_type } from '../../services/protocol';
import { withRouter } from 'react-router';
class EditForm extends Component {
	state = {
		editorState: BraftEditor.createEditorState('<p> </p>'),
		loading: false,
		title: '',
		submiting: false,
		templateLoading: false,
		templateVisible: false,
		templates: [],
		type_items: [],
		pagination: {},
		agreement_type_id: null,
		editorInstance: null,
		is_login_show: 0
	};
	componentDidMount() {
		const { id = '' } = this.props.match.params;
		if (id) {
			this.setState({ loading: true });
			this.getData(id);
		}
		this.get_type();
	}
	async getData(id) {
		this.setState({ loading: true });
		const { errCode, errMsg, data } = await getProtocol(id);
		if (errCode) {
			message.error(errMsg);
			this.props.history.goBack();
			return;
		}
		this.setState({
			title: data.title,
			agreement_type_id: data.agreement_type_id,
			is_login_show: data.is_login_show,
			editorState: BraftEditor.createEditorState(data.content),
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
	onEditorChange(editorState) {
		this.setState({ editorState, description: editorState.toText() });
	}
	onSave(e) {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				this.setState({ submiting: true });
				const { id = '', corpid } = this.props.match.params;
				values.corp_id = corpid;
				values.is_login_show = values.is_login_show ? 1 : 0;
				const { errCode, errMsg } = await (id
					? updateProtocol(id, values)
					: createProtocol(Object.assign({ status: 0 }, values)));
				if (errCode) {
					message.error(errMsg);
					return;
				}
				this.setState({ submiting: false });
				message.success('提交成功');
				this.props.history.goBack();
			}
		});
	}
	async openTemplates() {
		const { templates } = this.state;
		if (!templates.length) {
			this.getTemplates();
		} else {
			this.setState({ templateVisible: true })
		}
	}
	async getTemplates(page = 1) {
		this.setState({ templateLoading: true });
		const { errCode, errMsg, data } = await getProtocolTemplates({
			page
		});
		this.setState({ templateLoading: false });
		if (errCode) {
			message.error(errMsg);
			return;
		}
		const { items, _meta } = data;
		this.setState({
			templateVisible: true,
			templates: items,
			pagination: {
				current: page,
				total: _meta.totalCount,
				onChange: (page) => {
					this.getTemplates(page);
				}
			}
		});
	}
	onSelectedOk() {
		const { selectedTemplate, templates, editorInstance } = this.state;
		if (selectedTemplate) {
			const item = templates.find((item) => item.id === selectedTemplate);
			if (item) {
				const estate = BraftEditor.createEditorState(item.content);
				editorInstance.setValue(estate);
				this.setState({
					title: item.title,
					editorState: estate,
					selectedTemplate: ''
				});
			}
		}
		this.setState({ templateVisible: false });
	}
	onSelectedTemplate(e) {
		const { value } = e.target;
		this.setState({ selectedTemplate: value });
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		let { match, jurisdiction } = this.props;
		let { path } = match;
		if (typeof (jurisdiction) === 'undefined') {
			let a = path.split('/');
			let r_path = '';
			for (let i = 0; i < a.length; i++) {
				if (a[i].indexOf(':') === -1) {
					r_path = r_path + '/' + a[i];
				}
			}
			r_path = r_path.slice(1);
			var c = JSON.parse(localStorage.getItem("admin_limits"));
			for (let i in c) {
				if (r_path === c[i].name) {
					jurisdiction = c[i].ismenu;
				}
			}
		}

		const { editorState, title, submiting, templateLoading, templateVisible, pagination, templates, type_items, agreement_type_id, is_login_show } = this.state;
		return (
			<Form onSubmit={this.onSave.bind(this)}>
				<Form.Item>
					<Button
						loading={templateLoading}
						onClick={this.openTemplates.bind(this)}
						type="link"
						icon="appstore"
					>
						从模板选择
					</Button>
				</Form.Item>
				<Form.Item label="标题">
					{getFieldDecorator('title', {
						initialValue: title,
						rules: [
							{
								required: true,
								message: '请填写标题'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="协议分类">
					{getFieldDecorator('agreement_type_id', {
						initialValue: agreement_type_id,
						rules: [
							{
								required: true,
								message: '请选择协议分类'
							}
						]
					})(
						<Select allowClear>
							{
								type_items.map((item) => {
									return (
										<Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
									)
								})
							}
						</Select>
					)}
				</Form.Item>
				<Form.Item label="是否在小程序端显示">
					{getFieldDecorator('is_login_show', {
						initialValue: is_login_show,
						rules: [
							{
								required: true,
							}
						]
					})(
						<Switch onClick={(checked) => {
							let a = checked ? 1 : 0;
							this.setState({
								is_login_show: a
							}, () => {
								console.log(this.state.is_login_show)
							})
						}} checkedChildren="是" unCheckedChildren="否" checked={!!is_login_show} />
					)}
				</Form.Item>
				<Form.Item label="内容">
					{getFieldDecorator('content', {
						initialValue: editorState,
						rules: [
							{
								required: true,
								message: '请填写内容'
							}
						],
						normalize: function (editorState) {
							if (editorState.toText && !editorState.toText().length) {
								return '';
							} else if (editorState.toHTML) {
								return editorState.toHTML();
							}
							return editorState;
						}
					})(<BraftEditor ref={instance => this.setState({ editorInstance: instance })} style={{ border: '1px solid #ddd', borderRadius: 5 }} />)}
				</Form.Item>
				{jurisdiction && (
					<Form.Item>
						<Button loading={submiting} htmlType="submit" type="primary">
							提交
						</Button>
					</Form.Item>
				)}
				<Modal
					visible={templateVisible}
					title="选择模板"
					closable
					onCancel={() => this.setState({ templateVisible: false })}
					onOk={this.onSelectedOk.bind(this)}
				>
					<Radio.Group
						defaultValue=""
						onChange={this.onSelectedTemplate.bind(this)}
						style={{ display: 'block' }}
					>
						<List
							dataSource={templates}
							size="small"
							pagination={{ ...pagination, size: 'small' }}
							renderItem={(item) => (
								<List.Item>
									<Radio value={item.id}>{item.title}</Radio>
								</List.Item>
							)}
						/>
					</Radio.Group>
				</Modal>
			</Form>
		);
	}
}
const EditFormWrapper = Form.create({ name: 'editProtocolForm' })(withRouter(EditForm));
class EidtProtocol extends Component {
	render() {
		return (
			<Page>
				<PageHeader onBack={() => this.props.history.goBack()} title="编辑协议" />
				<Page.Content>
					<Page.Content.Panel>
						<EditFormWrapper />
					</Page.Content.Panel>
				</Page.Content>
			</Page>
		);
	}
}

export default EidtProtocol;
