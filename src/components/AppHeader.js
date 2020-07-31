import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Layout, Avatar, Icon, Dropdown, Menu } from 'antd';
import styles from './AppHeader.module.less';
import Daohang from '../images/Apphearedimg/daohang-icon.png'
import Logo from '../images/Apphearedimg/logo.png'
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
				<img className={styles.header_daohang}
                 src={Daohang}
				></img>
                <img className={styles.header_logo} src={Logo}></img>
				<span className={styles.header_font}>欢迎，使用华工劳务通管理系统!</span>
			</Header>
		);
	}
}

export default withRouter(AppHeader);
