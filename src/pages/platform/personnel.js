import React, { Component } from 'react';
import { Modal, Button, Card, message, Select, Pagination } from 'antd';
import Comp_table from "../../components/Table";
import Comp_form from "../../components/form";
import Screen from "../../components/screen";
import {
    jzgrteam_getlist, jzgrProjectlist, gejzgrCorp_list, sync_worker, post_worker, worker_list, memberlist, worker_info, update_worker, upload_worker, query_worker
} from "../../services/platform";
import './style.less';
const { Option } = Select;
class Personnel extends Component {
    state = {
        columns: [
            {
                dataIndex: "corp_name",
                title: "所在企业名称",
                fixed: "left",
                width: 200,
                align: "center"
            },
            {
                dataIndex: "team_name",
                title: "班组名称",
                width: 200,
                align: "center"
            },
            {
                dataIndex: "project_code",
                title: "接入编号",
                width: 200,
                align: "center"
            },
            {
                dataIndex: "corp_code",
                title: "信用代码",
                width: 200,
                align: "center"
            },
            {
                dataIndex: "created_at",
                title: "创建时间",
                width: 200,
                align: "center"
            },
            {
                dataIndex: "response_status",
                title: "状态",
                width: 200,
                align: "center",
                render: (text, record) => (
                    <div>
                        {record.response_status === 1 ? "上传成功" : record.response_status === 2 ? '上传失败' : "未上传"}
                    </div>
                ),
            },
            {
                dataIndex: "action",
                title: "操作",
                fixed: "right",
                align: "center",
                width: 200,
                render: (text, record) => (
                    <div style={{ display: 'flex', }}>
                        <Button disabled={record.response_status === 1 ? true : false} type="primary" block onClick={() => { this.edit_data(record) }} style={{ marginRight: '20px' }}>
                            编辑
              </Button>
                        <Button type="primary" block onClick={() => { this.query_code(record); }} style={{ marginRight: '20px' }}>
                            平台查询
                  </Button>
                        <Button disabled={record.response_status === 1 ? true : false} type="primary" block onClick={() => { this.dataupload(record) }}>
                            {record.response_status === 1 ? '已上传' : '待上传'}
                        </Button>
                    </div>
                ),
            }],
        treeData: {
            responsible_person_i_d_card_type: {
                value: [],
                id: 34
            },
        },
        formInlinelist: [
            {
                title: '所在企业名称',
                key: 'corp_name',
                placeholder: '填写所在企业名称',
                type: 'jzgrcorp_name',
                Mandatory: true
            },
            {
                title: '项目编码',
                key: 'project_code',
                placeholder: '填写项目编码',
                type: 'project',
                Mandatory: true
            },
            {
                key: "corp_code",
                title: "信用代码",
                placeholder: '填写信用代码',
                type: 'input',
                Mandatory: true
            },
            {
                key: "team_name",
                title: "班组名称",
                placeholder: '填写班组名称',
                type: 'team_name',
                Mandatory: true
            },
            {
                key: "team_sys_no",
                title: "班组ID编号",
                placeholder: '填写班组ID编号',
                type: 'team_sys_no',
                Mandatory: true
            },
            {
                key: "worker_list",
                title: "人员列表",
                placeholder: '人员列表',
                type: 'selectarr',
                maxarr: 20,
                Mandatory: true
            },
        ],
        selectarr: [
            {
                key: 'workerName',
                title: '工人名字',
                type: 'input',
                Mandatory: true
            },
            {
                key: 'isTeamLeader',
                title: '是否班组长',
                type: 'dict',
                Mandatory: true
            },
            {
                key: 'idCardType',
                title: '证件类型',
                type: 'dict',
                Mandatory: true
            },
            {
                key: 'idCardNumber',
                title: '证件号码',
                type: 'input',
                Mandatory: true
            },
            {
                key: 'workType',
                title: '工种',
                type: 'dict',
                Mandatory: true
            },
            {
                key: 'workRole',
                title: '工人类型',
                type: 'dict',
                Mandatory: true
            },
            {
                key: 'issueCardDate',
                title: '发卡时间',
                type: 'date'
            },
            {
                key: 'issueCardPic',
                title: '办卡采集相片',
                placeholder: '(Base64 字符串或文件地址)',
                type: 'input'
            },
            {
                key: 'cardNumber',
                title: '考勤卡号',
                type: 'input'
            },
            {
                key: 'payRollBankCardNumber',
                title: '发放工资银行卡号',
                type: 'input'
            },
            {
                key: 'payRollBankName',
                title: '发放工资银行名称',
                type: 'input'
            },
            {
                key: 'bankLinkNumber',
                title: '发放工资卡银行联号',
                type: 'input'
            },
            {
                key: 'payRollTopBankCode',
                title: '发放工资卡银行',
                type: 'dict'
            },

            {
                key: 'hasBuyInsurance',
                title: '是否购买工伤或意外伤害保险',
                type: 'dict'
            },

            {
                key: 'nation',
                title: '民族',
                type: 'input',
                Mandatory: true
            },
            {
                key: 'address',
                title: '住址',
                type: 'input',
                Mandatory: true
            },
            {
                key: 'headImage',
                title: '头像',
                type: 'input',
                placeholder: '(Base64 字符串或文件地址)',
                Mandatory: true
            },
            {
                key: 'politicsType',
                title: '政治面貌',
                type: 'dict',
                Mandatory: true
            },
            {
                key: 'joinedTime',
                title: '加入工会时间',
                type: 'date'
            },
            {
                key: 'cellPhone',
                title: '手机号码 ',
                type: 'input',
                Mandatory: true
            },
            {
                key: 'cultureLevelType',
                title: '文化程度',
                type: 'dict',
                Mandatory: true
            },
            {
                key: 'Specialty',
                title: '特长',
                type: 'input'
            },
            {
                key: 'hasBadMedicalHistory',
                title: '是否有重大病史',
                type: 'dict'
            },
            {
                key: 'urgentLinkMan',
                title: '紧急联系人姓名 ',
                type: 'input'
            },
            {
                key: 'urgentLinkManPhone',
                title: '紧急联系方式',
                type: 'input'
            },
            {
                key: 'workDate',
                title: '开始工作日期',
                type: 'date'
            },
            {
                key: 'maritalStatus',
                title: '婚姻状况',
                type: 'dict'
            },
            {
                key: 'grantOrg',
                title: '发证机关',
                type: 'input',
                Mandatory: true
            },
            {
                key: 'positiveIDCardImage',
                title: '正面照',
                placeholder: '(Base64 字符串或文件地址)',
                type: 'input'
            },
            {
                key: 'negativeIDCardImage',
                title: '反面照',
                placeholder: '(Base64 字符串或文件地址)',
                type: 'input'
            },
            {
                key: 'startDate',
                title: '证件有效期开始日期',
                type: 'date',
                date_format: 'YYYY-MM-DD',
            },
            {
                key: 'expiryDate',
                title: '证件有效期结束日期',
                type: 'date',
                date_format: 'YYYY-MM-DD',
            },

        ],
        uploadarr: {
            entry_attachments: {
                value: [],
                num: 5
            },
            exit_attachments: {
                value: [],
                num: 5
            },
        },
        selectarr_dict_id: {
            isTeamLeader: {
                value: [],
                id: 601
            },
            idCardType: {
                value: [],
                id: 34
            },
            workType: {
                value: [],
                id: 471
            },
            workRole: {
                value: [],
                id: 959
            },
            payRollTopBankCode: {
                value: [],
                id: 513
            },
            hasBuyInsurance: {
                value: [],
                id: 601
            },
            politicsType: {
                value: [],
                id: 637
            },
            cultureLevelType: {
                value: [],
                id: 651
            },
            hasBadMedicalHistory: {
                value: [],
                id: 601
            },
            maritalStatus: {
                value: [],
                id: 661
            },
        },
        formInline: {
            corp_code: "",
            team_name: "",
            project_code: "",
            corp_name: "",
            team_sys_no: "",
            worker_list: [],
        },
        dataSource: [],
        bordered: true,
        pagination: true,
        list: [],
        corpid: '',
        project_modal_show: false,
        projectitems: [],
        memberitems: [],
        teamitems: [],
        jzgrCorpitems: [],
        projectid: '',
        team_id: [],
        fromshow: false,
        meta: {},
        meta_object: {
            project_meta: {},
            member_meta: {},
            jzgrCorp_meta: {},
            team_meta: {},
        },
        screen_list: [
            {
                key: 'team_name',
                title: '班组名称',
                type: "input"
            },
            {
                key: 'team_sys_no',
                title: '班组ID编号',
                type: "input"
            },
            {
                key: 'project_code',
                title: '接入编号',
                type: "input"
            },
        ],
        screen_line: {},
        update: false,
        update_id: '',
        query_project_code: '',
        cre_api_data: {},
        cre_team_data: {}
    }
    constructor(props) {
        super(props)
        const { corpid } = props.match.params;
        this.state.corpid = corpid;
        this.page_change = this.page_change.bind(this);
        this.createdata = this.createdata.bind(this);
        this.companyScroll = this.companyScroll.bind(this);
        this.screen = this.screen.bind(this);
        this.create_api_data = this.create_api_data.bind(this);
        this.create_team_data = this.create_team_data.bind(this);

    }
    componentDidMount() {
        this.list();
        this.jzgrProjectlist();
        this.memberlist();
        this.jzgrcorplist();
        this.jzgrteam_getlist();
    }
    screen(value) {
        this.setState({
            screen_line: value
        }, () => {
            this.list();
        })
    }
    project_select(value) {
        this.setState({
            projectid: value
        })
    }
    base_select(value) {
        if (value.length > 5) {
            message.error('不能超过五个');
        } else {
            this.setState({
                team_id: value
            })
        }

    }
    // 企业列表
    async jzgrcorplist() {
        const { errCode, errMsg, data } = await gejzgrCorp_list({
            page: this.state.meta_object.jzgrCorp_meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, jzgrCorpitems } = this.state;
        jzgrCorpitems = jzgrCorpitems.concat(data.items)
        meta_object.jzgrCorp_meta = data._meta;
        this.setState({
            jzgrCorpitems: jzgrCorpitems,
            meta_object: meta_object
        })
    }

    // 人员列表
    async memberlist() {
        const { errCode, errMsg, data } = await memberlist({
            page: this.state.meta_object.member_meta.currentPage || 1,
            "filter[role][in][0]": 'worker',
            "filter[role][in][1]": 'teamleader',
            'filter[corp_id]': this.state.corpid,
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, memberitems } = this.state;
        memberitems = memberitems.concat(data.items)
        meta_object.member_meta = data._meta;
        this.setState({
            memberitems: memberitems,
            meta_object: meta_object
        })
    }
    // 项目
    async jzgrProjectlist() {
        const { errCode, errMsg, data } = await jzgrProjectlist({
            page: this.state.meta_object.project_meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, projectitems } = this.state;
        projectitems = projectitems.concat(data.items)
        meta_object.project_meta = data._meta;
        this.setState({
            projectitems: projectitems,
            meta_object: meta_object
        })
    }
    // 班组列表
    async jzgrteam_getlist() {
        const { errCode, errMsg, data } = await jzgrteam_getlist({
            page: this.state.meta_object.project_meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, teamitems } = this.state;
        teamitems = teamitems.concat(data.items)
        meta_object.team_meta = data._meta;
        this.setState({
            teamitems: teamitems,
            meta_object: meta_object
        })
    }
    // 新增数据要的额外参数
    create_api_data(value) {
        let cre_api_data = {
            corp_id: value.corp_id,
            jzgr_corp_id: value.jzgr_corp_id,
            jzgr_project_id: value.id,
        }
        this.setState({
            cre_api_data,
        })
    }
    create_team_data(value) {
        let cre_team_data = {
            team_name: value.team_name,
            team_sys_no: value.team_sys_no,
            jzgr_project_team_id: value.id,
        }
        this.setState({
            cre_team_data,
        })
    }
    // 新增数据
    async createdata(value) {
        const { errCode, errMsg, data } = await post_worker({
            ...value,
            ...this.state.cre_api_data,
            ...this.state.cre_team_data
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.list();
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
                if (value === 'member_meta') {
                    this.memberlist();
                } else if (value === 'project_meta') {
                    this.jzgrProjectlist();
                } else if (value === 'team_meta') {
                    this.jzgrteam_getlist();
                }
            }
        }
    }
    onRef = (ref) => {
        this.child_comp_table = ref
    }
    onRef_Comp_form = (ref) => {
        this.child_Comp_form = ref
    }
    async list() {
        const { screen_line } = this.state;
        const { errCode, errMsg, data } = await worker_list({
            page: this.state.meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
            'filter[team_name][like]': screen_line.team_name || '',
            'filter[team_sys_no]': screen_line.team_sys_no || '',
            'filter[project_code][like]': screen_line.project_code || ''
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let arr = data.items.map((item) => {
            return {
                key: item.id,
                corp_name: item.corp_name || '--------',
                team_name: item.team_name || '--------',
                project_code: item.project_code || '--------',
                corp_code: item.corp_code || '--------',
                corp_code: item.corp_code || '--------',
                created_at: item.created_at || '--------',
                response_status: item.response_status,
            };
        })
        this.setState({
            list: data.items,
            meta: data._meta,
            dataSource: arr,
        })
    }


    handleCancel() {
        this.setState({
            project_modal_show: false
        })

    }
    page_change(page) {
        const data = this.state.meta;
        data.currentPage = page;
        this.setState({
            meta: data
        }, () => {
            this.list();
        })
    }
    async synchronous() {
        let { errCode, errMsg, data } = await sync_worker({
            corp_project_member_ids: this.state.team_id,
            jzgr_project_team_id: this.state.projectid
        });
        if (!errCode) {
            message.success(data.message);
            this.list();
        } else {
            message.error(errMsg);
        }
        this.setState({
            project_modal_show: false
        })

    }
    // 上传---编辑---更新   worker_info, update_worker, upload_worker, query_worker
    async dataupload(record) {
        let { errCode, errMsg } = await upload_worker({
            jzgr_project_worker_id: record.key
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.setState({
            query_project_code: record.project_code,
            update_id: record.key
        }, () => {
            this.list();
        })
    }
    async edit_data(record) {
        let data_line = this.state.formInline;
        let { errCode, errMsg, data } = await worker_info(record.key)
        if (errCode) {
            message.error(errMsg);
            return;
        }
        for (let item in data_line) {
            data_line[item] = data[item]
        }
        this.setState({
            formInline: data_line,
            update: true,
            update_id: record.key
        }, () => {
            this.child_Comp_form.show();
        })
    }
    async put_data(value) {
        let { errCode, errMsg, data } = await update_worker(this.state.update_id, {
            ...value,
            ...this.state.cre_api_data,
            ...this.state.cre_team_data
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.list();
        this.child_Comp_form.modal_hide();

    }
    query_code = async () => {
        let { errCode, errMsg, data } = await query_worker({
            project_code: this.state.query_project_code
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        data.result && message.info(data.result);
        this.list();
    }
    render() {
        const { columns, dataSource, bordered, meta, projectitems, memberitems, meta_object, fromshow, treeData, formInlinelist, uploadarr, teamitems, jzgrCorpitems, selectarr, selectarr_dict_id, screen_list, update } = this.state;
        return (
            <React.Fragment>
                <Card
                    title={
                        <React.Fragment>
                            <Screen
                                screen_list={screen_list}
                                screen={this.screen}
                            />
                            <div className="flex flex-end">
                                <div className="flex">
                                    <Button className="margin-right" type="primary" block onClick={() => {
                                        this.child_Comp_form.show();
                                    }}>
                                        新增数据
					</Button>
                                    <Button className="margin-right" type="primary" block onClick={() => {
                                        this.setState({
                                            project_modal_show: true
                                        })
                                    }}>
                                        同步数据
					</Button>
                                    <Button className="margin-right" type="primary" block onClick={() => { }}>
                                        导入数据
					</Button>
                                    <Button className="margin-right" type="primary" block onClick={() => {

                                    }}>
                                        全部上传
					</Button>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                >
                    <Comp_table
                        bordered={bordered}
                        dataSource={dataSource}
                        columns={columns}
                        meta={meta}
                        ref="table"
                        onRef={this.onRef}
                        page_change={this.page_change}
                    />
                </Card>
                <Comp_form
                    fromshow={fromshow}
                    treeData={treeData}
                    selectarr_dict_id={selectarr_dict_id}
                    formInlinelist={formInlinelist}
                    uploadarr={uploadarr}
                    selectarr={selectarr}
                    formInline={this.state.formInline}
                    ref="form"
                    onRef={this.onRef_Comp_form}
                    memberitems={memberitems}
                    jzgrCorpitems={jzgrCorpitems}
                    teamitems={teamitems}
                    projectitems={projectitems}
                    create={this.createdata}
                    company_scroll={this.companyScroll}
                    update={update}
                    create_api_data={this.create_api_data}
                    create_team_data={this.create_team_data}
                    putdata={this.put_data}
                >
                </Comp_form>
                <Modal
                    title="选择你要同步的人员"
                    visible={this.state.project_modal_show}
                    onOk={() => { this.synchronous() }}
                    onCancel={() => { this.handleCancel() }}
                >
                    <Select
                        showSearch
                        mode="multiple"
                        maxTagCount={3}
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的人员(最多五个)"
                        optionFilterProp="children"
                        value={this.state.team_id}
                        onChange={this.base_select.bind(this)}
                        onPopupScroll={(e) => { this.companyScroll(e, 'member_meta') }}
                    >
                        {memberitems.map((item => {
                            return (
                                item.userInfo && <Option data-type="member_meta" key={item.id} value={item.id}>{item.userInfo.name}</Option>
                            )
                        }))}
                    </Select>

                    <Select
                        showSearch
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的班组"
                        optionFilterProp="children"
                        onSelect={this.project_select.bind(this)}
                        onPopupScroll={(e) => { this.companyScroll(e, 'team_meta') }}
                    >
                        {teamitems.map((item => {
                            return (
                                <Option data-type="team_meta" key={item.id} value={item.id}>{item.team_name}</Option>
                            )
                        }))}
                    </Select>
                </Modal>

            </React.Fragment >
        );
    }
}

export default Personnel;