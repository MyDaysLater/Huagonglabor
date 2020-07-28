import { observable, flow } from 'mobx';
import { roleService } from '../services';
class RoleStore {
	@observable listResult;
	list = flow(function*(params) {
		this.listResult = Object.assign(this.listResult, { pending: true });
		const { errCode, data } = yield roleService.getRoles(params);
		if (errCode) {
			this.listResult = { errCode, data: { items: [] } };
		} else {
			this.listResult = { data };
		}
	});
	constructor() {
		this.listResult = { pending: false, data: { items: [] } };
	}
}
export default new RoleStore();
