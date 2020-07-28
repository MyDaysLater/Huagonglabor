import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import {
  PageHeader,
  Tabs,
  Spin,
  Descriptions,
  Button,
  message,
  Modal,
  Select,
  Icon,
  Avatar,
} from "antd";
import Page from "../../components/Page";
import projectService from "../../services/project";
import { getRegion } from "../../utils/region";
import moment from "moment";
import Announcements from "../announcement/Announcements";
import Payroll from "../Payroll/Payroll";
import Workers from "../worker/Workers";
import Managements from "./Managements";
import Salary from "../salary/salary";
import Pinfromation from "../project_information/project_information";
import { ROLES } from "../../constants";
import Attendances from "../attendance/Attendances";
import styles from "./Project.module.less";
const { TabPane } = Tabs;
@inject("app")
@inject("project")
@inject("staff")
@observer
class Project extends Component {
  state = {
    id: "",
    projectInfo: {},
    projectInfoPending: true,
    defaultActiveKey: "1",
    tabActiveKey: "1",
    tabtwoKey: "1",
    userole: '',
  };
  constructor(props) {
    super(props);
    // console.log(props)
    const { id } = props.match.params;
    const { hash } = props.location;
    const { data } = props.project.listResult;
    const { authorize } = props;
    this.state.id = id;
    // this.state.userole = 'sf';
    this.state.userole = authorize.role.type;
    let projectInfo = { id };
    if (hash) {
      this.state.tabActiveKey = hash.substr(1);
    }
    if (data.items) {
      const item = data.items.find((item) => item.id === id);
      if (item) {
        projectInfo = item;
        const attachments = [];
        projectInfo.attachments.forEach((it) => {
          attachments.push(Object.assign({ uid: it.id }, { ...it }));
        });
        projectInfo = Object.assign({ ...projectInfo }, { attachments });
      }
    }
    this.state.projectInfo = projectInfo;
  }
  componentDidMount() {
    this.getManagers();
    this.getProjectDetail();
    window.addEventListener("hashchange", this.onHashChange.bind(this), false);
  }
  componentWillUnmount() {
    window.removeEventListener("hashchange", this.onHashChange);
  }
  getManagers() {
    this.props.project.managers({
      "filter[corp_project_id]": this.state.projectInfo.id,
      "filter[role][in][0]": ROLES.pm,
      "filter[role][in][1]": ROLES.subpm,
    });
  }
  onHashChange() {
    let { hash } = this.props.location;
    hash = hash.substr(1);
    if (!hash) {
      hash = this.state.defaultActiveKey;
    }
    this.setState({ tabActiveKey: hash });
  }
  onSetProjectStatus() {
    const { projectInfo } = this.state;
    let projectStatus = projectInfo.status;
    const modal = Modal.confirm({
      title: "设置项目状态",
      content: (
        <Select
          style={{ width: "100%" }}
          defaultValue={projectStatus}
          onChange={(v) => (projectStatus = v)}
          placeholder="请选择状态"
        >
          <Select.Option key={0} value={0}>
            未开始
          </Select.Option>
          <Select.Option key={1} value={1}>
            开工
          </Select.Option>
          <Select.Option key={2} value={2}>
            暂停
          </Select.Option>
          <Select.Option key={3} value={10}>
            结束
          </Select.Option>
        </Select>
      ),
      onOk: async () => {
        return new Promise(async (resolve, reject) => {
          modal.update({
            cancelButtonProps: {
              disabled: true,
            },
            confirmLoading: true,
          });
          const { errCode, errMsg, data } = await projectService.update(
            projectInfo.id,
            {
              status: projectStatus,
            }
          );
          modal.update({
            cancelButtonProps: {
              disabled: false,
            },
          });
          if (errCode) {
            message.error(errMsg);
            reject();
          }
          message.success("更新成功");
          this.setState({ projectInfo: data });
          resolve();
        });
      },
    });
  }
  async getProjectDetail() {
    const { id } = this.state;
    const { errCode, data } = await projectService.detail(id);
    if (errCode) {
      message.error(data.message);
      return;
    }
    data.attachments = data.attachments.map((item) => {
      item.uid = item.id;
      return item;
    });
    this.setState({ projectInfo: data, projectInfoPending: false });

  }
  onTabChange(key) {
    const { history, location } = this.props;
    const { pathname } = location;
    this.setState({ tabActiveKey: key });
    history.replace(`${pathname}#${key}`);
  }
  onTabtwoChange(key) {
    this.setState({ tabtwoKey: key });
  }
  render() {
    const { authorize, jurisdiction } = this.props;
    // console.log(this.props)
    const { projectInfo, projectInfoPending, tabActiveKey, tabtwoKey, userole, } = this.state;
    const { corpRole = {} } = this.props.staff.staffCorpRoleResult;
    return (
      <Page>
        <PageHeader
          title={projectInfo.name}
          onBack={() => {
            this.props.history.goBack();
          }}
        />
        <Page.Content>
          <Page.Content.Panel>
            <Tabs
              activeKey={tabActiveKey}
              onChange={this.onTabChange.bind(this)}
            >
              <TabPane tab="项目详情" key="1">
                <Spin spinning={projectInfoPending}>
                  {!projectInfoPending && (
                    <React.Fragment>
                      <Descriptions
                        bordered
                        title={<div>基本信息</div>}
                        column={1}
                      >
                        <Descriptions.Item label="项目名称">
                          {projectInfo.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="项目地址">
                          {getRegion(
                            projectInfo.province,
                            projectInfo.city,
                            projectInfo.area
                          )}
                          {projectInfo.address}
                        </Descriptions.Item>
                        <Descriptions.Item label="项目简介">
                          <div
                            dangerouslySetInnerHTML={{
                              __html: projectInfo.description,
                            }}
                          />
                          {projectInfo.attachments.map((item, index) => (
                            <a
                              className={styles.attachment}
                              key={index}
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {/image/.test(item.type) ? (
                                <Avatar
                                  size="large"
                                  src={item.url}
                                  shape="square"
                                />
                              ) : (
                                  <React.Fragment>
                                    <Icon type="file" />
                                    {item.name}
                                  </React.Fragment>
                                )}
                            </a>
                          ))}
                        </Descriptions.Item>
                        <Descriptions.Item label="项目状态">
                          {projectInfo.status_label}
                          {corpRole.role !== ROLES.contractor &&
                            jurisdiction && (
                              <Button
                                type="link"
                                onClick={this.onSetProjectStatus.bind(this)}
                              >
                                设置
                              </Button>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="创建日期">
                          {moment(projectInfo.created_at).format(
                            "YYYY年MM月DD日"
                          )}
                        </Descriptions.Item>
                      </Descriptions>
                    </React.Fragment>
                  )}
                </Spin>
              </TabPane>
              {corpRole.role !== ROLES.contractor && (
                <TabPane tab="项目设置" key="2">
                  <Tabs
                    activeKey={tabtwoKey}
                    onChange={this.onTabtwoChange.bind(this)}
                    type="card"
                  >
                    <TabPane tab="项目基础信息" key="1">
                      {tabtwoKey === '1' && <Pinfromation {...this.props} />}
                    </TabPane>
                    <TabPane tab="项目管理人员" key="2">
                      {tabtwoKey === '2' && <Managements {...this.props} />}
                    </TabPane>
                    <TabPane tab="工资发放流程" key="3">
                      {tabtwoKey === '3' && <Salary {...this.props} />}
                    </TabPane>
                  </Tabs>
                </TabPane>
              )}
              <TabPane tab="成员" key="3">
                {tabActiveKey === '3' && <Workers {...this.props} />}
              </TabPane>
              <TabPane tab="公告" key="4">
                {tabActiveKey === '4' && <Announcements {...this.props} />}
              </TabPane>
              <TabPane tab="考勤" key="5">
                {tabActiveKey === '5' && <Attendances {...this.props} />}
              </TabPane>
              {(userole === 'sf' || userole === 'master') && <TabPane tab="工资单" key="6">
                {tabActiveKey === '6' && <Payroll {...this.props} />}
              </TabPane>}
            </Tabs>
          </Page.Content.Panel>
        </Page.Content>
      </Page>
    );
  }
}
export default Project;
