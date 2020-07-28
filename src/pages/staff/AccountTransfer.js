import React, { Component } from 'react';
import Page from '../../components/Page';
import { inject, observer } from 'mobx-react';
import useStaff from '../../services/staff';
import { PageHeader, Form, Select, Button, message, Tag, Input } from 'antd';
import { ROLES } from '../../constants';

import './Styles.less';
import { removeLocalUserInfo } from '../../utils/localStoreCommon';
import { signIn } from '../../routeConfig';
import Notfound from '../NotFound';

@inject('user')
@observer
class AccountTransfer extends Component {
	state = {
		data: [],
    selectedValue: undefined,
    password: '',
		searchLoading: false,
		saving: false
	};
	constructor(props) {
		super(props);
		const { corpid, id } = props.match.params;
    this.state.corpid = corpid;
    this.state.userid = id;
	}
	async fetchData(keyword) {
		const { corpid, userid } = this.state;
		this.setState({ searchLoading: true });
		const { errCode, errMsg, data } = await useStaff.list({
			a: 'search',
			'filter[corp_id]': corpid,
      'filter[role][neq]': ROLES.contractor,
      'filter[user_id][neq]': userid,
			keyword
		});
		this.setState({ searchLoading: false });
		if (errCode) {
			message.error(errMsg);
			return;
		}
		if (data) {
			this.setState({ data: data.items });
		}
	}
	onSearch(value) {
		if (value) {
			this.fetchData(value);
		} else {
			this.setState({ data: [] });
		}
	}
	onChange(value) {
		this.setState({ selectedValue: value });
  }
  onPasswordChange({ currentTarget }) {
    this.setState({ password: currentTarget.value })
  }
	async onSave() {
		const { selectedValue, password, corpid: corp_id } = this.state;
    if (!selectedValue) return;
		this.setState({ saving: true });
		const { errCode, errMsg } = await useStaff.transfer({ to: selectedValue, password, corp_id });
		this.setState({ saving: false });
		if (errCode) {
			message.error(errMsg);
			return;
    }
    removeLocalUserInfo();
    this.props.user.setSignin(false);
		message.success('移交成功，需要重新登录', 3, () => {
			this.props.history.replace(signIn);
		});
	}
	render() {
		const { searchLoading, data, selectedValue, saving, password } = this.state;
		const { authorize } = this.props;
		const formItemLayout = {
			labelCol: {
				xs: { span: 24 },
				sm: { span: 8 },
				md: { span: 8 }
			},
			wrapperCol: {
				xs: { span: 24 },
				sm: { span: 14 },
				md: { span: 10 }
			}
		};
		const tailFormItemLayout = {
			wrapperCol: {
				xs: {
					span: 24,
					offset: 0
				},
				sm: {
					span: 16,
					offset: 8
				}
			}
		};
		if (authorize.role.type !== 'master') {
			return <Notfound />;
		}
		return (
			<Page>
				<PageHeader onBack={() => this.props.history.goBack()} title="超管移交" />
				<Page.Content>
					<Page.Content.Panel>
						<Form {...formItemLayout} style={{ padding: '50px 0' }}>
							<Form.Item label="移交给">
								<Select
									showSearch
									className="user-select"
									placeholder="输入姓名"
									allowClear
									value={this.state.selectedValue}
									defaultActiveFirstOption={false}
									showArrow={false}
									filterOption={false}
									onSearch={this.onSearch.bind(this)}
									onChange={this.onChange.bind(this)}
									notFoundContent={null}
									loading={searchLoading}
								>
									{data.map((item) => (
										<Select.Option key={item.user_id} value={item.user_id}>
											<div className="user-select-name">
												<b>{item.userInfo.name}</b>{' '}
												<Tag style={{ marginLeft: 5 }} color="green">
													{item.corpRole.name}
												</Tag>
											</div>
											<div className="user-select-email">{item.userInfo.email}</div>
										</Select.Option>
									))}
								</Select>
							</Form.Item>
							<Form.Item label="密码">
                <input style={{display: 'none'}}/>
								<Input.Password onChange={this.onPasswordChange.bind(this)} placeholder="输入登录密码" autoComplete={false} />
							</Form.Item>
							<Form.Item {...tailFormItemLayout}>
								<Button
									loading={saving}
									disabled={!selectedValue || password.length<6}
									onClick={this.onSave.bind(this)}
									type="primary"
								>
									确定移交
								</Button>
							</Form.Item>
						</Form>
					</Page.Content.Panel>
				</Page.Content>
			</Page>
		);
	}
}
export default AccountTransfer;
