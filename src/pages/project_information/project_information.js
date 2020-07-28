import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import {
  Button,
  Modal,
  TreeSelect,
  Descriptions,
  Switch,
  Input,
  Form,
  Upload,
  message,
  Icon,
} from "antd";
import Uploader from "../../services/uploader";
import {
  list,
  onelist,
  create,
  update,
} from "../../services/project_information";
import projectService from "../../services/project";

class P_information extends Component {
  state = {
    showAnchored: false,
    showservices: false,
    showmodal: false,
    showaddmodal: false,
    type: "",
    selectAnchoredValues: "",
    selectservicesValues: "",
    selectValues: null,
    selectedUploadFile: null,
    anchoredtext: "",
    fileList: [],
    list: [],
    base_id: "",
    p_id: "",
    projectInfo: {},
  };
  constructor(props) {
    super();
  }
  // 资质开关
  onChange_Anchored(bool, event) {
    const projectInfo = this.state.projectInfo;
    projectInfo.is_union = bool ? 1 : 0;
    this.setState(
      {
        showAnchored: bool,
        projectInfo,
      }, () => {

        if (!bool) {
          projectService.update(this.state.p_id, {
            is_union: 0,
            union_corp_base_id: null,

          });
        } else {
          projectService.update(this.state.p_id, {
            is_union: 1,
            union_corp_base_id: projectInfo.union_corp_base_id,
          });
        }
      }
    );
  }
  // 劳务开关
  onChange_services(bool, event) {
    const projectInfo = this.state.projectInfo;
    projectInfo.is_outsourcing = bool ? 1 : 0;
    this.setState(
      {
        showservices: bool,
        projectInfo,
      }, () => {

        if (!bool) {
          projectService.update(this.state.p_id, {
            is_outsourcing: 0,
            outsourcing_corp_base_id: null,
          });
        } else {
          projectInfo.outsourcing_corp_base_id !== null && projectService.update(this.state.p_id, {
            is_outsourcing: 1,
            outsourcing_corp_base_id: projectInfo.outsourcing_corp_base_id,
          });
        }

      }
    );
  }
  // 展开选择框
  onshowmodal(e) {
    this.setState({
      showmodal: true,
      selectValues: null,
      type: e.target.getAttribute("data-type"),
    });
  }
  // 打开添加modal
  onshowaddmodal() {
    this.setState({
      showaddmodal: true,
    });
  }
  // 确定资质公司
  onmodalOk() {
    this.state.type === "Anchored"
      ? this.setState({
        selectAnchoredValues: this.state.selectValues,
        showmodal: false,
      })
      : this.setState({
        selectservicesValues: this.state.selectValues,
        showmodal: false,
      });
    projectService.update(this.state.p_id, {
      is_union: this.state.projectInfo.is_union,
      is_outsourcing: this.state.projectInfo.is_outsourcing,
      union_corp_base_id: this.state.projectInfo.union_corp_base_id,
      outsourcing_corp_base_id: this.state.projectInfo.outsourcing_corp_base_id,
    });
  }
  // 取消
  oncancel() {
    this.setState({
      showmodal: false,
    });
  }
  // 上传之前
  beforeUpload(file) {
    this.setState({
      selectedUploadFile: file,
      fileList: [file],
    });
    return false;
  }
  // 上传营业执照
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { selectedUploadFile, fileList } = this.state;
        if (!selectedUploadFile && !fileList.length) {
          message.error("请上传营业执照", 3);
          return;
        }
        let ufile;
        if (selectedUploadFile) {
          const uploader = new Uploader([selectedUploadFile]);
          const { errCode, data } = await uploader.upload();
          if (errCode) {
            message.error("上传文件失败");
            this.setState({ uploadStatus: "exception", submitLoading: false });
          }

          const { url } = data.files[0];
          ufile = url;
        }
        const a = this.up_cre(values, this.state.list);
        const { errCode, errMsg } = a
          ? await update(this.state.base_id, {
            license_id: "",
            lawman_name: "",
            start_int_day: "0",
            end_int_day: "0",
            address: "阿发撒",
            license_scope: "阿发撒",
            corp_name: values.name,
            license_image: ufile,
          })
          : await create({
            license_id: "",
            lawman_name: "",
            start_int_day: "0",
            end_int_day: "0",
            address: "阿发撒",
            license_scope: "阿发撒",
            corp_name: values.name,
            license_image: ufile,
          });
        if (errCode) {
          message.error(errMsg ? errMsg : "添加失败");
          return;
        }
        message.success("提交成功");
        this.setState(
          {
            showaddmodal: false,
          },
          () => {
            this.getlist();
          }
        );
      }
    });
  };
  // 添加资质还是劳务
  up_cre(value, list) {
    for (let v of list) {
      if (v.corp_name === value.name) {
        this.setState({
          base_id: v.id,
        });
        return true;
      }
    }
    return false;
  }
  componentDidMount() {
    this.setState(
      {
        p_id: this.props.match.params.id,
      },
      () => {
        this.gitinfo();
        this.getlist();
      }
    );
  }
  // 控制render重复渲染
  // shouldComponentUpdate (nextProps, nextState) {
  //   const {projectInfo} = this.state
  //   return projectInfo !== nextState.projectInfo
  // }
  // 获取资质列表
  async getlist() {
    const { errMsg, errCode, data } = await list();

    if (errCode) {
      message.error(errMsg);
      return;
    }
    this.setState({
      list: data.items,
    });
  }
  // 获取项目信息
  async gitinfo() {
    const { p_id } = this.state;
    const { data } = await projectService.detail(p_id);
    const is_union_id = data.union_corp_base_id;
    const is_outsourcing_id = data.outsourcing_corp_base_id;
    if (data.is_union && is_union_id !== null) {
      const { data } = await onelist(is_union_id);
      this.setState({
        selectAnchoredValues: data.corp_name,
      });
    }
    if (data.is_outsourcing && is_outsourcing_id !== null) {
      const { data } = await onelist(is_outsourcing_id);
      this.setState({
        selectservicesValues: data.corp_name,
      });
    }
    this.setState({
      projectInfo: data,
    });
  }
  // 消除上传
  onUploadRemove(file) {
    this.setState({ selectedUploadFile: null, fileList: [] });
  }
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {

      showmodal,
      projectInfo,
      selectAnchoredValues,
      selectservicesValues,
      selectedUploadFile,
      type,
      showaddmodal,
      fileList,
      list,
      selectValues,
    } = this.state;
    const uploadProps =
      selectedUploadFile !== null || !fileList.length
        ? {}
        : { fileList: fileList };
    const treeSelectProps = {
      treeData:
        type === "Anchored"
          ? list.map((item, key) => {
            return {
              title: item.corp_name,
              value: key,
            };
          })
          : list.map((item, key) => {
            return {
              title: item.corp_name,
              value: key,
            };
          }),
      style: {
        width: "100%",
      },
      placeholder: selectValues ? selectValues : "请选择单位",
      value: selectValues,
      onSelect: (values) => {
        const projectInfo = this.state.projectInfo;
        type === "Anchored"
          ? (projectInfo.union_corp_base_id = list[values].id)
          : (projectInfo.outsourcing_corp_base_id = list[values].id);
        this.setState({
          selectValues: list[values].corp_name,
          projectInfo,
        });
      },
    };
    return (
      <React.Fragment>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="是否联营：">
            <div style={{ width: 800 }}>
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                checked={projectInfo.is_union === 1 ? true : false}
                // defaultChecked={projectInfo.is_union===1?true:false}
                onChange={(bool, e) => this.onChange_Anchored(bool, e)}
              />
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="挂靠单位：">
            {!projectInfo.is_union ? (
              "不需要挂靠单位"
            ) : (
                <div>
                  <Input
                    style={{ width: 600, paddingTop: 3 }}
                    readOnly={true}
                    value={selectAnchoredValues}
                    placeholder={selectAnchoredValues || "请选择挂靠单位："}
                  ></Input>
                  <Button
                    type="primary"
                    data-type="Anchored"
                    onClick={(e) => this.onshowmodal(e)}
                  >
                    选择
                </Button>
                </div>
              )}
          </Descriptions.Item>
          <Descriptions.Item label="是否劳务外包：">
            <div style={{ width: 180 }}>
              <Switch
                checkedChildren="是"
                unCheckedChildren="否"
                checked={projectInfo.is_outsourcing === 1 ? true : false}
                // defaultChecked={projectInfo.is_outsourcing===1?true:false}
                onChange={(bool, e) => this.onChange_services(bool, e)}
              />
            </div>
          </Descriptions.Item>
          <Descriptions.Item label="劳务单位：">
            {!projectInfo.is_outsourcing ? (
              "不需要劳务外包"
            ) : (
                <div>
                  <Input
                    style={{ width: 600, paddingTop: 3 }}
                    readOnly={true}
                    value={selectservicesValues}
                    placeholder={selectservicesValues || "请选择劳务单位："}
                  ></Input>
                  <Button
                    type="primary"
                    data-type="services"
                    onClick={(e) => this.onshowmodal(e)}
                  >
                    选择
                </Button>
                </div>
              )}
          </Descriptions.Item>
        </Descriptions>
        <Modal
          title="选择您要的单位"
          visible={showmodal}
          onCancel={this.oncancel.bind(this)}
          footer={
            <div>
              <Button type="primary" onClick={this.onmodalOk.bind(this)}>
                确定
              </Button>
              <Button type="primary" onClick={this.oncancel.bind(this)}>
                取消
              </Button>
              <Button type="primary" onClick={this.onshowaddmodal.bind(this)}>
                添加
              </Button>
            </div>
          }
        >
          <TreeSelect {...treeSelectProps} />
        </Modal>
        <Modal
          title="添加单位"
          visible={showaddmodal}
          footer={false}
          onCancel={() => {
            this.setState({
              showaddmodal: false,
            });
          }}
        >
          <Form onSubmit={this.handleSubmit}>
            <Form.Item label="单位名称">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "请输入企业名称",
                    whitespace: true,
                  },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="营业执照" name="businesslicense">
              <Upload
                listType="picture-card"
                accept="image/*"
                beforeUpload={this.beforeUpload.bind(this)}
                onRemove={this.onUploadRemove.bind(this)}
                {...uploadProps}
              >
                {!fileList.length && (
                  <div>
                    <Icon type={"upload"} />
                    <div className="ant-upload-text">上传</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              添加
            </Button>
          </Form>
        </Modal>
      </React.Fragment>
    );
  }
}

const Pinformation = Form.create({ name: "P_information" })(
  withRouter(P_information)
);

export default Pinformation;
