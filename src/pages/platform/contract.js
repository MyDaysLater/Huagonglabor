import React, { Component } from 'react';
import { Modal, Button, Card, message, Select, Pagination } from 'antd';
import Comp_table from "../../components/Table";
import Comp_form from "../../components/form";
import Screen from "../../components/screen";
import {
    contract_list, sync_contract, post_contract, jzgrProjectlist, gejzgrCorp_list, memberlist, update_contract, upload_contract, contract_info, query_contract
} from "../../services/platform";
import './style.less';
const { Option } = Select;
class Contract extends Component {
    state = {
        columns: [
            {
                dataIndex: "corp_id",
                title: "所在企业ID",
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
                key: 'project_code',
                title: '项目编码',
                placeholder: '填写项目编码',
                type: 'project',
                Mandatory: true
            },
            {
                key: "contract_list",
                title: "合同列表",
                placeholder: '合同列表',
                type: 'selectarr',
                maxarr: 2,
                Mandatory: true
            },
        ],
        selectarr: [
            {
                title: '所在企业名称',
                key: 'corpName',
                placeholder: '填写所在企业名称',
                type: 'jzgrcorp_name',
                Mandatory: true
            },
            {
                key: "corpCode",
                title: "信用代码",
                placeholder: '填写信用代码',
                type: 'input',
                Mandatory: true
            },
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
                key: "contractPeriodType",
                title: "合同期限类型",
                placeholder: '选择合同期限类型',
                type: 'dict',
                Mandatory: true
            },
            {
                key: "startDate",
                title: "生效日期",
                placeholder: '选择生效日期',
                type: 'date',
                date_format: 'YYYY-MM-DD',
                Mandatory: true
            },
            {
                key: "endDate",
                title: "失效日期",
                placeholder: '选择失效日期',
                type: 'date',
                date_format: 'YYYY-MM-DD',
                Mandatory: true
            },
            {
                key: "unit",
                title: "计量单位",
                placeholder: '选择计量单位',
                type: 'dict'
            },
            {
                key: "unitPrice",
                title: "计量单价",
                placeholder: '单位：元',
                type: 'decimal'
            },
            {
                key: "attachments",
                title: "合同附件",
                placeholder: '合同附件',
                type: 'upload',
            },
        ],
        uploadarr: {
            attachments: {
                value: [],
                num: 2
            },
        },
        selectarr_dict_id: {
            idCardType: {
                value: [],
                id: 34
            },
            contractPeriodType: {
                value: [],
                id: 604
            },
            unit: {
                value: [],
                id: 613
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
        jzgrCorpitems: [],
        projectid: '',
        member_id: [],
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
                key: 'jzgr_project_id',
                title: '项目ID',
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
        formInline: {
            project_code: '',
            contract_list: []
        },
        update_id: '',
        cre_api_data: {},
        formInline_clid: {
            corpCode: "",
            corpName: "",
        },
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
        this.create_api_data = this.create_api_data.bind(this);
    }
    componentDidMount() {
        this.list();
        this.jzgrProjectlist();
        this.memberlist();
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
        })
    }
    member_select(value) {
        if (value.length > 5) {
            message.error('不能超过五个');
        } else {
            this.setState({
                member_id: value
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
            'filter[role]': 'worker',
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
        const { errCode, errMsg, data } = await post_contract({
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
                } else if (value === 'project_meta') {
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
        // if (!(file instanceof File)) {
        //     return new Promise((resolve, reject) => {
        //         Modal.confirm({
        //             title: '删除文件',
        //             content: '确定删除该文件么？',
        //             onOk: () => {
        //                 resolve();
        //             },
        //             onCancel: () => {
        //                 reject();
        //             }
        //         });
        //     });
        // }
    }
    onUploadFileChange(upload_key, fileList) {
        // let {
        //     uploadarr,
        // } = this.state;
        // uploadarr[upload_key].value = fileList
        // this.setState({
        //     uploadarr: uploadarr
        // }, () => {
        //     return false
        // });
    }
    async list() {
        const { screen_line } = this.state;
        const { errCode, errMsg, data } = await contract_list({
            page: this.state.meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
            'filter[jzgr_project_id]': screen_line.jzgr_project_id || '',
            'filter[project_code][like]': screen_line.project_code || ''
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let arr = data.items.map((item) => {
            return {
                key: item.id,
                corp_id: item.corp_id || '--------',
                // corp_name: item.contract_list.corpName || '--------',
                // id_card_number: item.contract_list.idCardNumber || '--------',
                // start_date: item.contract_list.startDate || '--------',
                // end_data: item.contract_list.endData || '--------',
                jzgr_project_id: item.jzgr_project_id || '--------',
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
        let { errCode, errMsg, data } = await sync_contract({
            corp_project_member_ids: this.state.member_id,
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
    // 上传---编辑---更新     update_contract, upload_contract, contract_info, query_contract
    async dataupload(record) {
        let { errCode, errMsg } = await upload_contract({
            jzgr_project_worker_contract_id: record.key
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
        let { errCode, errMsg, data } = await contract_info(record.key)
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
        let { errCode, errMsg, data } = await update_contract(this.state.update_id, {
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
        let { errCode, errMsg, data } = await query_contract({
            project_code: record.project_code
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        data.result && message.info(data.result);
        this.list();
    }
    render() {
        const { columns, dataSource, bordered, meta, projectitems, memberitems, uploadarr_clid, fromshow, treeData, formInlinelist, uploadarr, teamitems, jzgrCorpitems, selectarr, selectarr_dict_id, screen_list, update } = this.state;
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
                    columns={columns}
                    update={update}
                    selectarr={selectarr}
                    ref="form"
                    onRef={this.onRef_Comp_form}
                    memberitems={memberitems}
                    jzgrCorpitems={jzgrCorpitems}
                    uploadarr_clid={uploadarr_clid}
                    projectitems={projectitems}
                    create={this.createdata}
                    formInline={this.state.formInline}
                    formInline_clid={
                        this.state.formInline_clid
                    }
                    company_scroll={this.companyScroll}
                    beforeUpload={this.beforeUpload}
                    onRemoveFile={this.onRemoveFile}
                    onUploadFileChange={this.onUploadFileChange}
                    create_api_data={this.create_api_data}
                >
                </Comp_form>
                <Modal
                    title="选择你要同步的数据"
                    visible={this.state.project_modal_show}
                    onOk={() => { this.synchronous() }}
                    onCancel={() => { this.handleCancel() }}
                >
                    <Select
                        showSearch
                        mode="multiple"
                        maxTagCount={5}
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的员工"
                        optionFilterProp="children"
                        value={this.state.member_id}
                        onChange={this.member_select.bind(this)}
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
                </Modal>

            </React.Fragment >
        );
    }
}
export default Contract;