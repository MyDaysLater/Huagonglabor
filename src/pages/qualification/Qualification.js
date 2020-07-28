import React, { Component } from "react";
import { Table, Button, Switch } from "antd";
import Page from "../../components/Page";
import { ROLES } from "../../constants";
const { Content } = Page;
class Qualification extends Component {
  state = {};
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  onChange(){}
  render() {
    const switchtext = {
      checkedChildren: "是",
      unCheckedChildren: "否",
    };
    const columns = [
      {
        title: "资质名称",
        dataIndex: "name",
      },
      {
        title: "标题",
        dataIndex: "chinese",
      },
      {
        title: "是否默认",
        dataIndex: "math",
      },
      {
        title: "是否启用",
        dataIndex: "enable",
      },
      {
        title: "排序",
        dataIndex: "english",
        sorter: (a, b) => a.english - b.english,
      },
    ];
    const data = [
      {
        key: "1",
        name: "资质名称1",
        chinese: "标题1",
        math: (
          <Switch
            {...switchtext}
            defaultChecked
            onChange={this.onChange.bind(this)}
          />
        ),
        enable: (
          <Switch
            {...switchtext}
            defaultChecked
            onChange={this.onChange.bind(this)}
          />
        ),
        english: 70,
      },
      {
        key: "2",
        name: "资质名称2",
        chinese: "标题2",
        math: (
          <Switch
            {...switchtext}
            defaultChecked
            onChange={this.onChange.bind(this)}
          />
        ),
        enable: (
          <Switch
            {...switchtext}
            defaultChecked
            onChange={this.onChange.bind(this)}
          />
        ),
        english: 89,
      },
      {
        key: "3",
        name: "资质名称3",
        chinese: "标题3",
        math: (
          <Switch
            {...switchtext}
            defaultChecked
            onChange={this.onChange.bind(this)}
          />
        ),
        enable: (
          <Switch
            {...switchtext}
            defaultChecked
            onChange={this.onChange.bind(this)}
          />
        ),
        english: 70,
      },

      {
        key: "4",
        name: "资质名称4",
        chinese: "标题4",
        math: (
          <Switch
            {...switchtext}
            defaultChecked
            onChange={this.onChange.bind(this)}
          />
        ),
        enable: (
          <Switch
            {...switchtext}
            defaultChecked
            onChange={this.onChange.bind(this)}
          />
        ),
        english: 89,
      },
    ];
    return <Table columns={columns} dataSource={data} />;
  }
}
export default Qualification;
