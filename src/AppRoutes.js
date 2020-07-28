import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import Notfound from './pages/NotFound';
import AuthRoute from './AuthRoute';
import Home from './pages/Home';
import Projects from './pages/project/Projects';
import Project from './pages/project/Project';
import EditProject from './pages/project/EditProject';
import Attendance from './pages/project/Administration/Attendance';
import Wages from './pages/project/Administration/wages';
import Workers from './pages/project/Administration/workers';
import CorpDetail from './pages/corp/CorpDetail';
import Staffs from './pages/staff/Staffs';
import EditStaff from './pages/staff/EditStaff';
import AnnouncementEdit from './pages/announcement/AnnouncementEdit';
import MiniProgram from './pages/weixin/MiniProgram';
import Orders from './pages/weixin/Orders';
import WechatPay from './pages/weixin/WechatPay';
import Wxconfiguration from './pages/weixin/Wx_configuration';
import Announcement from './pages/announcement/Announcement';
import Regulation from './pages/supervision/Regulation';
import Roles from './pages/role/Roles';
import RoleEdit from './pages/role/RoleEdit';
import CorpEdit from './pages/corp/CorpEdit';
import AccountTransfer from './pages/staff/AccountTransfer';
import Protocols from './pages/protocol/Protocols';
import EditProtocol from './pages/protocol/EditProtocol';
import protocolDetail from './pages/protocol/Detail';
import Interface from './pages/platform/interface';
import Dataupload from './pages/platform/dataupload';
import Applet_config from './pages/system_setup/applet_config';
const corpAuthKey = 'corp';
const staffAuthKey = 'staff';
const roleAuthKey = 'role';
const projectAuthKey = 'project';
const supervisionAuthKey = 'supervision';
const weixinAuthKey = 'weixin';
const protocolAuthKey = 'protocol';
const platformkey = 'platform';
class AppRoutes extends Component {
	render() {
		return (
			<Switch>
				<AuthRoute authKey={corpAuthKey} exact path="/dashboard/:corpid" component={Home} />
				<AuthRoute authKey={corpAuthKey} exact path="/dashboard/:corpid/corp" component={CorpDetail} />
				<AuthRoute authKey={corpAuthKey} exact path="/dashboard/:corpid/corp/edit" component={CorpEdit} />

				<AuthRoute authKey={staffAuthKey} exact path="/dashboard/:corpid/staffs" component={Staffs} />
				<AuthRoute authKey={staffAuthKey} exact path="/dashboard/:corpid/staffs/edit/:id" component={EditStaff} />
				<AuthRoute authKey={staffAuthKey} exact path="/dashboard/:corpid/staffs/create" component={EditStaff} />
				<AuthRoute authKey={staffAuthKey} exact path="/dashboard/:corpid/staffs/transfer/:id" component={AccountTransfer} />

				<AuthRoute authKey={roleAuthKey} exact path="/dashboard/:corpid/roles" component={Roles} />
				<AuthRoute authKey={roleAuthKey} exact path="/dashboard/:corpid/roles/create" component={RoleEdit} />
				<AuthRoute authKey={roleAuthKey} exact path="/dashboard/:corpid/roles/edit/:id" component={RoleEdit} />

				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/projects" component={Projects} />
				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/projects/detail/:id" component={Project} />
				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/projects/edit/:id" component={EditProject} />
				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/projects/create" component={EditProject} />
				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/Administration/Attendance" component={Attendance} />
				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/Administration/wages" component={Wages} />
				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/Administration/workers" component={Workers} />

				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/projects/:project/announcement/create" component={AnnouncementEdit} />
				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/projects/:project/announcement/edit/:id" component={AnnouncementEdit} />
				<AuthRoute authKey={projectAuthKey} exact path="/dashboard/:corpid/projects/:project/announcement/detail/:id" component={Announcement} />

				<AuthRoute authKey={weixinAuthKey} exact path="/dashboard/:corpid/weixin/orders" component={Orders} />
				<AuthRoute authKey={weixinAuthKey} exact path="/dashboard/:corpid/weixin/miniprogram" component={MiniProgram} />
				<AuthRoute authKey={weixinAuthKey} exact path="/dashboard/:corpid/weixin/wexinpay/:payment_plan_id" component={WechatPay} />
				<AuthRoute authKey={weixinAuthKey} exact path="/dashboard/:corpid/weixin/Wxconfiguration" component={Wxconfiguration} />

				<AuthRoute authKey={supervisionAuthKey} exact path="/dashboard/:corpid/protocols/regulation" component={Regulation} />
				<AuthRoute authKey={protocolAuthKey} exact path="/dashboard/:corpid/protocols/agreement" component={Protocols} />
				<AuthRoute authKey={protocolAuthKey} exact path="/dashboard/:corpid/protocols/edit/:id" component={EditProtocol} />
				<AuthRoute authKey={protocolAuthKey} exact path="/dashboard/:corpid/protocols/create" component={EditProtocol} />
				<AuthRoute authKey={protocolAuthKey} exact path="/dashboard/:corpid/protocols/detail/:id" component={protocolDetail} />

				<AuthRoute authKey={platformkey} exact path="/dashboard/:corpid/platform/interface" component={Interface} />
				<AuthRoute authKey={platformkey} exact path="/dashboard/:corpid/platform/dataupload" component={Dataupload} />

				<AuthRoute authKey={weixinAuthKey} exact path="/dashboard/:corpid/system_setup/applet_config" component={Applet_config} />

				<Notfound />

			</Switch>
		);
	}
}

export default AppRoutes;
