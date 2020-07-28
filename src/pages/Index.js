import React, { Component } from 'react';
import styles from './Index.module.less';
import { Row, Col, Typography, Button } from 'antd';
const { Title } = Typography;
export default class Index extends Component {
  mailTo() {
    window.location.href = "mailto:server_hg_data@163.com?subject=使用咨询&body=这里填写咨询内容";
  }
  render() {
    const featureLayout = {
      sm: 12,
      md: 8
    }
    return (
      <div className={styles.index}>
        <section className={styles.banner}>
          <div className={styles.banner_bg}></div>
          <div className={styles.banner_bg2}></div>
          <Row gutter={20} className={styles.banner_content}>
            <Col sm={14} xs={24}>
              <div className={styles.banner_title}>
                <Title level={1}>让工程建设更安全、有序、高效</Title>
                <div style={{ fontSize: 18 }}>「华工劳务工管理系统」，专注于建筑工程劳务管理、建筑工人移动考勤管理的行业信息化解决方案</div>
                <div style={{ marginTop: 50 }}>
                  <Button onClick={() => this.props.history.push('/signin')} shape="round" size="large" type="primary" style={{ marginRight: 20 }}>
                    开始使用
                  </Button>
                  {/* <Button onClick={this.mailTo} shape="round" size="large">
                    咨询
                  </Button> */}
                </div>
              </div>
            </Col>
            <Col xs={0} sm={10}>
              <img width="400" src={require('../images/index/banner.svg')} alt="" />
            </Col>
          </Row>
        </section>
        <section className={styles.feature}>
          <Title level={2} style={{ textAlign: "center", color: "#fff" }}>特色功能</Title>
          <Row gutter={30}>
            <Col {...featureLayout} >
              <div className={styles.card}>
                <div className={`${styles.image} ${styles.bg_location}`}>
                  <img src={require('../images/index/location.svg')} alt="" />
                </div>
                <h2 className={styles.title}>考勤打卡</h2>
                <div className={styles.desc}>功能描述</div>
              </div>
            </Col>
            <Col {...featureLayout}>
              <div className={styles.card}>
                <div className={`${styles.image} ${styles.bg_checkwork}`}>
                  <img src={require('../images/index/checkwork.svg')} alt="" />
                </div>
                <h2 className={styles.title}>考勤管理</h2>
                <div className={styles.desc}>功能描述</div>
              </div>
            </Col>
            <Col {...featureLayout}>
              <div className={styles.card}>
                <div className={`${styles.image} ${styles.bg_announcement}`}>
                  <img src={require('../images/index/announcement.svg')} alt="" />
                </div>
                <h2 className={styles.title}>项目公告</h2>
                <div className={styles.desc}>功能描述</div>
              </div>
            </Col>
            <Col {...featureLayout}>
              <div className={styles.card}>
                <div className={`${styles.image} ${styles.bg_message}`}>
                  <img src={require('../images/index/bell.svg')} alt="" />
                </div>
                <h2 className={styles.title}>实时消息</h2>
                <div className={styles.desc}>功能描述</div>
              </div>
            </Col>
            <Col {...featureLayout}>
              <div className={styles.card}>
                <div className={`${styles.image} ${styles.bg_team}`}>
                  <img src={require('../images/index/team.svg')} alt="" />
                </div>
                <h2 className={styles.title}>队伍管理</h2>
                <div className={styles.desc}>功能描述</div>
              </div>
            </Col>
            <Col {...featureLayout}>
              <div className={styles.card}>
                <div className={`${styles.image} ${styles.bg_safe}`}>
                  <img src={require('../images/index/safe.svg')} alt="" />
                </div>
                <h2 className={styles.title}>施工督导</h2>
                <div className={styles.desc}>功能描述</div>
              </div>
            </Col>
          </Row>
        </section>
        <section className={styles.customers}>
          <Title level={2} style={{ textAlign: 'center' }}>更多功能陆续加入中，敬请期待</Title>
        </section>
      </div>
    );
  }
}
