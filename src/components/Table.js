import React, { Component } from "react";
import { Table } from "antd";
export default class Comp_table extends Component {
  state = {
    rowSelection: {},
    bordered: true,
    tableColumns: [],
    tableDataSource: [],
    pagination: {
    },
    locale: {},
  }
  constructor(props) {
    super(props);

  }
  page_change(page, pageSize) {
    this.props.page_change(page);
  }
  render() {
    const {
      rowSelection,
      bordered = true,
      columns = [],
      dataSource = [],
      meta = {},
      locale = {},
    } = this.props;
    return (
      <Table
        rowSelection={rowSelection}
        bordered={bordered}
        columns={columns}
        dataSource={dataSource}
        pagination={{ position: 'bottom', current: meta.currentPage, pageSize: meta.perPage, total: meta.totalCount, onChange: (current, pageSize) => this.page_change(current, pageSize) }}
        locale={locale}
        scroll={{ x: 'max-content' }}
      ></Table>
    );
  }
}
