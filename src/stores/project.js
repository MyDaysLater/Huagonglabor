import { observable, flow } from 'mobx';
import { project } from '../services';
import { ROLELABEL } from '../constants';
function treeProgress(items) {
	return items.map((item) => {
		const newItem = {
			title: `${item.userInfo.name}(${ROLELABEL[item.role]})`,
			value: item.user_id,
			key: item.user_id,
			userId: item.user_id,
			id: item.id,
			role: item.role,
			children: []
		};
		if (item.teamMembers && item.teamMembers.length) {
			newItem.children = treeProgress(item.teamMembers);
		}
		return newItem;
	});
}
class ProjectStore {
	@observable listResult;
	@observable managersResult;
	@observable membersTreeResult;
	@observable workerLeadersResult;
	list = flow(function* (params) {
		this.listResult = Object.assign(this.listResult, { pending: true });
		this.listResult = yield project.list(params);
	});
	managers = flow(function* (params) {
		this.managersResult = Object.assign(this.managersResult, { pending: true });
		this.managersResult = yield project.getManagers(params);
	});
	membersTree = flow(function* (params) {
		this.membersTreeResult = Object.assign(this.membersTreeResult, { pending: true });
		const { errCode, data } = yield project.getMembers(params);
		console.log(data)
		if (!errCode) {
			this.membersTreeResult = { data: { items: treeProgress(data.items) } };
		} else {
			this.membersTreeResult = { errCode, data };
		}
	});
	workerLeaders = flow(function* (params) {
		this.workerLeadersResult = Object.assign(this.workerLeadersResult, { pending: true });
		this.workerLeadersResult = yield project.getManagers(params);
	});
	constructor() {
		this.listResult = { pending: false, data: { items: [], _meta: {} } };
		this.managersResult = { pending: false, data: { items: [], flatItems: [] } };
		this.membersTreeResult = { pending: false, data: { items: [] } };
		this.workerLeadersResult = { pending: false, data: { items: [] } };
	}
}

export default new ProjectStore();
