import React, { Component } from "react";
import { Form, DatePicker, Modal, Button, Upload, Select, Input, TreeSelect, Icon, message, } from "antd";
import { dict_select } from "../services/dict";
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import Clid_form_ from "./Clid_form";
import moment from 'moment';
import Uploader from '../services/uploader';
import { update } from "../services/corp";
import {
    jzgrCorp_info, jzgrproject_info, team_info
} from "../services/platform";
import { options } from "less";
@inject('corp')
@inject('user')
@observer
class Comp_form extends Component {
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
        key: '',
        add_arr: [],
        date: {}
    }
    constructor(props) {
        super(props);
        this.get_dictdata();
        // this.get_selectarr_dict_id();
        this.createdata_list = this.createdata_list.bind(this)
        this.modal_arr_hide = this.modal_arr_hide.bind(this)
    }
    companyScroll(e, value) {
        this.props.company_scroll(e, value);
    }
    componentDidMount() {
        this.props.onRef(this)

    }
    onRef_Comp_form = (ref) => {
        this.child_Comp_form = ref
    }
    async get_dictdata() {
        const {
            treeData = {},
        } = this.props;
        // const { treeData } = this.state;
        for (let item in treeData) {
            treeData[item].value = await dict_select(treeData[item].id);
        }
        this.setState({
            treeData,
        })
    }
    createdata_list(value) {

        let { add_arr } = this.state;
        add_arr.push(value);
        this.setState({
            add_arr,
            add_modal: false
        })
    }
    show() {
        this.setState({
            fromshow: true
        })
    }
    page_change(page, pageSize) {
        this.props.page_change(page);
    }

    handleSubmit = (e) => {
        const { uploadarr, formInlinelist } = this.props;
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            // console.log(values)
            for (let item in values) {
                // console.log(item, typeof (values[item]));
                // console.log(item, Object.prototype.toString.call(values[item]));
                for (let item_ in formInlinelist) {
                    (uploadarr && !uploadarr[item]) ? (formInlinelist[item_].key === item) && (Object.prototype.toString.call(values[item]) === '[object Object]') && (values[item] = moment(values[item]).format(formInlinelist[item_].date_format)) : Object.prototype.toString.call(values[item]) === '[object Undefined]' ? values[item] = '' : values[item] = values[item];
                }
                //(uploadarr && !uploadarr[item]) ? (Object.prototype.toString.call(values[item]) === '[object Object]') && (values[item] = moment(values[item]).format(formInlinelist[item].date_format)) : values[item] = values[item]
            }
            if (!err) {
                for (let item in uploadarr) {
                    if (uploadarr[item].value.length > 0) {
                        let files = uploadarr[item].value.filter((file) => file instanceof File);
                        const uploader = new Uploader(files);
                        const { errCode, errMsg } = await uploader.upload();
                        if (errCode) {
                            message.error(errMsg);
                            return;
                        }
                    }

                }
                this.props.update ? this.props.putdata(values) : this.props.create(values);
                this.modal_hide();
            }
        });
    };
    beforeUpload_form(upload_key, file) {
        this.props.beforeUpload(upload_key, file);
        return false
    }
    onUploadRemove(file) {
        this.props.onRemoveFile(file);
    }
    onUploadFileChange(upload_key, { fileList }) {
        this.props.onUploadFileChange(upload_key, fileList);
    }
    show_add_modal(key) {
        this.setState({
            add_modal: true,
            key,
        })
    }
    modal_hide() {
        this.setState({
            fromshow: false
        })
    }
    modal_arr_hide() {
        this.setState({
            add_modal: false
        })
    }
    date_change(key, a, dates) {
        let { date } = this.state;
        date[key] = dates
        this.setState({
            date: date
        });
    }
    async jzgrcorp_select(value, options) {
        let { formInline } = this.props;
        const { data } = await jzgrCorp_info(options.key);
        for (let i in formInline) {
            data[i] && (formInline[i] = data[i])
        }
        this.setState({
            formInline,
        })
    }
    async project_select(value, options) {
        let { formInline } = this.props;
        const { data } = await jzgrproject_info(options.key);
        for (let i in formInline) {
            data[i] && (formInline[i] = data[i])
        }
        this.setState({
            formInline,
        }, () => {
            this.props.create_api_data(data);
        })
    }
    async jzgrteam_select(value, options) {
        let { formInline } = this.props;
        const { data } = await team_info(options.key);
        for (let i in formInline) {
            data[i] && (formInline[i] = data[i])
        }
        this.setState({
            formInline,
        }, () => {
            this.props.create_team_data(data);
        })
    }
    render() {
        let {
            formInlinelist = [],
            treeData = {},
            formInline = {},
            form,
            baseitems = [],
            projectitems = [],
            memberitems = [],
            uploadarr = {},
            teamitems = [],
            jzgrCorpitems = [],
            selectarr_dict_id = {},
            selectarr = [],
            uploadarr_clid = {},
            update = false,
            formInline_clid = {},
        } = this.props;
        let { fromshow, fileList, add_modal, add_arr } = this.state;
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
            <Modal
                title="填写数据"
                visible={fromshow}
                onCancel={() => {
                    this.setState({
                        fromshow: false
                    })
                }}
                footer={null}
            >
                <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                    {formInlinelist.map((item, index) => {
                        if (item.type === 'input') {
                            return item.Mandatory ? (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        initialValue: formInline[item.key]
                                    })(<Input placeholder={item.placeholder || '请填写'} />)}
                                </Form.Item>
                            ) : (
                                    <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key, {
                                            initialValue: formInline[item.key]
                                        })(<Input placeholder={item.placeholder || '请填写'} />)}
                                    </Form.Item>
                                )
                        } else if (item.type === 'date_month') {
                            return item.Mandatory ? (
                                formInline && formInline[item.key] ? <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        rules: [{ required: true, type: 'object', message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        initialValue: formInline && formInline[item.key] ? moment(formInline[item.key]) : moment()
                                    })(<DatePicker.MonthPicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                                </Form.Item> :
                                    <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key, {
                                            rules: [{ required: true, type: 'object', message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        })(<DatePicker.MonthPicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                                    </Form.Item>
                            ) : (
                                    formInline && formInline[item.key] ? <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key,
                                            {
                                                initialValue: formInline && formInline[item.key] ? moment(formInline[item.key]) : moment()
                                            }
                                        )(<DatePicker.MonthPicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                                    </Form.Item> :
                                        <Form.Item label={item.title}
                                            key={item.key}>
                                            {getFieldDecorator(item.key,
                                                {

                                                }
                                            )(<DatePicker.MonthPicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                                        </Form.Item>
                                )
                        } else if (item.type === 'date') {
                            return item.Mandatory ? (
                                formInline && formInline[item.key] ? <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        rules: [{ required: true, type: 'object', message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        initialValue: moment(formInline[item.key])
                                    })(<DatePicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                                </Form.Item>
                                    :
                                    <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key, {
                                            rules: [{ required: true, type: 'object', message: `${item.placeholder || '必填项'}`, whitespace: true }]
                                        })(<DatePicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                                    </Form.Item>
                            ) : (
                                    formInline && formInline[item.key] ? <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key,
                                            {
                                                initialValue: formInline && formInline[item.key] ? moment(formInline[item.key]) : moment()
                                            }
                                        )(<DatePicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                                    </Form.Item> :
                                        <Form.Item label={item.title}
                                            key={item.key}>
                                            {getFieldDecorator(item.key,
                                                {

                                                }
                                            )(<DatePicker onChange={this.date_change.bind(this, item.key)} placeholder={item.placeholder || '选择时间'} />)}
                                        </Form.Item>

                                )
                        } else if (item.type === 'jzgrcorp_name' || item.type === 'jzgrcorp_id') {
                            return item.Mandatory ? (
                                <Form.Item label={item.title} key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        initialValue: formInline[item.key]
                                    })(<Select
                                        showSearch
                                        placeholder={item.placeholder || '请选择'}
                                        optionFilterProp="children"
                                        onPopupScroll={(e) => { this.companyScroll(e, 'base_meta') }}
                                        onSelect={this.jzgrcorp_select.bind(this)}
                                    >
                                        {jzgrCorpitems.map((item_corp => {
                                            return (<Select.Option data-type="baseitems" key={item_corp.id} value={item.type === 'jzgrcorp_name' ? item_corp.corp_name : item_corp.id}>{item_corp.corp_name}</Select.Option>)
                                        }))}
                                    </Select>)}
                                </Form.Item>)
                                : (
                                    <Form.Item label={item.title} key={item.key}>
                                        {getFieldDecorator(item.key, {
                                            initialValue: formInline[item.key]
                                        })(<Select
                                            showSearch
                                            placeholder={item.placeholder || '请选择'}
                                            optionFilterProp="children"
                                            onPopupScroll={(e) => { this.companyScroll(e, 'base_meta') }}
                                            onSelect={this.jzgrcorp_select.bind(this)}
                                        >
                                            {jzgrCorpitems.map((item_corp => {
                                                return (<Select.Option data-type="baseitems" key={item_corp.id} value={item.type === 'jzgrcorp_name' ? item_corp.corp_name : item_corp.id}>{item_corp.corp_name}</Select.Option>)
                                            }))}
                                        </Select>)}
                                    </Form.Item>)
                        } else if (item.type === 'base') {
                            return item.Mandatory ? (
                                <Form.Item label={item.title} key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        initialValue: formInline[item.key]
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
                                        {getFieldDecorator(item.key, {
                                            initialValue: formInline[item.key]
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
                        } else if (item.type === 'project' || item.type === 'project_id') {
                            return item.Mandatory ? (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        initialValue: formInline && formInline[item.key]
                                    })(<Select
                                        showSearch
                                        placeholder={item.placeholder || '请选择'}
                                        optionFilterProp="children"
                                        onPopupScroll={(e) => { this.companyScroll(e, 'project_meta') }}
                                        onSelect={this.project_select.bind(this)}
                                    >
                                        {projectitems.map((item_project => {
                                            return (
                                                <Select.Option data-type="project_meta" key={item_project.id} value={item.type === 'project_id' ? item_project.id : item_project.project_code}>{item_project.name}</Select.Option>
                                            )
                                        }))}
                                    </Select>)}
                                </Form.Item>) : (
                                    <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key, {
                                            initialValue: formInline && formInline[item.key]
                                        })(<Select
                                            showSearch
                                            placeholder={item.placeholder || '请选择'}
                                            optionFilterProp="children"
                                            onPopupScroll={(e) => { this.companyScroll(e, 'project_meta') }}
                                            onSelect={this.project_select.bind(this)}
                                        >
                                            {projectitems.map((item_project => {
                                                return (
                                                    <Select.Option data-type="project_meta" key={item_project.id} value={item.type === 'project_id' ? item_project.id : item_project.project_code}>{item_project.name}</Select.Option>
                                                )
                                            }))}
                                        </Select>)}
                                    </Form.Item>)
                        } else if (item.type === 'team_id' || item.type === 'team_sys_no' || item.type === 'team_name') {
                            return item.Mandatory ? (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        rules: [{ required: true, type: `${item.type === 'team_sys_no' ? 'number' : 'string'}`, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        initialValue: formInline[item.key] || '请选择'
                                    })(<Select
                                        showSearch
                                        placeholder={item.placeholder || '请选择'}
                                        optionFilterProp="children"
                                        onPopupScroll={(e) => { this.companyScroll(e, 'team_meta') }}
                                        onSelect={this.jzgrteam_select.bind(this)}
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
                                            initialValue: formInline[item.key] || '请选择'
                                        })(<Select
                                            showSearch
                                            placeholder={item.placeholder || '请选择'}
                                            optionFilterProp="children"
                                            onPopupScroll={(e) => { this.companyScroll(e, 'team_meta') }}
                                            onSelect={this.jzgrteam_select.bind(this)}
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
                                        initialValue: formInline && formInline[item.key]
                                    })(<TreeSelect
                                        style={{ width: '100%' }}
                                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                        treeData={treeData[item.key].value}
                                        placeholder={item.placeholder || '请选择'}
                                        treeDefaultExpandAll
                                    />)}
                                </Form.Item>
                            ) : (
                                    <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key, {
                                            initialValue: formInline[item.key] || ''
                                        })(<TreeSelect
                                            style={{ width: '100%' }}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={treeData[item.key].value}
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
                                        rules: [{ required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }],
                                        initialValue: ''
                                    })(<Upload
                                        multiple
                                        fileList={uploadarr[item.key].value}
                                        onRemove={this.onUploadRemove.bind(this)}
                                        onChange={this.onUploadFileChange.bind(this, item.key)}
                                        beforeUpload={this.beforeUpload_form.bind(this, item.key)}
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
                                            initialValue: ''
                                        })(<Upload
                                            multiple
                                            fileList={uploadarr[item.key].value}
                                            onRemove={this.onUploadRemove.bind(this)}
                                            onChange={this.onUploadFileChange.bind(this, item.key)}
                                            beforeUpload={this.beforeUpload_form.bind(this, item.key)}
                                        >
                                            <Button icon="plus" type="link">
                                                添加附件
							</Button>
                                        </Upload>)}
                                    </Form.Item>
                                )
                        } else if (item.type === 'selectarr') {
                            let a = add_arr.length > 0 ? add_arr : '';
                            return item.Mandatory ? (
                                <Form.Item label={item.title}
                                    key={item.key}>
                                    {getFieldDecorator(item.key, {
                                        rules: [
                                            // { required: true, message: `${item.placeholder || '必填项'}`, whitespace: true }
                                            { required: true, type: 'array', min: 1, message: '最少1条' },
                                            // { type: 'array', max: item.maxarr, message: '达到上限，不能添加了！' }
                                        ],
                                        initialValue: a
                                    })(
                                        <React.Fragment>
                                            <span>已添加{add_arr.length}条(最少1条,最多{item.maxarr}条)</span>
                                            <Button icon="plus" type="link" onClick={add_arr.length <= item.maxarr ? this.show_add_modal.bind(this, item.key) : ''}>
                                                添加{item.title}
                                            </Button>
                                        </React.Fragment>

                                    )}
                                </Form.Item>
                            ) : (
                                    <Form.Item label={item.title}
                                        key={item.key}>
                                        {getFieldDecorator(item.key, {
                                            initialValue: a
                                        })(<React.Fragment>
                                            <span>已添加{add_arr.length}条</span>
                                            <Button icon="plus" type="link" onClick={this.show_add_modal.bind(this, item.key)}>
                                                添加{item.title}
                                            </Button>
                                        </React.Fragment>)}
                                    </Form.Item>
                                )
                        }
                    })}
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" >
                            提 交
                </Button>
                        <Button style={{ marginLeft: 15 }} onClick={() => { this.modal_hide() }}>
                            取 消
                </Button>
                    </Form.Item>
                </Form>
                <Modal
                    title="添加列表"
                    visible={add_modal}
                    onCancel={() => {
                        this.setState({
                            add_modal: false
                        })
                    }}
                    footer={null}
                >
                    <Clid_form_
                        selectarr_dict_id={selectarr_dict_id}
                        uploadarr={uploadarr}
                        selectarr={selectarr}
                        ref="Clid_form"
                        onRef={this.onRef_Comp_form}
                        memberitems={memberitems}
                        formInline_clid={formInline_clid}
                        jzgrCorpitems={jzgrCorpitems}
                        teamitems={teamitems}
                        uploadarr_clid={uploadarr_clid}
                        projectitems={projectitems}
                        createdata_list={this.createdata_list}
                        modal_arr_hide={this.modal_arr_hide}
                        company_scroll={this.companyScroll}
                        beforeUpload_form={this.props.beforeUpload}
                        onRemoveFile={this.props.onRemoveFile}
                        onUploadFileChange={this.props.onUploadFileChange}

                    />
                </Modal>
            </Modal >

        );
    }
}
let Comp_form_ = Form.create({ name: 'Comp_form_form' })(withRouter(Comp_form));
export default Comp_form_;