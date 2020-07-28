import React, { Component } from 'react';
import { Modal, Button, Card, message, Select, Pagination } from 'antd';
import Comp_table from "../../components/Table";
import Comp_form from "../../components/form";
import Screen from "../../components/screen";
import {
    jzgrteam_getlist, jzgrProjectlist, gejzgrCorp_list, training_list, sync_training, post_training, memberlist, update_training, training_info, upload_training, query_training
} from "../../services/platform";
import './style.less';
const { Option } = Select;
class Training extends Component {
    state = {
        columns: [
            {
                dataIndex: "training_name",
                title: "培训名称",
                fixed: "left",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "training_date",
                title: "培训日期",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "training_duration",
                title: "培训时长",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "training_type_code",
                title: "培训类型代码字典ID",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "trainer",
                title: "培训人",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "training_org",
                title: "培训机构",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "training_address",
                title: "培训地址",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "description",
                title: "培训简述",
                width: 200,
                align: 'center',
            },
            {
                dataIndex: "created_at",
                title: "创建时间",
                width: 200,
                align: "center"
            },
            {
                dataIndex: "response_status",
                title: "状态",
                width: 200,
                align: "center",
                render: (text, record) => (
                    <div>
                        {record.response_status === 1 ? "上传成功" : record.response_status === 2 ? '上传失败' : "未上传"}
                    </div>
                ),
            },
            {
                dataIndex: "action",
                title: "操作",
                fixed: "right",
                align: "center",
                width: 200,
                render: (text, record) => (
                    <div style={{ display: 'flex', }}>
                        <Button disabled={record.response_status === 1 ? true : false} type="primary" block onClick={() => { this.edit_data(record) }} style={{ marginRight: '20px' }}>
                            编辑
              </Button>
                        <Button type="primary" block onClick={() => { this.query_code(record); }} style={{ marginRight: '20px' }}>
                            平台查询
                  </Button>
                        <Button disabled={record.response_status === 1 ? true : false} type="primary" block onClick={() => { this.dataupload(record) }}>
                            {record.response_status === 1 ? '已上传' : '待上传'}
                        </Button>
                    </div>
                ),
            }],
        treeData: {
            responsible_person_i_d_card_type: {
                value: [],
                id: 34
            },
        },
        formInlinelist: [
            {
                title: '项目编码',
                key: 'project_code',
                placeholder: '填写项目编码',
                type: 'project',
                Mandatory: true
            },
            {
                key: "training_date",
                title: "培训日期",
                placeholder: '填写培训日期',
                type: 'date',
                date_format: 'YYYY-MM-DD',
                Mandatory: true
            },
            {
                key: "training_duration",
                title: "培训时长",
                placeholder: '填写培训时长(单位/小时)',
                type: 'input',
                Mandatory: true
            },
            {
                key: "training_name",
                title: "培训名称",
                placeholder: '填写班组编号',
                type: 'input',
                Mandatory: true
            },
            {
                key: "training_type_code",
                title: "培训类型",
                placeholder: '填写培训类型ID',
                type: 'dict',
                Mandatory: true
            },
            {
                key: "trainer",
                title: "培训人",
                placeholder: '填写培训人',
                type: 'input'
            },
            {
                key: "training_org",
                title: "培训机构",
                placeholder: '填写培训机构',
                type: 'input'
            },
            {
                key: "training_address",
                title: "培训地址",
                placeholder: '填写培训地址',
                type: 'input'
            },
            {
                key: "description",
                title: "培训简述",
                placeholder: '填写培训简述',
                type: 'input'
            },
            {
                key: "attachments",
                title: "附件",
                type: 'upload'
            },
            {
                key: "workers",
                title: "参与培训的工人",
                placeholder: '参与培训的工人',
                type: 'selectarr'
            },
        ],
        selectarr: [
            {
                key: "idCardType",
                title: "证件类型",
                placeholder: '填写证件类型',
                type: 'dict',
                Mandatory: true
            },
            {
                key: 'idCardNumber',
                title: '证件号码',
                placeholder: '填写证件号码',
                type: 'input',
                Mandatory: true
            },
            {
                key: 'isPass',
                title: '是否合格',
                placeholder: '是否合格',
                type: 'dict',
                Mandatory: true
            },
            {
                key: 'trainingScore',
                title: '培训得分',
                placeholder: '分值 0~100，可以保留1位小数',
                type: 'input'
            }
        ],
        uploadarr: {
            attachments: {
                value: [],
                num: 10,
            }
        },
        treeData: {
            training_type_code: {
                value: [],
                id: 629
            },
        },
        selectarr_dict_id: {
            idCardType: {
                value: [],
                id: 34
            },
            isPass: {
                value: [],
                id: 601
            },
        },
        dataSource: [],
        bordered: true,
        pagination: true,
        list: [],
        corpid: '',
        project_modal_show: false,
        projectitems: [],
        memberitems: [],
        teamitems: [],
        jzgrCorpitems: [],
        projectid: '',
        team_id: [],
        fromshow: false,
        meta: {},
        meta_object: {
            project_meta: {},
            member_meta: {},
            jzgrCorp_meta: {},
            team_meta: {},
        },
        screen_list: [
            {
                key: 'trainer',
                title: '培训人',
                type: "input"
            },
            {
                key: 'training_name',
                title: '培训名称',
                type: "input"
            },
            {
                key: 'project_code',
                title: '接入编号',
                type: "input"
            },
        ],
        screen_line: {},
        update: false,
        formInline: {
            project_code: '',
            training_date: '',
            training_duration: '',
            training_name: '',
            training_type_code: '',
            trainer: '',
            training_org: '',
            training_address: '',
            description: '',
            attachments: [],
            workers: [],
        },
        update_id: '',
        cre_api_data: {},
    }
    constructor(props) {
        super(props)
        const { corpid } = props.match.params;
        this.state.corpid = corpid;
        this.page_change = this.page_change.bind(this);
        this.createdata = this.createdata.bind(this);
        this.companyScroll = this.companyScroll.bind(this);
        this.beforeUpload = this.beforeUpload.bind(this);
        this.onUploadFileChange = this.onUploadFileChange.bind(this);
        this.screen = this.screen.bind(this);
        this.create_api_data = this.create_api_data.bind(this);
    }
    componentDidMount() {
        this.list();
        this.jzgrProjectlist();
        this.memberlist();
        this.jzgrcorplist();
        this.jzgrteam_getlist();
    }
    screen(value) {
        this.setState({
            screen_line: value
        }, () => {
            this.list();
        })
    }
    project_select(value) {
        this.setState({
            projectid: value
        })
    }
    base_select(value) {
        if (value.length > 5) {
            message.error('不能超过五个');
        } else {
            this.setState({
                team_id: value
            })
        }

    }
    // 企业列表
    async jzgrcorplist() {
        const { errCode, errMsg, data } = await gejzgrCorp_list({
            page: this.state.meta_object.jzgrCorp_meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, jzgrCorpitems } = this.state;
        jzgrCorpitems = jzgrCorpitems.concat(data.items)
        meta_object.jzgrCorp_meta = data._meta;
        this.setState({
            jzgrCorpitems: jzgrCorpitems,
            meta_object: meta_object
        })
    }
    // 班组列表
    async jzgrteam_getlist() {
        const { errCode, errMsg, data } = await jzgrteam_getlist({
            page: this.state.meta_object.project_meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, teamitems } = this.state;
        teamitems = teamitems.concat(data.items)
        meta_object.team_meta = data._meta;
        this.setState({
            teamitems: teamitems,
            meta_object: meta_object
        })
    }
    // 人员列表
    async memberlist() {
        const { errCode, errMsg, data } = await memberlist({
            page: this.state.meta_object.member_meta.currentPage || 1,
            'filter[role]': 'contractor',
            'filter[corp_id]': this.state.corpid,
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, memberitems } = this.state;
        memberitems = memberitems.concat(data.items)
        meta_object.member_meta = data._meta;
        this.setState({
            memberitems: memberitems,
            meta_object: meta_object
        })
    }
    // 项目
    async jzgrProjectlist() {
        const { errCode, errMsg, data } = await jzgrProjectlist({
            page: this.state.meta_object.project_meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let { meta_object, projectitems } = this.state;
        projectitems = projectitems.concat(data.items)
        meta_object.project_meta = data._meta;
        this.setState({
            projectitems: projectitems,
            meta_object: meta_object
        })
    }
    // 新增数据要的额外参数
    create_api_data(value) {
        let cre_api_data = {
            corp_id: value.corp_id,
            jzgr_corp_id: value.jzgr_corp_id,
            jzgr_project_id: value.id,

        }
        this.setState({
            cre_api_data,
        })
    }
    // 新增数据
    async createdata(value) {
        const { errCode, errMsg, data } = await post_training({
            ...value,
            ...this.state.cre_api_data
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.list();
    }
    companyScroll(e, value) {
        e.persist();
        const { target } = e;
        if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            let { meta_object } = this.state;
            let page = meta_object[value].pageCount;
            if (page > meta_object[value].currentPage) {
                page > meta_object[value].currentPage ? meta_object[value].currentPage += 1 : meta_object[value].currentPage = meta_object[value].currentPage
                this.setState({
                    meta_object: meta_object
                })
                if (value === 'member_meta') {
                    this.memberlist();
                } else if (value === 'project_meta') {
                    this.jzgrProjectlist();
                } else if (value === 'team_meta') {
                    this.jzgrteam_getlist();
                }
            }
        }
    }
    onRef = (ref) => {
        this.child_comp_table = ref
    }
    onRef_Comp_form = (ref) => {
        this.child_Comp_form = ref
    }
    beforeUpload(upload_key, file) {
        let {
            uploadarr,
        } = this.state;
        if (uploadarr[upload_key].value) {
            let nameArr = uploadarr[upload_key].value.map((item) => {
                return item.name
            })
            let isRepeat = nameArr.indexOf(file.name)
            if (isRepeat !== -1) {
                message.error('文件名称不能重复');
                return false;
            }
            if (uploadarr[upload_key].value.length >= uploadarr[upload_key].num) {
                message.error(`文件最多${uploadarr[upload_key].num}个`);
                return false;
            }
        }
        uploadarr[upload_key].value.push(file);
        this.setState({
            uploadarr: uploadarr
        });

    }
    onRemoveFile(file) {
        // if (!(file instanceof File)) {
        //     return new Promise((resolve, reject) => {
        //         Modal.confirm({
        //             title: '删除文件',
        //             content: '确定删除该文件么？',
        //             onOk: () => {
        //                 resolve();
        //             },
        //             onCancel: () => {
        //                 reject();
        //             }
        //         });
        //     });
        // }
    }
    onUploadFileChange(upload_key, fileList) {
        // let {
        //     uploadarr,
        // } = this.state;
        // uploadarr[upload_key].value = fileList
        // this.setState({
        //     uploadarr: uploadarr
        // }, () => {
        //     return false
        // });
    }
    async list() {
        const { screen_line } = this.state;
        const { errCode, errMsg, data } = await training_list({
            page: this.state.meta.currentPage || 1,
            'filter[corp_id]': this.state.corpid,
            'filter[trainer][like]': screen_line.trainer || '',
            'filter[training_name][like]': screen_line.training_name || '',
            'filter[project_code][like]': screen_line.project_code || ''
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        let arr = data.items.map((item) => {
            return {
                key: item.id,
                project_code: item.project_code || '--------',
                training_date: item.training_date || '--------',
                training_duration: item.training_duration || '--------',
                training_name: item.training_name || '--------',
                training_type_code: item.training_type_code || '--------',
                trainer: item.trainer || '--------',
                training_org: item.training_org || '--------',
                training_address: item.training_address || '--------',
                description: item.description || '--------',
                created_at: item.created_at || '--------',
                response_status: item.response_status,
            };
        })
        this.setState({
            list: data.items,
            meta: data._meta,
            dataSource: arr,
        })
    }


    handleCancel() {
        this.setState({
            project_modal_show: false
        })

    }
    page_change(page) {
        const data = this.state.meta;
        data.currentPage = page;
        this.setState({
            meta: data
        }, () => {
            this.list();
        })
    }
    async synchronous() {
        let { errCode, errMsg, data } = await sync_training({
            corp_project_member_ids: this.state.team_id,
            jzgr_project_team_id: this.state.projectid
        });
        if (!errCode) {
            message.success(data.message);
            this.list();
        } else {
            message.error(errMsg);
        }
        this.setState({
            project_modal_show: false
        })

    }
    // 上传---编辑---更新     update_training, training_info, upload_training, query_training
    async dataupload(record) {
        let { errCode, errMsg } = await upload_training({
            jzgr_project_training_id: record.key
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.setState({
            query_project_code: record.project_code,
            update_id: record.key
        }, () => {
            this.result_query_code(record.key);
        })
    }
    async edit_data(record) {
        let data_line = this.state.formInline;
        let { errCode, errMsg, data } = await training_info(record.key)
        if (errCode) {
            message.error(errMsg);
            return;
        }
        for (let item in data_line) {
            data_line[item] = data[item]
        }
        this.setState({
            formInline: data_line,
            update: true,
            update_id: record.key
        }, () => {
            this.child_Comp_form.show();
        })
    }
    async put_data(value) {
        let { errCode, errMsg, data } = await update_training(this.state.update_id, {
            ...value,
            ...this.state.cre_api_data
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        this.list();
        this.child_Comp_form.modal_hide();

    }
    query_code = async (record) => {
        let { errCode, errMsg, data } = await query_training({
            project_code: record.project_code
        })
        if (errCode) {
            message.error(errMsg);
            return;
        }
        data.result && message.info(data.result);
        this.list();
    }
    render() {
        const { columns, dataSource, bordered, meta, projectitems, memberitems, uploadarr_clid, fromshow, treeData, formInlinelist, uploadarr, teamitems, jzgrCorpitems, selectarr, selectarr_dict_id, screen_list } = this.state;
        return (
            <React.Fragment>
                <Card
                    title={
                        <React.Fragment>
                            <Screen
                                screen_list={screen_list}
                                screen={this.screen}
                            />
                            <div className="flex flex-end">
                                <div className="flex">
                                    <Button className="margin-right" type="primary" block onClick={() => {
                                        this.child_Comp_form.show();
                                    }}>
                                        新增数据
					</Button>
                                    <Button className="margin-right" type="primary" block onClick={() => {
                                        // this.setState({
                                        //     project_modal_show: true
                                        // })
                                    }}>
                                        同步数据
					</Button>
                                    <Button className="margin-right" type="primary" block onClick={() => { }}>
                                        导入数据
					</Button>
                                    <Button className="margin-right" type="primary" block onClick={() => {

                                    }}>
                                        全部上传
					</Button>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                >
                    <Comp_table
                        bordered={bordered}
                        dataSource={dataSource}
                        columns={columns}
                        meta={meta}
                        ref="table"
                        onRef={this.onRef}
                        page_change={this.page_change}
                    />
                </Card>
                <Comp_form
                    fromshow={fromshow}
                    treeData={treeData}
                    selectarr_dict_id={selectarr_dict_id}
                    formInlinelist={formInlinelist}
                    uploadarr={uploadarr}
                    columns={columns}
                    selectarr={selectarr}
                    ref="form"
                    onRef={this.onRef_Comp_form}
                    memberitems={memberitems}
                    teamitems={teamitems}
                    jzgrCorpitems={jzgrCorpitems}
                    uploadarr_clid={uploadarr_clid}
                    projectitems={projectitems}
                    create={this.createdata}
                    company_scroll={this.companyScroll}
                    beforeUpload={this.beforeUpload}
                    onRemoveFile={this.onRemoveFile}
                    onUploadFileChange={this.onUploadFileChange}
                    formInline={this.state.formInline}
                    create_api_data={this.create_api_data}
                    update={this.state.update}
                >
                </Comp_form>
                <Modal
                    title="选择你要同步的班组长"
                    visible={this.state.project_modal_show}
                    onOk={() => { this.synchronous() }}
                    onCancel={() => { this.handleCancel() }}
                >
                    <Select
                        showSearch
                        mode="multiple"
                        maxTagCount={3}
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的班组长"
                        optionFilterProp="children"
                        value={this.state.team_id}
                        onChange={this.base_select.bind(this)}
                        onPopupScroll={(e) => { this.companyScroll(e, 'member_meta') }}
                    >
                        {memberitems.map((item => {
                            return (
                                item.userInfo && <Option data-type="member_meta" key={item.id} value={item.id}>{item.userInfo.name}</Option>
                            )
                        }))}
                    </Select>

                    <Select
                        showSearch
                        style={{ width: 300, marginLeft: 80, marginBottom: 20 }}
                        placeholder="选择你要同步的班组"
                        optionFilterProp="children"
                        onSelect={this.project_select.bind(this)}
                        onPopupScroll={(e) => { this.companyScroll(e, 'team_meta') }}
                    >
                        {teamitems.map((item => {
                            return (
                                <Option data-type="team_meta" key={item.id} value={item.id}>{item.team_name}</Option>
                            )
                        }))}
                    </Select>
                </Modal>

            </React.Fragment >
        );
    }
}
export default Training;