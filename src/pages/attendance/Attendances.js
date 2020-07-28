import React, { Component } from "react";
import {
  Card,
  DatePicker,
  Layout,
  Tree,
  Table,
  Tag,
  Button,
  Badge,
  Modal,
  message,
  Steps,
  Select,
} from "antd";
import { inject, observer } from "mobx-react";
import styles from "./Attendance.module.less";
import { ROLES, ROLELABEL } from "../../constants";
import attendanceService from "../../services/attendance";
import { updateverify } from "../../services/salary";
import moment from "moment";
@inject("project")
@inject("staff")
@inject("user")
@observer
class Attendances extends Component {
  state = {
    projectId: "",
    workerList: {
      items: [],
    },
    examineall: true,
    examineone: true,
    stepcurrent: 0,
    visible: false,
    steplist: [],
    selectedRowKeys: [],
    treeNodeLoading: true,
    treeSelectedKeys: ["0-0"],
    defaultExpandedKeys: ["0-0"],
    selectedNode: "",
    userole: "",
    attendance_id_arr: [],
    startDate: moment().format("YYYY-MM-DD"),
    endDate: moment().format("YYYY-MM-DD"),
    page: 1,
    pageSize: 1,
    total: 1,
    attendanceVerifyDefine: [],
    meta: {},
    userid: '',
    mutation: false,
    step_index: 0,
    type_w: 0
  };
  constructor(props) {
    super(props);
    const { id } = props.match.params;
    const { authorize, userInfo, jurisdiction } = props;
    this.state.projectId = id;
    // this.state.userole = 'sf';
    this.state.userid = userInfo.id;
    this.state.userole = authorize.role.type;
    this.state.mutation = jurisdiction;
  }
  componentDidMount() {
    this.getMembersTree();
    this.getTreeNodeMembers();
    // this.getsalarylist();
  }

  getMembersTree() {
    const { projectId } = this.state;
    const { corpRole = {} } = this.props.staff.staffCorpRoleResult;
    this.props.project.membersTree({
      "filter[corp_project_id]": projectId,
      role: corpRole.role === ROLES.contractor ? corpRole.role : ROLES.master,
      expand: "teamMembers,userInfo",
    });
  }
  async getTreeNodeMembers(isExport = false) {
    const { projectId, selectedNode, startDate, endDate } = this.state;
    const { staffCorpRoleResult } = this.props.staff;
    const isContractor = staffCorpRoleResult.role === ROLES.contractor;
    this.setState({ treeNodeLoading: true });
    let params = {
      page: this.state.meta.currentPage || 1,
      "filter[corp_project_id]": projectId,
      "filter[day]": startDate,
      // "filter[day][lte]": endDate,
      sort: "name",
      expand: 'userInfo,record,attendanceVerifys,projectMember,attendanceVerifyDefine',
      user_id: selectedNode.userId,
      export: isExport,
      role: selectedNode.role || (isContractor ? ROLES.contractor : ROLES.master),
    };
    const { errCode, errMsg, data } = await attendanceService.list(params);
    if (errCode) {
      message.error(errMsg);
      return;
    }
    this.setState({ treeNodeLoading: false });
    if (isExport) {
      return data;
    }
    this.setState({
      workerList: data,
      meta: data._meta
      // total:data._meta.totalCount,
      // pageSize:data._meta.perPage,
    });
  }
  onMembersTreeSelected(pos, { node }) {
    this.setState({ treeSelectedKeys: pos, selectedNode: node.props }, () => {
      this.getTreeNodeMembers();
    });
  }
  onDatePickerChange(m) {
    console.log(m)
    this.setState(
      {
        startDate: m.format("YYYY-MM-DD"),
        // endDate: m[1].format("YYYY-MM-DD"),
      },
      () => {
        this.getTreeNodeMembers();
      }
    );
  }
  disabledDateFun(current) {
    return current && current > moment().endOf("day");
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let arr = [];
    let verifyarr = [];
    if (selectedRowKeys.length) {
      selectedRows.map((item) => {
        arr.push(item.attendance_id);
        verifyarr.push({
          attendance_verify_id: item.attendance_verify_id,
          status: 1
        });
      })
      this.setState({
        selectedRowKeys,
        attendance_id_arr: arr,
        attendance_verify_id_arr: verifyarr,
        examineall: false,
      });
    } else {
      this.setState({
        selectedRowKeys,
        attendance_id_arr: [],
        attendance_verify_id_arr: [],
        examineall: true,
      });
    }
  };
  examineall() {
    this.updateverifyarr(this.state.attendance_verify_id_arr);
  }
  ofwages(attendance_verify_id, attendance_id) {
    // this.state.attendance_id_arr = [];
    // this.state.attendance_id_arr.push(attendance_id);
    // this.state.attendance_verify_id_arr = [];
    // this.state.attendance_verify_id_arr.push({
    //   attendance_verify_id: attendance_verify_id,
    //   status: 1
    // });
    let { attendance_id_arr, attendance_verify_id_arr, type_w } = this.state;
    attendance_id_arr = [];
    attendance_id_arr.push(attendance_id);
    attendance_verify_id_arr = [];
    attendance_verify_id_arr.push({
      attendance_verify_id: attendance_verify_id,
      status: 1
    });
    this.setState({
      attendance_id_arr,
      attendance_verify_id_arr
    }, () => {
      attendanceService.p_transfer({
        attendance_ids: this.state.attendance_id_arr,
        type: type_w
      }).then(res => {
        if (!res.errCode) {
          this.updateverifyarr(this.state.attendance_verify_id_arr);
        }
      })
    })
  }
  ofwagesall() {
    let { type_w } = this.state;
    attendanceService.p_transfer({
      attendance_ids: this.state.attendance_id_arr,
      type: type_w
    }).then(res => {
      if (!res.errCode) {
        this.updateverifyarr(this.state.attendance_verify_id_arr);
      }
    })
  }
  examineone(attendance_verify_id) {
    let arr = [];
    arr.push({
      attendance_verify_id: attendance_verify_id,
      status: 1
    })
    this.updateverifyarr(arr);
  }
  updateverifyarr(arr) {
    updateverify({
      attendance_verify: arr,
    }).then(res => {
      if (res.errCode) {
        message.error(res.errMsg);
        return;
      } else {
        message.success('审核完成')
        this.getTreeNodeMembers();
      }
    })
  }
  handleOk() {
    this.setState({
      visible: false,
    });
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  pagechange(page) {
    this.setState({
      page: page
    })
  }
  showmodal(index) {
    const { workerList } = this.state;
    const { items } = workerList;
    const s = items[index];
    if (items[index].attendance !== null) {
      if (s.attendanceVerifys.length) {
        let a = 0;
        // let step_role = s.attendanceVerifys[s.attendanceVerifys.length - 1].role;
        let step_status = s.attendanceVerifys[s.attendanceVerifys.length - 1].status;
        a = s.attendanceVerifys.length;
        step_status === 0 && (a -= 1);
        // let current_role = s.attendanceVerifys[1].role === 'contractor';
        this.setState({
          visible: true,
          steplist: s.attendanceVerifys,
          attendanceVerifyDefine: s.attendanceVerifyDefine,
          stepcurrent: a + 2
        });
      }
    } else {
      this.setState({
        steplist: [],
        stepcurrent: 0
      })
    }
  }
  async exportData() {
    const { projectId, selectedNode, startDate, endDate } = this.state;
    const { staffCorpRoleResult } = this.props.staff;
    const isContractor = staffCorpRoleResult.role === ROLES.contractor;

    let params = {
      "filter[corp_project_id]": projectId,
      "filter[day][gte]": startDate,
      "filter[day][lte]": endDate,
      sort: "name",
      verify: true,
      user_id: selectedNode.userId,
      role:
        selectedNode.role || (isContractor ? ROLES.contractor : ROLES.master),
    };
    const { downloadCode } = await this.getTreeNodeMembers(true);
    params.downloadCode = downloadCode;
    const downloadUrl = attendanceService.downloadUrl(params);
    window.open(downloadUrl, "_blank");
  }
  page_change(page) {
    const data = this.state.meta;
    data.currentPage = page;
    this.setState({
      meta: data
    }, () => {
      this.getTreeNodeMembers();
    })
  }
  wages_type(value) {
    this.setState({
      type_w: value
    })
  }
  async exportTpl() {
    const { projectId, selectedNode, startDate, endDate } = this.state;
    const { staffCorpRoleResult } = this.props.staff;
    const isContractor = staffCorpRoleResult.role === ROLES.contractor;
    const { data } = await attendanceService.exportTpl({
      exportTpl: true
    });
    // let params = '';
    // params = 'exportTpl=true';
    // const downloadUrl = attendanceService.exportTplurl(params);
    // console.log(importTplCode)
    window.open(data.importTplCode, "_blank");
  }
  render() {
    const { membersTreeResult } = this.props.project;
    const {
      treeSelectedKeys,
      defaultExpandedKeys,
      workerList,
      selectedRowKeys,
      stepcurrent,
      steplist,
      userole,
      examineall,
      treeNodeLoading,
      userid,
      mutation,
      meta,
      attendanceVerifyDefine,
    } = this.state;
    const treeData = [
      { title: "全部", value: 0, children: membersTreeResult.data.items },
    ];
    const tableDataSource = workerList.items.map((item, index) => {
      let { attendanceVerifys, userInfo, projectMember, attendanceVerifyDefine } = item;
      let Verifyrole = '';
      let upfataVerifyid = "";
      let attendance_id = "";
      let status = 1;
      let user_id = '';
      if (!projectMember) {
        projectMember = {};
      }
      if (attendanceVerifys.length) {
        Verifyrole = attendanceVerifys[attendanceVerifys.length - 1].role;
        upfataVerifyid = attendanceVerifys[attendanceVerifys.length - 1].id;
        status = attendanceVerifys[attendanceVerifys.length - 1].status;
        attendance_id = attendanceVerifys[attendanceVerifys.length - 1].attendance_id;
        for (let i in attendanceVerifyDefine) {
          Verifyrole === attendanceVerifyDefine[i].role && attendanceVerifyDefine[i].user_id && (user_id = attendanceVerifyDefine[i].user_id)
        }
      }
      if (!userInfo) userInfo = {};
      return {
        key: index,
        day: item.dayFormat,
        name: userInfo.name,
        workNo: projectMember.work_no,
        startStatus: item.start,
        endStatus: item.end,
        startTime: item.start_time,
        over_start: item.over_start,
        over_start_status: item.over_start_status,
        endTime: item.end_time,
        over_end: item.over_end,
        over_end_status: item.over_end_status,
        mobile: userInfo.mobile,
        role: projectMember.role,
        validateDuration: item.is_verify,
        attendance_verify_id: item.attendance_verify_id,
        wages: item.salary,
        day_cost: item.day_cost,
        newshrole: Verifyrole,
        upfataVerifyid: upfataVerifyid,
        attendance_id: attendance_id,
        status: status,
        attendance: item,
        shenhe_user_id: user_id,
        attendanceVerifys: attendanceVerifys
      };
    });
    const tableColumns = [
      {
        title: "打卡人员",
        dataIndex: "workNo",
        key: "workNo",
        render: (text, record) => {
          return (
            <>
              <p>工号：{record.workNo}</p>
              <p>
                姓名：{record.name}
                <Tag>{ROLELABEL[record.role]}</Tag>
              </p>
            </>
          );
        },
      },
      {
        title: "打卡时间",
        dataIndex: "startTime",
        key: "startTime",
        render: (text, record) => {
          return (
            <>
              <p>
                上班：
          <Badge
                  status={
                    record.startTime
                      ? record.startStatus
                        ? "warning"
                        : "success"
                      : "default"
                  }
                  text={record.startTime ? record.startStatus : record.day + "-未打卡"}
                />
              </p>
              <p>
                下班：
          <Badge
                  status={
                    record.endTime
                      ? record.endStatus
                        ? "warning"
                        : "success"
                      : "default"
                  }
                  text={record.endTime ? record.endStatus : record.day + "-未打卡"}
                />
              </p>
            </>
          );
        },
      },
      {
        title: "加班",
        dataIndex: "endTime",
        key: "endTime",
        render: (text, record) => {
          return (
            <>
              <p>
                上班：
          <Badge
                  status={
                    record.over_start
                      ? record.over_start_status
                        ? "warning"
                        : "success"
                      : "default"
                  }
                  text={record.over_start ? record.over_start : "-----"}
                />
              </p>
              <p>
                下班：
          <Badge
                  status={
                    record.over_end
                      ? record.over_end_status
                        ? "warning"
                        : "success"
                      : "default"
                  }
                  text={record.over_end ? record.over_end : "-----"}
                />
              </p>
            </>
          );
        },
      },
      {
        title: "工资",
        dataIndex: "wages",
        key: "wages",
        render: (text, record) => {
          return (
            <>
              <p>工资：{record.wages}</p>
              <p>生活费：{record.day_cost}</p>
            </>
          );
        },
      },
      {
        title: "发放工资类型",
        dataIndex: "wages_type",
        key: "wages_type",
        render: (text, record) => {
          return (
            <>
              <Select
                showSearch
                placeholder="选择发放的工资类型"
                optionFilterProp="children"
                defaultValue={2}
                onSelect={this.wages_type.bind(this)}
                disabled={userole !== 'sf' && userole !== 'master'}
              >
                <Select.Option value={0}>生活费</Select.Option>
                <Select.Option value={1}>劳务费</Select.Option>
                <Select.Option value={2}>生活费+劳务费</Select.Option>
              </Select>
            </>
          );
        },
      },
      {
        title: "审核",
        dataIndex: "validateDuration",
        key: "validateDuration",
        render: (text, record, index) => {
          return (
            <>
              <p>
                状态：
    {text === 10 ? "审核完成" : (text === 0 ? "未审核" : (typeof text === "undefined" || record.attendanceVerifys.length === 0 ? "无审核记录" : "审核中"))}
              </p>
              {record.attendanceVerifys.length !== 0 && <p>
                {typeof text !== "undefined" && <a onClick={this.showmodal.bind(this, index)}>详情</a>}
              </p>}
            </>
          );
        },
      },
      {
        title: "操作",
        dataIndex: "examine",
        key: "examine",
        render: (text, record, index) => {
          return (
            (record.shenhe_user_id ? (userid === record.shenhe_user_id || userole === 'master') && mutation : userole === 'master' || userole === record.newshrole) ? <Button
              type="primary"
              disabled={record.status === 1 ? true : false}
              onClick={(userole === 'sf' || userole === 'master') && record.newshrole === 'sf' ? this.ofwages.bind(this, record.attendance_verify_id, record.attendance_id) : this.examineone.bind(this, record.attendance_verify_id)
              }
            >
              {(userole === 'sf' || userole === 'master') && record.newshrole === 'sf' ? record.status === 1 ? '已发放工资' : '发放工资' : record.status === 1 ? record.attendanceVerifys.length ? '已审核' : '未审核' : '审核'}
            </Button> : record.shenhe_user_id ? <div>指定人员才能审核</div> : <div>没有审核权限</div>
          );
        },
      },
    ];
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: userole !== record.newshrole,
      }),
    };
    // const pagination={
    //   pageSize:pageSize,
    //   total:total,
    //   onChange:this.pagechange.bind(this)
    // }

    return (
      <Card
        className={styles.card}
        title="考勤"
        extra={
          <React.Fragment>
            {/* <DatePicker.RangePicker
              // mode="date"
              allowClear={false}
              ranges={{ 今天: [moment(), moment()] }}
              disabledDate={this.disabledDateFun.bind(this)}
              onChange={this.onDatePickerChange.bind(this)}
              defaultValue={[moment(), moment()]}
            /> */}
            <DatePicker
              // mode="date"
              allowClear={false}
              ranges={{ 今天: moment() }}
              onChange={this.onDatePickerChange.bind(this)}
              defaultValue={moment()}
            />
            <Button
              style={{ marginLeft: 8 }}
              onClick={this.exportData.bind(this)}
              type="primary"
            >
              导出考勤
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={this.exportTpl.bind(this)}
              type="primary"
            >
              导出模板
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={userole === 'sf' ? this.ofwagesall.bind(this) : this.examineall.bind(this)}
              type="primary"
              disabled={examineall}
            >
              {userole === 'sf' ? '全部发放' : '全部审核'}
            </Button>
          </React.Fragment>
        }
      >
        <Layout>
          <Layout.Sider theme="light">
            <Tree.DirectoryTree
              blockNode={true}
              defaultExpandedKeys={defaultExpandedKeys}
              selectedKeys={treeSelectedKeys}
              onSelect={this.onMembersTreeSelected.bind(this)}
              treeData={treeData}
            />
          </Layout.Sider>
          <Layout.Content>
            <Table
              rowSelection={rowSelection}
              bordered={false}
              pagination={{ position: 'bottom', current: meta.currentPage, pageSize: meta.perPage, total: meta.totalCount, onChange: (current, pageSize) => this.page_change(current, pageSize) }}
              columns={tableColumns}
              dataSource={tableDataSource}
              loading={treeNodeLoading && !membersTreeResult.pending}
            />
          </Layout.Content>
        </Layout>
        <Modal
          title="审核步骤"
          visible={this.state.visible}
          onOk={() => this.handleOk()}
          onCancel={() => this.handleCancel()}
        >
          <Steps current={stepcurrent} direction="vertical">
            <Steps.Step
              title="班组长审核"
              description={
                <Badge status="success" text="审核完毕" />
              }

            />
            <Steps.Step
              title="承包人审核"
              description={
                <Badge status="success" text="审核完毕" />
              }

            />
            {attendanceVerifyDefine.map((item, index) => {
              return item.status && <Steps.Step
                title={item.desc + '审核'}
                key={item.id}
                description={
                  steplist.map((item2, index2) => {
                    if (item.role === item2.role) {
                      return (
                        item2.status ?
                          <Badge key={index2} status="success" text="审核完毕" />
                          : <Badge key={index2} status="processing" text="待审核" />
                      )
                    }
                  })
                  // stepcurrent > (index + 2) ?
                  //   <Badge status="success" text="审核完毕" />
                  //   : <Badge status="processing" text="待审核" />
                }
              />


            })
            }
          </Steps>
        </Modal>
      </Card>
    );
  }
}

export default Attendances;
