import React, { Component } from 'react';
import Page from '../../components/Page';
import { PageHeader, Table, Button } from 'antd';
export default class Orders extends Component {
	render() {
		const columns = [
			{
				title: '订单编号',
				dataIndex: 'orderId',
				key: 'orderId'
			},
			{
				title: '订购服务',
				dataIndex: 'name',
				key: 'name'
			},
			{
				title: '服务生效',
				dataIndex: 'start',
				key: 'start'
      },
      {
				title: '服务期止',
				dataIndex: 'end',
				key: 'end'
      },
      {
				title: '支付方式',
				dataIndex: 'pay',
				key: 'pay'
			},{
				title: '金额',
				dataIndex: 'cost',
				key: 'cost'
      },
      {
				title: '操作',
        key: 'actions',
        renderItem() {
          return <div>
            <Button type="link">查看详情</Button>
            <Button type="link">删除</Button>
          </div>
        }
			}
		];
		return (
			<Page>
				<PageHeader title="订单" />
				<Page.Content>
					<Page.Content.Panel>
						<Table dataSource={[]} columns={columns} />
					</Page.Content.Panel>
				</Page.Content>
			</Page>
		);
	}
}
