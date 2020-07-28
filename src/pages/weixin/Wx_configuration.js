import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { inject, observer } from "mobx-react";
import Page from "../../components/Page";
import Uploader from "../../services/wx_upload";
import {
  corp_wxpay_cre,
  corp_wxpaylist,
  payment_plan_cre,
  payment_plan_list,
  corp_wxpay_text,
} from "../../services/weixin";
import moment from "moment";
import "./iconfont.less";

import {
  PageHeader,
  Button,
  Card,
  Modal,
  message,
  Upload,
  DatePicker,
  Form,
  Icon,
  Input,
  Alert,
} from "antd";
const { RangePicker } = DatePicker;
const { TextArea } = Input;
@inject("app")
@observer
class Wx_configuration extends Component {
  state = {
    fileList: [],
    fileList2: [],
    corpid: "",
    appid: "",
    corp_wxpaylist: {},
    corp_wxpay: {},
    corp_wxpay_id: "",
    schedulemodal: false,
    startday: moment().startOf("day"),
    endday: null,
    startday_defal: null,
    cre_startday: "",
    cre_endday: "",
    plan_list: [],
  };
  constructor(props) {
    super(props);
    const { corpid } = props.match.params;
    const { appid } = props.app.currentCorp;
    this.state.corpid = corpid;
    this.state.appid = appid;
  }
  componentDidMount() {
    this.corpIdinfo();
    this.payment_plan_list();
  }
  async corpIdinfo() {
    const { corpid } = this.state;
    const { errCode, errMsg, data } = await corp_wxpaylist({
      "filter[corp_id]": corpid,
    });
    //   const { errCode, errMsg, data } = await detail({
    // 	'filter[corp_id]':corpid
    // });
    if (errCode) {
      message.error(errMsg);
      return;
    }
    this.setState({
      corp_wxpaylist: data.items,
      corp_wxpay: data.items[0],
      corp_wxpay_id: data.items[0] ? data.items[0].id || "" : "",
    });
    // this.setState({ currentCorp: data.items[0].corpInfo, autoLoading: false,corp_agent_id:data.items[0].id });
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { fileList, appid, fileList2, corpid } = this.state;
        // let files = fileList.filter((file) => file instanceof File);
        // let files2 = fileList2.filter((file) => file instanceof File);
        // let arr = files.concat(files2);
        // const uploader = new Uploader(arr);
        // const { errCode, data } = await uploader.upload(appid);
        // if (!errCode) {
        //   const { errCode } = await corp_wxpay_cre({
        //     corp_id: corpid,
        //     name: values.name,
        //     mch_id: values.userid,
        //     key: values.zf_miyao,
        //     corp_agent_id: "",
        //   });
        //   if (!errCode) {
        //     message.success("添加成功");
        //     this.corpIdinfo();
        //   }
        // }
        // let { errCode } = await corp_wxpay_text({
        //   appid: appid,
        //   apiclient_cert: values.apiclient_cert,
        //   apiclient_key: values.apiclient_key,
        // });
        // if (!errCode) {
        let { errCode, errMsg } = await corp_wxpay_cre({
          corp_id: corpid,
          name: values.name,
          mch_id: values.userid,
          key: values.zf_miyao,
          corp_agent_id: "",
          apiclient_cert: values.apiclient_cert,
          apiclient_key: values.apiclient_key,
        });
        if (!errCode) {
          message.success("添加成功");
          this.corpIdinfo();
        } else {
          message.error(errMsg);
          return;
        }
        // }
      }
    });
  };
  beforeUpload(file) {
    const { fileList } = this.state;
    fileList.push(file);
    this.setState({ fileList });

    return false;
  }
  onUploadFileChange({ fileList }) {
    this.setState({
      fileList,
    });
  }
  onRemoveFile(file) {
    if (!(file instanceof File)) {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: "删除文件",
          content: "确定删除该文件么？",
          onOk: () => {
            resolve();
          },
          onCancel: () => {
            reject();
          },
        });
      });
    }
  }
  gowechatpay(id) {
    this.props.history.push(
      `/dashboard/${this.state.corpid}/weixin/wexinpay/${id}`
    );
  }
  beforeUpload2(file) {
    const { fileList2 } = this.state;
    fileList2.push(file);
    this.setState({ fileList2: fileList2 });
    return false;
  }
  onUploadFileChange2({ fileList }) {
    this.setState({
      fileList2: fileList,
    });
  }
  onRemoveFile2(file) {
    if (!(file instanceof File)) {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          title: "删除文件",
          content: "确定删除该文件么？",
          onOk: () => {
            resolve();
          },
          onCancel: () => {
            reject();
          },
        });
      });
    }
  }
  schedulemodal() {
    this.setState({
      schedulemodal: true,
    });
  }
  scheduleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        this.setState(
          {
            cre_startday: values.day[0].format("YYYY-MM-DD"),
            cre_endday: values.day[1].format("YYYY-MM-DD"),
          },
          async () => {
            const { corpid, cre_endday, cre_startday } = this.state;
            const { errCode } = await payment_plan_cre({
              corp_id: corpid,
              start_int_day: cre_startday,
              end_int_day: cre_endday,
              name: values.name,
              mch_id: values.mch_id,
            });
            if (!errCode) {
              this.setState({
                schedulemodal: false,
              });
              this.payment_plan_list();
            }
          }
        );
      }
    });
  };
  async payment_plan_list() {
    const { corpid } = this.state;
    const { data, errCode, errMsg } = await payment_plan_list({
      "filter[corp_id]": corpid,
    });
    if (errCode) {
      message.error(errMsg);
      return;
    }
    this.setState({
      plan_list: data.items,
    });
  }
  disabledDateFun(current) {
    const { startday, startday_defal } = this.state;
    return (
      startday > current || current > moment(startday_defal).add(29, "day")
    );
  }
  CalendarChange(dates, dateStrings) {
    this.setState({
      startday: dates[0],
      startday_defal: dates[0],
    });
  }
  OpenChange(open) {
    this.setState({
      startday: moment().startOf("day"),
      startday_defal: null,
    });
  }
  qiehuan() {
    this.setState({
      corp_wxpay: null,
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      fileList,
      fileList2,
      corp_wxpay,
      schedulemodal,
      plan_list,
    } = this.state;
    const gridStyle = {
      width: "20%",
      textAlign: "center",
      height: "100px",
    };
    const gridStyle2 = {
      width: "20%",
      textAlign: "center",
      height: "120px",
    };
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
    return (
      <Page>
        <PageHeader
          onBack={() => this.props.history.goBack()}
          title="微信支付配置"
        />
        <Page.Content>
          {!corp_wxpay ? (
            <Page.Content.Panel>
              <Form
                name="basic"
                onSubmit={this.handleSubmit}
                {...formItemLayout}
                style={{ width: 800, margin: "auto" }}
              >
                <Form.Item label="配置名称">
                  {getFieldDecorator("name", {
                    rules: [
                      {
                        required: true,
                        message: "请输入配置名称",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>

                <Form.Item label="商户ID">
                  {getFieldDecorator("userid", {
                    rules: [
                      {
                        required: true,
                        message: "请输入商户ID!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="支付密钥">
                  {getFieldDecorator("zf_miyao", {
                    rules: [
                      {
                        required: true,
                        message: "请输入支付密钥!",
                      },
                    ],
                  })(<Input />)}
                </Form.Item>
                <Form.Item label="支付证书">
                  {getFieldDecorator("apiclient_cert", {
                    rules: [
                      {
                        required: true,
                        message: "请输入支付证书!",
                      },

                    ],
                  })(
                    // <Upload.Dragger
                    //   // name="files"
                    //   onRemove={this.onRemoveFile.bind(this)}
                    //   accept=".pem"
                    //   beforeUpload={this.beforeUpload.bind(this)}
                    //   onChange={this.onUploadFileChange.bind(this)}
                    //   fileList={fileList}
                    // >
                    //   <p className="ant-upload-drag-icon">
                    //     <Icon type={"upload"} />
                    //   </p>
                    //   <p className="ant-upload-text">放入文件</p>
                    // </Upload.Dragger>
                    <TextArea rows={4} placeholder='打开_cert文件，复制全部内容，填入输入框' />
                  )}
                </Form.Item>
                <Form.Item label="证书密钥">
                  {getFieldDecorator("apiclient_key", {
                    rules: [
                      {
                        required: true,
                        message: "请输入证书密钥!",
                      },
                    ],
                  })(
                    // <Upload.Dragger
                    //   // name="files"
                    //   onRemove={this.onRemoveFile2.bind(this)}
                    //   accept=".pem"
                    //   beforeUpload={this.beforeUpload2.bind(this)}
                    //   onChange={this.onUploadFileChange2.bind(this)}
                    //   fileList={fileList2}
                    // >
                    //   <p className="ant-upload-drag-icon">
                    //     <Icon type={"upload"} />
                    //   </p>
                    //   <p className="ant-upload-text">放入文件</p>
                    // </Upload.Dragger>
                    <TextArea rows={4} placeholder='打开_key文件，复制全部内容，填入输入框' />
                  )}
                </Form.Item>
                <Form.Item>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      width: 800,
                    }}
                  >
                    {/* <Button
                      style={{ margin: 20 }}
                      onClick={() => {
                        this.setState({
                          showmodal: false,
                        });
                      }}
                    >
                      取消
                    </Button> */}
                    <Button type="primary" htmlType="submit">
                      添加
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Page.Content.Panel>
          ) : (
              <Page.Content.Panel>
                <Card
                  title={
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <h2 style={{ fontWeight: 550, fontSize: 20 }}>
                          配置相关信息:
                      </h2>
                        <Button type="primary" onClick={this.qiehuan.bind(this)}>
                          添加支付配置
                      </Button>
                      </div>
                      <Alert
                        message="支付配置已设置完成，请完成支付流水计划表，方便开通您的付款功能！"
                        type="success"
                        showIcon
                      />
                    </>
                  }
                >
                  <Card.Grid style={gridStyle2}>
                    <h4>配置名称</h4>
                    <div>{corp_wxpay.name}</div>
                  </Card.Grid>
                  <Card.Grid style={gridStyle2}>
                    <h4>商户号</h4>
                    <div>{corp_wxpay.mch_id}</div>
                  </Card.Grid>
                  <Card.Grid style={gridStyle2}>
                    <h4>支付密钥</h4>
                    <div style={{ wordWrap: "break-word" }}>{corp_wxpay.key}</div>
                  </Card.Grid>
                  <Card.Grid style={gridStyle2}>
                    <h4>商户密钥文件</h4>
                    <div style={{ wordWrap: "break-word" }}>
                      {corp_wxpay.cert_path}
                    </div>
                  </Card.Grid>
                  <Card.Grid style={gridStyle2}>
                    <h4>微信支付key文件</h4>
                    <div style={{ wordWrap: "break-word" }}>
                      {corp_wxpay.key_path}
                    </div>
                  </Card.Grid>
                  <Card.Grid
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={{ fontWeight: 550, fontSize: 20 }}>流水计划表</h2>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        type="primary"
                        style={{ height: 40, marginRight: 10 }}
                        onClick={this.schedulemodal.bind(this)}
                      >
                        创建计划表
                    </Button>
                      <Alert
                        style={{ background: "#87CEFA" }}
                        message={
                          <a
                            style={{ color: "white" }}
                            target="_blank"
                            href="https://pay.weixin.qq.com/static/product/product_intro.shtml?name=wallet"
                          >
                            <i className="iconfont icon-bangzhu"></i>
                          查看帮助文档
                        </a>
                        }
                        type="info"
                      />
                    </div>
                  </Card.Grid>
                  {plan_list.map((item) => {
                    return (
                      <React.Fragment key={item.id}>
                        <Card.Grid style={gridStyle}>
                          <h4>计划表名称</h4>
                          <div style={{ wordWrap: "break-word" }}>
                            {item.name}
                          </div>
                        </Card.Grid>
                        <Card.Grid style={gridStyle}>
                          <h4>开始时间</h4>
                          <div style={{ wordWrap: "break-word" }}>
                            {item.start_int_day}
                          </div>
                        </Card.Grid>
                        <Card.Grid style={gridStyle}>
                          <h4>结束时间</h4>
                          <div style={{ wordWrap: "break-word" }}>
                            {item.end_int_day}
                          </div>
                        </Card.Grid>
                        <Card.Grid style={gridStyle}>
                          <h4>已完成次数</h4>
                          <div style={{ wordWrap: "break-word" }}>
                            {item.nums}
                          </div>
                        </Card.Grid>
                        <Card.Grid style={gridStyle}>
                          <h4>前往支付</h4>
                          <Button
                            type="primary"
                            onClick={this.gowechatpay.bind(this, item.id)}
                          >
                            前往完成
                        </Button>
                        </Card.Grid>
                      </React.Fragment>
                    );
                  })}
                </Card>
                <Modal visible={schedulemodal} title="创建计划表" footer={null}>
                  <Form
                    name="basic"
                    onSubmit={this.scheduleSubmit}
                    {...formItemLayout}
                  >
                    <Form.Item label="名称">
                      {getFieldDecorator("name", {
                        rules: [
                          {
                            required: true,
                            message: "请输入名称",
                          },
                        ],
                      })(<Input />)}
                    </Form.Item>

                    <Form.Item label="商户号">
                      {getFieldDecorator("mch_id", {
                        rules: [
                          {
                            required: true,
                            message: "请输入商户号",
                          },
                        ],
                      })(<Input />)}
                    </Form.Item>
                    <Form.Item label="始末日期">
                      {getFieldDecorator("day", {
                        rules: [
                          {
                            required: true,
                            message: "请输入始末日期!",
                          },
                        ],
                      })(
                        <RangePicker
                          disabledDate={this.disabledDateFun.bind(this)}
                          onOpenChange={this.OpenChange.bind(this)}
                          onCalendarChange={this.CalendarChange.bind(this)}
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                          width: 460,
                        }}
                      >
                        <Button
                          style={{ margin: 20 }}
                          onClick={() => {
                            this.setState({
                              schedulemodal: false,
                            });
                          }}
                        >
                          取消
                      </Button>
                        <Button type="primary" htmlType="submit">
                          创建
                      </Button>
                      </div>
                    </Form.Item>
                  </Form>
                </Modal>
              </Page.Content.Panel>
            )}
        </Page.Content>
      </Page>
    );
  }
}
let Wx_configuration_ = Form.create({ name: "Wx_configuration" })(
  withRouter(Wx_configuration)
);
export default Wx_configuration_;
