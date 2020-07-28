import React, { Component } from "react";
import { Card, Table, Button, Modal, Divider, Pagination, message, Input, DatePicker, Col, Row, Select, PageHeader, Descriptions } from "antd";
import { list, wagesinfo, wages } from "../../../services/transfer_list";
import { inject, observer } from "mobx-react";
import moment from "moment";
import "../../Payroll/Payroll.less";
import "./administratin.less";
import Page from '../../../components/Page';
const { Content } = Page;
@inject("project")
@inject("staff")
@inject("user")
@observer
class Transfer_order extends Component {
    state = {
        list: [],
        visible: false,
        infolist: [],
        pageindex: 1,
        totalCount: 0,
        perPage: 20,
        type: 0,
        examineall: true,
        id: "",
        value: "",
        transfer_ids: [],
        t_page: 1,
        t_totalCount: 0,
        selectedRowKeys: [],
        t_perPage: 20,
        startDate: moment().format("YYYY-MM-DD"),
        endDate: moment().format("YYYY-MM-DD"),
        corpid: '',
        userole: '',
        projectid: '',
        select_project_arr: [],
        select_pm_arr: [],
        meta_object: {
            project_meta: {},
            pm_meta: {},
        },
        meta: {}
    };
    constructor(props) {
        super(props);
        console.log(props)
        const { id, corpid } = props.match.params;
        const { authorize } = props;
        // this.state.projectid = '5dc21a86eb7d4203e9398081';
        this.state.corpid = corpid;
        this.state.userole = authorize.role.type;
        this.screen = this.screen.bind(this);
    }
    componentDidMount() {
        this.project_list();
        this.transfer_list();
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
    async transfer_list(value) {
        const { data } = await list({
            'filter[re_user_name][like]': this.state.value || '',
            'filter[corp_id]': this.state.corpid || '',
            'filter[corp_project_id]': this.state.projectid || '',
            created_at: this.state.startDate + ',' + this.state.endDate,
            page: this.state.meta.currentPage || 1,
            // "filter[payment_time][lte]": this.state.endDate,
        });
        this.setState({
            list: data.items,
            t_totalCount: data._meta.totalCount,
            t_perPage: data._meta.perPage,
        });

    }
    wages(id) {
        this.state.transfer_ids = [];
        this.state.transfer_ids.push(id);
        this.gongzi();
    }
    ofwagesall() {
        this.gongzi();
    }
    async gongzi() {
        const { errCode, errMsg, data } = await wages({
            transfer_ids: this.state.transfer_ids
        });
        if (errCode) {
            message.error(errMsg);
            return;
        }
        message.success(data.message);
        this.setState({
            selectedRowKeys: []
        })
        this.transfer_list();
    }
    wagesmodal(type, id) {
        this.wagesinfo(type, id);
    }
    async wagesinfo(type, id) {
        const { pageindex } = this.state;
        const prams =
            type === 2
                ? {
                    "filter[day_cost_payment_order_id]": id,
                    "filter[salary_payment_order_id]": id,
                    page: pageindex,
                }
                : type === 0
                    ? {
                        "filter[day_cost_payment_order_id]": id,
                        page: pageindex,
                    }
                    : {
                        "filter[salary_payment_order_id]": id,
                        page: pageindex,
                    };
        const { data } = await wagesinfo(prams);
        this.setState({
            infolist: data.items,
            totalCount: data._meta.totalCount,
            perPage: data._meta.perPage,
            visible: true,
        });
    }
    pageChange(index) {
        this.setState(
            {
                pageindex: index,
            },
            () => {
                this.wagesinfo(this.state.type, this.state.id);
            }
        );
    }
    t_pageChange(index) {
        this.setState(
            {
                t_page: index,
            },
            () => {
                this.transfer_list();
            }
        );
    }
    onSelectChange = (selectedRowKeys, selectedRows) => {
        if (selectedRowKeys.length) {
            this.setState({
                selectedRowKeys,
                transfer_ids: selectedRowKeys,
                examineall: false
            })
        } else {
            this.setState({
                selectedRowKeys,
                examineall: true
            })
        }

    };
    onSearch(event) {
        this.setState({
            value: event.target.value
        }, () => {
            this.transfer_list();
        })
    }
    onDatePickerChange(m) {
        this.setState(
            {
                startDate: m[0].format("YYYY-MM-DD"),
                endDate: m[1].format("YYYY-MM-DD"),
            }, () => {
                this.transfer_list();
            }
        );
    }
    disabledDateFun(current) {
        return current && current > moment().endOf("day");
    }
    handleCancel() {
        this.setState({
            visible: false,
        });
    }
    screen(value) {
        this.setState({
            screen_line: value
        }, () => {
            this.transfer_list();
        })
    }
    project_select(value) {
        this.setState({
            projectid: value,
            selectedGroup: ''
        }, () => {
            this.transfer_list();
            // this.getMembersTree_one();
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
                if (value === 'project_meta') {
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
            this.transfer_list();
        })
    }
    render() {
        const { authorize,jurisdiction } = this.props;
        const {
            list,
            infolist,
            perPage,
            pageindex,
            totalCount,
            t_totalCount,
            t_perPage,
            examineall,
            selectedRowKeys,
            t_page,
            select_project_arr,
            select_pm_arr,
            meta,
        } = this.state;
        const tableColumns = [
            {
                title: "打卡人员",
                dataIndex: "re_user_name",
                key: "re_user_name",
                align: 'center'
            },
            {
                title: "账单类型",
                dataIndex: "type",
                key: "type",
                align: 'center',
                render: (text, record) => {
                    return (
                        <p>
                            {text === 0
                                ? "生活费"
                                : text === 1
                                    ? "工资"
                                    : text === 2
                                        ? "工资+生活费"
                                        : ""}
                        </p>
                    );
                },
            },
            {
                title: "工资总和",
                dataIndex: "amount",
                key: "amount",
                align: 'center',
                render: (text, record) => {
                    return (
                        <>
                            <p>{text}</p>
                            <a onClick={this.wagesmodal.bind(this, record.type, record.key)}>
                                详情
              </a>
                        </>
                    );
                },
            },
            {
                title: "订单状态",
                dataIndex: "status",
                key: "status",
                align: 'center',
                render: (text, record) => {
                    return (
                        <p>
                            {text === 0
                                ? "生成代付款单据，待审核"
                                : text === 1
                                    ? "审核通过，待发放"
                                    : text === 2
                                        ? "转账失败"
                                        : text === 10
                                            ? "转账（发放成功）"
                                            : ""}
                        </p>
                    );
                },
            },
            {
                title: "支付失败信息",
                dataIndex: "failure",
                key: "failure",
                align: 'center',
                render: (text, record) => {
                    return (
                        <div>{record.err_code_des}</div>
                    );
                },
            },
            {
                title: "创建日期",
                dataIndex: "created_at",
                key: "created_at",
                align: 'center',
            },
            {
                title: "付款时间",
                dataIndex: "payment_time",
                key: "payment_time",
                align: 'center',
            },
            {
                title: "操作",
                dataIndex: "action",
                key: "action",
                align: 'center',
                render: (text, record) => {
                    return (
                        jurisdiction ? <Button disabled={record.status === 10 ? true : (this.state.userole !== 'sf' && this.state.userole !== 'master') ? true : false} type="primary" onClick={this.wages.bind(this, record.key)}>
                            {record.status === 10 ? '发放完成' : '待发放'}
                        </Button> : <div>没有操作权限</div>
                    );
                },
            },
        ];
        const tableDataSource = list.map((item, index) => {
            return {
                key: item.id,
                re_user_name: item.re_user_name,
                type: item.type,
                amount: (item.amount / 100) + '元',
                status: item.status,
                payment_time: item.payment_time || '---------------',
                created_at: item.created_at || '---------------',
                err_code_des: item.err_code_des ? '失败原因：' + item.err_code_des : '---------------',
                action: item.re_user_name,
            };
        });
        const t_pagination = {
            showSizeChanger: true,
            onChange: this.t_pageChange.bind(this),
            pageSize: { t_perPage },
            current: { t_page },
            total: { t_totalCount },
        };

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: record.status === 10,
            }),
        };
        return (
            <Page>
                <PageHeader title="工资单" />
                <Content>
                    <Content.Panel>
                        <Card
                            extra={
                                <React.Fragment>

                                    <Button
                                        style={{ marginLeft: 8 }}
                                        onClick={this.ofwagesall.bind(this)}
                                        type="primary"
                                        disabled={examineall}
                                    >
                                        全部发放
          </Button>
                                </React.Fragment>
                            }
                        >
                            <div style={{ borderRadius: '5px', marginBottom: '10px', padding: '0 0 5px 5px' }}>
                                <Row gutter={24} style={{ marginBottom: '20px' }} className="situation">
                                    <Col span={6} className='sreen_flex'>
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
                                    <Col span={6} className='sreen_flex'>
                                        <div>姓名：</div>
                                        <Input style={{ width: '80%' }} onChange={this.onSearch.bind(this)} placeholder="请输入要查询的人员名字" ></Input>
                                    </Col>
                                    <Col span={6} className='sreen_flex'>
                                        <div>日期：</div>
                                        <DatePicker.RangePicker
                                            // mode="date"
                                            allowClear={false}
                                            ranges={{ 今天: [moment(), moment()] }}
                                            disabledDate={this.disabledDateFun.bind(this)}
                                            onChange={this.onDatePickerChange.bind(this)}
                                            defaultValue={[moment(), moment()]}
                                        />
                                    </Col>
                                </Row>

                            </div>
                            <Table
                                rowSelection={rowSelection}
                                bordered={true}
                                columns={tableColumns}
                                dataSource={tableDataSource}
                                pagination={{ position: 'bottom', current: meta.currentPage, pageSize: meta.perPage, total: meta.totalCount, onChange: (current, pageSize) => this.page_change(current, pageSize) }}
                            />
                            <Modal
                                title="工资详情"
                                visible={this.state.visible}
                                onOk={() => this.handleCancel()}
                                onCancel={() => this.handleCancel()}
                                className="al"
                            >
                                {infolist.map((item, index) => {
                                    return (
                                        <React.Fragment key={item.id}>
                                            <Descriptions title="基本信息" column={3}>
                                                <Descriptions.Item label="时间">{item.dayFormat}</Descriptions.Item>
                                                <Descriptions.Item label="上班时间">{item.start}</Descriptions.Item>
                                                <Descriptions.Item label="下班时间">{item.end}</Descriptions.Item>
                                                <Descriptions.Item label="工资">{item.salary}</Descriptions.Item>
                                                <Descriptions.Item label="生活费">{item.day_cost}</Descriptions.Item>
                                                <Descriptions.Item label="审核时长">{item.validate_duration + '天'}</Descriptions.Item>
                                            </Descriptions>
                                            <Divider></Divider>
                                        </React.Fragment>
                                    );
                                })}
                                <Pagination
                                    onChange={this.pageChange.bind(this)}
                                    pageSize={perPage}
                                    current={pageindex}
                                    total={totalCount}
                                />
                            </Modal>
                        </Card>
                    </Content.Panel>
                </Content>
            </Page>
        );
    }
}

export default Transfer_order;
