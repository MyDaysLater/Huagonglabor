export const ROLES = {
	worker: 'worker', // 普通工人
	submaster: 'submaster', // 子管理员
	master: 'master', // 管理员
	pm: 'pm', // 项目经理
	subpm: 'subpm', // 施工员
	sf: 'sf', // 劳务公司财务
	em: 'em', // 项目分包商工程经理
	pc: 'pc', // 项目分包商负责人
	cc: 'cc', // 装饰或建筑公司负责人
	cf: 'cf', // 装饰和建筑公司财务
	sc: 'sc', // 劳务公司负责人
	contractor: 'contractor', // 承包人
	teamleader: 'teamleader', // 班组长
	finance: 'finance' // 财务
};
export const ROLELABEL = {
	worker: '工人',
	submaster: '子管理员',
	master: '管理员',
	pm: '项目经理',
	subpm: '施工员',
	contractor: '承包人',
	teamleader: '班组长',
	finance: '财务'
};
export default {
	ROLES,
	ROLELABEL
};
