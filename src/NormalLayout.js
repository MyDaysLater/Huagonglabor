import React, { Component } from 'react';
import { Layout, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import { withRouter, Switch, Route } from 'react-router-dom';
import styles from './NormalLayout.module.less';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Forgot from './pages/Forgot';
import ResetPassword from './pages/ResetPassword';
import SignupVerification from './pages/SignupVerification';
import Notfound from './pages/NotFound';
import SignupResult from './pages/SignupResult';
import { appName } from './config';
import Index from './pages/Index';
const { Header, Content, Footer } = Layout;
@inject('user')
@observer
class Normal extends Component {
	render() {
		const { hasSignined, userInfo } = this.props.user;
		return (
			<Layout className={styles.app}>
				<Header className={styles.header}>
					<h3 className={styles.logowrapper} onClick={() => this.props.history.push('/')}>
						<img className={styles.logo} src={require('./images/huagong.png')} alt="" />
						<span className={styles.appName}>{appName}</span>
					</h3>
					<div className={styles.nav} />
					<div className={styles.actions}>
						{userInfo.email && hasSignined ? (
							<Button shape="round" onClick={() => this.props.history.push('/signin')}>
								控制台
							</Button>
						) : (
								<React.Fragment>
									<Button shape="round" onClick={() => this.props.history.push('/signin')}>
										登录
								</Button>
									<Button shape="round" onClick={() => this.props.history.push('/signin')} type="primary">
										开始使用
								</Button>
								</React.Fragment>
							)}
					</div>
				</Header>
				<Content className={styles.content}>
					<Switch>
						{/* <Route exact path="/index" component={Signin} /> */}
						<Route exact path="/" component={Index} />
						<Route exact path="/signin" component={Signin} />
						<Route exact path="/signup" component={Signup} />
						<Route exact path="/signup/result/:id" component={SignupResult} />
						<Route exact path="/forgot" component={Forgot} />
						<Route exact path="/resetpassword/:code" component={ResetPassword} />
						<Route exact path="/verification/:code" component={SignupVerification} />
						{/* <Redirect exact path="/" to="/corps" /> */}
						<Notfound />
					</Switch>
				</Content>
				<Footer className={styles.footer}>
					<div>©2019 深圳华工数据有限公司</div>
				</Footer>
			</Layout>
		);
	}
}

export default withRouter(Normal);
