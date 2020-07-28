import React, { Component } from 'react';
import Page from '../../components/Page';
import { Card, Icon, List, Modal, Input, message, Tag, PageHeader } from 'antd';
import moment from 'moment';
import styles from './Corps.module.less';
import { inject, observer } from 'mobx-react';
import PageFooter from '../../components/PageFooter';
import corp from '../../services/corp';
import staffService from '../../services/staff';
const { Content, Footer } = Page;
@inject('corp')
@inject('app')
@inject('user')
@inject('staff')
@observer
class Corps extends Component {
	state = {
		confirmDeleteCorp: false
	};
	constructor(props) {
		super(props);
		props.corp.list();
	}
	onEditClick(item) {
		this.props.history.push(`/corps/edit/${item.id}`);
	}
	async onSwitch(item) {
		const { userInfo } = this.props.user;
		message.loading('正在切换……');
		await this.props.user.fetchUserInfo();
		const { errCode, errMsg, data } = await staffService.getUserCorpRole({
			'filter[corp_id]': item.id,
			'filter[user_id]': userInfo.id
		});
		message.destroy();
		if (errCode) {
			message.error(errMsg);
			return;
		}
		const { items } = data;
		if (items.length < 1) {
			message.error('您没有权限，请联系管理员');
			return;
		}
		this.props.staff.setCorpRole(items[0]);
		this.props.app.setCurrentCorp(item);
		this.props.history.push(`/dashboard/${item.id}`);
	}
	onCreateCorp() {
		this.props.history.push('/corps/create');
	}
	onDeleteClick(id) {
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
				const { errCode, errMsg } = await corp.remove(id);
				if (errCode) {
					message.error(errMsg);
					return;
				}
				message.success('删除成功');
				this.props.corp.list();
			}
		});
	}
	render() {
		const { listResult } = this.props.corp;
		if (!listResult.pending && !listResult.data.items.length) {
			this.onCreateCorp();
		}
		return (
			<Page>
				<PageHeader title="我的企业" />
				<Content>
					<List
						grid={{ gutter: 24, column: 3, xs: 1, sm: 2, md: 3 }}
						dataSource={listResult.data.items}
						loading={listResult.pending || false}
						renderItem={(item) => {
							const itemActions = [
								<span onClick={() => this.onSwitch(item)}>
									<Icon type="import" /> 进入
								</span>
							];
							return (
								<List.Item>
									<Card className={styles.dataCard} actions={!listResult.pending && itemActions}>
										<Card.Meta
											avatar={<Icon type="home" style={{ fontSize: 20 }} theme="twoTone" />}
											title={item.name}
											description={`创建于：${moment(item.created_at).format('YYYY年MM月DD日')}`}
										/>
									</Card>
								</List.Item>
							);
						}}
					/>
				</Content>
				<Footer>
					<PageFooter />
				</Footer>
			</Page>
		);
	}
}

export default Corps;
