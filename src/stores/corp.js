import { observable, flow, action } from 'mobx';
import { corp } from '../services';
class CorpStore {
	@observable createResult;
	@observable listResult;
	@action clearCreateResult = () => (this.createResult = { pending: false });
	create = flow(function* (data) {
		this.createResult = { pending: true };
		const res = yield corp.create(data);
		this.createResult = res;
	});
	list = flow(function* () {
		this.listResult = Object.assign(this.listResult, { pending: true });
		const res = yield corp.list();
		if (res.errCode) {
			return;
		}
		this.listResult = res;
	});
	detail = flow(function* (id) {
		this.detailResult = { pending: true };
		const res = yield corp.detail(id);
		if (res) {
			this.detailResult = res;
		}
	});
	remove = flow(function* (corpid) {
		const res = yield corp.remove(corpid);
		if (res.count) {
			this.listResult.items = this.listResult.items.filter((item) => {
				return item.id !== corpid;
			});
		}
	});
	constructor() {
		this.createResult = { pending: false };
		this.listResult = { data: {}, pending: false };
		this.removeResult = { pending: false };
		this.detailResult = { pending: false };
		this.updateResult = { pending: false };
	}
}

export default new CorpStore();
