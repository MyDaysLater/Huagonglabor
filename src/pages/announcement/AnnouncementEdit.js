import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, PageHeader, Input, Upload, Button, Progress, Alert, message, Spin, Modal, Checkbox } from 'antd';
import BraftEditor from 'braft-editor';
import Page from '../../components/Page';
import Uploader from '../../services/uploader';
import { Beforeunload } from 'react-beforeunload';
import 'braft-editor/dist/index.css';
import { createAnnouncement, getAnnouncement, updateAnnouncement } from '../../services/announcement';
class AnnouncementEditForm extends Component {
	state = {
		fileList: [],
		title: '',
		content: '',
		fileUploadProgress: 0,
		uploadStatus: 'active',
		isUploading: false,
		isSubmit: false,
		loading: false
	};
	constructor(props) {
		super(props);
		const { corpid, id, project } = props.match.params;
		this.state.corpid = corpid;
		this.state.id = id;
		this.state.projectid = project;
		this.state.editorState = BraftEditor.createEditorState('<p> </p>');
	}
	async componentDidMount() {
		const { id } = this.state;
		if (id) {
			this.setState({ loading: true });
			const { errCode, errMsg, data } = await getAnnouncement(id);
			if (errCode) {
				message.error(errMsg);
				return;
			}
			const { title, need_confirm, content, attachments } = data;
			const editorState = BraftEditor.createEditorState(content);
			this.setState({
				title,
				need_confirm,
				editorState,
				fileList: attachments.map((item) => {
					item.uid = item.id;
					return item;
				}),
				loading: false
			});
		}
	}
	beforeUpload(file) {
		const { fileList } = this.state;
		fileList.push(file);
		this.setState({ fileList });
		return false;
	}
	onUploadFileChange({ fileList }) {
		this.setState({
			fileList
		});
	}
	onEditorChange(editorState) {
		this.setState({ editorState, content: editorState.toText() });
	}
	onSubmit() {
		this.props.form.validateFields(async (error, values) => {
			if (!error) {
				let { fileList, editorState, corpid, projectid, id } = this.state;
				let uploadedFiles = [];
				if (fileList.length) {
					const files = fileList.filter((file) => file instanceof File);
					if (files.length) {
						const uploader = new Uploader(files);
						uploader.onUploadProgress((progress) => {
							this.setState({ fileUploadProgress: progress });
						});
						this.setState({ isUploading: true, uploadStatus: 'active', isSubmit: true });
						const { errCode, data } = await uploader.upload({
							corp_id: corpid
						});
						if (errCode) {
							message.error('文件上传失败！');
							this.setState({ uploadStatus: 'exception', isSubmit: false });
							return;
						}
						const upFiles = data.files.map((item) => {
							item.uid = item.id;
							return item;
						});
						fileList = [].concat(fileList.filter((item) => item.id), upFiles);
						this.setState({
							fileList
						});
					}
					uploadedFiles = fileList.map((item) => item.id);
				}
				const { title, need_confirm } = values;
				const content = editorState.toHTML();
				const params = {
					corp_id: corpid,
					corp_project_id: projectid,
					title,
					need_confirm,
					content,
					attachments: uploadedFiles.join(',')
				};
				this.setState({ isSubmit: true });
				const { errCode, errMsg } = await (id ? updateAnnouncement(id, params) : createAnnouncement(params));
				if (errCode) {
					message.error(errMsg);
					this.setState({ isSubmit: false });
					return;
				}
				message.success('发布成功！');
				this.props.history.goBack();
			}
		});
	}
	onRemoveFile(file) {
		if (!(file instanceof File)) {
			return new Promise((resolve, reject) => {
				Modal.confirm({
					title: '删除文件',
					content: '确定删除该文件么？',
					onOk: () => {
						resolve();
					},
					onCancel: () => {
						reject();
					}
				});
			});
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		let { match, jurisdiction } = this.props;
		const {
			title,
			editorState,
			need_confirm = true,
			fileList,
			isSubmit,
			isUploading,
			fileUploadProgress,
			loading,
			id
		} = this.state;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 4 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 18 }
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
			<Spin spinning={loading}>
				<Form {...formItemLayout}>
					<Form.Item label="标题">
						{getFieldDecorator('title', {
							initialValue: title,
							rules: [
								{
									required: true,
									message: '请输入标题'
								}
							]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="内容">
						{getFieldDecorator('content', {
							initialValue: editorState,
							rules: [
								{
									required: true,
									message: '请输入内容'
								}
							],
							normalize: function (editorState) {
								if (editorState.toText) {
									return editorState.toText();
								}
								return editorState;
							}
						})(
							<BraftEditor
								style={{ border: '1px solid #ddd', borderRadius: 5 }}
								contentStyle={{ height: 'auto', minHeight: 100, paddingBottom: 0 }}
								excludeControls={['media', 'link', 'code']}
								onChange={this.onEditorChange.bind(this)}
							/>
						)}
					</Form.Item>
					<Form.Item label="确认">
						{getFieldDecorator('need_confirm', {
							valuePropName: 'checked',
							initialValue: need_confirm
						})(<Checkbox>需要确认</Checkbox>)}
					</Form.Item>
					<Form.Item label="附件">
						<Alert message="附件仅支持上传 PNG/JPG/GIF 等图片和Office/PDF 等文档。" type="warning" />
						<Upload
							multiple
							onRemove={this.onRemoveFile.bind(this)}
							accept=".png,.jpg,.jpeg,.gif,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf"
							beforeUpload={this.beforeUpload.bind(this)}
							onChange={this.onUploadFileChange.bind(this)}
							fileList={fileList}
						>
							<Button icon="plus" type="link">
								添加附件
							</Button>
						</Upload>
						{fileUploadProgress > 0 && isUploading && <Progress percent={fileUploadProgress} />}
					</Form.Item>
					<Form.Item {...tailFormItemLayout}>
						<Button onClick={this.onSubmit.bind(this)} loading={isSubmit} type="primary">
							确定{id ? '更新' : '发布'}
						</Button>
					</Form.Item>
					<Beforeunload onBeforeunload={(event) => event.preventDefault()} />
				</Form>
			</Spin>
		);
	}
}

const EditForm = Form.create({ name: 'editForm' })(withRouter(AnnouncementEditForm));

export default class AnnouncementEdit extends Component {
	render() {
		const { authorize } = this.props;
		return (
			<Page>
				<PageHeader title="发布公告" onBack={() => this.props.history.goBack()} />
				<Page.Content>
					<Page.Content.Panel>
						<EditForm authorize={authorize} />
					</Page.Content.Panel>
				</Page.Content>
			</Page>
		);
	}
}
