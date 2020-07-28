import React, { Component } from 'react';
import { Form, Input, Button, PageHeader, Upload, Icon, Cascader, Progress, message, Spin, Alert, TreeSelect } from 'antd';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Page from '../../components/Page';
import PageFooter from '../../components/PageFooter';
import { genTree } from '../../utils/region';
import Uploader from '../../services/uploader';
import corpService from '../../services/corp';
import { dict_select } from "../../services/dict";
const { Content, Footer } = Page;

@inject('corp')
@inject('user')
@observer
class CorpForm extends Component {
	state = {
		region: [],
		fileList: [],
		uploading: false,
		uploadStatus: '',
		isCreate: true,
		editLoading: false,
		corpInfo: {},
		selectedUploadFile: null,
		submitLoading: false,
		submitError: {},
		treeData: {
			corp_type_treeData: {
				value: [],
				id: 1
			},
		}
	};
	constructor(props) {
		super(props);
		const { corpid } = props;
		this.state.isCreate = !corpid;
		this.state.id = corpid;
		if (corpid) {
			this.state.editLoading = true;
		}
		this.state.region = genTree();
	}
	async componentDidMount() {
		const { id } = this.state;
		if (id) {
			const { errCode, errMsg, data } = await corpService.detail(id);
			if (errCode) {
				message.error(errMsg);
				return;
			}
			this.setState({
				editLoading: false,
				corpInfo: data,
				fileList: [{ uid: id, url: `${data.license}?x-oss-process=style/thumbnail`, status: 'done' }]
			});
		}
		this.get_dictdata();
	}
	async get_dictdata() {
		const { treeData } = this.state;
		for (let item in treeData) {
			treeData[item].value = await dict_select(treeData[item].id);
		}
		this.setState({
			treeData,
		})
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields(async (err, values) => {
			if (!err) {
				const { selectedUploadFile, id, fileList } = this.state;
				if (!selectedUploadFile && !fileList.length) {
					message.error('请上传营业执照', 3);
					return;
				}
				let ufile;
				this.setState({ submitLoading: true });
				if (selectedUploadFile) {
					const uploader = new Uploader([selectedUploadFile]);
					uploader.onUploadProgress((percent) => this.setState({ uploadPercent: percent }));
					this.setState({ uploading: true, uploadStatus: 'active' });
					const { errCode, data } = await uploader.upload();
					if (errCode) {
						message.error('上传文件失败');
						this.setState({ uploadStatus: 'exception', submitLoading: false });
					}
					const { url } = data.files[0];
					ufile = url;
				}
				const { region, name, contact_name, contact_mobile, contact_email, address, area_code, corp_code, corp_type, } = values;
				const [province, city, area] = region;
				const [area_code_province, area_code_city, area_code_area] = area_code;
				const formData = {
					province,
					city,
					area,
					name,
					contact_name,
					contact_mobile,
					contact_email,
					license: ufile,
					area_code: area_code_area,
					corp_code: corp_code,
					corp_type: corp_type,
					address
				};
				this.setState({ submitLoading: true });
				const { errCode, errMsg } = id
					? await corpService.update(id, {
						...formData
					})
					: await corpService.create({
						...formData
					});
				this.setState({ submitLoading: false });
				if (errCode) {
					this.setState({ submitError: { errCode, errMsg } });
					return;
				}
				message.success('提交成功');
				this.props.history.goBack();
			}
		});
	};
	beforeUpload(file) {
		this.setState({
			selectedUploadFile: file,
			fileList: [file]
		});
		return false;
	}
	onUploadRemove(file) {
		this.setState({ selectedUploadFile: null, fileList: [] });
	}
	onPreview({ url }) {
		window.open(url.substr(0, url.indexOf('?')), '_blank');
	}
	render() {
		let { form, corp, history, match, jurisdiction } = this.props;
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
		const {
			region = [],
			fileList,
			uploading,
			uploadPercent,
			uploadStatus,
			editLoading,
			corpInfo,
			selectedUploadFile,
			submitLoading,
			submitError,
			treeData,
			id
		} = this.state;
		const { getFieldDecorator } = form;
		const { createResult } = corp;
		const uploadProps = selectedUploadFile !== null || !fileList.length ? {} : { fileList: fileList };
		if (createResult.id) {
			corp.clearCreateResult();
			history.goBack();
			return <div />;
		}
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
				md: { span: 8 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
				md: { span: 10 }
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
					offset: 8
				}
			}
		};
		return (
			<Spin spinning={editLoading}>
				<Form {...formItemLayout} onSubmit={this.handleSubmit}>
					{submitError.errCode && (
						<Alert style={{ marginBottom: 15 }} message={submitError.errMsg || '提交失败'} type="error" />
					)}
					<Form.Item label="企业名称">
						{getFieldDecorator('name', {
							initialValue: corpInfo.name,
							rules: [{ required: true, message: '请输入企业名称', whitespace: true }]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="企业所在地区">
						{getFieldDecorator('region', {
							initialValue: [corpInfo.province, corpInfo.city, corpInfo.area],
							rules: [{ required: true, message: '请选择地区' }]
						})(<Cascader options={region} placeholder="请选择" />)}
					</Form.Item>
					<Form.Item label="详细地址">
						{getFieldDecorator('address', {
							initialValue: corpInfo.address,
							rules: [{ required: true, message: '请输入详细地址', whitespace: true }]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="企业联系人">
						{getFieldDecorator('contact_name', {
							initialValue: corpInfo.contact_name,
							rules: [{ required: true, message: '请输入企业联系人', whitespace: true }]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="联系人电话">
						{getFieldDecorator('contact_mobile', {
							initialValue: corpInfo.contact_mobile,
							rules: [{ required: true, message: '请输入联系电话', whitespace: true }]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="联系人邮箱">
						{getFieldDecorator('contact_email', {
							initialValue: corpInfo.contact_email,
							rules: [{ type: 'email', message: '请输入正确的邮箱' }, { required: true, message: '请输入邮箱' }]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="企业注册所在地区">
						{getFieldDecorator('area_code', {
							initialValue: ['', '', corpInfo.area_code],
							rules: [{ required: true, message: '请选择地区' }]
						})(<Cascader options={region} placeholder="请选择" />)}
					</Form.Item>
					<Form.Item label="企业统一社会信用代码">
						{getFieldDecorator('corp_code', {
							initialValue: corpInfo.corp_code,
							rules: [{ required: true, message: '请输入企业统一社会信用代码' }]
						})(<Input />)}
					</Form.Item>
					<Form.Item label="单位性质字典ID">
						{getFieldDecorator('corp_type', {
							initialValue: corpInfo.corp_type,
							rules: [{ required: true, message: '请输入单位性质字典ID' }]
						})(<TreeSelect
							style={{ width: '100%' }}
							dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
							treeData={treeData.corp_type_treeData.value}
							placeholder="请选择"
							treeDefaultExpandAll
						/>)}
					</Form.Item>
					<Form.Item label="营业执照">
						<Upload
							listType="picture-card"
							accept="image/*"
							{...uploadProps}
							onPreview={this.onPreview.bind(this)}
							onRemove={this.onUploadRemove.bind(this)}
							beforeUpload={this.beforeUpload.bind(this)}
						>
							{!fileList.length && (
								<div>
									<Icon type={'upload'} />
									<div className="ant-upload-text">上传</div>
								</div>
							)}
						</Upload>
						{uploading && <Progress percent={uploadPercent} status={uploadStatus} />}
					</Form.Item>
					{(jurisdiction || !id) && (
						<Form.Item {...tailFormItemLayout}>
							<Button type="primary" htmlType="submit" loading={submitLoading}>
								提 交
							</Button>
							<Button style={{ marginLeft: 15 }} onClick={() => history.goBack()}>
								取 消
							</Button>
						</Form.Item>
					)}
				</Form>
			</Spin>
		);
	}
}
const WrappedCorpForm = Form.create({ name: 'corpForm' })(withRouter(CorpForm));

class CorpEdit extends Component {
	render() {
		const { corpid = '' } = this.props.match.params;
		return (
			<Page>
				<PageHeader onBack={() => this.props.history.goBack()} title={`${corpid ? '编辑' : '添加'}企业`} />
				<Content>
					<Content.Panel>
						<WrappedCorpForm corpid={corpid} authorize={this.props.authorize} />
					</Content.Panel>
				</Content>
				<Footer>
					<PageFooter />
				</Footer>
			</Page>
		);
	}
}

export default CorpEdit;
