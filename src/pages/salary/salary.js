import React, { Component } from "react";
import {
  Table,
  message,
  Switch,
  Spin,
  Button,
  Radio,
  Modal,
  TreeSelect,
} from "antd";
import { ROLES } from "../../constants";
import { list, update, userlist } from "../../services/salary";
import { inject, observer } from "mobx-react";
import projectService from "../../services/project";
import "./salary.less";
@inject("app")
@inject("project")
@inject("staff")
@observer
class salary extends Component {
  state = {
    items: [],
    ROLES: ROLES,
    constructionteam: [],
    contracting: [],
    qualifications: [],
    labour: [],
    showManagementModal: false,
    selectManagerValues: "",
    corpid: "",
    updataindex: "",
    Mode_switching_value: "browse",
    loading: true,
    userlist: [],
    projectInfo: {},
  };
  constructor(props) {
    super();
  }
  componentDidMount() {
    this.setState(
      {
        p_id: this.props.match.params.id,
        corpid: this.props.match.params.corpid,
      },
      () => {
        this.gitinfo();
      }
    );
  }
  // 获取公司信息 是否需要资质挂靠
  async gitinfo() {
    const { p_id } = this.state;
    const { data } = await projectService.detail(p_id);
    this.setState(
      {
        projectInfo: data,
      },
      () => {
        this.gettable();
        this.userlist();
      }
    );
  }
  Modeswitching() {
    this.setState(
      {
        items: [],
        contracting: [],
        qualifications: [],
        labour: [],
      },
      () => {
        this.gettable();
      }
    );
  }
  // 获取表格需要的数据
  async gettable() {
    const { errCode, errMsg, data } = await list({
      "filter[corp_project_id]": this.state.p_id,
    });
    if (errCode) {
      message.error(errMsg);
    }
    this.setState({
      items: data.items,
    });
    this.rolefenlei();
  }

  // 表格列表  循环判断 三个表分开渲染
  rolefenlei() {
    const {
      items,
      contracting,
      qualifications,
      labour,
      projectInfo,
      Mode_switching_value,
    } = this.state;
    const switchtext = {
      checkedChildren: "是",
      unCheckedChildren: "否",
    };
    items.map((item, v) => {
      if (
        projectInfo.is_union !== 0
          ? item.role === "pm" || item.role === "em" || item.role === "pc"
          : item.role === "pm" ||
          item.role === "em" ||
          item.role === "pc" ||
          item.role === "cc" ||
          item.role === "cf"
      ) {
        const b = {
          key: item.id,
          title: (
            <h1 className="texth1" style={{ width: 20, height: 100 }}>
              承包方
            </h1>
          ),
          role: (
            <p>
              {item.desc}
              <img
                className="img2"
                alt=""
                src={require("../../images/da.svg")}
              ></img>
            </p>
          ),
          personnel: item.user ? (
            <React.Fragment>
              <span style={{ margin: 20 }}>{item.user.name}</span>
              <Button
                style={{ margin: 20 }}
                type="primary"
                data-index={v}
                onClick={this.showmodal.bind(this)}
              >
                更换
              </Button>
              <Button
                type="primary"
                data-index={v}
                onClick={this.Delete_people.bind(this)}
              >
                删除
              </Button>
            </React.Fragment>
          ) : (
              <React.Fragment>
                <span style={{ margin: 20 }}>暂无指定人员</span>
                <Button
                  type="primary"
                  data-index={v}
                  onClick={this.showmodal.bind(this)}
                >
                  添加
              </Button>
              </React.Fragment>
            ),
          enable: (
            <Switch
              data-id={item.id}
              {...switchtext}
              defaultChecked={item.status ? true : false}
              onClick={(value, e) => {
                this.switchupdata(value, e);
              }}
            />
          ),
        };
        Mode_switching_value === "browse"
          ? item.status && contracting.push(b)
          : contracting.push(b);
        this.setState({
          contracting: contracting,
        });
      } else if (
        projectInfo.is_union &&
        (item.role === "cc" || item.role === "cf")
      ) {
        const c = {
          key: item.id,
          title: (
            <h1 className="texth1" style={{ width: 20, height: 100 }}>
              资质方
            </h1>
          ),
          role: (
            <p>
              {item.desc}
              <img
                className="img2"
                alt=""
                src={require("../../images/da.svg")}
              ></img>
            </p>
          ),
          personnel: item.user ? (
            <React.Fragment>
              <span style={{ margin: 20 }}>{item.user.name}</span>
              <Button
                style={{ margin: 20 }}
                type="primary"
                data-index={v}
                onClick={this.showmodal.bind(this)}
              >
                更换
              </Button>
              <Button
                type="primary"
                data-index={v}
                onClick={this.Delete_people.bind(this)}
              >
                删除
              </Button>
            </React.Fragment>
          ) : (
              <React.Fragment>
                <span style={{ margin: 20 }}>暂无指定人员</span>
                <Button
                  type="primary"
                  data-index={v}
                  onClick={this.showmodal.bind(this)}
                >
                  添加
              </Button>
              </React.Fragment>
            ),
          enable: (
            <Switch
              data-id={item.id}
              {...switchtext}
              defaultChecked={item.status ? true : false}
              onClick={(value, e) => {
                this.switchupdata(value, e);
              }}
            />
          ),
        };
        Mode_switching_value === "browse"
          ? item.status && qualifications.push(c)
          : qualifications.push(c);
        this.setState({
          qualifications: qualifications,
        });
      } else if (
        projectInfo.is_outsourcing &&
        (item.role === "sc" || item.role === "sf")
      ) {
        const d = {
          key: item.id,
          title: (
            <h1 className="texth1" style={{ width: 20, height: 100 }}>
              劳务方
            </h1>
          ),
          role: (
            <p>
              {item.desc}
              <img
                className="img2"
                alt=""
                src={require("../../images/da.svg")}
              ></img>
            </p>
          ),
          personnel: item.user ? (
            <React.Fragment>
              <span style={{ margin: 20 }}>{item.user.name}</span>
              <Button
                style={{ margin: 20 }}
                type="primary"
                data-index={v}
                onClick={this.showmodal.bind(this)}
              >
                更换
              </Button>
              <Button
                type="primary"
                data-index={v}
                onClick={this.Delete_people.bind(this)}
              >
                删除
              </Button>
            </React.Fragment>
          ) : (
              <React.Fragment>
                <span style={{ margin: 20 }}>暂无指定人员</span>
                <Button
                  type="primary"
                  data-index={v}
                  onClick={this.showmodal.bind(this)}
                >
                  添加
              </Button>
              </React.Fragment>
            ),
          enable: (
            <Switch
              data-id={item.id}
              {...switchtext}
              defaultChecked={item.status ? true : false}
              onClick={(value, e) => {
                this.switchupdata(value, e);
              }}
            />
          ),
        };
        Mode_switching_value === "browse"
          ? item.status && labour.push(d)
          : labour.push(d);
        this.setState({
          labour: labour,
        });
      }
      return 1;
    });
    this.setState({
      loading: false,
    });
  }

  // 删除人员
  async Delete_people(e) {
    const index = e.currentTarget.getAttribute("data-index");
    const { items } = this.state;
    const { errCode, errMsg } = await update(items[index].id, {
      user_id: "",
    });
    if (errCode) {
      message.error(errMsg);
    }
    this.setState(
      {
        items: [],
        contracting: [],
        qualifications: [],
        labour: [],
        loading: true,
      },
      () => {
        this.gettable();
      }
    );
  }
  // 公司人员列表
  async userlist() {
    const { errCode, errMsg, data } = await userlist({
      "filter[corp_id]": this.state.corpid,
      "filter[role][in][0]": ROLES.pm,
      "filter[role][in][1]": ROLES.subpm,
      "filter[role][in][2]": ROLES.master,
      "filter[role][in][3]": ROLES.submaster,
      expand: 'userInfo'
    });
    if (errCode) {
      message.error(errMsg);
      this.setState({ uploadStatus: "exception", submitLoading: false });
    }
    this.setState({
      userlist: data.items,
    });
  }
  // 显示modal框
  async showmodal(e) {
    const index = e.target.getAttribute("data-index");
    this.setState({
      showManagementModal: true,
      updataindex: index,
    });
  }
  // 人员确认
  async onAddManagementOk() {
    const { selectManagerValues, items, updataindex } = this.state;
    const { errCode, errMsg } = await update(items[updataindex].id, {
      user_id: selectManagerValues,
    });
    if (errCode) {
      message.error(errMsg);
    }
    this.setState(
      {
        items: [],
        contracting: [],
        qualifications: [],
        labour: [],
        showManagementModal: false,
        loading: true,
      },
      () => {
        this.gettable();
      }
    );
  }
  // 启用切换
  async switchupdata(value, e) {
    const id = e.currentTarget.getAttribute("data-id");
    if (value) {
      const { errCode, errMsg } = await update(id, {
        status: 1,
      });
      if (errCode) {
        message.error(errMsg);
      }
      // let st_data = items;
      // st_data[index].status=1;
      // this.setState(
      //   {
      //     items:st_data,
      //     contracting: [],
      //     qualifications: [],
      //     labour: [],
      //   },()=>{
      //     this.gettable();
      //   });
    } else {
      const { errCode, errMsg } = await update(id, {
        status: 0,
      });
      if (errCode) {
        message.error(errMsg);
      }

      // let st_data = items;
      // st_data[index].status=0;
      // this.setState(
      //   {
      //     items:st_data,
      //     contracting: [],
      //     qualifications: [],
      //     labour: [],
      //   },()=>{
      //     this.gettable();
      //   });
    }
  }
  // 模式切换
  async Mode_switching(e) {
    const value = e.target.value;
    this.setState(
      {
        Mode_switching_value: value,
        contracting: [],
        qualifications: [],
        labour: [],
      },
      () => {
        this.rolefenlei();
      }
    );
  }
  render() {
    const {
      contracting,
      qualifications,
      labour,
      userlist,
      projectInfo,
    } = this.state;
    const constructionteam = [
      {
        key: "nm",
        title: (
          <h1 className="texth1" style={{ width: 20, height: 100 }}>
            承建团队
          </h1>
        ),
        role: (
          <p>
            农民工
            <img
              className="img2"
              alt=""
              src={require("../../images/da.svg")}
            ></img>
          </p>
        ),
        personnel: "--------------",
        enable: "--------------",
      },
      {
        key: "bzz",
        title: "",
        role: (
          <p>
            班组长
            <img
              className="img2"
              alt=""
              src={require("../../images/da.svg")}
            ></img>
          </p>
        ),
        personnel: "--------------",
        enable: "--------------",
      },
      {
        key: "bgt",
        title: "",
        role: (
          <p>
            包工头
            <img
              className="img2"
              alt=""
              src={require("../../images/da.svg")}
            ></img>
          </p>
        ),
        personnel: "--------------",
        enable: "--------------",
      },
    ];
    const columns = [
      {
        title: "团队",
        dataIndex: "title",
        width: 100,
        align: "center",
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = 3;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "职位",
        dataIndex: "role",
        width: 300,
        align: "center",
      },
      {
        title: "指定人员",
        dataIndex: "personnel",
        width: 500,
        align: "center",
      },
      {
        title: "启用",
        dataIndex: "enable",
        align: "center",
      },
    ];
    const columns1 = [
      {
        title: "团队",
        dataIndex: "title",
        width: 100,
        align: "center",
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = contracting.length;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "职位",
        dataIndex: "role",
        width: 300,
        align: "center",
      },
      {
        title: "指定人员",
        dataIndex: "personnel",
        width: 500,
        align: "center",
      },
      {
        title: "启用",
        dataIndex: "enable",
        align: "center",
      },
    ];
    const columns2 = [
      {
        title: "团队",
        dataIndex: "title",
        width: 100,
        align: "center",
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = qualifications.length;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "职位",
        dataIndex: "role",
        width: 300,
        align: "center",
      },
      {
        title: "指定人员",
        dataIndex: "personnel",
        width: 500,
        align: "center",
      },
      {
        title: "启用",
        dataIndex: "enable",
        align: "center",
      },
    ];
    const columns3 = [
      {
        title: "团队",
        dataIndex: "title",
        width: 100,
        align: "center",
        render: (text, record, index) => {
          const obj = {
            children: text,
            props: {},
          };
          if (index === 0) {
            obj.props.rowSpan = labour.length;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: "职位",
        dataIndex: "role",
        width: 300,
        align: "center",
      },
      {
        title: "指定人员",
        dataIndex: "personnel",
        width: 500,
        align: "center",
      },
      {
        title: "启用",
        dataIndex: "enable",
        align: "center",
      },
    ];

    const treeSelectProps = {
      treeData: userlist.map((item, index) => ({
        title: item.userInfo.name,
        value: item.user_id,
        key: item.user_id,
      })),
      value: this.state.selectManagerValues,
      onSelect: (values) => {
        this.setState({
          selectManagerValues: values,
        });
      },
      searchPlaceholder: "请选择人员",
      style: {
        width: "100%",
      },
    };
    return (
      <React.Fragment>
        <Spin spinning={this.state.loading}>
          <Radio.Group
            onChange={this.Mode_switching.bind(this)}
            defaultValue="browse"
            style={{ margin: 20 }}
          >
            <Radio.Button value="browse" onClick={this.Modeswitching.bind(this)}>浏览模式</Radio.Button>
            <Radio.Button value="edit" onClick={this.Modeswitching.bind(this)}>编辑模式</Radio.Button>
          </Radio.Group>
          <Table
            className="table"
            locale={{ emptyText: <p>暂无数据</p> }}
            bordered={true}
            pagination={false}
            columns={columns}
            dataSource={constructionteam}
          />
          <div className="jaintoubox">
            <img
              className="img"
              alt=""
              src={require("../../images/da.svg")}
            ></img>
          </div>
          <Table
            className="table"
            bordered={true}
            pagination={false}
            columns={columns1}
            dataSource={contracting}
          />

          {projectInfo.is_union !== 0 ? (
            <React.Fragment>
              <div className="jaintoubox">
                <img
                  alt=""
                  className="img"
                  src={require("../../images/da.svg")}
                ></img>
              </div>
              <Table
                className="table"
                bordered={true}
                pagination={false}
                columns={columns2}
                dataSource={qualifications}
              />
              {projectInfo.is_outsourcing !== 0 && (
                <div className="jaintoubox">
                  <img
                    alt=""
                    className="img"
                    src={require("../../images/da.svg")}
                  ></img>
                </div>
              )}
            </React.Fragment>
          ) : (
              <React.Fragment>
                {projectInfo.is_outsourcing !== 0 && (
                  <div className="jaintoubox">
                    <img
                      alt=""
                      className="img"
                      src={require("../../images/da.svg")}
                    ></img>
                  </div>
                )}
              </React.Fragment>
            )}
          {projectInfo.is_outsourcing !== 0 && (
            <Table
              className="table"
              bordered={true}
              pagination={false}
              columns={columns3}
              dataSource={labour}
            />
          )}
        </Spin>
        <Modal
          title="添加指定人员"
          onCancel={() => {
            this.setState({
              showManagementModal: false,
            });
          }}
          onOk={this.onAddManagementOk.bind(this)}
          visible={this.state.showManagementModal}
          confirmLoading={this.state.confirmLoading}
          maskClosable={false}
        >
          <TreeSelect {...treeSelectProps} />
        </Modal>
      </React.Fragment>
    );
  }
}
export default salary;
