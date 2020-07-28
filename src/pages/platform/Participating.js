import React, { Component } from 'react';
import { Modal, Button, Card, message, Select, Pagination } from 'antd';
import Comp_table from "../../components/Table";
import Comp_form from "../../components/form";
import {
    jzgrcontractor_post, jzgrcontractor_getlist, sync_contractor, jzgrProjectlist, jzgrcontractor_info, update_contractor, upload_contractor, baselist, query_contractor
} from "../../services/platform";
import './style.less';
import Screen from "../../components/screen";
const { Option } = Select;
class Participating extends Component {
    state = {
        columns: [{
            dataIndex: "contractor_corp_name",
            title: "总承包单位名称",
            fixed: "left",
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
            dataIndex: "name",
            title: "项目名称",
            width: 200,
            align: "center"
        },
        {
            dataIndex: "contractor_corp_code",
            title: "信用代码",
            width: 200,
            align: "center"
        },
        {
            dataIndex: "description",
            title: "项目简介",
            width: 200,
            align: "center"
        },
        {
            dataIndex: "category",
            title: "项目分类字典ID",
            width: 200,
            align: "center"
        },
        {
            dataIndex: "build_corp_name",
            title: "建设单位名称",
            width: 200,
            align: "center"
        },
        {
            dataIndex: "build_corp_code",
            title: "建设单位统一社会信用代码",
            width: 200,
            align: "center"
        },
        // {
        //     dataIndex: "builder_licenses",
        //     title: "施工许可证",
        //     width: 200,
        //     align: "center",
        //     render: (text, record) => (
        //         <Button type="primary" block onClick={() => { }}>
        //             查看许可证
        //         </Button>
        //     ),
        // },
        {
            dataIndex: "area_code",
            title: "项目所在地字典ID",
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
            corp_type: {
                value: [],
                id: 746
            },
            bank_code: {
                value: [],
                id: 513
            },
            legal_man_i_d_card_type: {
                value: [],
                id: 34
            }
        },
        formInlinelist: [
            {
                key: 'corp_name',
                title: '总承包单位名称',
                placeholder: '填写企业名称',
                type: 'base',
                Mandatory: true
            },
            {
                key: 'project_code',
                title: '项目编码',
                placeholder: '填写项目编码',
                type: 'project',
                Mandatory: true
            },
            {
                key: "corp_type",
                title: "参建类型id",
                placeholder: '填写参建类型id',
                type: 'dict',
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
                key: "entry_time",
                title: "进场时间",
                placeholder: '选择进场时间',
                type: 'date',
                date_format: 'YYYY-MM-DD',
                Mandatory: false
            },
            {
                key: "exit_time",
                title: "退场时间",
                placeholder: '选择退场时间',
                type: 'date',
                date_format: 'YYYY-MM-DD',
                Mandatory: false
            },
            {
                key: "bank_code",
                title: "银行代码",
                placeholder: '填写银行代码',
                type: 'dict',
                Mandatory: false
            },
            {
                key: "bank_name",
                title: "银行支行名称",
                placeholder: '填写银行支行名称',
                type: 'input',
                Mandatory: false
            },
            {
                key: "bank_number",
                title: "银行卡号",
                placeholder: '填写银行卡号',
                type: 'input',
                Mandatory: false
            },
            {
                key: "bank_linkNumber",
                title: "银行联号",
                placeholder: '填写银行联号',
                type: 'input',
                Mandatory: false
            },
            {
                key: "pm_name",
                title: "项目经理名称",
                placeholder: '填写项目经理名称',
                type: 'input',
                Mandatory: false
            },
            {
                key: "legal_man_i_d_card_type",
                title: "项目经理证件类型",
                placeholder: '填写项目经理证件类型',
                type: 'dict',
                Mandatory: false
            },
            {
                key: "legal_man_i_d_card_number",
                title: "项目经理证件号码",
                placeholder: '填写项目经理证件号码',
                type: 'input',
                Mandatory: false
            },
            {
                key: "pm_phone",
                title: "项目经理电话",
                placeholder: '填写项目经理电话',
                type: 'input',
                Mandatory: false
            },
        ],
        dataSource: [],
        bordered: true,
        pagination: true,
        list: [],
        corpid: '',
        project_modal_show: false,
        projectitems: [],
        baseitems: [],
        projectid: '',
        base_id: '',
        fromshow: false,
        meta: {},
        meta_object: {
            project_meta: {},
            base_meta: {},
        },

        bank_infos: {
            bank_name: "",
            bank_code: "",
            bank_number: "",
            bank_linkNumber: ""
        },
        screen_list: [
            {
                key: 'jzgr_corp_id',
                title: '公司ID',
                type: "input"
            },
            {
                key: 'project_code',
                title: '接入编号',
                type: "input"
            },
            {
                key: 'corp_name',
                title: '总承包单位名称',
                type: "input"
            },
            {
                key: 'pm_name',
                title: '项目经理名称',
                type: "input"
            },
        ],
        formInline: {
            corp_name: "",
            project_code: "",
            corp_type: "",
            corp_code: "",
            entry_time: "",
            exit_time: "",
            bank_name: "",
            bank_code: "",
            bank_number: "",
            bank_linkNumber: "",
            pm_name: "",
            legal_man_i_d_card_type: "",
            legal_man_i_d_card_number: "",
            pm_phone: "",
        },
        screen_line: {},
        update: false,
        update_id: '',
        query_id: '',
        cre_api_data: {}
    }
    constructor(props) {
        super(props)
        const { corpid } = props.match.params;
        this.state.corpid = corpid;
        this.page_change = this.page_change.bind(this);
        this.createdata = this.createdata.bind(this);
        this.companyScroll = this.companyScroll.bind(this);
        this.screen = this.screen.bind(this);
        this.put_data = this.put_data.bind(this);
        this.create_api_data = this.create_api_data.bind(this);
    }
    componentDidMount() {
        this.list();
        this.jzgrProjectlist();
        this.baselist();
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
        this.setState({
            base_id: value
        })
    }
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
        let bank_infos = this.state.bank_infos;
        bank_infos.bank_name = value.bank_name;
        bank_infos.bank_code = value.bank_code;
        bank_infos.bank_number = value.bank_number;
        bank_infos.bank_linkNumber = value.bank_linkNumber;
        this.setState({
            bank_infos: bank_infos
        }, async () => {
            const { errCode, errMsg, data } = await jzgrcontractor_post({
                ...value,
                bank_infos: bank_infos,
                ...this.state.cre_api_data
            })
            if (errCode) {
                message.error(errMsg);
                return;
            }
            this.list();
        })

    }
    companyScroll(e, value) {
        e.persist();
        const { target } = e;
        // console.log(e.target.getAttribute("data-type"));
        // console.log(e.currentTarget.getAttribute("data-type"));
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            let { meta_object } = this.state;
            let page = meta_object[value].pageCount;
            if (page > meta_object[value].currentPage) {
                page > meta_object[value].currentPage ? meta_object[value].currentPage += 1 : meta_object[value].currentPage = meta_object[value].currentPage
                this.setState({
                    meta_object: meta_object
                })
                if (value === 'base_meta') {
                    this.baselist();
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
    async list() {
        const { screen_line } = this.state;
        const { errCode, errMsg, data } = await jzgrcontractor_getlist({
            page: this.state.meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
            'filter[jzgr_corp_id]': screen_line.jzgr_corp_id || '',
            'filter[project_code]': screen_line.project_code || '',
            'filter[corp_name][like]': screen_line.corp_name || '',
            'filter[pm_name][like]': screen_line.pm_name || ''
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let arr = data.items.map((item) => {
            return {
                key: item.id,
                contractor_corp_name: item.contractor_corp_name || "--------",
                project_code: item.project_code || "--------",
                name: item.name || "--------",
                contractor_corp_code: item.contractor_corp_code || "--------",
                category: item.category || "--------",
                build_corp_name: item.build_corp_name || "--------",
                build_corp_code: item.build_corp_code || "--------",
                builder_licenses: item.builder_licenses || "--------",
                area_code: item.area_code || "--------",
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
    // 企业列表
    async baselist() {
        const { errCode, errMsg, data } = await baselist({
            page: this.state.meta_object.base_meta.currentPage || 1,
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, baseitems } = this.state;
        baseitems = baseitems.concat(data.items)
        meta_object.base_meta = data._meta;
        this.setState({
            baseitems: baseitems,
            meta_object: meta_object
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
        let { errCode, errMsg, data } = await sync_contractor({
            corp_base_id: this.state.base_id,
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
    async dataupload(record) {
        let { errCode, errMsg, data } = await upload_contractor({
            jzgr_project_sub_contractor_id: record.key
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.setState({
            query_id: record.project_code
        }, () => {
            this.list();
        })

    }
    async edit_data(record) {
        let data_line = this.state.formInline;
        let { errCode, errMsg, data } = await jzgrcontractor_info(record.key)
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
        let bank_infos = this.state.bank_infos;
        bank_infos.bank_name = value.bank_name;
        bank_infos.bank_code = value.bank_code;
        bank_infos.bank_number = value.bank_number;
        bank_infos.bank_linkNumber = value.bank_linkNumber;
        let { errCode, errMsg, data } = await update_contractor(this.state.update_id, {
            ...value,
            ...this.state.cre_api_data
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.list().bind(this);
        this.child_Comp_form.modal_hide();

    }
    query_code = async () => {
        let { errCode, errMsg, data } = await query_contractor({
            project_code: this.state.query_id
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        data.result && message.info(data.result);
        this.list();
    }
    render() {
        const { columns, dataSource, bordered, meta, projectitems, baseitems, meta_object, fromshow, treeData, formInlinelist, screen_list, update, formInline, add_object_data_list } = this.state;
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
                    formInlinelist={formInlinelist}
                    formInline={formInline}
                    add_object_data_list={add_object_data_list}
                    ref="form"
                    onRef={this.onRef_Comp_form}
                    baseitems={baseitems}
                    projectitems={projectitems}
                    create={this.createdata}
                    company_scroll={this.companyScroll}
                    update={update}
                    create_api_data={this.create_api_data}
                    putdata={this.put_data}
                >
                </Comp_form>
                <Modal
                    title="选择你要同步的项目"
                    visible={this.state.project_modal_show}
                    onOk={() => { this.synchronous() }}
                    onCancel={() => { this.handleCancel() }}
                >
                    <Select
                        showSearch
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的企业"
                        optionFilterProp="children"
                        onSelect={this.base_select.bind(this)}
                        onPopupScroll={(e) => { this.companyScroll(e, 'base_meta') }}
                    >
                        {baseitems.map((item => {
                            return (
                                <Option data-type="base_meta" key={item.id} value={item.id}>{item.corp_name}</Option>
                            )
                        }))}
                    </Select>

                    <Select
                        showSearch
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要参建的项目"
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

export default Participating;