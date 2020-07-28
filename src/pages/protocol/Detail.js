import React, { Component } from 'react';
import Page from '../../components/Page';
import { PageHeader, message, Skeleton, Typography, Divider } from 'antd';
import { getProtocol } from '../../services/protocol';

class Detail extends Component {
	state = {
		loading: true,
		detail: {}
	};
	async componentDidMount() {
		const { id = '' } = this.props.match.params;
		const { errCode, errMsg, data: detail } = await getProtocol(id);
		if (errCode) {
			message.error(errMsg);
			this.props.history.goBack();
			return;
		}
		this.setState({ detail, loading: false });
	}
	render() {
		const { loading, detail } = this.state;
		return (
			<Page>
				<PageHeader onBack={() => this.props.history.goBack()} title="协议详情" />
				<Page.Content>
					<Skeleton loading={loading}>
						<Page.Content.Panel>
							<Typography.Title level={3}>{detail.title}</Typography.Title>
              <Divider dashed/>
							<div dangerouslySetInnerHTML={{ __html: detail.content }} />
						</Page.Content.Panel>
					</Skeleton>
				</Page.Content>
			</Page>
		);
	}
}

export default Detail;
