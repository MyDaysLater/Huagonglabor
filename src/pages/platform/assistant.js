import React, { Component } from 'react';
import { Modal, Button, Card, message, Select, Pagination } from 'antd';
import Comp_table from "../../components/Table";
import Comp_form from "../../components/form";
import Screen from "../../components/screen";
import {
    sync_team, jzgrProjectlist, jzgrteam_getlist, post_team, gejzgrCorp_list, memberlist, team_info, update_team, result_query_team, upload_team
} from "../../services/platform";
import './style.less';
const { Option } = Select;
class Assistant extends Component {
    state = {
        columns: [
            {
                dataIndex: "team_name",
                title: "班组名称",
                fixed: "left",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "project_code",
                title: "接入编号",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "corp_code",
                title: "信用代码",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "corp_name",
                title: "总承包单位名称",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "responsible_person_name",
                title: "责任人姓名",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "responsible_person_phone",
                title: "责任人联系电话",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "responsible_person_i_d_card_type",
                title: "责任人证件类型",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "responsible_person_i_d_number",
                title: "责任人证件号码",
                width: 200,
                align: 'center',
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
            }
        ],
        treeData: {
            responsible_person_i_d_card_type: {
                value: [],
                id: 34
            },
        },
        formInlinelist: [
            {
                title: '班组名称',
                key: 'team_name',
                placeholder: '填写班组名称',
                type: 'input',
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
                key: "corp_name",
                title: "总承包单位名称",
                placeholder: '填写总承包单位名称',
                type: 'jzgrcorp_name',
                Mandatory: true
            },
            {
                key: "responsible_person_name",
                title: "责任人姓名",
                placeholder: '填写责任人姓名',
                type: 'input'
            },
            {
                key: "responsible_person_phone",
                title: "责任人电话",
                placeholder: '填写责任人电话',
                type: 'input'
            },
            {
                key: "responsible_person_i_d_card_type",
                title: "责任人证件类型",
                placeholder: '填写责任人证件类型',
                type: 'dict'
            },
            {
                key: "responsible_person_i_d_number",
                title: "责任人证件号码",
                placeholder: '填写责任人证件号码',
                type: 'input'
            },
            {
                key: "entry_time",
                title: "进场时间",
                placeholder: '选择进场时间',
                type: 'date',
                date_format: 'YYYY-MM-DD',
            },
            {
                key: "exit_time",
                title: "退场时间",
                placeholder: '选择退场时间',
                type: 'date',
                date_format: 'YYYY-MM-DD',
            },
            {
                key: "entry_attachments",
                title: "进场附件",
                type: 'upload'
            },
            {
                key: "exit_attachments",
                title: "退场附件",
                type: 'upload'
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
        dataSource: [],
        bordered: true,
        pagination: true,
        list: [],
        corpid: '',
        project_modal_show: false,
        projectitems: [],
        memberitems: [],
        jzgrCorpitems: [],
        projectid: '',
        memberid: '',
        fromshow: false,
        meta: {},
        meta_object: {
            project_meta: {},
            member_meta: {},
            jzgrCorp_meta: {},
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
        formInline: {
            team_name: "",
            corp_name: "",
            responsible_person_name: "",
            responsible_person_phone: "",
            project_code: "",
            responsible_person_i_d_card_type: "",
            responsible_person_i_d_number: "",
            corp_code: "",
            entry_time: "",
            exit_time: "",
            entry_attachments: "",
            exit_attachments: "",
        },
        update: false,
        update_id: '',
        query_corp_code: '',
        cre_api_data: {}
    }
    constructor(props) {
        super(props)
        const { corpid } = props.match.params;
        this.state.corpid = corpid;
        this.page_change = this.page_change.bind(this);
        this.createdata = this.createdata.bind(this);
        this.companyScroll = this.companyScroll.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.onUploadFileChange = this.onUploadFileChange.bind(this);
        this.screen = this.screen.bind(this);
        this.put_data = this.put_data.bind(this);
        this.create_api_data = this.create_api_data.bind(this);
    }
    componentDidMount() {
        this.list();
        this.jzgrProjectlist();
        this.jzgrcorplist();
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
        }, () => {
            this.memberlist();
        }
        )
    }
    base_select(value) {
        this.setState({
            memberid: value
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
            'filter[corp_project_id]': this.state.projectid,
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
    // 新增数据
    async createdata(value) {
        const { errCode, errMsg, data } = await post_team({
            ...value,
            ...this.state.cre_api_data
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
    beforeUpload(upload_key, file) {
        let {
            uploadarr,
        } = this.state;
        if (uploadarr[upload_key].value) {
            let nameArr = uploadarr[upload_key].value.map((item) => {
                return item.name
            })
            let isRepeat = nameArr.indexOf(file.name)
            if (isRepeat !== -1) {
                message.error('文件名称不能重复');
                return false;
            }
            if (uploadarr[upload_key].value.length >= uploadarr[upload_key].num) {
                message.error(`文件最多${uploadarr[upload_key].num}个`);
                return false;
            }
        }
        uploadarr[upload_key].value.push(file);
        this.setState({
            uploadarr: uploadarr
        });

    }
    onRemoveFile(file) {

    }
    onUploadFileChange(upload_key, fileList) {
        // let {
        //     uploadarr,
        // } = this.state;
        // uploadarr[upload_key].value = fileList
        // this.setState({
        //     uploadarr: uploadarr
        // }, () => {
        //     console.log(this.state.uploadarr)
        // });
    }
    async list() {
        const { screen_line } = this.state;
        const { errCode, errMsg, data } = await jzgrteam_getlist({
            page: this.state.meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
            'filter[team_name][like]': screen_line.team_name || '',
            'filter[team_sys_no]': screen_line.team_sys_no || '',
            'filter[corp_name][like]': screen_line.corp_name || '',
            'filter[project_code][like]': screen_line.project_code || ''
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let arr = data.items.map((item) => {
            return {
                key: item.id,
                team_name: item.team_name || '--------',
                project_code: item.project_code || '--------',
                corp_name: item.corp_name || '--------',
                corp_code: item.corp_code || '--------',
                responsible_person_name: item.responsible_person_name || '--------',
                responsible_person_phone: item.responsible_person_phone || '--------',
                responsible_person_i_d_card_type: item.responsible_person_i_d_card_type || '--------',
                responsible_person_i_d_number: item.responsible_person_i_d_number || '--------',
                responsible_person_phone: item.responsible_person_phone || '--------',
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
        let { errCode, errMsg, data } = await sync_team({
            corp_project_member_id: this.state.memberid,
            jzgr_project_id: this.state.projectid
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

    // 上传---编辑---更新
    async dataupload(record) {
        let { errCode, errMsg } = await upload_team({
            jzgr_project_team_id: record.key
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.setState({
            query_corp_code: record.corp_code,
            update_id: record.key
        }, () => {
            this.list();

        })
    }
    async edit_data(record) {
        let data_line = this.state.formInline;
        let { errCode, errMsg, data } = await team_info(record.key)
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
        let { errCode, errMsg, data } = await update_team(this.state.update_id, {
            ...value,
            ...this.state.cre_api_data
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.list();
        this.child_Comp_form.modal_hide();

    }
    query_code = async (record) => {
        let { errCode, errMsg, data } = await result_query_team({
            jzgr_project_team_id: record.key
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        data.result && message.info(data.result);
        this.list();
    }
    render() {
        const { columns, dataSource, bordered, meta, projectitems, memberitems, meta_object, fromshow, treeData, formInlinelist, uploadarr, jzgrCorpitems, screen_list, formInline, update } = this.state;
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
                                        this.memberlist();
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
                    formInlinelist={formInlinelist}
                    uploadarr={uploadarr}
                    formInline={formInline}
                    ref="form"
                    onRef={this.onRef_Comp_form}
                    memberitems={memberitems}
                    jzgrCorpitems={jzgrCorpitems}
                    projectitems={projectitems}
                    company_scroll={this.companyScroll}
                    create={this.createdata}
                    beforeUpload={this.beforeUpload}
                    create_api_data={this.create_api_data}
                    onRemoveFile={this.onRemoveFile}
                    onUploadFileChange={this.onUploadFileChange}
                    update={update}
                    putdata={this.put_data}
                >
                </Comp_form>
                <Modal
                    title="选择你要同步的项目和下面的班组长"
                    visible={this.state.project_modal_show}
                    onOk={() => { this.synchronous() }}
                    onCancel={() => { this.handleCancel() }}
                >
                    <Select
                        showSearch
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的项目"
                        optionFilterProp="children"
                        onSelect={this.project_select.bind(this)}
                        onPopupScroll={(e) => { this.companyScroll(e, 'project_meta') }}
                    >
                        {projectitems.map((item => {
                            return (
                                <Option data-type="project_meta" key={item.id} value={item.id}>{item.name}</Option>
                            )
                        }))}
                    </Select>
                    <Select
                        showSearch
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的班组长"
                        optionFilterProp="children"
                        onSelect={this.base_select.bind(this)}
                        onPopupScroll={(e) => { this.companyScroll(e, 'member_meta') }}
                    >
                        {memberitems.map((item => {
                            return (
                                item.userInfo && <Option data-type="member_meta" key={item.id} value={item.id}>{item.userInfo.name}</Option>
                            )
                        }))}
                    </Select>


                </Modal>

            </React.Fragment >
        );
    }
}

export default Assistant;