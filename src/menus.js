import { dashboardPath } from './routeConfig';
export function genMenus(corpid) {
	const mainPath = `${dashboardPath}/${corpid}`
	// const mainPath = `${dashboardPath}`
	return {
		home: {
			key: 'home',
			path: `${mainPath}`,
			title: '首页',
			icon: 'iconhome'
		},

		project: {
			key: 'project',
			authKey: 'project',
			path: `${mainPath}/projects`,
			title: '项目管理',
			icon: 'iconxiangmu'
		},
		workers: {
			key: 'workers',
			authKey: 'project',
			path: `${mainPath}/Administration/workers`,
			title: '工人管理',
			icon: 'icongongren'
		},
		Attendance: {
			key: 'Attendance',
			authKey: 'project',
			path: `${mainPath}/Administration/Attendance`,
			title: '考勤管理',
			icon: 'iconkaoqin'
		},
		wages: {
			key: 'wages',
			authKey: 'project',
			path: `${mainPath}/Administration/wages`,
			title: '工资管理',
			icon: 'icongongzi'
		},
		protocols: {
			key: 'protocols',
			authKey: 'protocol',
			path: `${mainPath}/protocols`,
			title: '协议规章',
			icon: 'iconxieyi',
			children: [
				{
					key: 'protocols',
					path: `${mainPath}/protocols/agreement`,
					title: '协议管理'
				},
				{
					key: 'regulation',
					path: `${mainPath}/protocols/regulation`,
					title: '奖惩设置'
				}
			]
		},
		platform: {
			key: 'platform',
			authKey: 'platform',
			path: `${mainPath}/platform`,
			title: '建工平台',
			icon: 'iconjiangong',
			children: [
				{
					key: 'interface',
					title: '接口配置',
					path: `${mainPath}/platform/interface`
				},
				{
					key: 'dataupload',
					title: '数据上传',
					path: `${mainPath}/platform/dataupload`
				}
			]
		},
		system_setup: {
			key: 'system_setup',
			authKey: 'system',
			path: `${mainPath}/system`,
			title: '系统设置',
			icon: 'iconshezhi',
			children: [
				{
					key: 'corp',
					authKey: 'corp',
					path: `${mainPath}/corp`,
					title: '企业信息',
				},
				{
					key: 'staffs',
					path: `${mainPath}/staffs`,
					authKey: 'staff',
					title: '账号管理',
				},
				{
					key: 'miniprogram',
					title: '小程序部署',
					authKey: 'weixin',
					path: `${mainPath}/weixin/miniprogram`
				},
				{
					key: 'wexinpay',
					title: '微信支付配置',
					authKey: 'weixin',
					path: `${mainPath}/weixin/Wxconfiguration`
				}
			]
		},

	};
}
export default {
	genMenus
};
