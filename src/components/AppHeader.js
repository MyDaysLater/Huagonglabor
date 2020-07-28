import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Layout, Avatar, Icon, Dropdown, Menu } from 'antd';
import styles from './AppHeader.module.less';
// import NoticePopover from './NoticePopover';
import { signIn } from '../routeConfig';
const { Header } = Layout;
const menuFoldKey = 'menu-fold';
@inject('app')
@inject('user')
@observer
class AppHeader extends Component {
	state = {
		menuFold: true
	};
	constructor(props) {
		super(props);
		this.state.menuFold = JSON.parse(localStorage.getItem(menuFoldKey));
		props.app.setSiderCollapse(this.state.menuFold);
	}
	componentDidMount() {
		const { userInfo } = this.props.user;
		if (userInfo.id && !userInfo.name) {
			this.props.history.push(`/ucenter`);
		}
	}
	menuTrigger() {
		const { menuFold } = this.state;
		this.setState({ menuFold: !menuFold });
		localStorage.setItem(menuFoldKey, !menuFold);
		this.props.app.setSiderCollapse(!menuFold);
	}
	handleMenuClick({ key }) {
		if (key === 'ucenter') {
			const { userInfo } = this.props.user;
			this.props.history.push(`/ucenter/${userInfo.id}`);
		}
	}
	onLogoutClick() {
		this.props.user.setSignin(false);
		this.props.history.replace(signIn);
	}
	render() {
		const { menuFold } = this.state;
		const { title = '', trigger = true } = this.props;
		const { userInfo } = this.props.user;
		const menu = (
			<Menu onClick={this.handleMenuClick.bind(this)} style={{ minWidth: 150 }}>
				<Menu.Item key="ucenter">
					<Icon type="user" />
					<span>个人中心</span>
				</Menu.Item>
				{/* <Menu.Item key="setting">
					<Icon type="setting" />
					<span>个人设置</span>
				</Menu.Item> */}
				<Menu.Divider />
				<Menu.Item key="logout" onClick={this.onLogoutClick.bind(this)}>
					<Icon type="logout" />
					<span>退出</span>
				</Menu.Item>
			</Menu>
		);
		return (
			<Header className={styles.header}>
				{trigger && (
					<div className={styles.trigger} onClick={this.menuTrigger.bind(this)}>
						<Icon type={menuFold ? 'menu-unfold' : 'menu-fold'} className={styles.icon} />
					</div>
				)}
				{title}
				<div className={styles.actions}>
					{/* <span className={styles.actionItem}>
						<Icon className={styles.menuIcon} type="question-circle" />
					</span>
					<NoticePopover>
						<span className={styles.actionItem}>
							<Badge count={0}>
								<Icon type="bell" className={styles.menuIcon} />
							</Badge>
						</span>
					</NoticePopover> */}
					<Dropdown overlay={menu}>
						<span className={styles.actionItem}>
							<Avatar icon="user" size="small" />
							<span className={styles.label}>{userInfo.name || userInfo.email}</span>
						</span>
					</Dropdown>
				</div>
			</Header>
		);
	}
}

export default withRouter(AppHeader);
