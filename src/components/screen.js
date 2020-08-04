import React, { Component, useState } from "react";
import { Form, DatePicker, Button, Col, Row, Input, Select, Icon } from "antd";
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import { CaretUpOutlined } from '@ant-design/icons';
import './screen.css';
@inject('corp')
@inject('user')
@observer
// 定义一个Screen类组件
class Screen extends Component {
    state = {

    }
    // 构造函数
    constructor(props) {
        super(props);
    }
    companyScroll(e, value) {

    }
    componentDidMount() {


    }

    handleSubmit = (e) => {
       
        const { uploadarr } = this.props;
        e.preventDefault();
        // 阻止默认事件
        // 表单验证
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.props.screen(values);
            }
        });
    };

    render() {
        let {
            screen_list = [],
            form,
        } = this.props;
        let { } = this.state;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            // 布局
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },//左边留白
                md: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 10 },//右边留白
                md: { span: 10 }
            }
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 16,
                    offset: 8
                }
            }
        };
        return (
            <div className="className"></div>
        //     <Form className="sousuo" {...formItemLayout} onSubmit={this.handleSubmit} style={{ borderRadius: '5px', marginBottom: '10px', padding: '0 0 5px 5px' }}>
        //         <Row gutter={24}>
        //             {screen_list.map((item, index) => {
        //                 if (item.type === 'input') {
        //                     return item.Mandatory ? (
        //                         <Col span={8} key={item.key} style={{ textAlign: "left" }}>
        //                             <Form.Item label={item.title}
        //                                 key={item.key}>

        //                                 {getFieldDecorator(item.key, {
        //                                     rules: [{ required: true, message: `${item.placeholder || '公司名称'}`, whitespace: true }]
        //                                 })(<Input placeholder={item.placeholder || '公司名称'} />)}
        //                             </Form.Item>
        //                         </Col>
        //                     ) : (
        //                             <Col span={8} key={item.key}>
        //                                 <Form.Item label={item.title}
        //                                     key={item.key}
        //                                     width={100}
        //                                 >
        //                                     {getFieldDecorator(item.key)(<Input placeholder={item.placeholder || '公司名称'} />)}
        //                                 </Form.Item>
        //                             </Col>
        //                         )
        //                 } else if (item.type === 'date') {
        //                     return item.Mandatory ? (
        //                         <Col span={8} key={item.key}>
        //                             <Form.Item label={item.title}
        //                                 key={item.key}>
        //                                 {getFieldDecorator(item.key, {
        //                                     rules: [{ required: true, type: 'object', message: `${item.placeholder || '公司名称'}`, whitespace: true }],
        //                                 })(<DatePicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '公司名称'} />)}
        //                             </Form.Item>
        //                         </Col>
        //                     ) : (
        //                             <Col span={8} key={item.key}>
        //                                 <Form.Item label={item.title}
        //                                     key={item.key}>
        //                                     {getFieldDecorator(item.key,
        //                                         {

        //                                         }
        //                                     )(<DatePicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '请输入关键词'} />)}
        //                                 </Form.Item>
        //                             </Col>
        //                         )
        //                 } else if (item.type === 'select') {
        //                     return item.Mandatory ? (
        //                         <Col span={8} key={item.key}>
        //                             <Form.Item label={item.title}
        //                                 key={item.key}>
        //                                 {getFieldDecorator(item.key, {
        //                                     rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
        //                                 })(<Select
        //                                     showSearch
        //                                     placeholder={item.placeholder || '请选择'}
        //                                     optionFilterProp="children"
        //                                     onPopupScroll={(e) => { this.companyScroll(e, item.key) }}
        //                                 // onSelect={this.project_select.bind(this)}
        //                                 >
        //                                     {item.data && item.data.map((item_ => {
        //                                         return (
        //                                             <Select.Option key={item_.id} value={item_[item.value]}>{item_[item.name]}</Select.Option>
        //                                         )
        //                                     }))}
        //                                 </Select>)}
        //                             </Form.Item>
        //                         </Col>) : (
        //                             <Col span={8} key={item.key}>
        //                                 <Form.Item label={item.title}
        //                                     key={item.key}>
        //                                     {getFieldDecorator(item.key, {

        //                                     })(<Select
        //                                         showSearch
        //                                         placeholder={item.placeholder || '请选择'}
        //                                         optionFilterProp="children"
        //                                         onPopupScroll={(e) => { this.companyScroll(e, item.key) }}
        //                                     // onSelect={this.project_select.bind(this)}
        //                                     >
        //                                         {item.data && item.data.map((item_ => {
        //                                             return (
        //                                                 <Select.Option key={item_.id} value={item_[item.value]}>{item_[item.name]}</Select.Option>
        //                                             )
        //                                         }))}
        //                                     </Select>)}
        //                                 </Form.Item>
        //                             </Col>)
        //                 }
        //             })}

        //         </Row>
        //         <Row>
        //             <Col span={24} style={{ textAlign: 'right' }}>
        //                 <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
        //                     搜索
        //   </Button>
        //                 <Button
        //                     onClick={() => {
        //                         form.resetFields();
        //                     }}
        //                 >
        //                     清除
        //   </Button>
        //             </Col>
        //         </Row>

        //     </Form>
        );
    }
}
let Screen_ = Form.create({ name: 'Screen' })(withRouter(Screen));
export default Screen_;