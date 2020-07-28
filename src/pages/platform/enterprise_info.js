import React, { Component } from 'react';
import { Button, Card, message, } from 'antd';
import Comp_table from "../../components/Table";
import Screen from "../../components/screen";
import { gejzgrCorp_list, synchronousCorp, upload_Corp } from "../../services/platform";
import './style.less';
class Enterprise_info extends Component {
    state = {
        columns: [
            {
                dataIndex: "corp_name",
                title: "企业名称",
                fixed: "left",
                width: 200,
                align: "center",
            },
            {
                dataIndex: "corp_type",
                title: "单位性质",
                width: 200,
                align: "center",
            },
            {
                dataIndex: "corp_code",
                title: "信用代码",
                width: 200,
                align: "center",
            },
            {
                dataIndex: "license_num",
                title: "工商营业执照注册号",
                width: 200,
                align: "center",
            },
            {
                dataIndex: "area_code",
                title: "企业注册地区编码",
                width: 200,
                align: "center",
            },
            {
                dataIndex: "address",
                title: "企业营业地址",
                width: 200,
                align: "center",
            },
            {
                dataIndex: "zip_code",
                title: "邮政编码",
                width: 200,
                align: "center",
            },
            {
                dataIndex: "legal_man",
                title: "法定代表人姓名",
                width: 200,
                align: "center",
            },
            {
                dataIndex: "legal_man_duty",
                title: "法定代表人职务",
                width: 200,
                align: "center",
            },
            {
                dataIndex: "legal_man_pro_title",
                title: "法定代表人职称",
                width: 200,
                align: "center",
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
                    <Button disabled={record.response_status === 1 ? true : false} type="primary" block onClick={() => { this.dataupload(record) }}>
                        {record.response_status === 1 ? '已上传' : '待上传'}
                    </Button>
                ),
            },
        ],
        dataSource: [],
        bordered: true,
        pagination: true,
        meta: {},
        list: [],
        corpid: '',
        screen_list: [
            {
                key: 'corp_name',
                title: '公司名',
                type: "input"
            },
            {
                key: 'legal_man',
                title: '联系人姓名',
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
    }
    screen(value) {
        this.setState({
            screen_line: value
        }, () => {
            this.list();
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
    async list() {
        const { screen_line } = this.state;
        const { data } = await gejzgrCorp_list({
            page: this.state.meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
            'filter[corp_name][like]': screen_line.corp_name || '',
            'filter[legal_man][like]': screen_line.legal_man || ''
        })
        let arr = data.items.map((item) => {
            return {
                key: item.id,
                corp_name: item.corp_name || "--------",
                corp_type: item.corp_type || "--------",
                corp_code: item.corp_code || "--------",
                license_num: item.license_num || "--------",
                area_code: item.area_code || "--------",
                address: item.address || "--------",
                zip_code: item.zip_code || "--------",
                legal_man: item.legal_man || "--------",
                legal_man_duty: item.legal_man_duty || "--------",
                legal_man_pro_title: item.legal_man_pro_title || "--------",
                response_status: item.response_status,
                legal_man_i_d_card_type: item.legal_man_i_d_card_type || "--------",
                legal_man_i_d_card_number:
                    item.legal_man_i_d_card_number || "--------",
                reg_capital: item.reg_capital || "--------",
                fact_reg_capital: item.fact_reg_capital || "--------",
                link_man: item.link_man || "--------",
                link_tel: item.link_tel || "--------",
                email: item.email || "--------",
                created_at: item.created_at || '--------',
                website: item.website || "--------",
            };
        })
        this.setState({
            list: data.items,
            meta: data._meta,
            dataSource: arr,
        })
    }
    async synchronous() {
        let { errCode, errMsg, data } = await synchronousCorp({
            corp_id: this.state.corpid
        });
        if (!errCode) {
            message.success(data.message);
        } else {
            message.error(errMsg);
            return;
        }
    }
    async dataupload(params) {
        let { errCode, errMsg } = await upload_Corp({
            jzgr_corp_id: params.key
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.list()
    }
    render() {
        const { columns, dataSource, bordered, meta, screen_list } = this.state;
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
                                    <Button className="margin-right" type="primary" block onClick={() => { this.synchronous() }}>
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
            </React.Fragment >

        );
    }
}

export default Enterprise_info;