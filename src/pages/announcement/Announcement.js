import React, { Component } from 'react';
import Page from '../../components/Page';
import { PageHeader, message, Skeleton, Typography, Card, Avatar, Divider, Checkbox, Tabs, List, Icon } from 'antd';
import { getAnnouncement } from '../../services/announcement';
import styles from './Announcement.module.less';
const { Title } = Typography;
const { TabPane } = Tabs;
class Announcement extends Component {
	state = {
		announcement: { attachments: [] },
		loading: true,
		images: [],
		files: []
	};
	constructor(props) {
		super(props);
		const { id } = props.match.params;
		this.state.id = id;
	}
	async componentDidMount() {
		const { id } = this.state;
		const { errCode, errMsg, data } = await getAnnouncement(id, {
			expand: 'confirm_list'
		});
		if (errCode) {
			message.error(errMsg);
			return;
		}
		const confirmed = data.confirm_list.filter((item) => item.status === 1);
		const unConfirm = data.confirm_list.filter((item) => item.status === 0);
		const images = data.attachments.filter((item) => /image/.test(item.type));
		const files = data.attachments.filter((item) => !/image/.test(item.type));
		this.setState({ announcement: data, images, files, loading: false, confirmed, unConfirm });
	}
	render() {
		const { announcement, loading, confirmed = [], unConfirm = [], images, files } = this.state;
		return (
			<Page>
				<PageHeader onBack={() => this.props.history.goBack()} title="公告详情" />
				<Page.Content>
					<Page.Content.Panel>
						<Skeleton loading={loading}>
							<Title level={3}>{announcement.title}</Title>
							<div dangerouslySetInnerHTML={{ __html: announcement.content }} />
							<Divider />
							<Checkbox checked={announcement.need_confirm}>是否需要确认</Checkbox>
							<Divider />
							<div className={styles.imagesContainer}>
								{images.map((item, index) => (
									<Card
										key={index}
										className={styles.item}
										cover={<img alt={item.name} src={item.url} />}
									>
										<Card.Meta
											title={
												<a href={item.url} target="_blank" rel="noopener noreferrer">
												  {item.name}
												</a>
											}
										/>
									</Card>
								))}
							</div>
							<div className={styles.filesContainer}>
								{files.map((item) => (
									<div className={styles.item}>
										<a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
											<Icon type="paper-clip" /> {item.name}
										</a>
									</div>
								))}
							</div>

							<Divider />
							<Tabs defaultActiveKey="1">
								<TabPane tab="已确认" key="1">
									<List
										dataSource={confirmed}
										renderItem={(item) => (
											<List.Item>
												<List.Item.Meta
													avatar={<Avatar src={item.avatar} />}
													title={item.name}
												/>
											</List.Item>
										)}
									/>
								</TabPane>
								<TabPane tab="未确认" key="2">
									<List
										dataSource={unConfirm}
										renderItem={(item) => (
											<List.Item>
												<List.Item.Meta
													avatar={<Avatar src={item.avatar} />}
													title={item.name}
												/>
											</List.Item>
										)}
									/>
								</TabPane>
							</Tabs>
						</Skeleton>
					</Page.Content.Panel>
				</Page.Content>
			</Page>
		);
	}
}

export default Announcement;
