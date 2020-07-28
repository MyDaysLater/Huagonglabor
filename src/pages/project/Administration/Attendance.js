import React, { Component } from "react";
import {
    Card,
    DatePicker,
    Table,
    Tag,
    Button,
    Badge,
    Modal,
    message,
    Steps,
    Col, Row, PageHeader, Select
} from "antd";
import { inject, observer } from "mobx-react";
import styles from "../../attendance/Attendance.module.less";
import { ROLES, ROLELABEL } from "../../../constants";
import attendanceService from "../../../services/attendance";
import { updateverify } from "../../../services/salary";
import projectService from '../../../services/project';
import moment from "moment";
import "./administratin.less";
import Page from '../../../components/Page';
const { Content } = Page;
@inject("project")
@inject("staff")
@inject("user")
@observer
class Attendances extends Component {
    state = {
        projectId: "",
        workerList: {
            items: [],
        },
        examineall: true,
        examineone: true,
        stepcurrent: 0,
        visible: false,
        steplist: [],
        selectedRowKeys: [],
        treeNodeLoading: true,
        treeSelectedKeys: ["0-0"],
        defaultExpandedKeys: ["0-0"],
        selectedNode: "",
        userole: "",
        attendance_id_arr: [],
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        page: 1,
        pageSize: 1,
        total: 1,
        corpid: '',
        userid: '',
        mutation: false,
        select_project_arr: [],
        select_pm_arr: [],
        attendanceVerifyDefine: [],
        meta: {},
        meta_object: {
            project_meta: {},
            pm_meta: {},
        },
    };
    constructor(props) {
        super(props);
        const { id, corpid } = props.match.params;
        const { authorize, userInfo, jurisdiction } = props;
        this.state.corpid = corpid;
        this.state.userid = userInfo.id;
        // this.state.userole = 'sf';
        console.log(authorize)
        this.state.userole = authorize.role.type;
        this.state.mutation = jurisdiction;
    }
    componentDidMount() {
        // this.getMembersTree();
        this.getTreeNodeMembers();
        this.project_list();
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
    async getTreeNodeMembers(isExport = false) {
        const { projectId, selectedNode, startDate, endDate } = this.state;
        const { staffCorpRoleResult } = this.props.staff;
        const isContractor = staffCorpRoleResult.role === ROLES.contractor;
        this.setState({ treeNodeLoading: true });
        let params = {
            page: this.state.meta.currentPage || 1,
            "filter[corp_project_id]": projectId,
            'filter[corp_id]': this.state.corpid,
            "filter[day][gte]": startDate,
            "filter[day][lte]": endDate,
            sort: "name",
            expand: 'userInfo,record,attendanceVerifys,projectMember,attendanceVerifyDefine',
            user_id: selectedNode.userId,
            export: isExport,
            role: selectedNode.role || (isContractor ? ROLES.contractor : ROLES.master),
        };
        const { errCode, errMsg, data } = await attendanceService.list(params);
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.setState({ treeNodeLoading: false });
        if (isExport) {
            return data;
        }
        this.setState({
            workerList: data,
            meta: data._meta
            // total:data._meta.totalCount,
            // pageSize:data._meta.perPage,
        });
    }
    async getTreeNodeMembers_pm(isExport = false) {
        const { projectId, selectedNode, startDate, endDate } = this.state;
        const { staffCorpRoleResult } = this.props.staff;
        const isContractor = staffCorpRoleResult.role === ROLES.contractor;
        this.setState({ treeNodeLoading: true });
        let params = {
            page: this.state.meta.currentPage || 1,
            "filter[corp_project_id]": projectId,
            "filter[day][gte]": startDate,
            "filter[day][lte]": endDate,
            sort: "name",
            user_id: selectedNode.userId,
            export: isExport,
            expand: 'userInfo,record,attendanceVerifys,projectMember,attendanceVerifyDefine',
            role: selectedNode.role || (isContractor ? ROLES.contractor : ROLES.master),
        };
        const { errCode, errMsg, data } = await attendanceService.list(params);
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.setState({ treeNodeLoading: false });
        if (isExport) {
            return data;
        }
        this.setState({
            workerList: data,
            // total:data._meta.totalCount,
            // pageSize:data._meta.perPage,
        });
    }
    onMembersTreeSelected(pos, { node }) {
        this.setState({ treeSelectedKeys: pos, selectedNode: node.props }, () => {
            this.getTreeNodeMembers();
        });
    }
    onDatePickerChange(m) {
        this.setState(
            {
                startDate: m[0].format("YYYY-MM-DD"),
                endDate: m[1].format("YYYY-MM-DD"),
            },
            () => {
                this.getTreeNodeMembers();
            }
        );
    }
    disabledDateFun(current) {
        return current && current > moment().endOf("day");
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        let arr = [];
        let verifyarr = [];
        if (selectedRowKeys.length) {
            selectedRows.map((item) => {
                arr.push(item.attendance_id);
                verifyarr.push({
                    attendance_verify_id: item.attendance_verify_id,
                    status: 1
                });
            })
            this.setState({
                selectedRowKeys,
                attendance_id_arr: arr,
                attendance_verify_id_arr: verifyarr,
                examineall: false,
            });
        } else {
            this.setState({
                selectedRowKeys,
                attendance_id_arr: [],
                attendance_verify_id_arr: [],
                examineall: true,
            });
        }
    };
    examineall() {
        this.updateverifyarr(this.state.attendance_verify_id_arr);
    }
    async ofwages(attendance_verify_id, attendance_id) {
        this.state.attendance_id_arr = [];
        this.state.attendance_id_arr.push(attendance_id);
        this.state.attendance_verify_id_arr = [];
        this.state.attendance_verify_id_arr.push({
            attendance_verify_id: attendance_verify_id,
            status: 1
        });
        const r = this.updateverifyarr(this.state.attendance_verify_id_arr);
        console.log(r)
        if (r) {
            const { errCode, errMsg } = await attendanceService.p_transfer({
                attendance_ids: this.state.attendance_id_arr,
                type: 2
            })
            if (errCode) {
                message.error(errMsg);
                return;
            }
        }
    }
    ofwagesall() {
        attendanceService.p_transfer({
            attendance_ids: this.state.attendance_id_arr,
            type: 2
        }).then(res => {
            if (!res.errCode) {
                this.updateverifyarr(this.state.attendance_verify_id_arr);
            }
        })
    }
    examineone(attendance_verify_id) {

        let arr = [];
        arr.push({
            attendance_verify_id: attendance_verify_id,
            status: 1
        })
        this.updateverifyarr(arr);
    }
    updateverifyarr(arr) {
        updateverify({
            attendance_verify: arr,
        }).then(res => {
            if (res.errCode) {
                message.error(res.errMsg);
                return;
            } else {
                message.success('审核完成')
                this.getTreeNodeMembers();
                return 1;
            }
        })
    }
    handleOk() {
        this.setState({
            visible: false,
        });
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    pagechange(page) {
        this.setState({
            page: page
        })
    }
    showmodal(index) {
        const { workerList } = this.state;
        const { items } = workerList;
        const s = items[index];
        if (items[index].attendance !== null) {
            if (s.attendanceVerifys.length) {
                let a = 0;
                let step_role = s.attendanceVerifys[s.attendanceVerifys.length - 1].role;
                let step_status = s.attendanceVerifys[s.attendanceVerifys.length - 1].status;
                a = s.attendanceVerifys.length;
                step_status === 0 && (a -= 1);
                let current_role = s.attendanceVerifys[1].role === 'contractor';
                this.setState({
                    visible: true,
                    steplist: s.attendanceVerifys,
                    attendanceVerifyDefine: s.attendanceVerifyDefine,
                    stepcurrent: a + 2
                });
            }
        } else {
            this.state.stepcurrent = 0;
            this.state.steplist = [];
        }
    }
    async exportData() {
        const { projectId, selectedNode, startDate, endDate } = this.state;
        const { staffCorpRoleResult } = this.props.staff;
        const isContractor = staffCorpRoleResult.role === ROLES.contractor;

        let params = {
            "filter[corp_project_id]": projectId,
            "filter[day][gte]": startDate,
            "filter[day][lte]": endDate,
            sort: "name",
            verify: 1,
            user_id: selectedNode.userId,
            role:
                selectedNode.role || (isContractor ? ROLES.contractor : ROLES.master),
        };
        const { downloadCode } = await this.getTreeNodeMembers(true);
        params.downloadCode = downloadCode;
        const downloadUrl = attendanceService.downloadUrl(params);
        window.open(downloadUrl, "_blank");
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
    render() {
        const { membersTreeResult } = this.props.project;
        const {
            treeSelectedKeys,
            defaultExpandedKeys,
            workerList,
            selectedRowKeys,
            stepcurrent,
            steplist,
            userole,
            examineall,
            treeNodeLoading,
            select_project_arr,
            select_pm_arr,
            meta,
            userid,
            mutation,
            attendanceVerifyDefine,
        } = this.state;
        const treeData = [
            { title: "全部", value: 0, children: membersTreeResult.data.items },
        ];
        const tableDataSource = workerList.items.map((item, index) => {
            let { attendanceVerifys, userInfo, projectMember, attendanceVerifyDefine } = item;
            let Verifyrole = '';
            let upfataVerifyid = "";
            let attendance_id = "";
            let status = 1;
            let user_id = '';
            if (!projectMember) {
                projectMember = {};
            }
            if (attendanceVerifys.length > 0) {
                Verifyrole = attendanceVerifys[attendanceVerifys.length - 1].role;
                upfataVerifyid = attendanceVerifys[attendanceVerifys.length - 1].id;
                status = attendanceVerifys[attendanceVerifys.length - 1].status;
                attendance_id = attendanceVerifys[attendanceVerifys.length - 1].attendance_id;
                for (let i in attendanceVerifyDefine) {
                    Verifyrole === attendanceVerifyDefine[i].role && attendanceVerifyDefine[i].user_id && (user_id = attendanceVerifyDefine[i].user_id)
                }
            }
            if (!userInfo) userInfo = {};
            return {
                key: index,
                day: item.dayFormat,
                name: userInfo.name,
                workNo: projectMember.work_no,
                startStatus: item.start,
                endStatus: item.end,
                startTime: item.start_time,
                over_start: item.over_start,
                over_start_status: item.over_start_status,
                endTime: item.end_time,
                over_end: item.over_end,
                over_end_status: item.over_end_status,
                mobile: userInfo.mobile,
                role: projectMember.role,
                validateDuration: item.is_verify,
                attendance_verify_id: item.attendance_verify_id,
                wages: item.salary,
                day_cost: item.day_cost,
                newshrole: Verifyrole,
                upfataVerifyid: upfataVerifyid,
                attendance_id: attendance_id,
                status: status,
                attendance: item,
                shenhe_user_id: user_id,
                attendanceVerifys: attendanceVerifys
            };
        });
        const tableColumns = [
            {
                title: "打卡人员",
                dataIndex: "workNo",
                key: "workNo",
                render: (text, record) => {
                    return (
                        <>
                            <p>工号：{record.workNo}</p>
                            <p>
                                姓名：{record.name}
                                <Tag>{ROLELABEL[record.role]}</Tag>
                            </p>
                        </>
                    );
                },
            },
            {
                title: "打卡时间",
                dataIndex: "startTime",
                key: "startTime",
                render: (text, record) => {
                    return (
                        <>
                            <p>
                                上班：
                <Badge
                                    status={
                                        record.startTime
                                            ? record.startStatus
                                                ? "warning"
                                                : "success"
                                            : "default"
                                    }
                                    text={record.startTime ? record.startStatus : record.day + "-未打卡"}
                                />
                            </p>
                            <p>
                                下班：
                <Badge
                                    status={
                                        record.endTime
                                            ? record.endStatus
                                                ? "warning"
                                                : "success"
                                            : "default"
                                    }
                                    text={record.endTime ? record.endStatus : record.day + "-未打卡"}
                                />
                            </p>
                        </>
                    );
                },
            },
            {
                title: "加班",
                dataIndex: "endTime",
                key: "endTime",
                render: (text, record) => {
                    return (
                        <>
                            <p>
                                上班：
                <Badge
                                    status={
                                        record.over_start
                                            ? record.over_start_status
                                                ? "warning"
                                                : "success"
                                            : "default"
                                    }
                                    text={record.over_start ? record.over_start : "-----"}
                                />
                            </p>
                            <p>
                                下班：
                <Badge
                                    status={
                                        record.over_end
                                            ? record.over_end_status
                                                ? "warning"
                                                : "success"
                                            : "default"
                                    }
                                    text={record.over_end ? record.over_end : "-----"}
                                />
                            </p>
                        </>
                    );
                },
            },
            {
                title: "工资",
                dataIndex: "wages",
                key: "wages",
                render: (text, record) => {
                    return (
                        <>
                            <p>工资：{record.wages}</p>
                            <p>生活费：{record.day_cost}</p>
                        </>
                    );
                },
            },
            {
                title: "审核",
                dataIndex: "validateDuration",
                key: "validateDuration",
                render: (text, record, index) => {
                    return (
                        <>
                            <p>
                                状态：
                {text === 10 ? "审核完成" : (text === 0 ? "未审核" : (typeof text === "undefined" || record.attendanceVerifys.length === 0 ? "无审核记录" : "审核中"))}
                            </p>
                            {record.attendanceVerifys.length !== 0 && <p>
                                {typeof text !== "undefined" && <a onClick={this.showmodal.bind(this, index)}>详情</a>}
                            </p>}
                        </>
                    );
                },
            },
            {
                title: "操作",
                dataIndex: "examine",
                key: "examine",
                render: (text, record, index) => {
                    return (
                        (record.shenhe_user_id ? (userid === record.shenhe_user_id || userole === 'master') && mutation : userole === 'master' || userole === record.newshrole) ? <Button
                            type="primary"
                            disabled={record.status === 1 ? true : false}
                            onClick={(userole === 'sf' || userole === 'master') && record.newshrole === 'sf' ? this.ofwages.bind(this, record.attendance_verify_id, record.attendance_id) : this.examineone.bind(this, record.attendance_verify_id)
                            }
                        >
                            {(userole === 'sf' || userole === 'master') && record.newshrole === 'sf' ? record.status === 1 ? '已发放工资' : '发放工资' : record.status === 1 && record.attendanceVerifys.length ? '已审核' : '审核'}
                        </Button> : record.shenhe_user_id ? <div>指定人员才能审核</div> : <div>没有审核权限</div>
                    );
                },
            },
        ];
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: userole !== record.newshrole,
            }),
        };
        return (
            <Page>
                <PageHeader title="考勤" />
                <Content>
                    <Content.Panel>
                        <Card
                            className={styles.card}
                            extra={
                                <React.Fragment>
                                    <DatePicker.RangePicker
                                        // mode="date"
                                        allowClear={false}
                                        ranges={{ 今天: [moment(), moment()] }}
                                        disabledDate={this.disabledDateFun.bind(this)}
                                        onChange={this.onDatePickerChange.bind(this)}
                                        defaultValue={[moment(), moment()]}
                                    />
                                    <Button
                                        style={{ marginLeft: 8 }}
                                        onClick={this.exportData.bind(this)}
                                        type="primary"
                                    >
                                        导出考勤
            </Button>
                                    <Button
                                        style={{ marginLeft: 8 }}
                                        onClick={userole === 'sf' ? this.ofwagesall.bind(this) : this.examineall.bind(this)}
                                        type="primary"
                                        disabled={examineall}
                                    >
                                        {userole === 'sf' ? '全部发放' : '全部审核'}
                                    </Button>
                                </React.Fragment>
                            }
                        >
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
                                </Row>
                                {/*  <Row>
                                    <Col span={24} style={{ textAlign: 'left' }}>
                                        <Button type="primary" htmlType="submit">
                                            筛选
          </Button>
                                    </Col>
                                </Row> */}
                            </div>
                            <Table
                                style={{ background: 'rgb(255,255,255)', width: '100%' }}
                                rowSelection={rowSelection}
                                bordered={true}
                                pagination={{ position: 'bottom', current: meta.currentPage, pageSize: meta.perPage, total: meta.totalCount, onChange: (current, pageSize) => this.page_change(current, pageSize) }}
                                columns={tableColumns}
                                dataSource={tableDataSource}
                                loading={treeNodeLoading && !membersTreeResult.pending}

                            />

                            <Modal
                                title="审核步骤"
                                visible={this.state.visible}
                                onOk={() => this.handleOk()}
                                onCancel={() => this.handleCancel()}
                            >
                                <Steps current={stepcurrent} direction="vertical">
                                    <Steps.Step
                                        title="班组长审核"
                                        description={
                                            <Badge status="success" text="审核完毕" />
                                        }
                                    />
                                    <Steps.Step
                                        title="承包人审核"
                                        description={
                                            <Badge status="success" text="审核完毕" />
                                        }

                                    />
                                    {attendanceVerifyDefine.map((item, index) => {
                                        return item.status && <Steps.Step
                                            title={item.desc + '审核'}
                                            key={index}
                                            description={
                                                steplist.map((item2, index2) => {
                                                    if (item.role === item2.role) {
                                                        return (
                                                            item2.status ?
                                                                <Badge key={index2} status="success" text="审核完毕" />
                                                                : <Badge key={index2} status="processing" text="待审核" />
                                                        )
                                                    }
                                                })
                                                // stepcurrent > index + 2 ?
                                                //     <Badge status="success" text="审核完毕" />
                                                //     : <Badge status="processing" text="待审核" />
                                            }
                                        />


                                    })}
                                </Steps>
                            </Modal>
                        </Card>
                    </Content.Panel>
                </Content>
            </Page>
        );
    }
}

export default Attendances;
