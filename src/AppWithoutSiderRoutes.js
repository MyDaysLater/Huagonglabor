import React, { Component } from 'react';
import { Switch } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Notfound from './pages/NotFound';
import AuthRoute from './AuthRoute';
import CorpEdit from './pages/corp/CorpEdit';
import Corps from './pages/corp/Corps';
import Infomation from './pages/ucenter/Infomation';
@inject('user')
@observer
class AppWithoutSiderRoutes extends Component {
	render() {
		return (
			<Switch>
				<AuthRoute authKey="corp" exact path="/corps" component={Corps} />
				<AuthRoute authKey="corp" exact path="/corps/create" component={CorpEdit} />
				<AuthRoute authKey="corp" exact path="/corps/edit/:id" component={CorpEdit} />
				<AuthRoute exact path="/ucenter/:id" component={Infomation} />
				<Notfound />
			</Switch>
		);
	}
}

export default AppWithoutSiderRoutes;
