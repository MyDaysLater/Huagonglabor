import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Page from '../../components/Page';
import { getRegion, genTree } from '../../utils/region';
import { PageHeader, Form, Button, Input, List, Tag, Icon, Cascader, Modal, message } from 'antd';
import projectService from '../../services/project';
const { Content } = Page;
@inject('app')
@inject('project')
@observer
class Projects extends Component {
	state = {
		page: 1,
		meta: {}
	};
	componentDidMount() {
		const { currentCorp } = this.props.app;
		this.props.project.list({
			'filter[corp_id]': currentCorp.id
		});
		// console.log(data)
	}
	onFilterClick() {
		const { filterName = '', region = [], page } = this.state;
		const [province, city, area] = region;
		const { currentCorp } = this.props.app;
		this.props.project.list({
			'filter[corp_id]': currentCorp.id,
			'filter[province]': province,
			'filter[city]': city,
			'filter[area]': area,
			'filter[name][like]': filterName,
			page
		});
	}
	onPageChange(page) {
		this.setState({ page }, () => {
			this.onFilterClick();
		});
	}
	onDeleteProject(item) {
		Modal.confirm({
			title: '提示',
			content: `您确定要删除 ${item.name} 吗`,
			onOk: async () => {
				const data = await projectService.remove(item.id);
				if (!data) {
					return Promise.reject().catch((e) => { });
				}
				message.success('删除成功', 2);
				this.onFilterClick();
				return Promise.resolve();
			}
		});
	}
	get_meta(listResult) {
		this.setState({
			meta: listResult.data._meta
		})
	}
	render() {
		const { app, project, authorize, jurisdiction } = this.props;
		const { meta } = this.state;
		const { mainPath } = app;
		const { listResult } = project;
		return (
			<Page>
				<PageHeader title="项目管理" />
				<Content>
					<Content.Panel>
						<Form layout="inline">
							{jurisdiction && <Form.Item>
								<Button type="primary">
									<Link to={`${mainPath}/projects/create`}>新增项目</Link>
								</Button>
							</Form.Item>}
							<Form.Item>
								<Cascader
									placeholder="地区筛选"
									style={{ width: 200 }}
									options={genTree()}
									changeOnSelect
									onChange={(v) => this.setState({ region: v })}
								/>
							</Form.Item>
							<Form.Item>
								<Input
									allowClear
									onChange={(e) => this.setState({ filterName: e.currentTarget.value })}
									placeholder="项目名称"
								/>
							</Form.Item>
							<Form.Item>
								<Button onClick={this.onFilterClick.bind(this)}>筛选</Button>
							</Form.Item>
						</Form>
					</Content.Panel>
					<Content.Panel style={{ marginTop: 15 }}>
						<List
							loading={listResult.pending || false}
							itemLayout="horizontal"
							pagination={{
								onChange: this.onPageChange.bind(this),
								pageSize: listResult.data._meta.perPage || 20,
								current: listResult.data._meta.currentPage || 20,
								total: listResult.data._meta.totalCount || 20,
							}}
							dataSource={listResult.data.items}
							renderItem={(item) => (
								<List.Item
									actions={[
										jurisdiction && <Button
											onClick={() => this.props.history.push(`${mainPath}/projects/detail/${item.id}`)}
											type="link"
											key="list-manage"
										>
											管理
										</Button>,
										jurisdiction && <Button
											onClick={() => this.props.history.push(`${mainPath}/projects/edit/${item.id}`)}
											type="link"
											key="list-edit"
										>
											编辑
										</Button>,
										jurisdiction && <Button
											type="link"
											key="list-delete"
											onClick={() => this.onDeleteProject(item)}
										>
											删除
										</Button>
									]}
								>
									<List.Item.Meta
										avatar={<Icon type="flag" />}
										title={item.name}
										description={
											<React.Fragment>
												<Tag color="green">{item.status_label}</Tag>地址：{getRegion(item.province, item.city, item.area)}{' '}
												{item.address}
											</React.Fragment>
										}
									/>
								</List.Item>
							)}
						/>
					</Content.Panel>
				</Content>
			</Page>
		);
	}
}

export default Projects;
