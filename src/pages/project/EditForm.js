import React, { Component } from 'react';
import { Form, Input, Cascader, Button, message, Alert, Upload, Progress, Modal, DatePicker, TreeSelect } from 'antd';
import BraftEditor from 'braft-editor';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { genTree, getProvince, getCity, getArea } from '../../utils/region';
import projectService from '../../services/project';
import { dict_select } from "../../services/dict";
import Uploader from '../../services/uploader';
import { detail } from '../../services/corp';
import moment from "moment";
@inject('app')
@inject('project')
@observer
class EditForm extends Component {
	state = {
		regionTree: [],
		corps: [],
		id: '',
		project: {},
		submitLoading: false,
		fileList: [],
		corp_info: {},
		treeData: {
			category: {
				value: [],
				id: 399
			},
			prj_status: {
				value: [],
				id: 413
			},
			area_code: {
				value: [],
				id: 33
			},
		},
	};
	constructor(props) {
		super(props);
		this.state.regionTree = genTree();
		const { id } = props;
		const { corpid } = props.match.params;
		this.state.corpid = corpid;
		this.state.id = id;
		this.state.editorState = BraftEditor.createEditorState('<p> </p>');
	}
	async componentDidMount() {
		const { id } = this.state;
		const { data } = this.props.project.listResult;
		this.git_list();
		this.get_dictdata();
		let project;
		let fileList = [];
		if (id && !data.items.length) {
			const { errCode, errMsg, data } = await projectService.detail(id);
			if (errCode) {
				message.error(errMsg);
				return;
			}
			console.log(data)
			project = data;
		} else if (data.items.length) {
			project = data.items.find((item) => item.id === id) || {};
		}
		if (project.attachments && project.attachments.length) {
			fileList = project.attachments.map((item) => {
				item.uid = item.id;
				return item;
			});
		}
		const editorState = BraftEditor.createEditorState(project.description);
		this.setState({ project, editorState, fileList });
	}
	async get_dictdata() {
		let {
			treeData
		} = this.state;
		for (let item in treeData) {
			treeData[item].value = await dict_select(treeData[item].id);
		}
		this.setState({
			treeData,
		})
	}
	async git_list() {
		const { errCode, errMsg, data } = await detail(this.state.corpid);
		if (errCode) {
			message.error(errMsg);
			return;
		}
		this.setState({
			corp_info: data
		})
	}
	date_change(key, a, dates) {
		let { project } = this.state;
		project[key] = dates
		this.setState({
			project,
		});
	}
	onSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			// values.complete_date = moment(values.complete_date);
			// values.start_date = moment(values.start_date);
			if (!err) {
				console.log(values)
				// values.start_date = this.state.project.start_date;
				// values.complete_date = this.state.project.complete_date;
				const { currentCorp } = this.props.app;
				let { id, editorState, fileList, corpid, corp_info } = this.state;
				const { name, address, region, complete_date, start_date, build_corp_code, category, prj_status,
					area_code, } = values;
				const [area_code_province, area_code_city, area_code_area] = area_code;
				const [province, city, area] = region;
				const [province_label, city_label, area_label] = [
					getProvince(province),
					getCity(city),
					getArea(area)
				];
				const description = editorState.toHTML();

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
				const formData = {
					contractor_corp_code: corp_info.corp_code,
					contractor_corp_name: corp_info.name,
					corp_id: currentCorp.id,
					province,
					province_label,
					city,
					city_label,
					area,
					area_label,
					name,
					address,
					description,
					complete_date: moment(complete_date).format("YYYY-MM-DD"),
					start_date: moment(start_date).format("YYYY-MM-DD"),
					build_corp_code,
					category,
					prj_status,
					area_code: area_code_area,
					builder_licenses: [],
					attachments: uploadedFiles.join(',')
				};
				this.setState({ submitLoading: true });
				const { errCode, errMsg } = await (id
					? projectService.update(id, formData)
					: projectService.create(formData));
				this.setState({ submitLoading: false });
				if (errCode) {
					message.error(errMsg);
					return;
				}
				message.success('提交成功');
				this.props.history.goBack();
			}
		});
	}
	onEditorChange(editorState) {
		this.setState({ editorState, description: editorState.toText() });
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
		const { authorize, jurisdiction } = this.props;
		let {
			regionTree,
			project = {},
			submitLoading,
			editorState,
			fileList,
			fileUploadProgress,
			isUploading
		} = this.state;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 6 },
				md: { span: 4 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 16 },
				md: { span: 18 }
			}
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0
				},
				sm: {
					span: 22,
					offset: 4
				}
			}
		};
		return (
			<Form {...formItemLayout} onSubmit={this.onSubmit.bind(this)}>
				<Form.Item label="项目名称">
					{getFieldDecorator('name', {
						initialValue: project.name || '',
						rules: [
							{
								required: true,
								message: '请输入项目名称'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="项目地区">
					{getFieldDecorator('region', {
						initialValue: [project.province, project.city, project.area],
						rules: [{ type: 'array', required: true, message: '请选择地区' }]
					})(<Cascader options={regionTree} placeholder="选择地区" />)}
				</Form.Item>
				<Form.Item label="详细地址">
					{getFieldDecorator('address', {
						initialValue: project.address || '',
						rules: [
							{
								required: true,
								message: '请输入详细地址'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="项目分类">
					{getFieldDecorator('category', {
						initialValue: project.category,
						rules: [
							{
								required: true,
								message: '请输入项目分类'
							}
						]
					})(<TreeSelect
						style={{ width: '100%' }}
						dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
						treeData={this.state.treeData.category.value}
						placeholder='请选择'
						treeDefaultExpandAll
					/>)}
				</Form.Item>
				<Form.Item label="项目状态">
					{getFieldDecorator('prj_status', {
						initialValue: project.prj_status,
						rules: [
							{
								required: true,
								message: '请输入项目状态'
							}
						]
					})(<TreeSelect
						style={{ width: '100%' }}
						dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
						treeData={this.state.treeData.prj_status.value}
						placeholder='请选择'
						treeDefaultExpandAll
					/>)}
				</Form.Item>
				<Form.Item label="项目所在地">
					{getFieldDecorator('area_code', {
						initialValue: ['', '', project.area_code],
						rules: [{ type: 'array', required: true, message: '请选择地区' }]
					})(<Cascader options={regionTree} placeholder="请选择" />)}
				</Form.Item>
				{/* 新增数据 */}
				<Form.Item label="信用代码">
					{getFieldDecorator('build_corp_code', {
						initialValue: project.build_corp_code,
						rules: [
							{
								required: true,
								message: '请输入信用代码'
							}
						]
					})(<Input />)}
				</Form.Item>
				<Form.Item label="开工日期">
					{getFieldDecorator('start_date', {
						initialValue: project.start_date || moment(),
						rules: [
							{
								required: true,
								message: '请输入开工日期'
							}
						]
					})(<DatePicker onChange={this.date_change.bind(this, 'start_date')} placeholder='选择时间' />)}
				</Form.Item>
				<Form.Item label="竣工日期">
					{getFieldDecorator('complete_date', {
						initialValue: project.complete_date || moment(),
						rules: [
							{
								required: true,
								message: '请输入竣工日期'
							}
						]
					})(<DatePicker onChange={this.date_change.bind(this, 'complete_date')} placeholder='选择时间' />)}
				</Form.Item>

				<Form.Item label="简介">
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
				{jurisdiction && (
					<Form.Item {...tailFormItemLayout}>
						<Button loading={submitLoading} type="primary" htmlType="submit">
							提交
						</Button>
					</Form.Item>
				)}
			</Form>
		);
	}
}

export default Form.create({ name: 'editProjectForm' })(withRouter(EditForm));
