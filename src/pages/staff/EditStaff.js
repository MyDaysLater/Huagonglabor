import React, { Component } from 'react';
import { PageHeader } from 'antd';
import Page from '../../components/Page';
import EditForm from './EditForm';
const { Content } = Page;
export default class EditStaff extends Component {
  state = {
    isCreate: true,
    id: ''
  }
  constructor(props) {
    super(props);
    const { params } = props.match;
    this.state.isCreate = !params.id;
    this.state.id = params.id
  }
  render() {
    const { isCreate, id } = this.state;
    const { authorize } = this.props;
    console.log(this.props)
    return (
      <Page>
        <PageHeader onBack={() => this.props.history.goBack()} title={isCreate ? '添加员工' : '编辑员工'} />
        <Content>
          <Content.Panel>
            <EditForm authorize={authorize} id={id} />
          </Content.Panel>
        </Content>
      </Page>
    )
  }
}