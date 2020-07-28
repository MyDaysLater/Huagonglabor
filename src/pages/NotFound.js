import React, { Component } from 'react';
import { Result } from 'antd';
export default class Notfound extends Component {
	render() {
		return <Result status="404" title="404" subTitle="未找到该页面" />;
	}
}
