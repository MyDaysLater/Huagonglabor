import React, { Component } from "react";
import { Form, DatePicker, Modal, Button, Upload, Select, Input, TreeSelect, Icon, message, InputNumber } from "antd";
import { dict_select } from "../services/dict";
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Uploader from '../services/uploader';
import {
    jzgrCorp_info, jzgrproject_info, team_info
} from "../services/platform";
import moment from 'moment';
@inject('corp')
@inject('user')
@observer
class Clid_form extends Component {
    state = {
        rowSelection: {},
        bordered: true,
        tableColumns: [],
        tableDataSource: [],
        pagination: {
        },
        locale: {},
        fromshow: false,
        add_modal: false,
        fileList: [],
        date: {
            startDate: '2018-20-20',
            endDate: '2019-20-20'
        },
    }
    constructor(props) {
        super(props);
        this.get_selectarr_dict_id();
    }
    companyScroll(e, value) {
        this.props.company_scroll(e, value);
    }
    componentDidMount() {
        this.props.onRef(this)

    }
    async get_selectarr_dict_id() {
        const {
            selectarr_dict_id = {},
        } = this.props;
        // const { treeData } = this.state;
        for (let item in selectarr_dict_id) {
            selectarr_dict_id[item].value = await dict_select(selectarr_dict_id[item].id);
        }
        this.setState({
            selectarr_dict_id,
        })
    }
    page_change(page, pageSize) {
        this.props.page_change(page);
    }

    handleSubmit = (e) => {
        const { uploadarr, selectarr } = this.props;
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {

            for (let item in values) {
                // console.log(item, typeof (values[item]));
                // console.log(item, Object.prototype.toString.call(values[item]));
                // typeof (values[item]) === 'undefined' ? values[item] = '' : values[item];
                for (let item_ in selectarr) {
                    // (uploadarr && !uploadarr[item]) ? (selectarr[item_].key === item) && (Object.prototype.toString.call(values[item]) === '[object Object]') && (values[item] = moment(values[item]).format(selectarr[item_].date_format)) : values[item] = values[item];
                    // console.log(uploadarr && !uploadarr[item])
                    (uploadarr && !uploadarr[item]) ? Object.prototype.toString.call(values[item]) === '[object Undefined]' ? values[item] = "" : (selectarr[item_].key === item) && (Object.prototype.toString.call(values[item]) === '[object Object]') && (values[item] = moment(values[item]).format(selectarr[item_].date_format)) : values[item] = values[item];

                }
            }
            console.log(values)
            if (!err) {
                this.props.createdata_list(values);
            }
        });
    };
    beforeUpload(upload_key, file) {
        this.props.beforeUpload_form(upload_key, file);
        return false
    }
    onUploadRemove(file) {
        this.props.onRemoveFile(file);
    }
    onUploadFileChange(upload_key, { fileList }) {
        this.props.onUploadFileChange(upload_key, fileList);
    }
    show_add_modal() {
        this.setState({
            add_modal: true
        })
    }
    date_change(key, a, dates) {

        let { date } = this.state;
        date[key] = a
        this.setState({
            date: date
        });
    }
    async jzgrcorp_select(value, options) {
        let { formInline_clid } = this.props;
        const { data } = await jzgrCorp_info(options.key);
        formInline_clid.corpName = data.corp_name;
        formInline_clid.corpCode = data.corp_code
        this.setState({
            formInline_clid,
        })
    }
    render() {
        let {
            formInlinelist = [],
            treeData = {},
            form,
            baseitems = [],
            projectitems = [],
            memberitems = [],
            uploadarr,
            teamitems = [],
            jzgrCorpitems = [],
            selectarr_dict_id = {},
            selectarr = [],
            formInline_clid = {},
        } = this.props;
        let { fromshow, fileList, add_modal, date } = this.state;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
                md: { span: 8 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
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
            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                {selectarr.map((item, index) => {
                    if (item.type === 'input') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title}
                                key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                    initialValue: formInline_clid && (formInline_clid[item.key] || '')
                                })(<Input placeholder={item.placeholder || '请填写'} />)}
                            </Form.Item>
                        ) : (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        initialValue: formInline_clid && (formInline_clid[item.key] || '')
                                    })(<Input placeholder={item.placeholder || '请填写'} />)}
                                </Form.Item>
                            )
                    } else if (item.type === 'decimal') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title}
                                key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                    initialValue: 0
                                })(<InputNumber min={0} placeholder={item.placeholder || '请填写'} />)}
                            </Form.Item>
                        ) : (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        initialValue: 0
                                    })(<InputNumber min={0} placeholder={item.placeholder || '请填写'} />)}
                                </Form.Item>
                            )
                    } else if (item.type === 'date') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title}
                                key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, type: 'object', message: `${item.placeholder || '必填项'}`, whitespace: true }],

                                })(<DatePicker format="yyyy-MM-DD" onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                            </Form.Item>
                        ) : (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {

                                    })(<DatePicker format="yyyy-MM-DD" onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                                </Form.Item>
                            )
                    } else if (item.type === 'jzgrcorp_name') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title} key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                    initialValue: formInline_clid && (formInline_clid[item.key] || '')
                                })(<Select
                                    showSearch
                                    placeholder={item.placeholder || '请选择'}
                                    optionFilterProp="children"
                                    onPopupScroll={(e) => { this.companyScroll(e, 'base_meta') }}
                                    onSelect={this.jzgrcorp_select.bind(this)}
                                >
                                    {jzgrCorpitems.map((item_corp => {
                                        return (<Select.Option data-type="baseitems" key={item_corp.id} value={item_corp.corp_name}>{item_corp.corp_name}</Select.Option>)
                                    }))}
                                </Select>)}
                            </Form.Item>)
                            : (
                                <Form.Item label={item.title} key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        initialValue: formInline_clid && (formInline_clid[item.key] || '')
                                    })(<Select
                                        showSearch
                                        placeholder={item.placeholder || '请选择'}
                                        optionFilterProp="children"
                                        onPopupScroll={(e) => { this.companyScroll(e, 'base_meta') }}
                                    >
                                        {jzgrCorpitems.map((item_corp => {
                                            return (<Select.Option data-type="baseitems" key={item_corp.id} value={item_corp.corp_name}>{item_corp.corp_name}</Select.Option>)
                                        }))}
                                    </Select>)}
                                </Form.Item>)
                    } else if (item.type === 'base') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title} key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }]
                                })(<Select
                                    showSearch
                                    placeholder={item.placeholder || '请选择'}
                                    optionFilterProp="children"
                                    onPopupScroll={(e) => { this.companyScroll(e, 'base_meta') }}
                                >
                                    {baseitems.map((item_base => {
                                        return (<Select.Option data-type="baseitems" key={item_base.id} value={item_base.corp_name}>{item_base.corp_name}</Select.Option>)
                                    }))}
                                </Select>)}
                            </Form.Item>)
                            : (
                                <Form.Item label={item.title} key={item.key}>
                                    {getFieldDecorator(item.key)(<Select
                                        showSearch
                                        placeholder={item.placeholder || '请选择'}
                                        optionFilterProp="children"
                                        onPopupScroll={(e) => { this.companyScroll(e, 'base_meta') }}
                                    >
                                        {baseitems.map((item_base => {
                                            return (<Select.Option data-type="baseitems" key={item_base.id} value={item_base.corp_name}>{item_base.corp_name}</Select.Option>)
                                        }))}
                                    </Select>)}
                                </Form.Item>)
                    } else if (item.type === 'project') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title}
                                key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }]
                                })(<Select
                                    showSearch
                                    placeholder={item.placeholder || '请选择'}
                                    optionFilterProp="children"
                                    onPopupScroll={(e) => { this.companyScroll(e, 'project_meta') }}
                                >
                                    {projectitems.map((item_project => {
                                        return (
                                            <Select.Option data-type="project_meta" key={item_project.id} value={item_project.project_code}>{item_project.name}</Select.Option>
                                        )
                                    }))}
                                </Select>)}
                            </Form.Item>) : (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key)(<Select
                                        showSearch
                                        placeholder={item.placeholder || '请选择'}
                                        optionFilterProp="children"
                                        onPopupScroll={(e) => { this.companyScroll(e, 'project_meta') }}
                                    >
                                        {projectitems.map((item_project => {
                                            return (
                                                <Select.Option data-type="project_meta" key={item_project.id} value={item_project.project_code}>{item_project.name}</Select.Option>
                                            )
                                        }))}
                                    </Select>)}
                                </Form.Item>)
                    } else if (item.type === 'team_id' || item.type === 'team_sys_no' || item.type === 'team_name') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title}
                                key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, type: `${item.type === 'team_sys_no' ? 'number' : 'string'}`, message: `${item.placeholder || '必填项'}`, whitespace: true }]
                                })(<Select
                                    showSearch
                                    placeholder={item.placeholder || '请选择'}
                                    optionFilterProp="children"
                                    onPopupScroll={(e) => { this.companyScroll(e, 'team_meta') }}
                                >
                                    {teamitems.map((item_team => {
                                        return (
                                            <Select.Option data-type="team_meta" key={item_team.id} value={item.type === 'team_id' ? item_team.id : (item.type === 'team_sys_no' ? item_team.team_sys_no : item_team.team_name)}>{item_team.team_name}</Select.Option>
                                        )
                                    }))}
                                </Select>)}
                            </Form.Item>) : (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                    })(<Select
                                        showSearch
                                        placeholder={item.placeholder || '请选择'}
                                        optionFilterProp="children"
                                        onPopupScroll={(e) => { this.companyScroll(e, 'team_meta') }}
                                    >
                                        {teamitems.map((item_team => {
                                            return (
                                                <Select.Option data-type="team_meta" key={item_team.id} value={item.type === 'team_id' ? item_team.id : (item.type === 'team_sys_no' ? item_team.team_sys_no : item_team.team_name)}>{item_team.team_name}</Select.Option>
                                            )
                                        }))}
                                    </Select>)}
                                </Form.Item>)
                    } else if (item.type === 'dict') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title}
                                key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                    initialValue: ''
                                })(<TreeSelect
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                    treeData={selectarr_dict_id[item.key].value}
                                    placeholder={item.placeholder || '请选择'}
                                    treeDefaultExpandAll
                                />)}
                            </Form.Item>
                        ) : (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        initialValue: ''
                                    })(<TreeSelect
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={selectarr_dict_id[item.key].value}
                                        placeholder={item.placeholder || '请选择'}
                                        treeDefaultExpandAll
                                    />)}
                                </Form.Item>
                            )
                    } else if (item.type === 'upload') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title}
                                key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, type: 'object', message: `${item.placeholder || '必填项'}`, whitespace: true },
                                    { type: 'object', message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                    initialValue: {}
                                })(<Upload
                                    multiple
                                    fileList={uploadarr[item.key].value || []}
                                    onRemove={this.onUploadRemove.bind(this)}
                                    onChange={this.onUploadFileChange.bind(this, item.key)}
                                    beforeUpload={this.beforeUpload.bind(this, item.key)}
                                >
                                    <Button icon="plus" type="link">
                                        添加附件
							</Button>
                                </Upload>
                                )}
                            </Form.Item>
                        ) : (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        initialValue: {}
                                    })(
                                        <Upload
                                            multiple
                                            fileList={uploadarr[item.key].value || []}
                                            onRemove={this.onUploadRemove.bind(this)}
                                            onChange={this.onUploadFileChange.bind(this, item.key)}
                                            beforeUpload={this.beforeUpload.bind(this, item.key)}
                                        >
                                            <Button icon="plus" type="link">
                                                添加附件
							</Button>
                                        </Upload>)}
                                </Form.Item>
                            )
                    } else if (item.type === 'selectarr') {
                        return item.Mandatory ? (
                            <Form.Item label={item.title}
                                key={item.key}>
                                {getFieldDecorator(item.key, {
                                    rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }]
                                })(
                                    <Button icon="plus" type="link">
                                        添加{item.title}
                                    </Button>
                                )}
                            </Form.Item>
                        ) : (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key)(<Button icon="plus" type="link" onClick={this.show_add_modal.bind(this)}>
                                        添加{item.title}
                                    </Button>
                                    )}
                                </Form.Item>
                            )
                    }
                })}
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" >
                        提 交
                </Button>
                    <Button style={{ marginLeft: 15 }} onClick={() => {
                        this.props.modal_arr_hide();
                    }}>
                        取 消
                </Button>
                </Form.Item>
            </Form>
        );
    }
}
let Clid_form_ = Form.create({ name: 'Clid_form' })(withRouter(Clid_form));
export default Clid_form_;