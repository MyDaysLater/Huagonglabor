import React, { Component } from 'react';
import { Dropdown } from 'antd';
import styles from './NoticePopover.module.less';
class NoticePopover extends Component {
	render() {
		return (
			<Dropdown
				placement="topRight"
				trigger={["click"]}
				overlay={<div className={styles.noticePopover}>fsdfsdfsd</div>}
			>
				{this.props.children}
			</Dropdown>
		);
	}
}

export default NoticePopover;
