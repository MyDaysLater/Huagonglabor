import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import Page from "../../components/Page";
import Comp_form from "../../components/form";
import queryString from "querystring";
import { corp_wxpaylist, wx_update, corp_config_put, corp_config_post } from "../../services/weixin";
import {
  PageHeader,
  Button,
  Table,
  List,
  Avatar,
  Modal,
  message,
  Select,
  Form,
} from "antd";
import { bindMiniProgram, corp_config } from "../../services/weixin";
import useCorpService from "../../services/corp";
const { Option } = Select;
@inject("app")
@observer
class MiniProgram extends Component {
  state = {
    currentCorp: {},
    autoLoading: true,
    showmodal: false,
    corp_wxpaylist: [],
    appid: "",
    corp_agent_id: "",
    fromshow: false,
    formInlinelist: [
      {
        key: 'mini-name',
        title: '小程序标题',
        placeholder: '请填写小程序标题',
        type: 'input'
      }

    ],
    formInline: {
      'mini-name': ''
    },
    config_info: {

    },
  }
  constructor(props) {
    super(props);
    const { corpid } = props.match.params;
    const { appid } = props.app.currentCorp;
    const { search = "", pathname } = props.location;
    const { auth_code = "" } = queryString.parse(search.substr(1));
    this.state.corpId = corpid;
    this.state.auth_code = auth_code;
    this.state.pathname = pathname;
    this.state.appid = appid;
    this.set_config = this.set_config.bind(this);
  }
  async componentWillMount() {
    this.corp_config();
    const { auth_code, pathname, corpId } = this.state;
    if (auth_code) {
      this.setState({ autoLoading: true });
      const { errCode, data } = await bindMiniProgram({ auth_code, corpId });
      this.setState({ autoLoading: false });
      if (errCode) {
        return;
      }
      const { currentCorp, setCurrentCorp } = this.props.app;
      setCurrentCorp(Object.assign({}, currentCorp, { corp_agent: data }));
      Modal.info({
        title: "恭喜",
        content: "恭喜您授权开通了专属安薪小程序",
        onOk: () => {
          this.props.history.replace(pathname);
        },
      });
    } else {
      const { errCode, errMsg, data } = await useCorpService.detail(corpId);
      //   const { errCode, errMsg, data } = await detail({
      // 	'filter[corp_id]':corpId
      // });
      if (errCode) {
        message.error(errMsg);
        return;
      }
      this.setState({
        currentCorp: data,
        autoLoading: false,
        corp_agent_id: data.corp_agent ? data.corp_agent.id || "" : "",
      }, () => {
        this.wxpaylist();
      });
      // this.setState({ currentCorp: data.items[0].corpInfo, autoLoading: false,corp_agent_id:data.items[0].id });
    }

  }
  async wxpaylist() {
    const { corpId } = this.state;
    const { errCode, errMsg, data } = await corp_wxpaylist({
      'filter[corp_id]': corpId
    });
    //   const { errCode, errMsg, data } = await detail({
    // 	'filter[corp_id]':corpId
    // });
    if (errCode) {
      message.error(errMsg);
      return;
    }
    this.setState({
      corp_wxpaylist: data.items,
    });
  }
  async corp_config() {
    const { errCode, errMsg, data } = await corp_config();
    if (errCode) {
      message.error(errMsg);
      return;
    }
    this.setState({
      formInline: data.value,
      config_info: data
    })
  }
  async onClickBindMiniProgram() {
    const { corpId, currentCorp } = this.state;
    if (currentCorp.type < 2) {
      Modal.info({
        title: "提示",
        content: "请先升级至高级会员版以上的版本",
      });
      return;
    }
    const { errCode, data } = await bindMiniProgram({ corpId });
    if (errCode) {
      return;
    }
    window.open(data.authUrl);
  }
  showmodal() {
    this.setState({
      showmodal: true,
    });
  }
  onRef = (ref) => {
    this.child_comp_table = ref
  }
  onRef_Comp_form = (ref) => {
    this.child_Comp_form = ref
  }
  handleCancel() {
    this.setState({
      showmodal: false,
    });
  }
  set_config(value) {
    let config_info = this.state.config_info;
    config_info.value = value;
    this.setState({
      config_info,
    }, async () => {
      const { data, errCode, errMsg } = this.state.config_info.id ? await corp_config_put(this.state.config_info.id, {
        value: this.state.config_info.value
      }) : await corp_config_post({
        corp_id: this.state.corpId,
        key: this.state.config_info.key,
        value: this.state.config_info.value
      });
      if (errCode) {
        message.error(errMsg);
        return;
      }
      this.setState({
        formInline: data.value,
        config_info: data
      })
    })
  }
  onUpgradeMemberLevel() {
    Modal.info({
      title: "提示",
      content: (
        <div>
          <p>请联系我们【华工数据】</p>
          <p>电话：0755-86562888</p>
          <p>
            邮箱：<a href="mailto:hg_data@163.com">hg_data@163.com</a>
          </p>
        </div>
      ),
    });
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { currentCorp } = this.state;
        const { corp_agent } = currentCorp;
        const { data, errCode, errMsg } = await wx_update(corp_agent.id, {
          mch_id: values.wxpayid
        })
        if (errCode) {
          message.error(errMsg);
          return;
        }
        message.success('更换成功')
        this.setState({
          corp_wxpayinfo: data,
          showmodal: false
        })
      }
    });
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      autoLoading,
      currentCorp,
      showmodal,
      corp_wxpaylist,
    } = this.state;
    const { authorize, jurisdiction } = this.props;
    const dataSource = [];
    const { corp_agent } = currentCorp;
    if (corp_agent) {
      dataSource.push({
        key: corp_agent.id,
        nick_name: corp_agent.nick_name,
        appid: corp_agent.appid,
        current_version: corp_agent.current_version,
        version: currentCorp.type_label,
      });
    }
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 4,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 20,
        },
      },
    };
    const columns = [
      {
        title: "专属小程序名称",
        dataIndex: "nick_name",
        align: 'center',
        key: "nick_name",
      },
      {
        title: "APP ID",
        dataIndex: "appid",
        align: 'center',
        key: "appid",
      },
      {
        title: "小程序版本",
        dataIndex: "current_version",
        key: "current_version",
        align: 'center',
      },
      {
        title: "购买版本",
        dataIndex: "version",
        align: 'center',
        key: "version",
      },
      {
        title: "支付配置",
        dataIndex: "zhifu",
        key: "zhifu",
        align: 'center',
        render: (text, record) => {
          return (
            <>
              {/* <a onClick={this.gowechatpay.bind(this)}>更换配置</a> */}

              <a onClick={this.showmodal.bind(this)}>更换支付配置</a>
            </>
          );
        },
      },
      {
        title: "小程序界面设置",
        dataIndex: "config",
        key: "config",
        align: 'center',
        render: (text, record) => {
          return (
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {/* <a onClick={this.gowechatpay.bind(this)}>更换配置</a> */}

              <a onClick={() => {
                this.child_Comp_form.show();
              }}>设置</a>
            </div>
          );
        },
      },
    ];
    return (
      <Page>
        <PageHeader
          onBack={() => this.props.history.goBack()}
          title="绑定小程序"
        />
        <Page.Content>
          <Page.Content.Panel>
            <Table
              title={() => "部署状态"}
              bordered
              // loading={autoLoading}
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              locale={
                currentCorp.type < 2
                  ? {
                    emptyText: (
                      <div>
                        请先升级至高级会员版以上的版本
                        <div style={{ marginTop: 10 }}>
                          <Button
                            onClick={this.onUpgradeMemberLevel.bind(this)}
                            disabled={!jurisdiction}
                            type="primary"
                          >
                            升级高级会员版
                            </Button>
                        </div>
                      </div>
                    ),
                  }
                  : {}
              }
            />

            {!corp_agent && (
              <List
                style={{ marginTop: 60 }}
                bordered
                loading={autoLoading}
                size="large"
                header="服务"
                dataSource={[
                  {
                    key: 1,
                    title: "小程序第三方平台授权 (请先升级至高级会员版)",
                    description:
                      "授权后，华工劳务工管理系统专属小程序的版本升级、提审、发布将完全自动化 每次升级小程序版本都会推送通知",
                  },
                ]}
                renderItem={(item) => (
                  <List.Item
                    extra={
                      <Button
                        type="primary"
                        size="large"
                        disabled={!jurisdiction}
                        onClick={this.onClickBindMiniProgram.bind(this)}
                      >
                        去授权
                      </Button>
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          size="large"
                          src={require("../../images/miniprogram-logo.svg")}
                        />
                      }
                      title={item.title}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            )}
            <Comp_form
              formInlinelist={this.state.formInlinelist}
              formInline={this.state.formInline}
              ref="form"
              onRef={this.onRef_Comp_form}
              create={this.set_config}
            >
            </Comp_form>
            <Modal
              title="操作"
              visible={showmodal}
              onOk={() => this.handleCancel()}
              onCancel={() => this.handleCancel()}
              footer={null}
            >
              <Form
                name="basic"
                onSubmit={this.handleSubmit}
                {...formItemLayout}
              >
                <Form.Item label="配置名称：">
                  {getFieldDecorator("wxpayid", {
                    rules: [
                      {
                        required: true,
                        message: "请选择配置!",
                      },
                    ],
                  })(
                    <Select
                      showSearch
                      style={{ width: 400 }}
                      placeholder="请选择支付配置"
                      optionFilterProp="children"
                    >
                      {corp_wxpaylist.map((item, index) => {
                        return (
                          <Option key={item.id} value={item.mch_id}>
                            {"配置名称：" +
                              item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item>
                  <Button
                    style={{ margin: 20 }}
                    onClick={() => {
                      this.setState({
                        showmodal: false,
                      });
                    }}
                  >
                    取消
                  </Button>
                  <Button type="primary" htmlType="submit">
                    更换
                  </Button>
                </Form.Item>
              </Form>
            </Modal>
          </Page.Content.Panel>
        </Page.Content>
      </Page>
    );
  }
}

let MiniProgram_ = Form.create({ name: "MiniProgram" })(
  withRouter(MiniProgram)
);

export default MiniProgram_;
