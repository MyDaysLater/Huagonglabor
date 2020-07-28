import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  Card,
  Empty,
  Button,
  List,
  Avatar,
  Tag,
  Spin,
  Modal,
  TreeSelect,
  message,
  Alert,
} from "antd";
import { ROLES } from "../../constants";
import {
  setManagers,
  removeManager,
  changeManager,
} from "../../services/project";
@inject("app")
@inject("project")
@inject("staff")
@observer
class Managements extends Component {
  state = {
    projectId: "",
    showManagementModal: false,
    addManagementType: ROLES.pm,
    selectManagerValues: [],
    groupId: "",
    changeToManager: "",
    disabledAddOkBtn: true,
  };
  constructor(props) {
    super(props);
    const { id } = props.match.params;
    this.state.projectId = id;
  }
  componentDidMount() {
    const { staff, app } = this.props;

    if (!staff.listResult._meta) {
      staff.list({
        "filter[corp_id]": app.currentCorp.id,
        "filter[role][in][0]": ROLES.pm,
        "filter[role][in][1]": ROLES.subpm,
        "filter[role][in][2]": ROLES.master,
        "filter[role][in][3]": ROLES.submaster,
        expand: 'userInfo'
      });
    }
    this.getManagers();
  }
  getManagers() {
    this.props.project.managers({
      "filter[corp_project_id]": this.state.projectId,
      "filter[role][in][0]": ROLES.pm,
      "filter[role][in][1]": ROLES.subpm,
      expand: 'userInfo'
    });
  }
  onChangeToManagerTreeSelect(value) {
    this.state.currentModal.update({
      okButtonProps: {
        disabled: false,
      },
    });
    this.setState({
      changeToManager: value,
    });
  }
  /**
   * 删除
   * @param {Object} item
   */
  async onRemoveManager(item) {
    let content = `是否删除【${item.userInfo.name}】`;
    if (item.groupMemberCount > 1) {
      const { managersResult } = this.props.project;
      const treeData = [];
      managersResult.data.items.forEach((ele) => {
        const newItem = {
          title: ele.userInfo.name,
          value: ele.user_id,
          children: [],
        };
        if (ele.user_id === item.user_id) {
          newItem.selectable = false;
        } else if (item.role === ROLES.pm) {
          treeData.push(newItem);
          return;
        }
        const children = ele.children.filter(
          (it) => it.user_id !== item.user_id
        );
        newItem.children = children.map((c) => ({
          title: c.userInfo.name,
          value: c.user_id,
          key: c.user_id,
        }));
        treeData.push(newItem);
      });
      content = (
        <div>
          <Alert
            message={`【${item.userInfo.name}】下有其他人员，无法直接删除，需要指定并转移。`}
          />
          <TreeSelect
            onChange={this.onChangeToManagerTreeSelect.bind(this)}
            treeData={treeData}
            placeholder="选择指定人员"
            style={{ width: "100%", marginTop: 15 }}
          />
        </div>
      );
    }

    const modal = Modal.confirm({
      title: "提示",
      content,
      okButtonProps: {
        disabled: item.groupMemberCount > 1,
      },
      onOk: async () => {
        const { errCode, errMsg } = await removeManager(
          item.id,
          item.groupMemberCount > 1
            ? {
              user_id: this.state.changeToManager,
            }
            : {}
        );
        if (errCode) {
          message.error(errMsg);
          return;
        }
        message.success("删除成功");
        this.getManagers();
      },
    });

    this.setState({
      currentModal: modal,
    });
  }
  /**
   * 更换
   * @param {Object} item
   */
  onChangeManager(item) {
    const { data } = this.props.staff.listResult;
    let treeData = data.items.filter((ele) => ele.user_id !== item.user_id);
    treeData = treeData.map((ele) => ({
      title: ele.userInfo.name,
      value: ele.user_id,
    }));
    const modal = Modal.confirm({
      title: "更换为",
      content: (
        <div>
          <TreeSelect
            style={{ width: "100%" }}
            onChange={this.onChangeToManagerTreeSelect.bind(this)}
            placeholder="选择人员"
            treeData={treeData}
          />
        </div>
      ),
      okButtonProps: {
        disabled: true,
      },
      onOk: async () => {
        const { errCode, errMsg } = await changeManager(item.id, {
          user_id: this.state.changeToManager,
        });
        if (errCode) {
          message.error(errMsg);
          return;
        }
        message.success("更换成功");
        this.getManagers();
      },
    });
    this.setState({
      currentModal: modal,
    });
  }
  onOpenManagementModal(addType, groupId = "") {
    this.setState({
      showManagementModal: true,
      addManagementType: addType,
      groupId,
    });
  }
  async onAddManagementOk() {
    const {
      addManagementType,
      selectManagerValues,
      projectId,
      groupId,
    } = this.state;
    const { currentCorp } = this.props.app;
    this.setState({
      confirmLoading: true,
    });

    const { errCode, errMsg } = await setManagers({
      users: selectManagerValues.map((item) => ({
        corp_id: currentCorp.id,
        corp_project_id: projectId,
        user_id: item,
        role: addManagementType,
        status: 10,
        group_id: addManagementType === ROLES.pm ? "" : groupId,
      })),
    });
    if (errCode) {
      message.error(errMsg);
      return;
    }
    message.success("添加成功");
    this.getManagers();
    this.setState({
      confirmLoading: false,
      showManagementModal: false,
    });
  }
  renderAction(item) {
    return (
      <div>
        <Button onClick={() => this.onChangeManager(item)}>更换</Button>
        <Button
          style={{ marginLeft: 8 }}
          onClick={() => this.onRemoveManager(item)}
          type="danger"
        >
          删除
        </Button>
      </div>
    );
  }
  render() {
    const { authorize, jurisdiction } = this.props;
    const { addManagementType, disabledAddOkBtn } = this.state;
    const { data, pending } = this.props.project.managersResult;
    const { listResult, staffCorpRoleResult } = this.props.staff;
    console.log(listResult)
    const isProjectPM = data.flatItems.find((item) => item.role === ROLES.pm);
    const managerIds = data.flatItems.map((item) => item.user_id);
    const filterItems = listResult.data.items.filter(
      (item) => !managerIds.includes(item.user_id)
    );
    const treeSelectProps = {
      treeData: filterItems.map((item) => ({
        title: item.userInfo.name || item.userInfo.email,
        value: item.user_id,
        key: item.user_id,
      })),
      value: this.state.selectManagerValues,
      onChange: (values) => {
        this.setState({
          selectManagerValues: values,
          disabledAddOkBtn: !values.length,
        });
      },
      allowClear: true,
      treeCheckable: true,
      searchPlaceholder: "请选择人员",
      style: {
        width: "100%",
      },
    };

    return (
      <React.Fragment>
        <Card
          title="项目管理人员"
          loading={pending || false}
          extra={
            jurisdiction &&
            [ROLES.master, ROLES.submaster].includes(
              staffCorpRoleResult.role
            ) && (
              <Button
                type="primary"
                icon="plus"
                onClick={() => this.onOpenManagementModal(ROLES.pm)}
              >
                添加项目经理
              </Button>
            )
          }
        >
          {data.items.length ? (
            data.items.map((item) => (
              <Card
                key={item.user_id}
                type="inner"
                style={{ marginBottom: 15 }}
                bodyStyle={{ paddingTop: 0, paddingBottom: 0 }}
                title={
                  <List.Item.Meta
                    avatar={<Avatar icon="user" />}
                    title={
                      <div>
                        {item.userInfo.name} <Tag color="gold">项目经理</Tag>
                      </div>
                    }
                    description={item.userInfo.mobile}
                  />
                }
                extra={jurisdiction && this.renderAction(item)}
              >
                <List
                  dataSource={item.children}
                  loadMore={
                    jurisdiction &&
                    item.children.length &&
                    isProjectPM && (
                      <div style={{ textAlign: "center", padding: 24 }}>
                        <Button
                          onClick={() =>
                            this.onOpenManagementModal(
                              ROLES.subpm,
                              item.user_id
                            )
                          }
                        >
                          添加施工员
                        </Button>
                      </div>
                    )
                  }
                  renderItem={(item) => (
                    <List.Item
                      key={item.user_id}
                      extra={this.renderAction(item)}
                    >
                      <List.Item.Meta
                        avatar={<Avatar icon="user" />}
                        title={
                          <div>
                            {item.userInfo.name} <Tag color="cyan">施工员</Tag>
                          </div>
                        }
                        description={item.userInfo.mobile}
                      />
                    </List.Item>
                  )}
                >
                  {!item.children.length && (
                    <div style={{ textAlign: "center" }}>
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description="暂无施工员"
                      >
                        {jurisdiction && isProjectPM && (
                          <Button
                            onClick={() =>
                              this.onOpenManagementModal(
                                ROLES.subpm,
                                item.user_id
                              )
                            }
                          >
                            添加施工员
                          </Button>
                        )}
                      </Empty>
                    </div>
                  )}
                </List>
              </Card>
            ))
          ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无项目经理"
              />
            )}
        </Card>
        <Modal
          title={addManagementType === ROLES.pm ? "添加项目经理" : "添加施工员"}
          onCancel={() => {
            this.setState({
              showManagementModal: false,
              selectManagerValues: [],
              confirmLoading: false,
            });
          }}
          onOk={this.onAddManagementOk.bind(this)}
          visible={this.state.showManagementModal}
          confirmLoading={this.state.confirmLoading}
          maskClosable={false}
          okButtonProps={{
            disabled: disabledAddOkBtn,
          }}
        >
          <Spin spinning={listResult.pending || false}>
            <TreeSelect {...treeSelectProps} />
          </Spin>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Managements;
