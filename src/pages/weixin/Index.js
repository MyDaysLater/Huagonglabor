import React, { Component } from 'react';
import Page from '../../components/Page';
import { PageHeader } from 'antd';
export default class Index extends Component {
  render() {
    return (
      <Page>
        <PageHeader title="微信服务"/>
        <Page.Content>
          <Page.Content.Panel>
            kslkjslfjls
          </Page.Content.Panel>
        </Page.Content>
      </Page>
    )
  }
}