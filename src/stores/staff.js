import { observable, flow, action } from 'mobx';
import { staffService } from '../services';

class StaffStore {
	@observable listResult;
	@observable treeData;
	@observable staffCorpRoleResult;
	@action
	setCorpRole = (v) => {
		this.staffCorpRoleResult = v;
	};
	list = flow(function* (params) {
		this.listResult = Object.assign(this.listResult, { pending: true });
		this.listResult = yield staffService.list(params);
	});
	staffCorpRole = flow(function* (params) {
		this.staffCorpRoleResult = Object.assign(this.staffCorpRoleResult, { pending: true });
		const { errCode, data } = yield staffService.getUserCorpRole(params);
		if (!errCode) {
			if (data.items.length) this.staffCorpRoleResult = data.items[0];
		}
	});
	constructor() {
		this.listResult = { pending: false, data: { items: [], _meta: { pageCount: 1 } } };
		this.staffCorpRoleResult = { pending: false };
	}
}
export default new StaffStore();
