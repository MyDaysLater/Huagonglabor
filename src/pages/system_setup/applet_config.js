import React, { Component } from 'react';
import { Button, Card, message, PageHeader } from 'antd';
import Comp_table from "../../components/Table";
import Screen from "../../components/screen";
import Page from "../../components/Page";
import { getconfigs, putconfig } from "../../services/platform";
class Applet_config extends Component {
    state = {
        bordered: true,
        dataSource: [],
        columns: [
            {
                dataIndex: "name",
                title: "名称",
                align: "center",
            },
            {
                dataIndex: "corp_id",
                title: "公司ID",
                align: "center",
            },
            {
                dataIndex: "value",
                title: "授权方支付商户号",
                align: "center",
            },
            {
                dataIndex: "created_at",
                title: "创建时间",
                align: "center"
            },
            {
                dataIndex: "action",
                title: "操作",
                align: "center",
                render: (text, record) => (
                    <Button disabled={record.response_status === 1 ? true : false} type="primary" block onClick={() => { this.dataupload(record) }}>
                        更新
                    </Button>
                ),
            },
        ],
        bordered: true,
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
        meta: {},
        items: [],
    }
    constructor(props) {
        super(props)
        const { corpid } = props.match.params;
        this.state.corpid = corpid;
    }
    componentDidMount() {
        this.list();
    }
    async list() {
        const { screen_line } = this.state;
        const { data } = await getconfigs({
            page: this.state.meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
        })
        let arr = data.items.map((item) => {
            return {
                key: item.id,
                corp_id: item.corp_id || "--------",
                name: item.key || "--------",
                value: item.value || "--------",
                created_at: item.created_at || "--------",
            };
        })
        this.setState({
            items: data.items,
            meta: data._meta,
            dataSource: arr,
        })
    }
    render() {
        const { columns, dataSource, bordered, meta, screen_list } = this.state;
        return (
            <Page>
                <PageHeader title="数据上传" />
                <Page.Content>
                    <Page.Content.Panel >
                        <Card
                            title={
                                <React.Fragment>
                                    <Screen
                                        screen_list={screen_list}
                                        screen={this.screen}
                                    />
                                    <div className="flex flex-end">
                                        <div className="flex">
                                            <Button style={{ marginRight: '20px' }} type="primary" block onClick={() => { }}>
                                                新增配置
					</Button>
                                            <Button style={{ marginRight: '20px' }} type="primary" block onClick={() => { }}>
                                                更换配置
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
                    </Page.Content.Panel>
                </Page.Content>
            </Page>
        );
    }
}

export default Applet_config;