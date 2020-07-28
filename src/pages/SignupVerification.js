import React, { Component } from 'react';
import userService from '../services/user';
import { inject, observer } from 'mobx-react';
import { Button, Spin, Result } from 'antd';
import styles from './Sign.module.less';
import routeConfig from '../routeConfig';
@inject('user')
@observer
class SignupVerification extends Component {
	state = {
		code: '',
		verifyLoading: true,
		verifySuccess: false,
		isToVerify: false,
		verifyStatus: {}
	};
	constructor(props) {
		super(props);
		const { code } = props.match.params;
		this.state.code = code;
	}
	async componentDidMount() {
		const { code } = this.state;
		if (code) {
			const { errCode, errMsg, data } = await userService.verifyEmail(code);
			this.setState({ verifyLoading: false, verifyStatus: { errCode, errMsg } });
			if (errCode) {
				return;
			}
			this.setState({
				newCode: data.code,
				hasPassword: data.hasPassword
			});
		}
	}
	supplement() {
		const { newCode } = this.state;
		this.props.history.push(`${routeConfig.resetPassword}`);
	}
	render() {
		const { verifyLoading, verifyStatus, hasPassword } = this.state;
		return (
			<div className={styles.signContainer}>
				{verifyLoading ? (
					<Result title="正在验证" subTitle="请稍等……" icon={<Spin size="large" />} />
				) : (
						<React.Fragment>
							{!verifyStatus.errCode ? (
								<Result
									status="success"
									title="验证成功"
									subTitle="您现在可以使用该邮箱来登录系统。"
									extra={
										<React.Fragment>
											{hasPassword ? (
												<Button
													type="primary"
													onClick={() => this.props.history.push(routeConfig.signIn)}
													key="console"
												>
													马上去登录
												</Button>
											) : (
													<Button onClick={this.supplement.bind(this)} type="primary">
														设置登录密码
													</Button>
												)}
										</React.Fragment>
									}
								/>
							) : (
									<Result status="error" title="验证失败" subTitle={verifyStatus.errMsg} />
								)}
						</React.Fragment>
					)}
			</div>
		);
	}
}
export default SignupVerification;
