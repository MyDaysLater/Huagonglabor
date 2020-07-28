import { observable, action } from 'mobx';
import { dashboardPath } from '../routeConfig';

class AppStore {
	@observable siderCollapse;
	@observable currentCorp;
	@observable mainPath;
	@action setSiderCollapse = (v) => (this.siderCollapse = v);
	@action
	setCurrentCorp = (v) => {
		this.currentCorp = v;
		this.mainPath = `${dashboardPath}/${v.id}`;
	};

	constructor() {
		this.siderCollapse = false;
		this.mainPath = dashboardPath;
	}
}

export default new AppStore();
