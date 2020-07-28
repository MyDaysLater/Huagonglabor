import React, { Component } from 'react';
import { Modal, Button, Card, message, Select, Pagination } from 'antd';
import Comp_table from "../../components/Table";
import Comp_form from "../../components/form";
import Screen from "../../components/screen";
import {
    jzgrProjectlist, jzgrteam_getlist, gejzgrCorp_list, attendance_list, sync_attendance, post_attendance, recordlist, memberlist, attendance_info, update_attendance, query_attendance, upload_attendance
} from "../../services/platform";
import './style.less';
const { Option } = Select;
class Attendance extends Component {
    state = {
        columns: [
            {
                dataIndex: "corp_name",
                title: "所在企业名称",
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
                title: '接入编号',
                key: 'project_code',
                placeholder: '填写接入编号',
                type: 'project',
                Mandatory: true
            },
            {
                title: '班组编号',
                key: 'team_sys_no',
                placeholder: '填写班组编号',
                type: 'team_sys_no',
                Mandatory: true
            },
            {
                key: "data_list",
                title: "考勤列表",
                placeholder: '考勤列表',
                type: 'selectarr',
                maxarr: 20,
                Mandatory: true
            },
        ],
        selectarr: [
            {
                key: "idCardType",
                title: "证件类型",
                placeholder: '填写证件类型',
                type: 'dict',
                Mandatory: true
            },
            {
                title: '证件号码',
                key: 'idCardNumber',
                placeholder: '填写证件号码',
                type: 'input',
                Mandatory: true
            },
            {
                key: "date",
                title: "刷卡时间",
                placeholder: '选择合刷卡时间',
                type: 'date',
                date_format: 'YYYY-MM-DD HH:mm:ss',
                Mandatory: true
            },
            {
                key: "direction",
                title: "刷卡进出方向",
                placeholder: '选择刷卡进出方向',
                type: 'dict',
                Mandatory: true
            },
            {
                key: "image",
                title: "刷卡近照",
                placeholder: 'Base64字符串或图片地址，支持格式(jpg, png, jpeg)，不超过50KB',
                type: 'input'
            },
            {
                key: "channel",
                title: "通道的名称",
                placeholder: '选择刷卡进出方向',
                type: 'input'
            },
            {
                key: "attendType",
                title: "通行方式",
                placeholder: '通行方式',
                type: 'dict'
            },
            {
                key: "lng",
                title: "WGS84 经度",
                placeholder: 'WGS84 经度',
                type: 'input'
            },
            {
                key: "lat",
                title: "WGS84 纬度",
                placeholder: 'WGS84 纬度',
                type: 'input'
            },
        ],
        selectarr_dict_id: {
            idCardType: {
                value: [],
                id: 34
            },
            direction: {
                value: [],
                id: 607
            },
            attendType: {
                value: [],
                id: 617
            },
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
        recorditems: [],
        jzgrCorpitems: [],
        record_ids: [],
        team_id: '',
        fromshow: false,
        meta: {},
        meta_object: {
            project_meta: {},
            member_meta: {},
            jzgrCorp_meta: {},
            team_meta: {},
            record_meta: {},
        },
        screen_list: [
            {
                key: 'jzgr_project_team_id',
                title: '班组ID编号',
                type: "input"
            },
            {
                key: 'project_code',
                title: '接入编号',
                type: "input"
            },
        ],
        screen_line: {
            jzgr_project_team_id: '',
            project_code: '',
        },
        formInline: {
            project_code: '',
            team_sys_no: 0,
            data_list: [],
        },
        update: false,
        update_id: '',
        query_project_code: '',
        query_date: '',
        cre_api_data: {},
        cre_team_data: {},
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

        if (value.length > 50) {
            message.error('不能超过50个');
        } else {
            this.setState({
                record_ids: value
            })
        }
    }
    team_select(value) {
        this.setState({
            team_id: value
        }, () => {
            this.get_record_items();
        })
    }
    // 打卡列表
    async get_record_items() {
        const { errCode, errMsg, data } = await recordlist({
            page: this.state.meta_object.record_meta.currentPage || 1,
            'per-page': 50,
            'filter[corp_id]': this.state.corpid,
            'filter[group_id]': this.state.team_id,
            'filter[is_synchronous_entry_exit]': 0,
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, recorditems } = this.state;
        recorditems = recorditems.concat(data.items)
        meta_object.record_meta = data._meta;
        this.setState({
            recorditems: recorditems,
            meta_object: meta_object
        })
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
            'filter[role]': 'contractor',
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
        const { errCode, errMsg, data } = await post_attendance({
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
                } else if (value === 'record_meta') {
                    this.get_record_items();
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
        const { errCode, errMsg, data } = await attendance_list({
            page: this.state.meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
            'filter[jzgr_project_team_id]': screen_line.jzgr_project_team_id || '',
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
                team_sysNo: item.team_sysNo || '--------',
                project_code: item.project_code || '--------',
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
        let { errCode, errMsg, data } = await sync_attendance({
            jzgr_project_team_id: this.state.team_id,
            record_ids: this.state.record_ids
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
    // 上传---编辑---更新   attendance_info, update_attendance,query_attendance,upload_attendance
    async dataupload(record) {
        let { errCode, errMsg } = await upload_attendance({
            jzgr_project_worker_attendance_id: record.key
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.setState({
            query_project_code: record.project_code,
            query_date: record.date,
            update_id: record.key
        }, () => {
            this.list();

        })
    }
    async edit_data(record) {
        let data_line = this.state.formInline;
        let { errCode, errMsg, data } = await attendance_info(record.key)
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
        console.log(value)
        let { errCode, errMsg, data } = await update_attendance(this.state.update_id, {
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
    query_code = async (record) => {
        let { errCode, errMsg, data } = await query_attendance({
            project_code: record.project_code,
            date: this.state.query_date
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        data.result && message.info(data.result);
        this.list();
    }
    render() {
        const { columns, dataSource, bordered, meta, projectitems, memberitems, recorditems, fromshow, treeData, formInlinelist, teamitems, jzgrCorpitems, selectarr, selectarr_dict_id, screen_list, update } = this.state;
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
                    selectarr={selectarr}
                    ref="form"
                    onRef={this.onRef_Comp_form}
                    memberitems={memberitems}
                    jzgrCorpitems={jzgrCorpitems}
                    teamitems={teamitems}
                    projectitems={projectitems}
                    create={this.createdata}
                    company_scroll={this.companyScroll}
                    beforeUpload={this.beforeUpload}
                    onRemoveFile={this.onRemoveFile}
                    onUploadFileChange={this.onUploadFileChange}
                    formInline={this.state.formInline}
                    create_api_data={this.create_api_data}
                    create_team_data={this.create_team_data}
                    update={update}
                    putdata={this.put_data}
                >
                </Comp_form>
                <Modal
                    title="选择你要同步的数据(请先选择班组)"
                    visible={this.state.project_modal_show}
                    onOk={() => { this.synchronous() }}
                    onCancel={() => { this.handleCancel() }}
                >
                    <Select
                        showSearch
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的班组"
                        optionFilterProp="children"
                        onChange={this.team_select.bind(this)}
                        onPopupScroll={(e) => { this.companyScroll(e, 'team_meta') }}
                    >
                        {teamitems.map((item => {
                            return (
                                <Option data-type="team_meta" key={item.id} value={item.id}>{item.team_name}</Option>
                            )
                        }))}
                    </Select>

                    <Select
                        showSearch
                        mode="multiple"
                        maxTagCount={3}
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的打卡列表"
                        optionFilterProp="children"
                        value={this.state.record_ids}
                        onChange={this.project_select.bind(this)}
                        onPopupScroll={(e) => { this.companyScroll(e, 'record_meta') }}
                    >
                        {recorditems.map((item => {
                            return (
                                item.userInfo && <Option data-type="record_meta" key={item.id} value={item.id}>{item.userInfo.name}</Option>
                            )
                        }))}
                    </Select>
                </Modal>

            </React.Fragment >
        );
    }
}

export default Attendance;