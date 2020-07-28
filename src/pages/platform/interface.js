import React, { Component } from "react";
import Page from "../../components/Page";
import { PageHeader, Form, Input, Button, message } from "antd";
import { withRouter } from "react-router-dom";
import { getconfigs, putconfig } from "../../services/platform";
class Interface extends Component {
  state = {
    list: [],
    values: {},
  };
  constructor(props) {
    super(props);
    console.log(props)
  }
  componentDidMount() {
    this.getonter();
  }

  async getonter() {

    const { data } = await getconfigs({
      "filetr[key]": "jzgr",
    });
    this.setState({
      list: data.items,
      values: data.items[0].value,
    });
  }
  handleSubmit = async (e) => {
    e.preventDefault();
    this.props.form.validateFields(async (err, value) => {
      if (!err) {
        const { errCode } = await putconfig(this.state.list[0].id, {
          value,
        });

        !errCode && message.success('配置成功')
        this.getonter()

      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { values } = this.state;
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
        <PageHeader title="接口配置" />
        <Page.Content>
          <Page.Content.Panel>
            <Form name="basic" onSubmit={this.handleSubmit} {...formItemLayout} style={{ width: '50%', margin: 'auto' }}>
              <Form.Item label="App ID">
                {getFieldDecorator("appid", {
                  rules: [
                    {
                      required: true,
                      message: "请输入appid!",
                    },
                  ],
                  initialValue: values.appid,
                })(<Input />)}
              </Form.Item>

              <Form.Item label="企业秘钥">
                {getFieldDecorator("secret", {
                  rules: [
                    {
                      required: true,
                      message: "请输入企业秘钥!",
                    },
                  ],
                  initialValue: values.secret,
                })(<Input />)}
              </Form.Item>
              <Form.Item label="接口地址">
                {getFieldDecorator("gw_url", {
                  rules: [
                    {
                      required: true,
                      message: "请输入接口地址!",
                    },
                  ],
                  initialValue: values.gw_url,
                })(<Input />)}
              </Form.Item>
              <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button type="primary" htmlType="submit">
                  确认配置
                </Button>
              </Form.Item>
            </Form>
          </Page.Content.Panel>
        </Page.Content>
      </Page>
    );
  }
}
let Interface_ = Form.create({ name: "Interface" })(withRouter(Interface));
export default Interface_;
