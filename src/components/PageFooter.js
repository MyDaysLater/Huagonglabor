import React, { Component } from 'react';
import styles from './PageFooter.module.less';
export default class PageFooter extends Component {
  render() {
    return (
      <div className={styles.copyright}>Copyright &copy; 2019 深圳华工数据有限公司</div>
    )
  }
}