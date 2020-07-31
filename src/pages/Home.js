import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Row, Col, Card, Statistic, Skeleton, Table } from 'antd';
import Page from '../components/Page';
import echarts from "echarts"
import "../pages/StylePenetration/Home.module.less"
import corpService from '../services/corp';
import { ROLES } from '../constants';
const { Content } = Page;
@inject('app')
@inject('user')
@inject('staff')
@observer
class Home extends Component {
	componentDidMount(){
		let myChart = echarts.init(document.getElementById("mychart"));
		let mychartBootom = echarts.init(document.getElementById("mychartbootom"));
		let myChartRight = echarts.init(document.getElementById("mychartRight"));
		let myChartRight_bottom = echarts.init(document.getElementById("mychartRight_bottom"));
// 		font-size:18px;
// font-family:Microsoft YaHei;
// font-weight:400;
// color:rgba(37,50,62,1)

		myChart.setOption({
			title: {
				text: '今日考勤情况',
				padding:[0,0,0,60],
				subtext:"人数",
				itemGap:2,
				textStyle:{
					fontSize:18,
					fontFamily:"Microsoft YaHei",
					fontWeight:400,
					color:"rgba(37,50,62,1)",
					lineHeight:38,
					// align:"center"//水平对齐
				},
			},
			
			grid: {
			
			  },
			legend: {},
			tooltip: {},
			dataset: {
				source: [
					['product', '出勤人数', '缺勤人数'],
					['万科麓园', 23, 0],
					['阳光花园', 28,6],
					['阳光花园', 26, 12],
					['太湖二期', 19, 11],
					['路径时代城', 18, 12],
					['镇江A2期', 18, 11],
					['天津太阳城', 21, 9],
					['溪谷项目', 25, 15],
					['溪谷项目', 25, 13],
				]
			},
			legend: {
				left: "65%",
				top:"2.5%"
			  },
			xAxis: {type: 'category'},//类目轴，默认从dataset.source获取数据或者dataset.data获取数据

			yAxis: {},
			// Declare several bar series, each will be mapped
			// to a column of dataset.source by default.
			series: [
				{type: 'bar',
				// 柱子的宽度
				barWidth:5,
				itemStyle:{
                  normal:{
					//   给柱子设置渐变的颜色，从下到上
					color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						offset: 0,
						color: '#97E068'
					}, {
						offset: 1,
						color: '#2EC99F'
					}]),
				  }
				},
			},
				{type: 'bar',
				barWidth:5,
				itemStyle:{
					normal:{
					  //   给柱子设置渐变的颜色，从下到上
					  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
						  offset: 0,
						  color: '#FFBF96'
						}, {
							offset: 1,
							color: '#FE7096'
					  }]),
					}
				  },
			},
			]
		});

		var  getmydmc=['万科麓园','阳光花园','太湖二期','路径时代城','镇江A2期','天津太阳城','溪谷项目'];//数据点名称
		var  getmyd=[100,75,66,58,62,67,60];//出勤率
		var getmydzd =[];//出勤100%
		for (let i = 0; i < getmyd.length; i++) {
			getmydzd.push(100)
		}
		mychartBootom.setOption({
			title:{
			   text:"今日出勤排名",
			   padding:[0,0,20,60],
			   textStyle:{
				fontSize:18,
				fontFamily:"Microsoft YaHei",
				fontWeight:400,
				color:"rgba(37,50,62,1)",
				lineHeight:38,
			},
			},
			grid: {
				left: '150',
				right: '75',
				bottom: '0',
				top: '10%',
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'none'
				},
				formatter: function(params) {
					return '今日出勤日<br>'+ params[0].name  + ': ' + params[0].value+'%'
				}
			},
			xAxis: {
				show: false,
				type: 'value'
			},
			yAxis: [{
				type: 'category',
				inverse: true,
				axisLabel: {
					formatter:function(value){
						var ret = "";//拼接加\n返回的类目项  
						var maxLength = 5;//每项显示文字个数  
						var valLength = value.length;//X轴类目项的文字个数  
						var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
						if (rowN > 1)//如果类目项的文字大于5,
						{  
							var temp = "";//每次截取的字符串  
							var start = 0;//开始截取的位置  
							var end = maxLength;//结束截取的位置  
							temp = value.substring(start, end)+'\n'+value.substring(end, valLength)					
							ret += temp; //凭借最终的字符串  
							return ret;  
						}
						else{
							return value;  
						}
					},
					textStyle: {
						color: '#666666',
						fontSize: '14'
					},
				},
				splitLine: {
					show: false
				},
				axisTick: {
					show: false
				},
				axisLine: {
					show: false
				},
				data: getmydmc
			}, {
				type: 'category',
				inverse: true,
				axisTick: 'none',
				axisLine: 'none',
				show: true,
				axisLabel: {
					textStyle: {
						color: '#333333',
						fontSize: '14'
					},
					formatter: '{value}%'
				},
				data:getmyd
			}],
			series: [{
					name: '值',
					type: 'bar',
					zlevel: 1,
					itemStyle: {
						normal: {
							barBorderRadius: 5,
							color: '#2EC99F'
						},
					},
					barWidth: 15,
					data: getmyd
				},
				{
					name: '背景',
					type: 'bar',
					barWidth: 15,
					barGap: '-100%',
					data: getmydzd,
					itemStyle: {
						normal: {
							color: 'rgba(103,150,253,0.3)',
							barBorderRadius: 5,
						}
					},
				},
			]
    
		})

		// const colorList = ["#9E87FF", '#73DDFF', '#fe9a8b', '#F56948', '#9E87FF']
        myChartRight.setOption({
			backgroundColor: '#fff',
			title: {
				text:"工资发放情况",
				padding:[0,0,0,60],
			    itemGap:2,
				textStyle:{
					fontSize:18,
					fontFamily:"Microsoft YaHei",
					fontWeight:400,
					color:"rgba(37,50,62,1)",
					lineHeight:38,
					// align:"center"//水平对齐
				},
				subtext:"金额",
			},
			legend: {
				icon: 'circle',
				// top: '5%',
				// right: '5%',
				itemWidth: 6,
				itemGap: 2,
				textStyle: {
					color: '#556677'
				}
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					label: {
						show: true,
						backgroundColor: '#fff',
						color: '#556677',
						borderColor: 'rgba(0,0,0,0)',
						shadowColor: 'rgba(0,0,0,0)',
						shadowOffsetY: 0
					},
					lineStyle: {
						width: 0
					}
				},
				backgroundColor: '#fff',
				textStyle: {
					color: '#5c6c7c'
				},
				padding: [10, 10],
				extraCssText: 'box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)'
			},
			grid: {
				top: '20%'
			},
			xAxis: [{
				type: 'category',
				show:true,
				
				data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月',"8月"],
				axisLine: {
					lineStyle: {
						color: '#DCE2E8'
					}
				},
				
				axisTick: {
					show: false
				},
				axisLabel: {
					interval: 0,
					textStyle: {
						color: '#556677'
					},
					// 默认x轴字体大小
					fontSize: 12,
					// margin:文字到x轴的距离
					margin: 15
				},
				axisPointer: {
					label: {
						// padding: [11, 5, 7],
						padding: [0, 0, 10, 0],
						// 这里的margin和axisLabel的margin要一致!
						margin: 15,
						// 移入时的字体大小
						fontSize: 12,
						backgroundColor: {
							type: 'linear',
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							colorStops: [{
								offset: 0,
								color: '#fff' // 0% 处的颜色
							}, {
								// offset: 0.9,
								offset: 0.86,
								
								color: '#fff' // 0% 处的颜色
							}, {
								offset: 0.86,
								color: '#33c0cd' // 0% 处的颜色
							}, {
								offset: 1,
								color: '#33c0cd' // 100% 处的颜色
							}],
							global: false // 缺省为 false
						}
					}
				},
				boundaryGap: false
			}],
			yAxis: [{
				type: 'value',
				axisTick: {
					show: false
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#DCE2E8'
					}
				},
				axisLabel: {
					textStyle: {
						color: '#556677'
					}
				},
				splitLine: {
					show: false
				}
			}, {
				type: 'value',
				position: 'right',
				axisTick: {
					show: false
				},
				axisLabel: {
					textStyle: {
						color: '#556677'
					},
					formatter: '{value}'
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#DCE2E8'
					}
				},
				splitLine: {
					show: false
				}
			}],
			series: [
			       {
					type: 'line',
					data: [0, 28000, 28000, 22000, 26000, 38000,37000,27000],
					symbolSize: 6,
					symbol: 'circle',
					smooth: true,
					yAxisIndex: 0,
					showSymbol: false,
					symbol: 'circle', //折线点设置为实心点
					lineStyle: {
						width: 5,
						color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [{
								offset: 0,
								color: '#97E068'
							},
							{
								offset: 1,
								color: '#2EC99F'
							}
						]),
						shadowColor: 'rgba(115,221,255, 0.3)',
						shadowBlur: 10,
						shadowOffsetY: 20
					},
					// itemStyle: {
					// 	normal: {
					// 		color: colorList[1],
					// 		borderColor: colorList[1]
					// 	}
					// }
				},
				
			]
		})
		var  getmydprice=[85140,78454,64154];//金钱
		myChartRight_bottom.setOption({
			title:{
				text:"本月项目工资发放排名",
				padding:[0,0,20,60],
				textStyle:{
				 fontSize:18,
				 fontFamily:"Microsoft YaHei",
				 fontWeight:400,
				 color:"rgba(37,50,62,1)",
				 lineHeight:38,
			 },
			 },
			 grid: {
				 left: '150',
				 right: '75',
				 bottom: '0',
				 top: '10%',
			 },
			 tooltip: {
				 trigger: 'axis',
				 axisPointer: {
					 type: 'none'
				 },
				 formatter: function(params) {
					 return '今日出勤日<br>'+ params[0].name  + ': ' + params[0].value+'%'
				 }
			 },
		})
	}

	render() {
		return (
		  <div className="home">
			  <div className="homeConter">
			  <div className="homeLeft">
                  <div id="mychart"></div>
			      <div id="mychartbootom"></div>
			 </div>
			 <div className="homeRight">
                  <div id="mychartRight"></div>
				  <div id="mychartRight_bottom"></div>
			 </div>
			 </div>
		  </div>
		);
	}
}
export default Home;
