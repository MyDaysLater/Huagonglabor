import { observable, flow, configure } from 'mobx';
import { attendanceService } from '../services';

configure({ enforceActions: 'never' });

class AttendanceStore {
	@observable listResult;
	list = flow(function*(params) {
		this.listResult = Object.assign(this.listResult, { pending: true });
		const res = yield attendanceService.list(params);
		if (res) {
			this.listResult = res;
		}
	});

	constructor() {
		this.listResult = { pending: false, items: [], _meta: { pageCount: 1 } };
	}
}
export default new AttendanceStore();
