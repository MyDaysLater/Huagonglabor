import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout } from 'antd';
import styles from './AppLayout.module.less';
import AppWithoutSiderRoutes from './AppWithoutSiderRoutes';
import AppHeader from './components/AppHeader';
import { appName } from './config';
const { Content } = Layout;

@inject('app')
@observer
class AppWithoutSiderLayout extends Component {
	render() {
		const { currentCorp = { name: appName } } = this.props.app;
		return (
			<Layout className={styles.app}>
				<AppHeader
					title={
						<h3 style={{ float: 'left', marginLeft: -30 }}>
							<img style={{ marginRight: 10 }} src={require('./images/huagong.png')} alt="" />
							{currentCorp.name}
						</h3>
					}
					trigger={false}
				/>
				<Content>
					<AppWithoutSiderRoutes />
				</Content>
			</Layout>
		);
	}
}

export default AppWithoutSiderLayout;
