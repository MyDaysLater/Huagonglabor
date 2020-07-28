import React, { Component } from 'react';
import { Menu, Icon } from 'antd';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router';
import { dashboardPath } from './routeConfig';
import { genMenus } from './menus';
import { ROLES } from './constants';
const { Item, SubMenu } = Menu;
const IconFont = Icon.createFromIconfontCN({
	scriptUrl: '//at.alicdn.com/t/font_1945915_2xopsfhm2ch.js',
});
@inject('user')
@inject('app')
@inject('staff')
@observer
class SiderMenu extends Component {
	state = {
		defaultSelectedKeys: ['index'],
		menus: [],
		corpid: '',
		defaultOpenKeys: [],
		admin_limits: [],
	};
	constructor(props) {
		super(props);
		const { userInfo } = props.user;
		const { corpLimits = {} } = userInfo;
		const { corpid } = props.match.params;
		const { admin_limits = [] } = corpLimits[corpid] || {};
		const _menus = genMenus(corpid || props.app.currentCorp.id);
		let menus = {};
		Object.values(_menus).forEach(item => {
			const _item = admin_limits.find(i => i.name === item.authKey);
			if (!_item || (_item && _item.authorize.query) || item.key === 'home') {
				menus[item.key] = item
			}
		});
		this.state.menus = menus;
		// this.state.menus = _menus;
		this.state.admin_limits = admin_limits;
		this.state.corpid = corpid || props.app.currentCorp.id;
		let flatMenus = {};
		Object.values(menus).forEach((item) => {
			if (!item.hide) {
				flatMenus[item.key] = item;
				if (item.children && item.children.length > 0) {
					item.children.forEach((child) => {
						if (!child.hide) {
							flatMenus[child.key] = child;
						}
					});
				}
			}
		});
		this.state.flatMenus = flatMenus;
	}
	componentDidMount() {
		const { pathname = '' } = this.props.location;
		const { flatMenus, corpid, defaultOpenKeys } = this.state;
		const testReg = new RegExp(`${dashboardPath}`);
		if (testReg.test(pathname)) {
			const matchs = pathname.match(`${dashboardPath}/([\\w/]*)`);
			if (matchs && matchs.length > 0) {
				const res = matchs[1];
				const homeReg = new RegExp(`${corpid}\\/?$`, 'img');
				let selectedKey = '';
				if (homeReg.test(res)) {
					selectedKey = 'home';
				} else {
					selectedKey = Object.keys(flatMenus).find((item) => new RegExp(`${item}`).test(res));
					const { children } = flatMenus[selectedKey] || {};
					if (children && children.length > 0) {
						defaultOpenKeys.push(selectedKey);
						this.setState({ defaultOpenKeys });
						const child = children.find((item) => new RegExp(`${item.key}`).test(res));
						if (child) selectedKey = child.key;
					}
				}
				if (selectedKey) {
					this.setState({ defaultSelectedKeys: [selectedKey] });
				}
			}
		}
	}
	quanxian(path, adminlist) {
		for (let i = 0; i < adminlist.length; i++) {
			if (path === adminlist[i].name) {
				return adminlist[i].ismenu;
			}
		}
	}
	render() {
		let { defaultSelectedKeys, menus, flatMenus, defaultOpenKeys = [], corpid, admin_limits } = this.state;
		const { corpRole = {} } = this.props.staff.staffCorpRoleResult;
		if (corpRole.role === ROLES.contractor) {
			menus = { home: menus.home, projects: menus.projects };
		}
		return (
			<Menu
				key={defaultSelectedKeys[0]}
				mode="inline"
				theme="dark"
				defaultOpenKeys={defaultOpenKeys}
				defaultSelectedKeys={defaultSelectedKeys}
				onSelect={(e) => {
					let { path = '' } = flatMenus[e.key] || {};
					if (!path) {
						path = flatMenus['home'].path;
					}
					this.props.history.push(path);
				}}
			>
				{Object.values(menus).map((item, index) => {
					let a = item.path.split('/');
					let r_path = '';
					for (let i = 0; i < a.length; i++) {
						if (a[i] === corpid) {
						} else {
							r_path = r_path + '/' + a[i];
						}
					}
					r_path = r_path.slice(1);
					let show_menu = this.quanxian(r_path, admin_limits);
					return (
						!item.hide && show_menu &&
						(item.children && item.children.length > 0 ? (
							<SubMenu
								key={item.key}
								title={
									<span>
										{/* <Icon type={item.icon} /> */}
										<IconFont type={item.icon} />
										{/* <i className={item.icon} style={{ fontSize: '14px', marginRight: '10px' }}></i> */}
										<span>{item.title}</span>
									</span>
								}
							>
								{item.children.map((ele) => {
									// console.log(ele)
									let a = ele.path.split('/');
									let r_path = '';
									for (let i = 0; i < a.length; i++) {
										if (a[i] === corpid) {

										} else {
											r_path = r_path + '/' + a[i];
										}
									}
									r_path = r_path.slice(1);
									let show_menu = this.quanxian(r_path, admin_limits[index].sub);
									return (
										!ele.hide && show_menu && (
											<Item key={ele.key}>
												<span>{ele.title}</span>
											</Item>
										)
									);
								})}
							</SubMenu>
						) : (
								show_menu && <Item key={item.key}>
									{/* <i className={item.icon} style={{ fontSize: '14px', marginRight: '10px' }}></i>  */}
									<IconFont type={item.icon} />
									<span>{item.title}</span>
								</Item>
							))
					);
				})}
			</Menu>
		);
	}
}

export default withRouter(SiderMenu);
