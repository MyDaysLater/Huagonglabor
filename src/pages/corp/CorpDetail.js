import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { PageHeader, Descriptions, Divider, Button, Modal, Tag, Input, message } from 'antd';
import Page from '../../components/Page';
import useCorp from '../../services/corp';
import { getRegion } from '../../utils/region';

const { Content } = Page;
@inject('app')
@observer
class CorpDetail extends Component {
	state = {};
	constructor(props) {
		super(props);
		const { corpid } = props.match.params;
		this.state.corpid = corpid;
	}
	onEditClick() {
		const { mainPath } = this.props.app;

		this.props.history.push(`${mainPath}/corp/edit`);
	}
	onDeleteClick() {
		const { corpid } = this.state;
		Modal.confirm({
			title: '删除企业',
			content: (
				<div>
					输入 <Tag>DELETE</Tag> 确认删除
					<Input
						style={{ marginTop: 15 }}
						placeholder="输入 DELETE"
						required
						className="has-error"
						onInput={(e) => {
							this.setState({ confirmDeleteCorp: e.target.value === 'DELETE' });
						}}
					/>
				</div>
			),
			okType: 'danger',
			onOk: async () => {
				const { confirmDeleteCorp } = this.state;
				if (!confirmDeleteCorp) {
					message.error('输入验证有误');
					return Promise.reject();
				}
				const { errCode, errMsg } = await useCorp.remove(corpid);
				if (errCode) {
					message.error(errMsg);
					return;
				}
				message.success('删除成功');
				this.props.history.replace('/corps');
			}
		});
	}
	render() {
		const { currentCorp } = this.props.app;
		const { authorize, jurisdiction } = this.props;
		console.log(jurisdiction)
		return (
			<Page>
				<PageHeader title="企业信息" />
				<Content>
					<Content.Panel>
						<Descriptions title="基本信息">
							<Descriptions.Item label="企业名称">{currentCorp.name}</Descriptions.Item>
							<Descriptions.Item label="营业执照">
								{currentCorp.license ? (
									<a target="_blank" rel="noopener noreferrer" href={currentCorp.license}>
										查看
									</a>
								) : (
										'无'
									)}
							</Descriptions.Item>
							<Descriptions.Item label="企业地址">{`${getRegion(
								currentCorp.province,
								currentCorp.city,
								currentCorp.area
							)} ${currentCorp.address}`}</Descriptions.Item>
						</Descriptions>
						<Divider dashed />
						<Descriptions title="企业联系人">
							<Descriptions.Item label="姓名">{currentCorp.contact_name}</Descriptions.Item>
							<Descriptions.Item label="电话">{currentCorp.contact_mobile}</Descriptions.Item>
							<Descriptions.Item label="邮箱">{currentCorp.contact_email}</Descriptions.Item>
						</Descriptions>
						{jurisdiction && (
							<div>
								<Divider dashed />
								<Button onClick={this.onEditClick.bind(this)} type="primary">
									修改企业信息
								</Button>
								<Button
									onClick={this.onDeleteClick.bind(this)}
									style={{ marginLeft: 20 }}
									type="danger"
								>
									{authorize.role.type !== 'master' ? '退出企业' : '删除企业'}
								</Button>
							</div>
						)}
					</Content.Panel>
				</Content>
			</Page>
		);
	}
}

export default CorpDetail;
