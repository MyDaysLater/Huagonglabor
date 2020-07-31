import React, { Component } from "react";
import Page from "../../components/Page";
import { withRouter } from "react-router-dom";
import { getconfigs, putconfig } from "../../services/platform";
import { PageHeader, Form, Tabs, message ,DatePicker, Button, Col, Row, Input, Select, } from "antd";

import Wages from './wages';//工资
import Participating from './Participating';//参建单位
import Training from './training';//培训
import Personnel from './personnel';   //项目人员
import Entryandexit from './Entryandexit';   //进退场
import Contract from './contract';   //合同
import Attendance from './attendance';   //考勤
import Assistant from './assistant';   //班助
import ProjectInfo from './project_info';   //项目信息
import EnterpriseInfo from './enterprise_info';   //企业信息
const { TabPane } = Tabs;
class dataupload extends Component {
  handleSubmit = (e) => {
    const { uploadarr } = this.props;
    e.preventDefault();
    this.props.form.validateFields(async (err, values) => {
        if (!err) {
            this.props.screen(values);
        }
    });
};
  state = {
    list: [],
    values: {},
    tabActiveKey: '1',
  };
  constructor(props) {
    super(props);
  }
  componentDidMount() {
  }

  callback(key) {
    this.setState({
      tabActiveKey: key
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { values, tabActiveKey } = this.state;
    let {
      screen_list = [],
      form,

  } = this.props;
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
      <Page >
        <PageHeader title="数据上传" style={{background:"rgba(249,249,249,1)"}} />
        <Form className="sousuo" {...formItemLayout} onSubmit={this.handleSubmit} style={{ borderRadius: '5px', marginBottom: '10px', padding: '0 0 5px 5px' }}>
                <Row gutter={24}>
                    {screen_list.map((item, index) => {
                        if (item.type === 'input') {
                            return item.Mandatory ? (
                                <Col span={8} key={item.key} style={{ textAlign: "left" }}>
                                    <Form.Item label={item.title}
                                        key={item.key}>

                                        {getFieldDecorator(item.key, {
                                            rules: [{ required: true, message: `${item.placeholder || '填入搜索'}`, whitespace: true }]
                                        })(<Input placeholder={item.placeholder || '填入搜索'} />)}
                                    </Form.Item>
                                </Col>
                            ) : (
                                    <Col span={8} key={item.key}>
                                        <Form.Item label={item.title}
                                            key={item.key}
                                            width={100}
                                        >
                                            {getFieldDecorator(item.key)(<Input placeholder={item.placeholder || '填入搜索'} />)}
                                        </Form.Item>
                                    </Col>
                                )
                        } else if (item.type === 'date') {
                            return item.Mandatory ? (
                                <Col span={8} key={item.key}>
                                    <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key, {
                                            rules: [{ required: true, type: 'object', message: `${item.placeholder || '填入搜索'}`, whitespace: true }],
                                        })(<DatePicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '填入搜索'} />)}
                                    </Form.Item>
                                </Col>
                            ) : (
                                    <Col span={8} key={item.key}>
                                        <Form.Item label={item.title}
                                            key={item.key}>
                                            {getFieldDecorator(item.key,
                                                {

                                                }
                                            )(<DatePicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '填入搜索'} />)}
                                        </Form.Item>
                                    </Col>
                                )
                        } else if (item.type === 'select') {
                            return item.Mandatory ? (
                                <Col span={8} key={item.key}>
                                    <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key, {
                                            rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        })(<Select
                                            showSearch
                                            placeholder={item.placeholder || '请选择'}
                                            optionFilterProp="children"
                                            onPopupScroll={(e) => { this.companyScroll(e, item.key) }}
                                        // onSelect={this.project_select.bind(this)}
                                        >
                                            {item.data && item.data.map((item_ => {
                                                return (
                                                    <Select.Option key={item_.id} value={item_[item.value]}>{item_[item.name]}</Select.Option>
                                                )
                                            }))}
                                        </Select>)}
                                    </Form.Item>
                                </Col>) : (
                                    <Col span={8} key={item.key}>
                                        <Form.Item label={item.title}
                                            key={item.key}>
                                            {getFieldDecorator(item.key, {

                                            })(<Select
                                                showSearch
                                                placeholder={item.placeholder || '请选择'}
                                                optionFilterProp="children"
                                                onPopupScroll={(e) => { this.companyScroll(e, item.key) }}
                                            // onSelect={this.project_select.bind(this)}
                                            >
                                                {item.data && item.data.map((item_ => {
                                                    return (
                                                        <Select.Option key={item_.id} value={item_[item.value]}>{item_[item.name]}</Select.Option>
                                                    )
                                                }))}
                                            </Select>)}
                                        </Form.Item>
                                    </Col>)
                        }
                    })}

                </Row>
                <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
                            搜索
          </Button>
                        <Button
                            onClick={() => {
                                form.resetFields();
                            }}
                        >
                            清除
          </Button>
                        {/* <Button
                            type="primary"
                        >
                            <Icon type="caret-down" />
                        </Button> */}

                        {/* <a
                            style={{ fontSize: 12 }}
                            onClick={() => {
                                setExpand(!expand);
                            }}
                        >
                            {expand ? <UpOutlined /> : <DownOutlined />} Collapse
          </a> */}
          
                    </Col>
                </Row>

            </Form>
        <Page.Content>
          <Page.Content.Panel >
            <Tabs defaultActiveKey="1" activeKey={tabActiveKey} tabPosition="left" onChange={this.callback.bind(this)}>
              <TabPane tab="企业信息" key="1">
                {tabActiveKey === '1' && <EnterpriseInfo {...this.props} />}
              </TabPane>
              <TabPane tab="项目信息" key="2">
                {tabActiveKey === '2' && <ProjectInfo {...this.props} />}
              </TabPane>
              <TabPane tab="参建单位上传" key="3">
                {tabActiveKey === '3' && <Participating {...this.props} />}
              </TabPane>
              <TabPane tab="班组上传" key="4">
                {tabActiveKey === '4' && <Assistant {...this.props} />}
              </TabPane>
              <TabPane tab="项目人员上传" key="5">
                {tabActiveKey === '5' && <Personnel {...this.props} />}
              </TabPane>
              <TabPane tab="进退场上传" key="6">
                {tabActiveKey === '6' && <Entryandexit {...this.props} />}
              </TabPane>
              <TabPane tab="合同上传" key="7">
                {tabActiveKey === '7' && <Contract {...this.props} />}
              </TabPane>
              <TabPane tab="考勤上传" key="8">
                {tabActiveKey === '8' && <Attendance {...this.props} />}
              </TabPane>
              <TabPane tab="工资上传" key="9">
                {tabActiveKey === '9' && <Wages {...this.props} />}
              </TabPane>
              <TabPane tab="培训上传" key="10">
                {tabActiveKey === '10' && <Training {...this.props} />}
              </TabPane>
            </Tabs>
          </Page.Content.Panel>
        </Page.Content>
      </Page>
    );
  }
}

let dataupload_ = Form.create({ name: "dataupload" })(withRouter(dataupload));
export default dataupload_;
