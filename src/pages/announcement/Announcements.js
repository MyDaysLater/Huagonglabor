import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { List, Button, message, Empty, Modal } from 'antd';
import { getAnnouncements, removeAnnouncement } from '../../services/announcement';
@inject('app')
@observer
class Announcements extends Component {
	state = {
		items: [],
		_meta: {
			perPage: 10,
			currentPage: 1,
			totalCount: 0
		},
		loading: true
	};
	constructor(props) {
		super(props);
		const { corpid, id } = props.match.params;
		this.state.corpid = corpid;
		this.state.projectId = id;
	}
	componentDidMount() {
		this.getAnnouncementsList();
	}
	async getAnnouncementsList(page = 1) {
		const { projectId } = this.state;
		this.setState({ loading: true });
		const { errCode, errMsg, data } = await getAnnouncements({
			'filter[corp_project_id]': projectId,
			'per-page': 10,
			page
		});
		if (errCode) {
			message.error(errMsg);
			return;
		}
		this.setState({ ...data, loading: false });
	}
	onPostClick() {
		const { corpid, projectId } = this.state;
		this.props.history.push(`/dashboard/${corpid}/projects/${projectId}/announcement/create`);
	}
	onEdit(id) {
		const { corpid, projectId } = this.state;
		this.props.history.push(`/dashboard/${corpid}/projects/${projectId}/announcement/edit/${id}`);
	}
	onDelete(id) {
		Modal.confirm({
			title: '删除',
			content: '确定删除吗？',
			onOk: async () => {
				message.loading('正在操作……');
				const { errCode, errMsg } = await removeAnnouncement(id);
				message.destroy();
				if (errCode) {
					message.error(errMsg);
					return;
				}
				message.success('删除成功');
				let { currentPage, totalCount, perPage } = this.state._meta;
				const pageCount = Math.ceil((totalCount - 1) / perPage);
				if (pageCount < currentPage) {
					currentPage = pageCount;
				}
				this.getAnnouncementsList(currentPage);
			}
		});
	}
	onView(id) {
		const { corpid, projectId } = this.state;
		this.props.history.push(`/dashboard/${corpid}/projects/${projectId}/announcement/detail/${id}`);
	}
	render() {
		const { jurisdiction } = this.props;
		const { loading, items, _meta } = this.state;
		return (
			<List
				itemLayout="vertical"
				loading={loading}
				pagination={{
					position: 'bottom',
					pageSize: _meta.perPage,
					current: _meta.currentPage,
					total: _meta.totalCount,
					onChange: () => this.getAnnouncementsList(_meta.currentPage + 1)
				}}
				header={
					jurisdiction && (
						<Button onClick={this.onPostClick.bind(this)} icon="plus" type="primary">
							发布公告
						</Button>
					)
				}
			>
				{items.map((item) => {
					const itemActions = [
						<Button onClick={() => this.onView(item.id)} icon="eye" type="link">
							查看详情
						</Button>
					];
					if (jurisdiction) {
						itemActions.push(
							<Button onClick={() => this.onEdit(item.id)} icon="edit" type="link">
								编辑
							</Button>,
							<Button
								onClick={() => this.onDelete(item.id)}
								style={{ color: 'red' }}
								icon="delete"
								type="link"
							>
								删除
							</Button>
						);
					}
					return (
						<List.Item key={item.id} actions={itemActions}>
							<List.Item.Meta title={item.title} description={`于 ${item.created_at} 发布`} />
							{item.description}
						</List.Item>
					);
				})}
				{!loading && items.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无公告" />}
			</List>
		);
	}
}

export default Announcements;
