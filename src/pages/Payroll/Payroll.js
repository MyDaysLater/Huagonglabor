import React, { Component } from "react";
import { Card, Table, Button, Modal, Divider, Pagination, message, Input, DatePicker } from "antd";
import { list, wagesinfo, wages } from "../../services/transfer_list";
import { inject, observer } from "mobx-react";
import moment from "moment";
import "./Payroll.less";
@inject("project")
@inject("staff")
@inject("user")
@observer
class Payroll extends Component {
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
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.transfer_list();
  }
  async transfer_list(value) {
    const { data } = await list({
      'filter[re_user_name][like]': value || '',
      created_at: this.state.startDate + ',' + this.state.endDate,
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
    const { errCode, data } = await wages({
      transfer_ids: this.state.transfer_ids
    });
    if (!errCode) {
      message.success(data.message);
      this.setState({
        selectedRowKeys: []
      })
      this.transfer_list();
    }
  }
  wagesmodal(type, id) {
    this.setState(
      {
        visible: true,
      },
      () => {
        this.wagesinfo(type, id);
      }
    );
  }
  async wagesinfo(type, id) {
    const { pageindex } = this.state;
    this.state.type = type;
    this.state.id = id;
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
    console.log('selectedRowKeys', selectedRowKeys)
    console.log('selectedRows', selectedRows)
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
    this.state.value = event.target.value;
  }
  sousuo() {
    this.transfer_list(this.state.value);
  }
  onDatePickerChange(m) {
    this.setState(
      {
        startDate: m[0].format("YYYY-MM-DD"),
        endDate: m[1].format("YYYY-MM-DD"),
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
  render() {
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
    } = this.state;
    const tableColumns = [
      {
        title: "打卡人员",
        dataIndex: "re_user_name",
        key: "re_user_name",
      },
      {
        title: "账单类型",
        dataIndex: "type",
        key: "type",
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
        title: "创建日期",
        dataIndex: "created_at",
        key: "created_at",
      },
      {
        title: "付款时间",
        dataIndex: "payment_time",
        key: "payment_time",
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        render: (text, record) => {
          return (
            <Button disabled={record.status === 10} type="primary" onClick={this.wages.bind(this, record.key)}>
              {record.status === 10 ? '发放完成' : '待发放'}
            </Button>
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
        payment_time: item.payment_time || '----------------------',
        created_at: item.created_at || '----------------------',
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
      <Card title={
        <React.Fragment>
          <Input onChange={this.onSearch.bind(this)} placeholder="请输入要查询的人员名字" style={{ width: 200 }}></Input>
          <DatePicker.RangePicker
            // mode="date"
            style={{ margin: 20 }}
            allowClear={false}
            ranges={{ 今天: [moment(), moment()] }}
            disabledDate={this.disabledDateFun.bind(this)}
            onChange={this.onDatePickerChange.bind(this)}
            defaultValue={[moment(), moment()]}
          />
          <Button
            style={{ margin: 20 }}
            onClick={this.sousuo.bind(this)}
            type="primary"
          >
            搜索
          </Button>
        </React.Fragment>
      }
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
        <Table
          rowSelection={rowSelection}
          bordered={true}
          columns={tableColumns}
          dataSource={tableDataSource}
          pagination={true}
        />
        {
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
                  <div className="modalflex">
                    <span>时间：{item.dayFormat}</span>
                    <span>上班时间：{item.start}</span>
                    <span>下班时间：{item.end}</span>
                    <span>工资：{item.salary}</span>
                    <span>生活费：{item.day_cost}</span>
                    <span>审核时长：{item.validate_duration + '天'}</span>
                  </div>
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
        }
      </Card>
    );
  }
}

export default Payroll;
