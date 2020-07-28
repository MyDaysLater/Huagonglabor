import React, { Component } from 'react';
import Page from '../../components/Page';
import { inject, observer } from 'mobx-react';
import userService from '../../services/user';
import { PageHeader, Descriptions, Divider, Button, message } from 'antd';
import ModifyPassword from './ModifyPassword';
import ModifyInformation from './ModifyInfomation';
import { setLocalUserInfo } from '../../utils/localStoreCommon';
@inject('user')
@observer
class Infomation extends Component {
	state = {
		modifyPasswordModalVisible: false,
		modifyPasswordModalConfirmLoading: false
	};
	componentDidMount() {
		const { userInfo } = this.props.user;
		if (userInfo.id && !userInfo.name) {
			this.setState({ modifyInfoModalVisible: true });
		}
	}
	onModify() {
		this.setState({ modifyInfoModalVisible: true });
	}
	onModifyPassword() {
		this.setState({ modifyPasswordModalVisible: true });
	}
	onModifyPasswordModalClose() {
		const { form } = this.passwordFormRef.props;
		form.resetFields();
		this.setState({ modifyPasswordModalVisible: false });
	}
	onModifyInfoModalClose() {
		const { form } = this.infoFormRef.props;
		form.resetFields();
		this.setState({ modifyInfoModalVisible: false });
	}
	onSubmitInfo() {
		if (this.infoFormRef) {
			const { form } = this.infoFormRef.props;
			form.validateFields(async (err, values) => {
				if (!err) {
					const { userInfo, setUserInfo } = this.props.user;

					this.setState({ modifyInfoModalConfirmLoading: true });
					const { errCode, errMsg, data } = await userService.update(userInfo.id, values);
					this.setState({ modifyInfoModalConfirmLoading: false, modifyInfoModalVisible: false });
					if (errCode) {
						message.error(errMsg);
						return;
					}
					setUserInfo(data);
					setLocalUserInfo(data);
					message.success('更新成功');
					form.resetFields();
				}
			});
		}
	}
	onSubmitPassword() {
		if (this.passwordFormRef) {
			const { form } = this.passwordFormRef.props;
			form.validateFields(async (err, values) => {
				if (!err) {
					const { userInfo } = this.props.user;
					this.setState({ modifyPasswordModalConfirmLoading: true });
					const { errCode, errMsg } = await userService.modifyPassword({
						user_id: userInfo.id,
						password: values.password,
						new_password: values['new-password']
					});
					if (errCode) {
						message.error(errMsg);
						this.setState({ modifyPasswordModalConfirmLoading: false });
						return;
					}
					message.success('修改成功');
					form.resetFields();
					this.setState({ modifyPasswordModalVisible: false });
				}
			});
		}
	}
	savePasswordFormRef(formRef) {
		this.passwordFormRef = formRef;
	}
	saveInfoFormRef(formRef) {
		this.infoFormRef = formRef;
	}
	render() {
		const { userInfo } = this.props.user;
		console.log(userInfo)
		const {
			modifyPasswordModalVisible,
			modifyPasswordModalConfirmLoading,
			modifyInfoModalConfirmLoading,
			modifyInfoModalVisible
		} = this.state;

		return (
			<Page>
				<PageHeader onBack={() => this.props.history.goBack()} title="个人中心" />
				<Page.Content>
					<Page.Content.Panel>
						<Descriptions title="基本信息" column={3}>
							<Descriptions.Item label="用户名">{userInfo.username || '未设置'}</Descriptions.Item>
							<Descriptions.Item label="姓名">{userInfo.name || '未设置'}</Descriptions.Item>
							<Descriptions.Item label="手机号码">{userInfo.mobile || '未设置'}</Descriptions.Item>
							<Descriptions.Item>
								<Button onClick={this.onModify.bind(this)}>修改</Button>
							</Descriptions.Item>
						</Descriptions>
						<Divider dashed />
						<Descriptions title="帐号信息" column={1}>
							<Descriptions.Item label="登录账号">{userInfo.username}</Descriptions.Item>
							<Descriptions.Item>
								<Button onClick={this.onModifyPassword.bind(this)}>修改密码</Button>
							</Descriptions.Item>
						</Descriptions>
						<ModifyInformation
							wrappedComponentRef={this.saveInfoFormRef.bind(this)}
							confirmLoading={modifyInfoModalConfirmLoading}
							visible={modifyInfoModalVisible}
							onCancel={this.onModifyInfoModalClose.bind(this)}
							onSubmit={this.onSubmitInfo.bind(this)}
						/>
						<ModifyPassword
							confirmLoading={modifyPasswordModalConfirmLoading}
							wrappedComponentRef={this.savePasswordFormRef.bind(this)}
							visible={modifyPasswordModalVisible}
							onCancel={this.onModifyPasswordModalClose.bind(this)}
							onSubmit={this.onSubmitPassword.bind(this)}
						/>
					</Page.Content.Panel>
				</Page.Content>
			</Page>
		);
	}
}

export default Infomation;
