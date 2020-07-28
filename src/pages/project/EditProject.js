import React, { Component } from 'react';
import { PageHeader } from 'antd';
import Page from '../../components/Page';
import EditForm from './EditForm';
const { Content } = Page;
export default class EditProject extends Component {
  state = {
    isCreate: true,
    id: ''
  }
  constructor(props) {
    super(props);
    const { id } = props.match.params;
    this.state.isCreate = !id;
    this.state.id = id;
  }
  render() {
    const { isCreate, id } = this.state;
    // console.log(this.props)
    return (
      <Page>
        <PageHeader onBack={() => this.props.history.goBack()} title={isCreate ? '新增项目' : '编辑项目'} />
        <Content>
          <Content.Panel>
            <EditForm authorize={this.props.authorize} jurisdiction={this.props.jurisdiction} id={id} />
          </Content.Panel>
        </Content>
      </Page>
    )
  }
}