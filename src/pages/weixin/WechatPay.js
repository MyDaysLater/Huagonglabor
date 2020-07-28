import React, { Component } from "react";
import { inject, observer } from "mobx-react";
import Page from "../../components/Page";
import Comp_table from "../../components/Table";
import { withRouter } from "react-router-dom";
import {
  wxlist,
  wx_update,
  wxpayment,
  detail,
  payment_v2,
  wx_payment_info,
} from "../../services/weixin";
import Uploader from "../../services/wx_upload";
import {
  PageHeader,
  Select,
  Button,
  Input,
  DatePicker,
  Modal,
  Form,
  message,
  Upload,
  Badge,
  Calendar,
  Icon,
} from "antd";
import moment from "moment";
import "./qrcode.less";
import "./iconfont.less";
const { Option } = Select;

const QRCode = require("qrcode.react");
@inject("app")
@observer
class WechatPay extends Component {
  state = {
    bordered: true,
    pagination: true,
    visible: false,
    item: [],
    appidlist: [],
    tableDataSource: [],
    startDate: "",
    endDate: "",
    schedulevalue: moment(moment().format("YYYY-MM-DD")) || "",
    page: 1,
    wximg: "",
    perPage: 1,
    corpid: "",
    totalCount: 1,
    appidvalue: "",
    zfinfovalue: 0.01,
    bodyvalue: "",
    qrCodeshow: false,
    showmodal: false,
    beizhuvalue: "",
    corp_agent_id: "",
    fileList: [],
    fileList2: [],
    appid: "",
    payment_plan_id: "",
    p_index: 0,
  };
  constructor(props) {
    super(props);
    const { corpid } = props.match.params;
    const { payment_plan_id } = props.match.params;
    this.state.corpid = corpid;
    const { appid } = props.app.currentCorp;
    this.state.appid = appid;
    this.state.payment_plan_id = payment_plan_id;
  }
  componentDidMount() {
    this.list();
    this.appidlist();
  }
  async list() {
    const { errCode, data } = await wxlist({
      "per-page": 30,
      page: 1,
      "filter[payment_plan_id]": this.state.payment_plan_id,
      "filter[corp_id]": this.state.corpid,
    });
    if (!errCode) {
      this.setState({
        item: data.items,
        startDate: data.items[0].int_day,
        endDate: data.items[data.items.length - 1].int_day,
      });
    }
  }
  async appidlist() {
    const { data } = await detail({
      "filter[corp_id]": this.state.corpid,
    });

    this.setState({
      appidlist: data.items,
      corp_agent_id: data.items[0].id,
    });
  }
  pagechange(page) {
    this.setState(
      {
        page,
      },
      () => {
        this.list();
      }
    );
  }
  handleCancel() {
    this.setState({
      visible: false,
    });
  }
  handleCancel2() {
    this.setState({
      showmodal: false,
    });
  }
  // onDatePickerChange(m) {
  //   this.setState({
  //     startDate: m[0].format("YYYY-MM-DD"),
  //     endDate: m[1].format("YYYY-MM-DD"),
  //   });
  // }
  showmodal() {
    this.setState({
      visible: true,
    });
  }
  showmodal2() {
    this.setState({
      showmodal: true,
    });
  }
  disabledDateFun(current) {
    const { startDate, endDate } = this.state;
    return moment(startDate) > current || current > moment(endDate);
  }
  sousuo() {
    this.list();
  }
  async payment() {
    if (this.state.appidvalue) {
      const { data } = await wxpayment({
        appid: this.state.appidvalue,
        total_fee: this.state.zfinfovalue,
        body: this.state.bodyvalue,
        detail: this.state.beizhuvalue,
      });
      this.setState(
        {
          wximg: data.code_url,
          visible: false,
        },
        () => {
          setTimeout(() => {
            this.setState({
              qrCodeshow: true,
            });
          }, 500);
        }
      );
    } else {
      message.error("appid是必选，请填选好在提交。");
    }
  }

  qrCodeshow() {
    this.setState({
      qrCodeshow: false,
    });
    clearInterval(this.interval);
    this.list();
  }
  getappid(value) {
    this.state.appidvalue = value;
  }
  getzfinfo(e) {
    if (e.target.value > 0) {
      this.state.zfinfovalue = e.target.value;
    }
  }
  async topayment(record) {
    const { code_url } = record;
    this.setState(
      {
        wximg: code_url,
      },
      () => {
        setTimeout(() => {
          this.setState({
            qrCodeshow: true,
          });
        }, 500);
      }
    );
  }
  getbody(e) {
    this.state.bodyvalue = e.target.value;
  }
  getbeizhu(e) {
    this.state.beizhuvalue = e.target.value;
  }
  async formatDate(nows, index) {
    var now = new Date(nows * 1000);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    let shijian = this.state.item;
    shijian[index].pay_time =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hour +
      ":" +
      minute +
      ":" +
      second;
    this.setState({
      item: shijian,
    });
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        let { fileList, fileList2, corp_agent_id } = this.state;
        let files = fileList.filter((file) => file instanceof File);
        let files2 = fileList2.filter((file) => file instanceof File);
        let arr = files.concat(files2);
        const uploader = new Uploader(arr);
        const { errCode, data } = await uploader.upload(values.appid);
        if (!errCode) {
          const { errCode } = await wx_update(corp_agent_id, {
            appid: values.appid,
            mch_id: values.userid,
            key: values.zf_miyao,
          });
          if (!errCode) {
            message.success("修改成功");
            this.setState(
              {
                showmodal: false,
              },
              () => {
                this.gowechatpay();
              }
            );
          }
        }
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
  gowechatpay() {
    this.props.history.push("/dashboard/:corpid/weixin/wexinpay");
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
  onPanelChange = (value) => {
    this.setState({
      schedulevalue: value,
    });
  };
  schedule(value) {
    this.setState({
      schedulevalue: value,
    });
  }
  async newtopayment(e) {
    var index = e.currentTarget.getAttribute("data-index");
    var img = e.currentTarget.getAttribute("data-img");
    var id = e.currentTarget.getAttribute("data-id");
    if (img) {
      this.setState(
        {
          wximg: e.currentTarget.getAttribute("data-img"),
          p_index: e.currentTarget.getAttribute("data-index"),
        },
        () => {
          setTimeout(() => {
            this.setState({
              qrCodeshow: true,
            }, () => {
              this.interval = setInterval(() => {
                this.payment_info(id);
              }, 1500)
            });
          }, 500);
        }
      );
    } else {
      const { errCode, errMsg, data } = await payment_v2({
        payment_id: id,
      });
      if (errCode) return message.error(errMsg);
      this.setState(
        {
          wximg: data.code_url,
          visible: false,
          p_index: index,
        },
        () => {
          this.list();
          setTimeout(() => {
            this.setState({
              qrCodeshow: true,
            }, () => {
              this.interval = setInterval(() => {
                this.payment_info(id);
              }, 1500)
            });
          }, 500);
        }
      );
    }
  }
  async payment_info(id) {
    const { errCode, errMsg, data } = await wx_payment_info(id);
    if (errCode) return message.error(errMsg);
    if (data.status) {
      clearInterval(this.interval);
      this.setState({
        qrCodeshow: false,
      });
      this.list();
    }
  }
  getListData(value) {
    let listData;
    let { item } = this.state;
    for (let i = 0; i < item.length; i++) {
      switch (moment(value).format("YYYY-MM-DD") === item[i].int_day) {
        case true:
          moment().format("YYYY-MM-DD") !== item[i].int_day
            ? (listData = (
              <React.Fragment>
                {item[i].status ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <h4 className="textcenter">{item[i].title}</h4> */}
                    <div style={{ width: "50%", fontWeight: 550 }}>
                      {item[i].title}
                    </div>
                    <i
                      style={{ fontSize: 58, color: "#87CEFA" }}
                      className="iconfont icon-yizhifu"
                    ></i>
                  </div>
                ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <h4 className="textcenter">{item[i].title}</h4> */}
                      <div style={{ width: "50%", fontWeight: 550 }}>
                        {item[i].title}
                      </div>
                      <i
                        style={{ fontSize: 58 }}
                        className="iconfont icon-weizhifu"
                      ></i>
                    </div>
                  )}
              </React.Fragment>
            ))
            : (listData = (
              <React.Fragment>
                {item[i].status ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <h4 className="textcenter">{item[i].title}</h4> */}
                    <div
                      style={{
                        width: "50%",
                        fontWeight: 550,
                        color: "#87CEFA",
                      }}
                    >
                      今日流水已完成
                      </div>
                    <i
                      style={{ fontSize: 58, color: "#87CEFA" }}
                      className="iconfont icon-yizhifu"
                    ></i>
                  </div>
                ) : (
                    <div
                      data-id={item[i].id}
                      data-img={item[i].code_url}
                      data-index={i}
                      onClick={this.newtopayment.bind(this)}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {/* <h4 className="textcenter">{item[i].title}</h4> */}
                      <div
                        style={{
                          width: "50%",
                          fontWeight: 550,
                          color: "rgb(247,30,33)",
                        }}
                      >
                        点击完成今日流水
                      </div>
                      <i
                        style={{ fontSize: 58 }}
                        className="iconfont icon-weizhifu"
                      ></i>
                    </div>
                  )}
              </React.Fragment>
            ));
          break;
        default:
      }
    }
    return listData || [];
  }

  dateCellRender(value) {
    const listData = this.getListData(value);
    return listData;
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let {
      bordered,
      pagination,
      item,
      p_index,
      perPage,
      appidlist,
      showmodal,
      totalCount,
      schedulevalue,
      fileList,
      fileList2,
      startDate,
      endDate,
    } = this.state;

    const layout = {
      labelCol: { span: 3 },
      wrapperCol: { offset: 1, span: 16 },
    };

    pagination = {
      pageSize: perPage,
      total: totalCount,
      onChange: this.pagechange.bind(this),
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
          title="微信支付刷流水"
        />
        <Page.Content>
          <Page.Content.Panel>
            <Calendar
              value={schedulevalue}
              validRange={[moment(startDate), moment(endDate)]}
              onSelect={this.schedule.bind(this)}
              dateCellRender={this.dateCellRender.bind(this)}
              disabledDate={this.disabledDateFun.bind(this)}
              onPanelChange={this.onPanelChange}
            />
            <Modal
              title="支付后，右上角或者空白处关闭二维码"
              className="qrCodeshow"
              visible={this.state.qrCodeshow}
              footer={null}
              onCancel={() => this.qrCodeshow()}
            >
              <QRCode value={this.state.wximg} size={400} id="qrCode" />
              {item.length && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h2>{item[p_index].title}</h2>
                  <h2>{item[p_index].paid_amount + "元"}</h2>
                </div>
              )}
            </Modal>
          </Page.Content.Panel>
        </Page.Content>
      </Page>
    );
  }
}
let WechatPay_ = Form.create({ name: "WechatPay" })(withRouter(WechatPay));

export default WechatPay_;
