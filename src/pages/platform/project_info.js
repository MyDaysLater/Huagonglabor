import React, { Component } from 'react';
import { Modal, Button, Card, message, Select } from 'antd';
import Comp_table from "../../components/Table";
import Screen from "../../components/screen";
import {
    jzgrProjectlist,
    synchronousProject,
    getprojectitems,
    upload_project,
    query_project, result_query_project
} from "../../services/platform";
const { Option } = Select;
class Project_info extends Component {
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
                    <Button type="primary" block onClick={() => { this.query_code(record); }} style={{ marginRight: '20px' }}>
                        平台查询
              </Button>
                    <Button disabled={record.response_status === 1 ? true : false} type="primary" block onClick={() => { this.dataupload(record) }}>
                        {record.response_status === 1 ? '已上传' : '待上传'}
                    </Button>
                </div>
            ),
        }],
        dataSource: [],
        bordered: true,
        pagination: true,
        meta: {},
        list: [],
        corpid: '',
        project_modal_show: false,
        projectitems: [],
        project_meta: [],
        projectid: '',
        screen_list: [
            {
                key: 'jzgr_corp_id',
                title: '公司ID',
                type: "input"
            },
            {
                key: 'name',
                title: '项目名称',
                type: "input"
            },
            {
                key: 'project_code',
                title: '接入编号',
                type: "input"
            },
        ],
        screen_line: {},
    }
    constructor(props) {
        super(props)
        const { corpid } = props.match.params;
        this.state.corpid = corpid;
        this.page_change = this.page_change.bind(this);
        this.screen = this.screen.bind(this);
    }
    componentDidMount() {
        this.list();
        this.projectlist();
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
    async projectlist() {
        const { errCode, errMsg, data } = await getprojectitems({
            page: 1,
            'filter[corp_id]': this.state.corpid
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.setState({
            projectitems: data.items,
            project_meta: data._meta
        })
    }
    async list() {
        const { screen_line } = this.state;
        const { errCode, errMsg, data } = await jzgrProjectlist({
            page: this.state.meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
            'filter[jzgr_corp_id]': screen_line.jzgr_corp_id || '',
            'filter[name][like]': screen_line.name || '',
            'filter[contractor_corp_name][like]': screen_line.contractor_corp_name || '',
            'filter[project_code][like]': screen_line.project_code || ''
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
                created_at: item.created_at || '--------',
                area_code: item.area_code || "--------",
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
        let { errCode, errMsg, data } = await synchronousProject({
            corp_project_id: this.state.projectid
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
    async dataupload(params) {
        let { errCode, errMsg } = await upload_project({
            jzgr_project_id: params.key
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.list()
    }
    result_query_code = async (id) => {
        let { errCode, errMsg } = await result_query_project({
            jzgr_project: id
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.list();
    }
    query_code = async (record) => {
        let { errCode, errMsg, data } = await query_project({
            project_code: record.project_code,
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        data.result && message.info(data.result);
        this.result_query_code(record.key);
    }
    render() {
        const { columns, dataSource, bordered, meta, projectitems, screen_list } = this.state;
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
                                        this.setState({
                                            project_modal_show: true
                                        })
                                    }}>
                                        同步数据
					</Button>
                                    <Button type="primary" block onClick={() => { }}>
                                        导入数据
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
                <Modal
                    title="选择你要同步的项目"
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
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {projectitems.map((item => {
                            return (
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            )
                        }))}

                    </Select>
                </Modal>
            </React.Fragment >
        );
    }
}

export default Project_info;