import React, { Component } from 'react';
import { Layout } from 'antd';
import styles from './Page.module.less';
const { Header, Content, Footer } = Layout;
class Page extends Component {
  render() {
    return <Layout className={styles.page}>{this.props.children}</Layout>;
  }
}

Page.Header = (props) => {
  return <Header className={styles.header}>{props.children}</Header>;
};
Page.Header.Title = (props) => {
  return <h1 className={styles.title}>{props.children}</h1>;
};
Page.Header.Brief = (props) => {
  return <div className={`${styles.brief} ${props.className || ''}`}>{props.children}</div>;
};
Page.Content = (props) => {
  return <Content className={styles.content}>{props.children}</Content>;
};
Page.Content.Panel = (props) => {
  return <div style={props.style || {}} className={`${styles.panel} ${props.className}`}>{props.children}</div>
}
Page.Footer = (props) => {
  return <Footer className={styles.footer}>{props.children}</Footer>;
};

export default Page;
