import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Card, Button, Table, Tree, Modal, Divider, Spin, message, Tag, Descriptions, Col, Row, PageHeader, Select, TreeSelect } from 'antd';
import { ROLES, ROLELABEL } from '../../../constants';
import projectService from '../../../services/project';
import styles from '../../worker/Workers.module.less';
import CreateForm from '../../worker/CreateForm';
import EditForm from '../../worker/EditForm';
import Page from '../../../components/Page';
import { dict_select } from "../../../services/dict";
import "./administratin.less";
const { Content } = Page;
@inject('app')
@inject('project')
@inject('user')
@inject('staff')
@observer
class Workers extends Component {
    state = {
        projectId: '',
        positionid: '',
        workerList: {
            items: []
        },
        memberDetail: { userInfo: {} },
        detailModalVisible: false,
        treeNodeLoading: true,
        treeSelectedKeys: ['0-0'],
        defaultExpandedKeys: ['0-0'],
        createMemberFormVisible: false,
        createMemberFormConfirmLoading: false,
        removeConfirmLoading: false,
        selectedGroup: '',
        editMemberFormVisible: false,
        editMemberFormConfirmLoading: false,
        editMemberData: '',
        corpid: '',
        select_project_arr: [],
        select_pm_arr: [],
        meta_object: {
            project_meta: {},
            pm_meta: {},
        },
        meta: {},
        treeData: {
            position_id: {
                value: [],
                id: 471
            },
        }
    };
    constructor(props) {
        super(props);
        const { id, corpid } = props.match.params;
        // this.state.projectId = '5dc21a86eb7d4203e9398081';
        this.state.corpid = corpid;
        this.screen = this.screen.bind(this);
    }
    componentDidMount() {
        // this.getMembersTree();
        this.project_list();
        this.getTreeNodeMembers();
        this.get_dictdata();
    }
    async project_list() {
        this.props.project.list({
            'filter[corp_id]': this.state.corpid,
            page: this.state.meta_object.project_meta.currentPage || 1,
        }).then(res => {
            const { project } = this.props;
            const { listResult } = project;
            const { data } = listResult;
            let { meta_object, select_project_arr } = this.state;
            select_project_arr = select_project_arr.concat(data.items)
            let meta = {
                currentPage: data._meta.currentPage,
                pageCount: data._meta.pageCount,
                perPage: data._meta.perPage,
                totalCount: data._meta.totalCount,
            }
            meta_object.project_meta = meta;
            this.setState({
                select_project_arr: select_project_arr,
                meta_object: meta_object
            })
        })

    }
    async getMembersTree() {
        const { projectId } = this.state;
        const { corpRole = {} } = this.props.staff.staffCorpRoleResult;
        // const { errCode, errMsg, data } = this.props.project.membersTree({
        //     'filter[corp_project_id]': projectId,
        //     role: corpRole.role === ROLES.contractor ? corpRole.role : ROLES.master,
        //     expand: 'teamMembers'
        // });
        const { errCode, errMsg, data } = await projectService.getMembers({
            'filter[corp_project_id]': projectId,
            'filter[corp_id]': this.state.corpid,
            role: corpRole.role === ROLES.contractor ? corpRole.role : ROLES.master,
            expand: 'teamMembers,userInfo',
            page: this.state.meta_object.pm_meta.currentPage || 1,
        });
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, select_pm_arr } = this.state;
        select_pm_arr = select_pm_arr.concat(data.items)
        meta_object.pm_meta = data._meta;
        this.setState({
            select_pm_arr: select_pm_arr,
            meta_object: meta_object
        })
    }
    async getMembersTree_one() {
        const { projectId } = this.state;
        const { corpRole = {} } = this.props.staff.staffCorpRoleResult;
        // const { errCode, errMsg, data } = this.props.project.membersTree({
        //     'filter[corp_project_id]': projectId,
        //     role: corpRole.role === ROLES.contractor ? corpRole.role : ROLES.master,
        //     expand: 'teamMembers'
        // });
        const { errCode, errMsg, data } = await projectService.getMembers({
            'filter[corp_project_id]': projectId,
            'filter[corp_id]': this.state.corpid,
            role: corpRole.role === ROLES.contractor ? corpRole.role : ROLES.master,
            expand: 'teamMembers,userInfo',
            page: 1,
        });
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, select_pm_arr } = this.state;
        select_pm_arr = data.items;
        meta_object.pm_meta = data._meta;
        this.setState({
            select_pm_arr: select_pm_arr,
            meta_object: meta_object
        })
    }
    async getTreeNodeMembers() {
        const { projectId, selectedGroup, positionid } = this.state;
        this.setState({ treeNodeLoading: true });
        let params = {
            page: this.state.meta.currentPage || 1,
            'filter[corp_project_id]': projectId,
            'filter[corp_id]': this.state.corpid,
            'filter[position_id]': positionid,
            'filter[role][in][0]': ROLES.contractor,
            'filter[role][in][1]': ROLES.teamleader,
            'filter[role][in][2]': ROLES.worker,
            'filter[status][nin][0]': 7,
            'filter[status][nin][1]': 9,
            expand: 'userInfo.projects',
        };
        if (selectedGroup) {
            params = Object.assign(params, { expand: 'memberList,userInfo', id: selectedGroup });
        }
        const { errCode, errMsg, data } = await projectService.getMembers(params);
        if (errCode) {
            message.error(errMsg);
            return;
        }

        this.setState({ treeNodeLoading: false, workerList: data, meta: data._meta ? data._meta : {} });
    }
    async getTreeNodeMembers_pm() {
        const { projectId, selectedGroup, positionid } = this.state;
        this.setState({ treeNodeLoading: true });
        let params = {
            page: this.state.meta.currentPage || 1,
            'filter[corp_project_id]': projectId,
            'filter[corp_id]': this.state.corpid,
            'filter[position_id]': positionid,
            'filter[role][in][0]': ROLES.contractor,
            'filter[role][in][1]': ROLES.teamleader,
            'filter[role][in][2]': ROLES.worker,
            'filter[status][nin][0]': 7,
            'filter[status][nin][1]': 9,
            expand: 'userInfo.projects',
        };
        if (selectedGroup) {
            params = Object.assign(params, { expand: 'memberList,userInfo', id: selectedGroup });
        }
        const { errCode, errMsg, data } = await projectService.getMembers(params);
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.setState({ treeNodeLoading: false, workerList: data, });
    }
    async onMembersTreeSelected(pos, { node }) {
        this.setState({ treeSelectedKeys: pos, selectedGroup: node.props.id }, () => {
            this.getTreeNodeMembers();
        });
    }
    onClickAddMember() {
        this.setState({ createMemberFormVisible: true });
    }
    onMemberCreate() {
        this.createSaveFormRef.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { currentCorp } = this.props.app;
                this.setState({ createMemberFormConfirmLoading: true });
                const { errCode, errMsg } = await projectService.addMember(
                    Object.assign(values, {
                        a: 'addMember',
                        corp_id: currentCorp.id,
                        corp_project_id: this.state.projectId
                    })
                );
                this.setState({ createMemberFormConfirmLoading: false });
                if (errCode) {
                    message.error(errMsg);
                    return;
                }

                message.success('添加成功');
                this.getTreeNodeMembers();
                this.setState({ createMemberFormVisible: false });
            }
        });
    }
    onMemberCreateCancel() {
        this.setState({ createMemberFormVisible: false });
    }
    createFormRef(formRef) {
        this.createSaveFormRef = formRef;
    }
    onViewDetail(record) {
        const { workerList } = this.state;
        this.setState({
            detailModalVisible: true,
            memberDetail: workerList.items.find((item) => item.user_id === record.user_id)
        });
    }
    onViewDetailClose() {
        this.setState({ detailModalVisible: false });
    }
    onEditMember(record) {
        const { workerList } = this.state;
        this.setState({
            editMemberFormVisible: true,
            editMemberData: workerList.items.find((item) => item.user_id === record.user_id)
        });
    }
    editFormRef(formRef) {
        this.editSaveFormRef = formRef;
    }
    onMemberEditSave() {
        this.editSaveFormRef.props.form.validateFields(async (err, values) => {
            if (!err) {
                const { editMemberData } = this.state;
                const { currentCorp } = this.props.app;
                this.setState({ editMemberFormConfirmLoading: true });
                const { errCode, errMsg } = await projectService.updateMember(
                    editMemberData.id,
                    Object.assign(values, {
                        corp_id: currentCorp.id,
                        corp_project_id: this.state.projectId
                    })
                );
                this.setState({ editMemberFormConfirmLoading: false });
                if (errCode) {
                    message.error(errMsg);
                    return;
                }
                message.success('修改成功');
                this.getMembersTree();
                this.setState({ editMemberFormVisible: false, editMemberData: '' });
            }
        });
    }
    onMemberEditFormCancel() {
        this.setState({ editMemberFormVisible: false, editMemberData: '' });
    }
    onRemoveMember(record) {
        const { removeConfirmLoading } = this.state;
        const removeModal = Modal.confirm({
            title: '删除',
            content: `您是否要删除【${record.name}】?`,
            okButtonProps: {
                loading: removeConfirmLoading
            },
            onOk: async () => {
                this.setState({ removeConfirmLoading: true });
                //离职
                const { errCode, errMsg } = await projectService.removeMember(record.id, { status: 7 });
                if (errCode) {
                    message.error(errMsg);
                    return;
                }
                message.success('删除成功');
                this.getTreeNodeMembers();
                this.setState({ removeConfirmLoading: false });
                removeModal.destroy();
            }
        });
    }
    renderActions() {
        const { authorize, jurisdiction } = this.props;
        const { staffCorpRoleResult } = this.props.staff;
        const { data } = this.props.project.managersResult;
        const { userInfo } = this.props.user;
        const isProjectManager = data.flatItems.find((item) => item.user_id === userInfo.id);
        if (jurisdiction && ([ROLES.master, ROLES.submaster].includes(staffCorpRoleResult.role) || isProjectManager)) {
            return (
                <div className={styles.actions}>
                    <Button onClick={this.onClickAddMember.bind(this)} type="primary">
                        添加人员
					</Button>
                    {/* <Button>从Excel导入</Button> */}
                </div>
            );
        }
        return <span />;
    }
    screen(value) {
        this.setState({
            screen_line: value
        }, () => {
            this.getTreeNodeMembers();
        })
    }
    project_select(value) {
        this.setState({
            projectId: value,
            selectedGroup: ''
        }, () => {
            this.getTreeNodeMembers();
            this.getMembersTree_one();
        })

    }
    pm_select(value) {
        this.setState({
            selectedGroup: value
        }, () => {
            this.getTreeNodeMembers_pm();
        })
    }
    companyScroll(e, value) {
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            let { meta_object } = this.state;
            let page = meta_object[value].pageCount;
            if (page > meta_object[value].currentPage) {
                page > meta_object[value].currentPage ? meta_object[value].currentPage += 1 : meta_object[value].currentPage = meta_object[value].currentPage
                this.setState({
                    meta_object: meta_object
                })
                if (value === 'pm_meta') {
                    this.getMembersTree();
                } else if (value === 'project_meta') {
                    this.project_list();
                }
            }
        }
    }
    page_change(page) {
        const data = this.state.meta;
        data.currentPage = page;
        this.setState({
            meta: data
        }, () => {
            this.getTreeNodeMembers();
        })
    }
    async get_dictdata() {
        const { treeData } = this.state;
        for (let item in treeData) {
            treeData[item].value = await dict_select(treeData[item].id);
        }
        this.setState({
            treeData,
        })
    }
    position_select(value) {
        this.setState({
            positionid: value
        }, () => {
            this.getTreeNodeMembers();
        })
    }
    render() {
        const { authorize, project, jurisdiction } = this.props;
        const { listResult } = project;
        const { membersTreeResult } = this.props.project;
        const { staffCorpRoleResult } = this.props.staff;
        const {
            workerList,
            treeNodeLoading,
            treeSelectedKeys,
            defaultExpandedKeys,
            createMemberFormVisible,
            projectId,
            detailModalVisible,
            createMemberFormConfirmLoading,
            memberDetail,
            editMemberFormVisible,
            editMemberFormConfirmLoading,
            editMemberData,
            select_project_arr,
            select_pm_arr,
            meta,
            treeData,
        } = this.state;
        // const treeData = [{ title: '全部', value: 0, children: membersTreeResult.data.items }];
        const tableDataSource = workerList.items.map((item) => {
            let { userInfo = {} } = item;
            if (!userInfo) userInfo = {};
            return {
                key: item.id,
                user_id: item.user_id,
                id: item.id,
                name: userInfo.name,
                work_no: item.work_no,
                mobile: userInfo.mobile,
                role: item.role
            }
        });
        const tableColumns = [
            {
                title: '工号',
                dataIndex: 'work_no',
                key: 'work_no'
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
                render: (text, record) => {
                    return (
                        <span>
                            <label style={{ marginRight: 8 }}>{text}</label>
                            <Tag>{ROLELABEL[record.role]}</Tag>
                        </span>
                    );
                }
            },
            {
                title: '电话',
                dataIndex: 'mobile',
                key: 'mobile'
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => {
                    const { role, user_id } = staffCorpRoleResult;
                    let canMutation = false;
                    if (record.role === ROLES.worker && role === ROLES.contractor) {
                        canMutation = true;
                    } else if (record.role === ROLES.contractor) {
                        if ([ROLES.pm, ROLES.subpm].includes(role) && record.group_id === user_id) {
                            canMutation = true;
                        } else if ([ROLES.master, ROLES.submaster].includes(role)) {
                            canMutation = true;
                        }
                    }
                    return (
                        <span>
                            <Button type="link" onClick={() => this.onViewDetail(record)}>
                                详情
							</Button>
                            {jurisdiction && canMutation && (
                                <React.Fragment>
                                    <Button type="link" onClick={() => this.onEditMember(record)}>
                                        编辑
									</Button>
                                    <Button type="link" onClick={() => this.onRemoveMember(record)}>
                                        删除
									</Button>
                                </React.Fragment>
                            )}
                        </span>
                    );
                }
            }
        ];
        return (
            <Page>
                <PageHeader title="工人管理" />
                <Content>
                    <Content.Panel>
                        <Card
                            className={styles.cardPanel}
                        // extra={!membersTreeResult.pending && membersTreeResult.data.items.length ? this.renderActions() : ''}
                        >
                            <div className={styles.content}>
                                <div style={{ borderRadius: '5px', marginBottom: '10px', padding: '0 0 5px 5px' }}>
                                    <Row gutter={24} style={{ marginBottom: '20px' }} className="situation">
                                        <Col span={8} className='sreen_flex'>
                                            <div>项目：</div>
                                            <Select
                                                style={{ width: '80%' }}
                                                showSearch
                                                placeholder='请选择'
                                                optionFilterProp="children"
                                                onPopupScroll={(e) => { this.companyScroll(e, 'project_meta') }}
                                                onSelect={this.project_select.bind(this)}
                                            >
                                                {select_project_arr.map((item_ => {
                                                    return (
                                                        <Select.Option key={item_.id} value={item_.id}>{item_.name}</Select.Option>
                                                    )
                                                }))}
                                            </Select>
                                        </Col>
                                        <Col span={8} className='sreen_flex'>
                                            <div>项目经理：</div>
                                            <Select
                                                style={{ width: '60%' }}
                                                showSearch
                                                placeholder='请选择'
                                                optionFilterProp="children"
                                                onPopupScroll={(e) => { this.companyScroll(e, 'pm_meta') }}
                                                onSelect={this.pm_select.bind(this)}
                                            >
                                                {select_pm_arr.map((item_ => {
                                                    return (
                                                        <Select.Option key={item_.id} value={item_.id}>{item_.userInfo.name}</Select.Option>
                                                    )
                                                }))}
                                            </Select>
                                        </Col>
                                        <Col span={8} className='sreen_flex'>
                                            <div>工种：</div>
                                            <TreeSelect
                                                style={{ width: '60%' }}
                                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                                treeData={treeData.position_id.value}
                                                placeholder='请选择'
                                                treeDefaultExpandAll
                                                onChange={this.position_select.bind(this)}
                                                filterable
                                            />
                                        </Col>
                                    </Row>
                                    {/* <Row>
                                        <Col span={24} style={{ textAlign: 'left' }}>
                                            <Button type="primary" htmlType="submit">
                                                筛选
          </Button>
                                        </Col>
                                    </Row> */}
                                </div>
                                <Table
                                    bordered
                                    columns={tableColumns}
                                    dataSource={tableDataSource}
                                    loading={treeNodeLoading && !membersTreeResult.pending}
                                    pagination={{ position: 'bottom', current: meta.currentPage, pageSize: meta.perPage, total: meta.totalCount, onChange: (current, pageSize) => this.page_change(current, pageSize) }}
                                />
                            </div>
                            <CreateForm
                                projectId={projectId}
                                confirmLoading={createMemberFormConfirmLoading}
                                wrappedComponentRef={this.createFormRef.bind(this)}
                                visible={createMemberFormVisible}
                                onCreate={this.onMemberCreate.bind(this)}
                                onCancel={this.onMemberCreateCancel.bind(this)}
                            />
                            <EditForm
                                projectId={projectId}
                                memberData={editMemberData}
                                visible={editMemberFormVisible}
                                confirmLoading={editMemberFormConfirmLoading}
                                wrappedComponentRef={this.editFormRef.bind(this)}
                                onEditSave={this.onMemberEditSave.bind(this)}
                                onCancel={this.onMemberEditFormCancel.bind(this)}
                            />
                            <Modal
                                footer={[
                                    <Button type="primary" onClick={this.onViewDetailClose.bind(this)}>
                                        确定
						</Button>
                                ]}
                                style={{ top: 30 }}
                                onCancel={this.onViewDetailClose.bind(this)}
                                onOk={this.onViewDetailClose.bind(this)}
                                visible={detailModalVisible}
                                title={memberDetail.userInfo.name}
                            >
                                <Descriptions title="基本信息" column={2}>
                                    <Descriptions.Item label="姓名">{memberDetail.userInfo.name}</Descriptions.Item>
                                    <Descriptions.Item label="手机号码">{memberDetail.userInfo.mobile}</Descriptions.Item>
                                    <Descriptions.Item label="角色">{ROLELABEL[memberDetail.role]}</Descriptions.Item>
                                    {memberDetail.userInfo.email && (
                                        <Descriptions.Item label="邮箱">{memberDetail.userInfo.email}</Descriptions.Item>
                                    )}
                                    <Descriptions.Item label="每日生活费">{memberDetail.day_cost} 元</Descriptions.Item>
                                    <Descriptions.Item label="每日工资">{memberDetail.salary} 元</Descriptions.Item>
                                    <Descriptions.Item label="状态">{memberDetail.status_label}</Descriptions.Item>
                                </Descriptions>
                                <Divider dashed />
                                <h3>紧急联系人</h3>
                                <Table
                                    bordered
                                    size="small"
                                    columns={[
                                        { title: '姓名', dataIndex: 'name' },
                                        { title: '关系', dataIndex: 'relation' },
                                        { title: '电话号码', dataIndex: 'mobile' }
                                    ]}
                                    dataSource={memberDetail.userInfo.contacts}
                                />
                            </Modal>
                        </Card>
                    </Content.Panel>
                </Content>
            </Page>
        );
    }
}
export default Workers;
