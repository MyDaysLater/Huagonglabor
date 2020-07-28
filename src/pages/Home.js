import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Card, PageHeader, Statistic, Skeleton, Table } from 'antd';
import Page from '../components/Page';
import corpService from '../services/corp';
import { ROLES } from '../constants';

const { Content } = Page;
@inject('app')
@inject('user')
@inject('staff')
@observer
class Home extends Component {
	state = {
		info: {}
	};
	constructor(props) {
		super(props);
		props.user.fetchUserInfo()
	}
	async componentDidMount() {
		const { currentCorp } = this.props.app;
		this.setState({ infoLoading: true });
		const { errCode, data } = await corpService.dashboardInfo({
			corpId: currentCorp.id
		});
		if (errCode) {
			return;
		}
		this.setState({
			infoLoading: false,
			info: data,
			projects: data.projects
		});
	}
	render() {
		const { userInfo } = this.props.user;
		const { staffCorpRoleResult } = this.props.staff;
		const { info = {}, infoLoading, projects = [] } = this.state;
		const dataSource = projects.map((item) => ({ name: item.name, key: item.id, ...item.attendance }));
		const columns = [
			{
				title: '项目',
				dataIndex: 'name',
				key: 'name'
			},
			{
				title: '出勤人数',
				dataIndex: 'dutyCount',
				key: 'dutyCount'
			},
			{
				title: '缺勤人数',
				dataIndex: 'unDutyCount',
				key: 'unDutyCount'
			},
			{
				title: '总人数',
				dataIndex: 'workerCount',
				key: 'workerCount'
			}
		];

		return (
			<Page>
				<PageHeader title="最近概况">{userInfo.name || userInfo.email}，欢迎回来。</PageHeader>
				<Content>
					<Row gutter={24}>
						<Col span={12}>
							<Card bordered={false} title="今日考勤概况">
								<Skeleton loading={infoLoading}>
									<Table
										pagination={false}
										bordered
										size="small"
										dataSource={dataSource}
										columns={columns}
									/>
								</Skeleton>
							</Card>
						</Col>
						{staffCorpRoleResult.role !== ROLES.contractor && (
							<Col span={12}>
								<Card bordered={false} title="项目概况">
									<Skeleton loading={infoLoading}>
										<Row>
											<Col span={8}>
												<Statistic title="开工项目" value={info.processProjectCount} />
											</Col>
											<Col span={8}>
												<Statistic title="暂停项目" value={info.pausedProjectCount} />
											</Col>
											<Col span={8}>
												<Statistic title="总项目" value={info.projectCount} />
											</Col>
										</Row>
									</Skeleton>
								</Card>
							</Col>
						)}
					</Row>
				</Content>
			</Page>
		);
	}
}
export default Home;
